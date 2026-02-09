import { type Response, type NextFunction } from 'express';
import { auth } from './lib/auth';
import { prisma } from './lib/db';
import { AuthRequest } from './types';
import { UserType } from './generated/prisma/enums';
import { getParam } from './utils/helpers';

// UTILITY: Async Middleware Wrapper

// Wraps async middleware to catch promise rejections automatically
function asyncHandler(fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// AUTHENTICATION MIDDLEWARE

export const authMiddleware = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    // 1. Validate session
    const session = await auth.api.getSession({
      headers: req.headers as unknown as Record<string, string>,
    });

    if (!session?.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 2. Look up user role in parallel
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
      res.status(403).json({ error: 'User role not found' });
      return;
    }

    // 3. Attach user context to request
    req.user = {
      id: session.user.id,
      email: session.user.email,
      role: sponsor ? UserType.SPONSOR : UserType.PUBLISHER,
      sponsorId: sponsor?.id,
      publisherId: publisher?.id,
    };

    next();
  }
);

// AUTHORIZATION MIDDLEWARE - Role-Based

export function requireRole(
  allowedRoles: UserType[]
): (req: AuthRequest, res: Response, next: NextFunction) => void {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
}

// Convenience wrappers for specific roles
export const requireSponsor = requireRole([UserType.SPONSOR]);
export const requirePublisher = requireRole([UserType.PUBLISHER]);

// AUTHORIZATION MIDDLEWARE - Resource Ownership

// Generic ownership checker factory
function requireOwnership<T extends { id: string }>(
  entityName: string,
  fetchEntity: (id: string) => Promise<T | null>,
  checkOwnership: (entity: T, user: AuthRequest['user']) => boolean
) {
  return asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const entityId = getParam(req.params.id);

      if (!entityId) {
        res.status(400).json({ error: 'Invalid ID parameter' });
        return;
      }

      const entity = await fetchEntity(entityId);

      if (!entity) {
        res.status(404).json({ error: `${entityName} not found` });
        return;
      }

      if (!checkOwnership(entity, req.user)) {
        res.status(403).json({
          error: `Forbidden: You do not own this ${entityName.toLowerCase()}`,
        });
        return;
      }

      next();
    }
  );
}

// Specific ownership middleware
export const requireCampaignOwner = requireOwnership(
  'Campaign',
  (id) => prisma.campaign.findUnique({ where: { id } }),
  (campaign, user) => campaign.sponsorId === user?.sponsorId
);

export const requireAdSlotOwner = requireOwnership(
  'AdSlot',
  (id) => prisma.adSlot.findUnique({ where: { id } }),
  (adSlot, user) => adSlot.publisherId === user?.publisherId
);

export const requireSpecificSponsor = requireOwnership(
  'Sponsor',
  (id) => prisma.sponsor.findUnique({ where: { id } }),
  (sponsor, user) => sponsor.userId === user?.id
);

export const requireSpecificPublisher = requireOwnership(
  'Publisher',
  (id) => prisma.publisher.findUnique({ where: { id } }),
  (publisher, user) => publisher.userId === user?.id
);

// CUSTOM ERROR CLASSES

export class AuthError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}
