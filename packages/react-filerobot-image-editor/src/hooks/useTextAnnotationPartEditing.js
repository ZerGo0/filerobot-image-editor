/** External dependencies */
import { SET_SELECTED_TEXT_PART } from 'actions';
import emitCustomEvent from 'utils/emitCustomEvent';
import { EVENTS } from 'utils/constants';

/** Internal dependencies */
import useStore from './useStore';
import useEditableTextId from './useEditableTextId';
import useSetAnnotation from './useSetAnnotation';

const useTextAnnotationPartEditing = () => {
  const { dispatch, annotations, selectedTextPart } = useStore();
  const editableTextId = useEditableTextId();
  const setAnnotation = useSetAnnotation();

  const setCurrentSelectedText = (selectedTextPartData) => {
    dispatch({
      type: SET_SELECTED_TEXT_PART,
      payload: selectedTextPartData,
    });
  };

  const updateAnnotationTextSlice = ({
    annotationId,
    searchValue,
    replaceValue,
    emitUpdateEvent = true,
  }) => {
    const currentAnnotation = annotations[annotationId] || {};
    const currentAnnotationText =
      currentAnnotation.defaultText || currentAnnotation.text;
    if (!currentAnnotation) {
      return;
    }

    let annotationText = Array.isArray(currentAnnotationText)
      ? currentAnnotationText
      : [{ textContent: currentAnnotationText }];

    annotationText = annotationText.map(
      ({ textContent, startIndex, ...rest }) => {
        const newTextContent = textContent.replace(searchValue, replaceValue);

        return {
          ...rest,
          ...(typeof startIndex !== 'undefined' && {
            startIndex,
            endIndex: startIndex + newTextContent.length,
          }),
          textContent: newTextContent,
        };
      },
    );

    setAnnotation({
      id: annotationId,
      text: annotationText,
      tmpText: undefined,
    });

    if (emitUpdateEvent) {
      emitCustomEvent(EVENTS.TEXT_CONTENT_EDITED, {
        id: editableTextId,
        textContent: annotationText,
        annotation: { ...currentAnnotation, text: annotationText },
      });
    }
  };

  return {
    selectedTextPart,
    setCurrentSelectedText,
    editableTextId,
    updateAnnotationTextSlice,
  };
};

export default useTextAnnotationPartEditing;
