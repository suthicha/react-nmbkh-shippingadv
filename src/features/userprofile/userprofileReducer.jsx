import { createReducer } from "../../app/common/util/reducerUtil";
import { FETCH_USER_PROFILE, UPDATE_USER_PROFILE } from './userprofileConstants';

const initialState = {}

export const fetchUserProfile = (state, payload) => {
    return payload.user;
}

export const updateUserProfile = (state, payload) => {
    return Object.assign({}, payload.user);
}

export default createReducer(initialState, {
    [FETCH_USER_PROFILE]: fetchUserProfile,
    [UPDATE_USER_PROFILE]: updateUserProfile
});