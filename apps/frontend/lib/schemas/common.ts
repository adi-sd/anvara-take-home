import { z } from 'zod';

// Constants
const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

// Reusable primitives
export const emailSchema = z.email();
export const uuidSchema = z.uuid();
export const dateSchema = z.coerce.date();
export const positiveNumberSchema = z.number().positive();
export const urlSchema = z.url();

// Reusable field schemas
export const nameSchema = z.string().min(1).max(MAX_NAME_LENGTH);
export const descriptionSchema = z.string().max(MAX_DESCRIPTION_LENGTH).optional();
