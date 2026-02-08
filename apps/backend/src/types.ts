import { type Request } from 'express';

import { UserType } from './generated/prisma/enums';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserType;
    sponsorId?: string; // For SPONSOR role
    publisherId?: string; // For PUBLISHER role
  };
}
