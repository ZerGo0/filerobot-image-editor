export const SET_FEEDBACK = 'SET_FEEDBACK';

const setFeedback = (state, payload) => ({
  ...state,
  loadingData: {
    isLoadingGlobally: false,
    text: '',
    cancelFn: null,
  },
  feedback: payload.feedback || {},
});

export default setFeedback;
