import { type Response, type NextFunction } from 'express';
import { auth } from './lib/auth'; // Your Better Auth instance
import { prisma } from './lib/db'; // Your database client
import { AuthRequest } from './types';
import { UserType } from './generated/prisma/enums';

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // 1. Check for Authorization header or session cookie
    const session = await auth.api.getSession({
      headers: req.headers as unknown as Record<string, string>,
    });
    // 2. Validate the token/session
    if (!session?.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    // 3. Look up the user in the database
    const [sponsor, publisher] = await Promise.all([
      prisma.sponsor.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      }),
      prisma.publisher.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      }),
    ]);

    if (!sponsor && !publisher) {
      res.status(401).json({
        error: 'Not Found',
      });
      return;
    }

    // Determine role based on which relation exists
    const role = sponsor ? UserType.SPONSOR : UserType.PUBLISHER;
    const sponsorId = sponsor?.id;
    const publisherId = publisher?.id;

    // 4. Attach user info to req.user
    req.user = {
      id: session.user.id,
      email: session.user.email,
      role,
      sponsorId,
      publisherId,
    };

    // 5. Return 401 if invalid
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      error: 'Invalid or expired session',
    });
    return;
  }
}
// This middleware can be used to enforce role-based access control on routes
export function roleMiddleware(allowedRoles: Array<UserType>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Check if user is authenticated and has a role
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
      });
      return;
    }
    // Check if user's role is in the allowedRoles array
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
}

// This middleware can be used for routes that require a sponsor role
export function requireSponsor(req: AuthRequest, res: Response, next: NextFunction): void {
  // Check if user has a sponsorId, which indicates they are a sponsor
  if (!req.user?.sponsorId) {
    res.status(403).json({
      error: 'Forbidden',
    });
    return;
  }
  next();
}

// This middleware can be used for routes that require a publisher role
export function requirePublisher(req: AuthRequest, res: Response, next: NextFunction): void {
  // Check if user has a publisherId, which indicates they are a publisher
  if (!req.user?.publisherId) {
    res.status(403).json({
      error: 'Forbidden',
    });
    return;
  }
  next();
}
