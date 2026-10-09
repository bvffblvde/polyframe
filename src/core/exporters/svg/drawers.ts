import type { ComponentType } from "../../document/types";
import { anyDrawer, type AnyDrawer } from "./types";
import { accordionSvg } from "../../registry/components/accordion/svg";
import { alertSvg } from "../../registry/components/alert/svg";
import { avatarSvg } from "../../registry/components/avatar/svg";
import { avatargroupSvg } from "../../registry/components/avatargroup/svg";
import { badgeSvg } from "../../registry/components/badge/svg";
import { barchartSvg } from "../../registry/components/barchart/svg";
import { boxSvg } from "../../registry/components/box/svg";
import { breadcrumbsSvg } from "../../registry/components/breadcrumbs/svg";
import { buttonSvg } from "../../registry/components/button/svg";
import { calendarSvg } from "../../registry/components/calendar/svg";
import { cardSvg } from "../../registry/components/card/svg";
import { checkboxSvg } from "../../registry/components/checkbox/svg";
import { datepickerSvg } from "../../registry/components/datepicker/svg";
import { dividerSvg } from "../../registry/components/divider/svg";
import { dropzoneSvg } from "../../registry/components/dropzone/svg";
import { gridSvg } from "../../registry/components/grid/svg";
import { headingSvg } from "../../registry/components/heading/svg";
import { iconSvg } from "../../registry/components/icon/svg";
import { imageSvg } from "../../registry/components/image/svg";
import { inputSvg } from "../../registry/components/input/svg";
import { linechartSvg } from "../../registry/components/linechart/svg";
import { linkSvg } from "../../registry/components/link/svg";
import { listSvg } from "../../registry/components/list/svg";
import { menuSvg } from "../../registry/components/menu/svg";
import { modalSvg } from "../../registry/components/modal/svg";
import { navbarSvg } from "../../registry/components/navbar/svg";
import { paginationSvg } from "../../registry/components/pagination/svg";
import { piechartSvg } from "../../registry/components/piechart/svg";
import { progressSvg } from "../../registry/components/progress/svg";
import { radioSvg } from "../../registry/components/radio/svg";
import { ratingSvg } from "../../registry/components/rating/svg";
import { segmentedSvg } from "../../registry/components/segmented/svg";
import { selectSvg } from "../../registry/components/select/svg";
import { sidebarSvg } from "../../registry/components/sidebar/svg";
import { skeletonSvg } from "../../registry/components/skeleton/svg";
import { sliderSvg } from "../../registry/components/slider/svg";
import { spinnerSvg } from "../../registry/components/spinner/svg";
import { stackSvg } from "../../registry/components/stack/svg";
import { statSvg } from "../../registry/components/stat/svg";
import { stepperSvg } from "../../registry/components/stepper/svg";
import { switchSvg } from "../../registry/components/switch/svg";
import { tableSvg } from "../../registry/components/table/svg";
import { tabsSvg } from "../../registry/components/tabs/svg";
import { textSvg } from "../../registry/components/text/svg";
import { textareaSvg } from "../../registry/components/textarea/svg";
import { timelineSvg } from "../../registry/components/timeline/svg";
import { toastSvg } from "../../registry/components/toast/svg";
import { tooltipSvg } from "../../registry/components/tooltip/svg";

export const svgDrawers: Record<ComponentType, AnyDrawer> = {
  accordion: anyDrawer(accordionSvg),
  alert: anyDrawer(alertSvg),
  avatar: anyDrawer(avatarSvg),
  avatargroup: anyDrawer(avatargroupSvg),
  badge: anyDrawer(badgeSvg),
  barchart: anyDrawer(barchartSvg),
  box: anyDrawer(boxSvg),
  breadcrumbs: anyDrawer(breadcrumbsSvg),
  button: anyDrawer(buttonSvg),
  calendar: anyDrawer(calendarSvg),
  card: anyDrawer(cardSvg),
  checkbox: anyDrawer(checkboxSvg),
  datepicker: anyDrawer(datepickerSvg),
  divider: anyDrawer(dividerSvg),
  dropzone: anyDrawer(dropzoneSvg),
  grid: anyDrawer(gridSvg),
  heading: anyDrawer(headingSvg),
  icon: anyDrawer(iconSvg),
  image: anyDrawer(imageSvg),
  input: anyDrawer(inputSvg),
  linechart: anyDrawer(linechartSvg),
  link: anyDrawer(linkSvg),
  list: anyDrawer(listSvg),
  menu: anyDrawer(menuSvg),
  modal: anyDrawer(modalSvg),
  navbar: anyDrawer(navbarSvg),
  pagination: anyDrawer(paginationSvg),
  piechart: anyDrawer(piechartSvg),
  progress: anyDrawer(progressSvg),
  radio: anyDrawer(radioSvg),
  rating: anyDrawer(ratingSvg),
  segmented: anyDrawer(segmentedSvg),
  select: anyDrawer(selectSvg),
  sidebar: anyDrawer(sidebarSvg),
  skeleton: anyDrawer(skeletonSvg),
  slider: anyDrawer(sliderSvg),
  spinner: anyDrawer(spinnerSvg),
  stack: anyDrawer(stackSvg),
  stat: anyDrawer(statSvg),
  stepper: anyDrawer(stepperSvg),
  switch: anyDrawer(switchSvg),
  table: anyDrawer(tableSvg),
  tabs: anyDrawer(tabsSvg),
  text: anyDrawer(textSvg),
  textarea: anyDrawer(textareaSvg),
  timeline: anyDrawer(timelineSvg),
  toast: anyDrawer(toastSvg),
  tooltip: anyDrawer(tooltipSvg),
};
