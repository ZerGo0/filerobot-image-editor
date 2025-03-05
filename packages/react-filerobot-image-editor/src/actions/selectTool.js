import { POINTER_ICONS } from 'utils/constants';
import isDrawTool from 'utils/isDrawTool';

export const SELECT_TOOL = 'SELECT_TOOL';

const selectTool = (state, payload) =>
  state.toolId === payload.toolId
    ? state
    : {
        ...state,
        toolId: payload.toolId,
        selectionsIds: payload.keepSelections ? state.selectionsIds : [],
        pointerCssIcon: isDrawTool(payload.toolId)
          ? POINTER_ICONS.DRAW
          : POINTER_ICONS.DEFAULT,
      };

export default selectTool;
