import { type Request, type Response } from 'express';
import { AdSlotType, prisma } from '../lib/db.js';
import { checkValueInEnum, getParam } from '../utils/helpers.js';
import { AuthRequest } from '../types.js';

// getAdSlots - List available ad slots
export const getAdSlots = async (req: Request, res: Response) => {
  try {
    const { publisherId, type, available } = req.query;

    const adSlots = await prisma.adSlot.findMany({
      where: {
        ...(publisherId && { publisherId: getParam(publisherId) }),
        ...(type && {
          type: type as string as 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST',
        }),
        ...(available === 'true' && { isAvailable: true }),
      },
      include: {
        publisher: { select: { id: true, name: true, category: true, monthlyViews: true } },
        _count: { select: { placements: true } },
      },
      orderBy: { basePrice: 'desc' },
    });

    res.status(200).json(adSlots);
  } catch (error) {
    console.error('Error fetching ad slots:', error);
    res.status(500).json({ error: 'Failed to fetch ad slots' });
  }
};

// createAdSlot - Create new ad slot
export const createAdSlot = async (req: Request, res: Response) => {
  try {
    const { name, description, type, basePrice, publisherId } = req.body;

    if (!name || !type || !basePrice || !publisherId) {
      res.status(400).json({
        error: 'Name, type, basePrice, and publisherId are required',
      });
      return;
    }

    // Validate basePrice
    if (validateBasePrice(basePrice).valid === false) {
      res.status(400).json({ error: validateBasePrice(basePrice).error });
      return;
    }

    // Validate type
    if (validateAdSlotType(type).valid === false) {
      res.status(400).json({ error: validateAdSlotType(type).error });
      return;
    }

    const adSlot = await prisma.adSlot.create({
      data: {
        name,
        description,
        type: type as keyof typeof AdSlotType,
        basePrice,
        publisherId,
      },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(adSlot);
  } catch (error) {
    console.error('Error creating ad slot:', error);
    res.status(500).json({ error: 'Failed to create ad slot' });
  }
};

// getAdSlot - Get single ad slot with details
export const getAdSlot = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: {
        publisher: true,
        placements: {
          include: {
            campaign: { select: { id: true, name: true, status: true } },
          },
        },
      },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    res.status(200).json(adSlot);
  } catch (error) {
    console.error('Error fetching ad slot:', error);
    res.status(500).json({ error: 'Failed to fetch ad slot' });
  }
};

// updateAdSlot - Update ad slot details (only publisher can update their slot)
export const updateAdSlot = async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { name, description, type, basePrice } = req.body;

    // Validate that basePrice is positive if provided
    if (validateBasePrice(basePrice).valid === false) {
      res.status(400).json({ error: validateBasePrice(basePrice).error });
      return;
    }

    // Validate that 'type' is valid enum value if provided
    if (validateAdSlotType(type).valid === false) {
      res.status(400).json({ error: validateAdSlotType(type).error });
      return;
    }

    // Get existing ad slot
    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    // middleware handles ownership check but we double check here to be safe
    if (!adSlot.publisherId || adSlot.publisherId !== req.user?.publisherId) {
      res.status(403).json({ error: 'Forbidden: You do not own this ad slot' });
      return;
    }

    const updatedSlot = await prisma.adSlot.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(type && { type: type as keyof typeof AdSlotType }),
        ...(basePrice && { basePrice }),
      },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.json(updatedSlot);
  } catch (error) {
    console.error('Error updating ad slot:', error);
    res.status(500).json({ error: 'Failed to update ad slot' });
  }
};

// deleteAdSlot - Delete an ad slot (only publisher can delete their slot)
export const deleteAdSlot = async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    // Get existing ad slot
    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
    });

    // Check if ad slot exists
    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    // middleware handles ownership check  but we double check here to be safe
    if (!adSlot.publisherId || adSlot.publisherId !== req.user?.publisherId) {
      res.status(403).json({ error: 'Forbidden: You do not own this ad slot' });
      return;
    }

    // Delete the ad slot
    await prisma.adSlot.delete({
      where: { id },
    });

    res.status(204).json({ success: true, message: 'Ad slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting ad slot:', error);
    res.status(500).json({ error: 'Failed to delete ad slot' });
  }
};

// bookAdSlot - Book an ad slot (simplified booking flow)
// This marks the slot as unavailable and creates a simple booking record
export const bookAdSlot = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { sponsorId, message } = req.body;

    // Validate that sponsorId is provided in request body
    if (!sponsorId) {
      res.status(400).json({ error: 'sponsorId is required' });
      return;
    }

    // Check if slot exists and is available
    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: { publisher: true },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (!adSlot.isAvailable) {
      res.status(400).json({ error: 'Ad slot is no longer available' });
      return;
    }

    // Mark slot as unavailable
    const updatedSlot = await prisma.adSlot.update({
      where: { id },
      data: { isAvailable: false },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    // In a real app, you'd create a Placement record here
    // For now, we just mark it as booked
    console.log(`Ad slot ${id} booked by sponsor ${sponsorId}. Message: ${message || 'None'}`);

    res.json({
      success: true,
      message: 'Ad slot booked successfully!',
      adSlot: updatedSlot,
    });
  } catch (error) {
    console.error('Error booking ad slot:', error);
    res.status(500).json({ error: 'Failed to book ad slot' });
  }
};

// unbookAdSlot - Reset ad slot to available (for testing)
export const unbookAdSlot = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);

    // Check if slot exists and is available
    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: { publisher: true },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (adSlot.isAvailable) {
      res.status(400).json({ error: 'Ad slot is already available' });
      return;
    }

    const updatedSlot = await prisma.adSlot.update({
      where: { id },
      data: { isAvailable: true },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.json({
      success: true,
      message: 'Ad slot is now available again',
      adSlot: updatedSlot,
    });
  } catch (error) {
    console.error('Error unbooking ad slot:', error);
    res.status(500).json({ error: 'Failed to unbook ad slot' });
  }
};

// Helpers for adSlots API

// This function validates basePrice
function validateBasePrice(basePrice: number): { valid: boolean; error?: string } {
  if (basePrice === undefined || basePrice === null) {
    return { valid: false, error: 'basePrice is required' };
  }
  if (typeof basePrice !== 'number') {
    return { valid: false, error: 'basePrice must be a number' };
  }
  if (basePrice <= 0) {
    return { valid: false, error: 'basePrice must be a positive number' };
  }
  return { valid: true };
}

// This function validates the 'type' field against the AdSlotType enum
function validateAdSlotType(type: string): { valid: boolean; error?: string } {
  if (!type) {
    return { valid: false, error: 'type is required' };
  }
  if (typeof type !== 'string') {
    return { valid: false, error: 'type must be a string' };
  }
  if (!checkValueInEnum(type, AdSlotType)) {
    return {
      valid: false,
      error: `Invalid ad slot type. Must be one of: ${Object.keys(AdSlotType).join(', ')}`,
    };
  }
  return { valid: true };
}
