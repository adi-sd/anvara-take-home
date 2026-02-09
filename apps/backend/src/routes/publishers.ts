import { type Request, type Response } from 'express';
import { prisma } from '../lib/db.js';
import { getParam } from '../utils/helpers.js';

// getPublishers - List all publishers
export const getPublishers = async (_req: Request, res: Response) => {
  try {
    const publishers = await prisma.publisher.findMany({
      include: {
        _count: {
          select: { adSlots: true, placements: true },
        },
      },
      orderBy: { monthlyViews: 'desc' },
    });
    res.json(publishers);
  } catch (error) {
    console.error('Error fetching publishers:', error);
    res.status(500).json({ error: 'Failed to fetch publishers' });
  }
};

// getPublisher - Get single publisher with ad slots
export const getPublisher = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const publisher = await prisma.publisher.findUnique({
      where: { id },
      include: {
        adSlots: true,
        placements: {
          include: {
            campaign: { select: { name: true, sponsor: { select: { name: true } } } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!publisher) {
      res.status(404).json({ error: 'Publisher not found' });
      return;
    }

    res.json(publisher);
  } catch (error) {
    console.error('Error fetching publisher:', error);
    res.status(500).json({ error: 'Failed to fetch publisher' });
  }
};

// createPublisher - Create new publisher
export const createPublisher = async (req: Request, res: Response) => {
  try {
    const { name, email, website, monthlyViews, userId } = req.body;

    // Validate required fields
    if (!name || !email || !userId) {
      res.status(400).json({ error: 'Name and userId are required' });
      return;
    }

    const newPublisher = await prisma.publisher.create({
      data: { name, email, website, monthlyViews, userId },
    });

    res.status(201).json(newPublisher);
  } catch (error) {
    console.error('Error creating publisher:', error);
    res.status(500).json({ error: 'Failed to create publisher' });
  }
};
// updatePublisher - Update publisher details (only specific publisher can update their profile)
export const updatePublisher = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { name, website, monthlyViews } = req.body;

    const updatedPublisher = await prisma.publisher.update({
      where: { id },
      data: { name, website, monthlyViews },
    });

    res.json(updatedPublisher);
  } catch (error) {
    console.error('Error updating publisher:', error);
    res.status(500).json({ error: 'Failed to update publisher' });
  }
};
