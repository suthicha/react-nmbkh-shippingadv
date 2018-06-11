import { combineReducers } from 'redux'
import { reducer as toastrReducer } from 'react-redux-toastr'
import { reducer as FormReducer  } from 'redux-form';
import { sessionReducer } from 'redux-react-session';
import authReducer from '../../features/auth/authReducer';
import asyncReducer from '../../features/async/asyncReducer';
import modalReducer from '../../features/modals/modalReducer';
import shipmentReducer from '../../features/shipments/shipmentReducer';
import userprofileReducer from '../../features/userprofile/userprofileReducer';
import userReducer from '../../features/users/userReducer';

const rootReducer = combineReducers({
    session: sessionReducer,
    async: asyncReducer,
    auth: authReducer,
    form: FormReducer,
    modals: modalReducer,
    toastr: toastrReducer,
    shipments: shipmentReducer,
    userprofile: userprofileReducer,
    users: userReducer
})

export default rootReducer