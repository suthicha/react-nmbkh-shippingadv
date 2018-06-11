import {
  FETCH_USER_PROFILE,
  UPDATE_USER_PROFILE
} from "./userprofileConstants";
import { updateUser, fetchUserProfile, recoveryPassword } from "../../app/data/mockUserApi";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions";
import { toastr } from "react-redux-toastr";
import jwtDecode from "jwt-decode";
import * as Cookies from "js-cookie";

export const fetchUserProfileAction = user => {
  return {
    type: FETCH_USER_PROFILE,
    payload: {
      user
    }
  };
};

export const updateUserProfileAction = user => {
  return {
    type: UPDATE_USER_PROFILE,
    payload: {
      user
    }
  };
};

export const fetch_userprofile = () => {
  return async dispatch => {
    try {
      asyncActionStart();
      let promise = await fetchUserProfile();
      dispatch(fetchUserProfileAction(promise.data));
      asyncActionFinish();
      toastr.success("Success", "User profile has loaded.");
    } catch (error) {
      asyncActionError();
      toastr.error("Opps!", "Found error " + error.message);
    }
  };
};

export const update_userprofile = (user) => {
  return async dispatch => {
    try {
      dispatch(asyncActionStart());
      let promise = await updateUser(user.UserID, user);
      const cookie = Cookies.getJSON("USER-SESSION");
      const updateCookie = {...cookie, user: promise.user[0]}
      Cookies.set('USER-SESSION', updateCookie);

      dispatch(updateUserProfileAction(promise.user[0]));
      dispatch(asyncActionFinish());
      toastr.success("Success", "User have been updated");
    } catch (error) {
      dispatch(asyncActionError());
      toastr.error("Opps!", "Found error " + error.message);
    }
  };
};

export const get_userinfoFromCookie = callback => {
  return async dispatch => {
    try {
      const cookie = Cookies.getJSON("USER-SESSION");
      callback(jwtDecode(cookie.token), cookie.user);
    } catch (error) {
      callback(null);
      toastr.error("Opps!", "Found error " + error.message);
    }
  };
};

export const resetpassword_userprofile = (user, callback) => {
  return async dispatch => {
    try {
      dispatch(asyncActionStart());
      let promise = await recoveryPassword(null);
      if (promise)
      { 
        callback('OK');
      }
      dispatch(asyncActionFinish());
      toastr.success('Success', 'Your password have updated');
    } catch (error) {
      callback(null);
      dispatch(asyncActionError());
      toastr.error('Opps!', 'Found error ' + error.message);
    }
  };
};
