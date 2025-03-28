export const SET_SAVING = 'SET_SAVING';

const setSaving = (state, payload) => ({
  ...state,
  isSaving: payload.isSaving,
  loadingData: {
    isLoadingGlobally: payload.isSaving,
    text: payload.loadingText || '',
    cancelFn: payload.loadingCancelFn || null,
  },
});

export default setSaving;
