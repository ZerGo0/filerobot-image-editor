import { TABS_TOOLS } from 'components/tools/tools.constants';
import { POINTER_ICONS, TABS_IDS } from 'utils/constants';
import isDrawTool from 'utils/isDrawTool';

export const SELECT_TAB = 'SELECT_TAB';

const selectTab = (state, payload) => {
  const isUnselectTab = state.tabId === payload.tabId;
  const tabId = isUnselectTab ? null : payload.tabId;
  const toolId = tabId ? TABS_TOOLS[tabId][0] : null;

  return {
    ...state,
    tabId,
    toolId,
    selectionsIds: [],
    pointerCssIcon:
      tabId === TABS_IDS.ANNOTATE || isDrawTool(toolId)
        ? POINTER_ICONS.DRAW
        : POINTER_ICONS.DEFAULT,
  };
};

export default selectTab;
