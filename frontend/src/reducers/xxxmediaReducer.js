import { FETCH_MEDIA_FOR_MESSAGES, ADD_MEDIA } from '../actions/types';


const initialState = { mediaByMessage: {} };

export const mediaReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_MEDIA_SUCCESS':
      return { ...state, mediaByMessage: action.payload };
    case 'FETCH_MEDIA_ERROR':
      return { ...state, error: action.error };
    default:
      return state;
  }
};
