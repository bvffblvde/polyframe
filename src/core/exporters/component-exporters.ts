import type { ComponentType } from "../document/types";
import { anyExporters, type AnyExporters } from "./types";
import { accordionExporters } from "../registry/components/accordion/exporters";
import { alertExporters } from "../registry/components/alert/exporters";
import { avatarExporters } from "../registry/components/avatar/exporters";
import { avatargroupExporters } from "../registry/components/avatargroup/exporters";
import { badgeExporters } from "../registry/components/badge/exporters";
import { barchartExporters } from "../registry/components/barchart/exporters";
import { boxExporters } from "../registry/components/box/exporters";
import { breadcrumbsExporters } from "../registry/components/breadcrumbs/exporters";
import { buttonExporters } from "../registry/components/button/exporters";
import { calendarExporters } from "../registry/components/calendar/exporters";
import { cardExporters } from "../registry/components/card/exporters";
import { checkboxExporters } from "../registry/components/checkbox/exporters";
import { datepickerExporters } from "../registry/components/datepicker/exporters";
import { dividerExporters } from "../registry/components/divider/exporters";
import { dropzoneExporters } from "../registry/components/dropzone/exporters";
import { gridExporters } from "../registry/components/grid/exporters";
import { headingExporters } from "../registry/components/heading/exporters";
import { iconExporters } from "../registry/components/icon/exporters";
import { imageExporters } from "../registry/components/image/exporters";
import { inputExporters } from "../registry/components/input/exporters";
import { linechartExporters } from "../registry/components/linechart/exporters";
import { linkExporters } from "../registry/components/link/exporters";
import { listExporters } from "../registry/components/list/exporters";
import { menuExporters } from "../registry/components/menu/exporters";
import { modalExporters } from "../registry/components/modal/exporters";
import { navbarExporters } from "../registry/components/navbar/exporters";
import { paginationExporters } from "../registry/components/pagination/exporters";
import { piechartExporters } from "../registry/components/piechart/exporters";
import { progressExporters } from "../registry/components/progress/exporters";
import { radioExporters } from "../registry/components/radio/exporters";
import { ratingExporters } from "../registry/components/rating/exporters";
import { segmentedExporters } from "../registry/components/segmented/exporters";
import { selectExporters } from "../registry/components/select/exporters";
import { sidebarExporters } from "../registry/components/sidebar/exporters";
import { skeletonExporters } from "../registry/components/skeleton/exporters";
import { sliderExporters } from "../registry/components/slider/exporters";
import { spinnerExporters } from "../registry/components/spinner/exporters";
import { stackExporters } from "../registry/components/stack/exporters";
import { statExporters } from "../registry/components/stat/exporters";
import { stepperExporters } from "../registry/components/stepper/exporters";
import { switchExporters } from "../registry/components/switch/exporters";
import { tableExporters } from "../registry/components/table/exporters";
import { tabsExporters } from "../registry/components/tabs/exporters";
import { textExporters } from "../registry/components/text/exporters";
import { textareaExporters } from "../registry/components/textarea/exporters";
import { timelineExporters } from "../registry/components/timeline/exporters";
import { toastExporters } from "../registry/components/toast/exporters";
import { tooltipExporters } from "../registry/components/tooltip/exporters";

export const componentExporters: Record<ComponentType, AnyExporters> = {
  accordion: anyExporters(accordionExporters),
  alert: anyExporters(alertExporters),
  avatar: anyExporters(avatarExporters),
  avatargroup: anyExporters(avatargroupExporters),
  badge: anyExporters(badgeExporters),
  barchart: anyExporters(barchartExporters),
  box: anyExporters(boxExporters),
  breadcrumbs: anyExporters(breadcrumbsExporters),
  button: anyExporters(buttonExporters),
  calendar: anyExporters(calendarExporters),
  card: anyExporters(cardExporters),
  checkbox: anyExporters(checkboxExporters),
  datepicker: anyExporters(datepickerExporters),
  divider: anyExporters(dividerExporters),
  dropzone: anyExporters(dropzoneExporters),
  grid: anyExporters(gridExporters),
  heading: anyExporters(headingExporters),
  icon: anyExporters(iconExporters),
  image: anyExporters(imageExporters),
  input: anyExporters(inputExporters),
  linechart: anyExporters(linechartExporters),
  link: anyExporters(linkExporters),
  list: anyExporters(listExporters),
  menu: anyExporters(menuExporters),
  modal: anyExporters(modalExporters),
  navbar: anyExporters(navbarExporters),
  pagination: anyExporters(paginationExporters),
  piechart: anyExporters(piechartExporters),
  progress: anyExporters(progressExporters),
  radio: anyExporters(radioExporters),
  rating: anyExporters(ratingExporters),
  segmented: anyExporters(segmentedExporters),
  select: anyExporters(selectExporters),
  sidebar: anyExporters(sidebarExporters),
  skeleton: anyExporters(skeletonExporters),
  slider: anyExporters(sliderExporters),
  spinner: anyExporters(spinnerExporters),
  stack: anyExporters(stackExporters),
  stat: anyExporters(statExporters),
  stepper: anyExporters(stepperExporters),
  switch: anyExporters(switchExporters),
  table: anyExporters(tableExporters),
  tabs: anyExporters(tabsExporters),
  text: anyExporters(textExporters),
  textarea: anyExporters(textareaExporters),
  timeline: anyExporters(timelineExporters),
  toast: anyExporters(toastExporters),
  tooltip: anyExporters(tooltipExporters),
};
