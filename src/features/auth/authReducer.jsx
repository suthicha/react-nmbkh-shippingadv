import { LOGIN_USER, SIGN_OUT_USER } from './authConstants'
import { createReducer } from '../../app/common/util/reducerUtil'

const initialState = {
    currentUser: {},
    token: localStorage.getItem('token')
}

export const loginUser = (state, payload) => {
    return {
        ...state,
        authenticated: true,
        currentUser: payload.auth.email
    }
}

export const signOutUser = (state, payload) => {
    return {
        ...state,
        authenticated: false,
        currentUser: {}
    }
}

export default createReducer(initialState,{
    [LOGIN_USER]: loginUser,
    [SIGN_OUT_USER]: signOutUser
})
