import { GitCommitVertical } from "lucide-react";
import { timelineExporters } from "./exporters";
import { timelineSvg } from "./svg";
import { defineComponent, list } from "../../types";
import { TimelineRender } from "./render";
import { timelineSchema } from "./schema";

export const timelineDefinition = defineComponent(timelineSchema)({
  type: "timeline",
  category: "data",
  labelKey: "components.timeline",
  keywords: ["timeline", "history", "activity", "events", "log", "таймлайн", "історія", "події", "активність"],
  icon: GitCommitVertical,
  defaultSize: { w: 300, h: 170 },
  minSize: { w: 80, h: 40 },
  defaultProps: (t) => ({ events: list(t, "timeline.events"), dates: list(t, "timeline.dates"), activeIndex: 1 }),
  Render: TimelineRender,
  exporters: timelineExporters,
  svg: timelineSvg,
});
