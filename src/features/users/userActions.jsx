import {toastr} from 'react-redux-toastr';
import { FETCH_USERS, INSERT_USER, UPDATE_USER, DELETE_USER } from './userConstants';
import { fetchUsers, insertUser, updateUser, deleteUser } from '../../app/data/mockUserApi';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';

export const insertUserAction = (user) => {
    return {
        type: INSERT_USER,
        payload: {
            user
        }
    }
}

export const updateUserAction = (user) => {
    return {
        type: UPDATE_USER,
        payload: {
            user
        }
    }
}

export const deleteUserAction = (id) => {
    return {
        type: DELETE_USER,
        payload: {
            id
        }
    }
}

export const fetchUsersAction = (users) => {
    return {
        type: FETCH_USERS,
        payload: {
            users
        }
    }
}

// export const fetch_userProfile = (id) => {
//     return async dispatch => {
//         try{
//             asyncActionStart();
//             let promise = await fetchUserProfile(id);
//             dispatch(fetchUserProfileAction(promise.data))
//             asyncActionFinish();
//             toastr.success('Success', 'Load user profile success.')
//         }catch(error){
//             toastr.error('Opps!', 'Found error ' + error.message);
//             asyncActionError();
//         }
//     }
// }

export const fetch_users = () => {
    return async dispatch => {
        try{
            asyncActionStart();
            let promise = await fetchUsers();
            dispatch(fetchUsersAction(promise.data));
            asyncActionFinish();
            toastr.success('Success', 'Users have been loaded.');
        }catch(error){
            asyncActionError();
            toastr.error('Opps!', 'Found error ' + error.message);
        }
    }
}

export const insert_user = (user) => {
    return async dispatch => {
        try{
            asyncActionStart();
            let promise = await insertUser(user);
            dispatch(insertUserAction(promise.data));
            asyncActionFinish();
            toastr.success('Success', 'Add new user success.')
        }catch(error){
            asyncActionError();
            toastr.error('Opps!', 'Found error ' + error.message);
        }
    }
}

export const update_user = (id, user) => {
    return async dispatch => {
        try{
            asyncActionStart();
            let promise = await updateUser(id, user);
            dispatch(updateUserAction(promise.data));
            asyncActionFinish();
            toastr.success('Success', 'User did updated.')
        }catch(error) {
            asyncActionError();
            toastr.error('Opps!', 'Found error ' + error.message);
        }
    }
}

export const delete_user = (id, username) => {
    return async dispatch => {
        try{
            asyncActionStart();
            let promise = await deleteUser(id, username);
            if (promise){
                dispatch(deleteUserAction(id));
            }
            asyncActionFinish();
            toastr.warning('Success', 'User has been deleted.')
        }catch(error){
            asyncActionError();
            toastr.error('Opps!', 'Found error ' + error.message);
        }
    }
}