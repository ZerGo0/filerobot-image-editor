export const SET_SELECTED_TEXT_PART = 'SET_SELECTED_TEXT_PART';

const setSelectedTextPart = (state, payload) => ({
  ...state,
  selectedTextPart: {
    hasSelection: payload.hasSelection ?? false,
    textContent:
      payload.textContent || payload.textContent === 0
        ? payload.textContent
        : '',
    element: payload.element || null,
    startIndex: payload.startIndex ?? null,
    endIndex: payload.endIndex ?? null,
    annotationId: payload.annotationId ?? state.textIdOfEditableContent ?? null,
  },
});

export default setSelectedTextPart;
