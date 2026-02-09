import { type Request, type Response } from 'express';
import { prisma } from '../lib/db.js';
import { getParam } from '../utils/helpers.js';
import { AuthRequest } from '../types.js';

// getCampaigns - List all campaigns
// Supports optional filters: status (ACTIVE, PAUSED, COMPLETED), sponsorId
export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const { status, sponsorId } = req.query;

    const campaigns = await prisma.campaign.findMany({
      where: {
        ...(status && { status: status as string as 'ACTIVE' | 'PAUSED' | 'COMPLETED' }),
        ...(sponsorId && { sponsorId: getParam(sponsorId) }),
      },
      include: {
        sponsor: { select: { id: true, name: true, logo: true } },
        _count: { select: { creatives: true, placements: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};

// createCampaign - Create new campaign
export const createCampaign = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      budget,
      cpmRate,
      cpcRate,
      startDate,
      endDate,
      targetCategories,
      targetRegions,
      sponsorId,
    } = req.body;

    if (!name || !budget || !startDate || !endDate || !sponsorId) {
      res.status(400).json({
        error: 'Name, budget, startDate, endDate, and sponsorId are required',
      });
      return;
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        budget,
        cpmRate,
        cpcRate,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        targetCategories: targetCategories || [],
        targetRegions: targetRegions || [],
        sponsorId,
      },
      include: {
        sponsor: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
};

// getCampaign - Get single campaign with details
export const getCampaign = async (req: Request, res: Response) => {
  try {
    const campaignId = getParam(req.params.id);
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        sponsor: true,
        creatives: true,
        placements: {
          include: {
            adSlot: true,
            publisher: { select: { id: true, name: true, category: true } },
          },
        },
      },
    });

    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    res.status(200).json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
};

// updateCampaign - Update campaign (only sponsor can update their campaign)
export const updateCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const campaignId = getParam(req.params.id);
    const {
      name,
      description,
      budget,
      cpmRate,
      cpcRate,
      startDate,
      endDate,
      targetCategories,
      targetRegions,
      status,
    } = req.body;

    // Get existing campaign
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!existingCampaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    // middleware handles ownership check, but we double check to be safe
    if (existingCampaign.sponsorId !== req.user?.sponsorId) {
      res.status(403).json({ error: 'Forbidden: You do not own this campaign' });
      return;
    }

    const campaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(budget && { budget }),
        ...(cpmRate && { cpmRate }),
        ...(cpcRate && { cpcRate }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(targetCategories && { targetCategories }),
        ...(targetRegions && { targetRegions }),
        ...(status && { status: status as string as 'ACTIVE' | 'PAUSED' | 'COMPLETED' }),
      },
    });

    res.status(200).json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
};

// deleteCampaign - Delete a campaign (only sponsor can delete their campaign)
export const deleteCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const campaignId = getParam(req.params.id);

    // Get existing campaign
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!existingCampaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    // middleware handles ownership check, but we double check to be safe
    if (existingCampaign.sponsorId !== req.user?.sponsorId) {
      res.status(403).json({ error: 'Forbidden: You do not own this campaign' });
      return;
    }

    await prisma.campaign.delete({
      where: { id: campaignId },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
};
