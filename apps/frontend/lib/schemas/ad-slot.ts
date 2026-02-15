import { z } from 'zod';
import { AdSlotType } from '@/lib/types';
import { validBasePriceRefinement, validCpmPriceRefinement } from './refinements';

export const baseAdSlotSchema = z.object({
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

export const createAdSlotSchema = baseAdSlotSchema
  .refine(validBasePriceRefinement, {
    message: 'Base price must be a positive number',
    path: ['basePrice'],
  })
  .refine(validCpmPriceRefinement, {
    message: 'CPM floor must be a positive number and less than or equal to base price',
    path: ['cpmFloor'],
  });

export const updateAdSlotSchema = baseAdSlotSchema
  .partial()
  .omit({ publisherId: true })
  .refine(validBasePriceRefinement, {
    message: 'Base price must be a positive number',
    path: ['basePrice'],
  })
  .refine(validCpmPriceRefinement, {
    message: 'CPM floor must be a positive number and less than or equal to base price',
    path: ['cpmFloor'],
  });

export type CreateAdSlotInput = z.infer<typeof createAdSlotSchema>;
export type UpdateAdSlotInput = z.infer<typeof updateAdSlotSchema>;
