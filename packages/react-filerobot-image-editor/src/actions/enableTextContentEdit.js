export const ENABLE_TEXT_CONTENT_EDIT = 'ENABLE_TEXT_CONTENT_EDIT';

const enableTextContentEdit = (state, payload) => ({
  ...state,
  textIdOfEditableContent: payload.textIdOfEditableContent || null,
  selectedTextPart:
    payload.textIdOfEditableContent &&
    (!state.textIdOfEditableContent ||
      state.textIdOfEditableContent === payload.textIdOfEditableContent)
      ? {
          ...state.selectedTextPart,
          annotationId: payload.textIdOfEditableContent,
        }
      : {},
  selectionsIds: [],
});

export default enableTextContentEdit;
