import { z } from 'zod';

export const toolImageSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  path: z.string().startsWith('/images/tools/').endsWith('.webp'),
  alt: z.string().min(3),
  imageSourceUrl: z.url().nullable(),
  sourcePageUrl: z.url().nullable(),
  sourceLabel: z.string().min(1).nullable(),
  verification: z.enum(['exact', 'photo-needed'])
});

export const toolImagesSchema = z.array(toolImageSchema);
