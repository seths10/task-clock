import { z } from "zod";

export const AddTaskFormSchema = z.object({
  task: z.string().min(2, {
    message: "Task must be at least 2 characters.",
  }),
  startTime: z.string(),
  endTime: z.string(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message: "Invalid color format. Use #RRGGBB",
  }).optional(),
}).refine((data) => {
  const start = new Date(`1970-01-01T${data.startTime}`);
  const end = new Date(`1970-01-01T${data.endTime}`);
  return start < end;
}, {
  message: "Start time must be earlier than end time",
  path: ["endTime"], // This will associate the error with the endTime field
});