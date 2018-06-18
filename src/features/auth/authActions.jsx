import { LOGIN_USER, SIGN_OUT_USER } from "./authConstants";
import { closeModal } from "../modals/modalActions";
import { loginUser } from "../../app/data/mockUserApi";
import { toastr } from "react-redux-toastr";
import { sessionService } from "redux-react-session";
import jwtDecode from "jwt-decode";
import * as Cookies from "js-cookie";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions";

export const login = creds => {
  return async dispatch => {
    try {
      dispatch(asyncActionStart());
      const { email, password } = creds;
      const auth = await loginUser(email, password);
      
      if (auth) {
        const resp_auth = { ...auth, email };
        sessionService.saveSession(auth);
        sessionService.saveUser(resp_auth.email);

        dispatch({ type: LOGIN_USER, payload: { auth: resp_auth } });
        dispatch(asyncActionFinish());

        toastr.success("Success!", "Authenticated");
        dispatch(closeModal());
      }
    } catch (e) {
      dispatch(asyncActionError());
      toastr.error("Oops", "Found error something went wrong");
    }
  };
};

export const logout = callback => {
  setTimeout(() => {
    localStorage.removeItem('shipments');
    sessionService.deleteSession();
    sessionService.deleteUser();
    callback({ status: "OK" });
  }, 300);
  return {
    type: SIGN_OUT_USER
  };
};

export const checkAuth = (history, callback) => {
  
  setTimeout(() => {
    const cookie = Cookies.getJSON("USER-SESSION");
    if (cookie) {
      const validateExpired = jwtDecode(cookie.token).exp > Date.now() / 1000;
      if (!validateExpired) {
        sessionService.deleteSession();
        sessionService.deleteUser();
      }
      callback({ authenticated: validateExpired });
    } else {
      sessionService.deleteSession();
      sessionService.deleteUser();
      history.push("/");
    }
  }, 300);
};
