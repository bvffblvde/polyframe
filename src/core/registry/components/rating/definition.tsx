import { Star } from "lucide-react";
import { defineComponent } from "../../types";
import { RatingRender } from "./render";
import { ratingSchema } from "./schema";

export const ratingDefinition = defineComponent(ratingSchema)({
  type: "rating",
  category: "inputs",
  labelKey: "components.rating",
  keywords: ["rating", "stars", "review", "score", "рейтинг", "зірки", "оцінка", "відгук"],
  icon: Star,
  defaultSize: { w: 140, h: 28 },
  minSize: { w: 40, h: 12 },
  defaultProps: () => ({ value: 4, count: 5 }),
  Render: RatingRender,
});
