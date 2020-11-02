export const FETCH_TENANTS_PENDING = 'FETCH_TENANTS_PENDING';
export const FETCH_TENANTS_SUCCESS = 'FETCH_TENANTS_SUCCESS';
export const FETCH_TENANTS_ERROR = 'FETCH_TENANTS_ERROR';
export const LOGIN_USER_PENDING = 'LOGIN_USER_PENDING';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';
import {ToastAndroid} from 'react-native';

const displayToast = (msg) => {

  ToastAndroid.showWithGravity(
    msg,
    ToastAndroid.SHORT, //can be SHORT, LONG
    ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
  );
};

export const fetchTenantsPending = () => {
  return {
    type: FETCH_TENANTS_PENDING,
  };
};

export const fetchTenantsSuccess = tenants => {
  return {
    type: FETCH_TENANTS_SUCCESS,
    tenants,
  };
};

export const fetchTenantsError = error => {
  return {
    type: FETCH_TENANTS_ERROR,
    error,
  };
};

export const loginUserPending = () => {
  return {
    type: LOGIN_USER_PENDING,
  };
};

export const loginUserSuccess = user => {
  return {
    type: LOGIN_USER_SUCCESS,
    user,
  };
};

export const loginUserError = error => {

  displayToast("Invalid Login Credentials.")
  return {
    type: LOGIN_USER_ERROR,
    error,
  };
};
