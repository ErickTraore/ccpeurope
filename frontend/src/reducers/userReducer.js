// File: frontend/src/reducers/userReducer.js

const initialState = {
  users: [],
  loading: false,
  error: null
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_USERS_REQUEST':
      return { ...state, loading: true };

    case 'GET_USERS_SUCCESS':
      return { ...state, loading: false, users: action.payload };

    case 'GET_USERS_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'CREATE_USER_REQUEST':
      return { ...state, loading: true };

    case 'CREATE_USER_SUCCESS':
      return { ...state, loading: false, users: [...state.users, action.payload] };

    case 'CREATE_USER_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'UPDATE_USER_REQUEST':
      return { ...state, loading: true };

    case 'UPDATE_USER_SUCCESS':
      return {
        ...state,
        loading: false,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        )
      };

    case 'UPDATE_USER_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DELETE_USER_REQUEST':
      return { ...state, loading: true };

    case 'DELETE_USER_SUCCESS':
      return {
        ...state,
        loading: false,
        users: state.users.filter(user => user.id !== action.payload)
      };

    case 'DELETE_USER_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default userReducer;