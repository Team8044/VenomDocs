import { z } from 'zod';

export const toolSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  brand: z.string().min(1),
  model: z.string().min(1),
  quantity: z.number().int().positive(),
  category: z.enum(['Drilling & Driving', 'Cutting', 'Finishing', 'Heat & Fastening', 'Cleanup & Utility']),
  power: z.string().min(1),
  notes: z.string(),
  sourceRows: z.array(z.string()).min(1),
  guide: z.string().startsWith('/tools/handheld/guides/'),
  manufacturerUrl: z.url().nullable(),
  manualUrl: z.url().nullable(),
  team: z.object({
    location: z.string().nullable()
  })
});

export const toolsSchema = z.array(toolSchema);
export type Tool = z.infer<typeof toolSchema>;
