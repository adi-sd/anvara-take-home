import { type Request, type Response } from 'express';
import { prisma } from '../lib/db.js';
import { getParam } from '../utils/helpers.js';
import { AuthRequest } from '../types.js';

// NOTE: Authentication is handled by Better Auth on the frontend
// This route is kept for any backend-specific auth utilities

// login - Placeholder (Better Auth handles login via frontend)
export async function login(_req: Request, res: Response) {
  res.status(400).json({
    error: 'Use the frontend login at /login instead',
    hint: 'Better Auth handles authentication via the Next.js frontend',
  });
}

// getCurrentUser - Get current user (for API clients)
export async function getCurrentUser(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  // Return user info from req.user set by auth middleware
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      sponsorId: req.user.sponsorId || null,
      publisherId: req.user.publisherId || null,
    },
  });
}

// getUserRole - Get user role based on Sponsor/Publisher records
export async function getUserRole(req: Request, res: Response) {
  try {
    const userId = getParam(req.params.userId);

    // Check if user is a sponsor
    const sponsor = await prisma.sponsor.findUnique({
      where: { userId },
      select: { id: true, name: true },
    });

    if (sponsor) {
      res.json({ role: 'sponsor', sponsorId: sponsor.id, name: sponsor.name });
      return;
    }

    // Check if user is a publisher
    const publisher = await prisma.publisher.findUnique({
      where: { userId },
      select: { id: true, name: true },
    });

    if (publisher) {
      res.json({ role: 'publisher', publisherId: publisher.id, name: publisher.name });
      return;
    }

    // User has no role assigned
    res.json({ role: null });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ error: 'Failed to fetch user role' });
  }
}
