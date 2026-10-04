import { CreditCard } from "lucide-react";
import { cardExporters } from "./exporters";
import { defineComponent } from "../../types";
import { CardRender } from "./render";
import { cardSchema } from "./schema";

export const cardDefinition = defineComponent(cardSchema)({
  type: "card",
  category: "layout",
  labelKey: "components.card",
  keywords: ["card", "panel", "tile", "картка", "панель"],
  icon: CreditCard,
  defaultSize: { w: 320, h: 200 },
  minSize: { w: 80, h: 60 },
  defaultProps: (t) => ({
    title: t("card.title"),
    body: t("card.body"),
    showFooter: true,
    actionLabel: t("card.action"),
  }),
  Render: CardRender,
  exporters: cardExporters,
});
