export const SHOW_LOADER = 'SHOW_LOADER';

const showLoader = (state, payload = {}) => ({
  ...state,
  loadingData: {
    isLoadingGlobally: true,
    text: payload.text,
    cancelFn: payload.cancelFn,
  },
});

export default showLoader;
