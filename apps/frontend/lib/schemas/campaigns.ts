import { z } from 'zod';

// Base schemas
export const createCampaignSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().max(500).optional(),
    budget: z.number().positive('Budget must be positive'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    sponsorId: z.string().uuid('Invalid sponsor ID'),
    cpmRate: z.number().positive().optional(),
    cpcRate: z.number().positive().optional(),
    targetCategories: z.array(z.string()).default([]),
    targetRegions: z.array(z.string()).default([]),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export const updateCampaignSchema = createCampaignSchema.partial().omit({ sponsorId: true });

// Infer types from schemas
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
