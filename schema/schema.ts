import { z } from "zod";

export const AddTaskFormSchema = z.object({
  task: z.string().min(2, {
    message: "Task must be at least 2 characters.",
  }),
  startTime: z.string(),
  endTime: z.string(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message: "Invalid color format. Use #RRGGBB",
  }),
});