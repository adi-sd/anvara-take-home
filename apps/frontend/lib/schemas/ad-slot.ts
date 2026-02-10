import { z } from 'zod';
import { AdSlotType } from '@/lib/types';

export const createAdSlotSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  type: z.nativeEnum(AdSlotType),
  position: z.string().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  basePrice: z.number().positive(),
  cpmFloor: z.number().positive().optional(),
  publisherId: z.string().uuid(),
});

export const updateAdSlotSchema = createAdSlotSchema.partial().omit({ publisherId: true });

export type CreateAdSlotInput = z.infer<typeof createAdSlotSchema>;
export type UpdateAdSlotInput = z.infer<typeof updateAdSlotSchema>;
