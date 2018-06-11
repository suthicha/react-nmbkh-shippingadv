import { createReducer } from "../../app/common/util/reducerUtil";
import { FETCH_USERS, INSERT_USER, UPDATE_USER, DELETE_USER } from './userConstants';

const initialState = [];

export const fetchUsers = (state, payload) => {
    return payload.users;
}

export const createUser = (state, payload) => {
    return [Object.assign({}, ...payload.user), ...state]
}

export const updateUser = (state, payload) => {
    const updateState = state.filter(
        (user) => {
           return user.TrxNo !== payload.user.TrxNo
        }
    );
    return [Object.assign({}, ...payload.user), ...updateState];
}

export const deleteUser = (state, payload) => {
    return [...state.filter((user)=> { return user.TrxNo !== payload.id})]
}

export default createReducer(initialState,{
    [INSERT_USER]: createUser,
    [UPDATE_USER]: updateUser,
    [DELETE_USER]: deleteUser,
    [FETCH_USERS]: fetchUsers
})