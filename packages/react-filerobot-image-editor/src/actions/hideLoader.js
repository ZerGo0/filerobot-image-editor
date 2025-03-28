export const HIDE_LOADER = 'HIDE_LOADER';

const hideLoader = (state) => ({
  ...state,
  loadingData: {
    isLoadingGlobally: false,
    text: '',
    cancelFn: null,
  },
});

export default hideLoader;
