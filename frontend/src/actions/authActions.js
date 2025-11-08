// src/actions/authActions.js

const USER_API = process.env.REACT_APP_USER_API;
const MEDIA_API = process.env.REACT_APP_MEDIA_API;


export const registerRequest = () => ({
  type: 'REGISTER_REQUEST'
});
export const registerSuccess = (user) => ({
  type: 'REGISTER_SUCCESS',
  payload: user
});
export const registerFail = (error) => ({
  type: 'REGISTER_FAIL',
  payload: error
});

export const registerUser = (userData) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    console.log("📤 Données reçues :", userData);

    // Simuler une requête API
    const response = await fetch(`${USER_API}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    dispatch(registerSuccess(data));
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
      window.location.reload();
    }

  } 
  catch (error) {
    dispatch(registerFail(error.message));
  }
};

export const loginUser = (token) => (dispatch) => {
  dispatch({
    type: 'LOGIN_REQUEST'
  });

  try {
    // Stocker le token dans le localStorage
    localStorage.setItem('accessToken', token);
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: token
    });
  } catch (error) {
    dispatch({
      type: 'LOGIN_FAILURE',
      payload: error.message
    });
  }
};