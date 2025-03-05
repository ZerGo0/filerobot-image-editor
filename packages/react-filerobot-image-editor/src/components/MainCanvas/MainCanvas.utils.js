/** Internal Dependencies */
import { POINTER_ICONS, TABS_IDS, TOOLS_IDS } from 'utils/constants';
import isDrawTool from 'utils/isDrawTool';

export const getCursorStyle = ({ tabId, toolId, pointerCssIcon } = {}) => {
  if (toolId === TOOLS_IDS.OBJECT_REMOVAL) {
    return 'none';
  }

  if (
    pointerCssIcon === POINTER_ICONS.DEFAULT &&
    (tabId === TABS_IDS.ANNOTATE || isDrawTool(toolId))
  ) {
    return POINTER_ICONS.DRAW;
  }

  return pointerCssIcon;
};
