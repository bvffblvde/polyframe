import { z } from "zod";

export const stepperSchema = z.object({
  steps: z.array(z.string()),
  activeIndex: z.number().int().min(0).max(20),
});
export type StepperProps = z.infer<typeof stepperSchema>;
