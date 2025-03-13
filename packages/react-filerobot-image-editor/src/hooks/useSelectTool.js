/** External dependencies */
import { useCallback } from 'react';

/** Internal dependencies */
import { SELECT_TOOL } from 'actions';
import isFunction from 'utils/isFunction';
import useDispatch from './useDispatch';

const useSelectTool = (onToolChangeCbk) => {
  const dispatch = useDispatch();

  const selectTool = useCallback(
    (toolId, keepSelections = false) => {
      dispatch({
        type: SELECT_TOOL,
        payload: {
          toolId,
          keepSelections,
        },
      });

      if (isFunction(onToolChangeCbk)) {
        onToolChangeCbk(toolId);
      }
    },
    [onToolChangeCbk],
  );

  return selectTool;
};

export default useSelectTool;
