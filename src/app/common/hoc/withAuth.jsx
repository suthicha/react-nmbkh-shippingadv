import React from 'react'
import {compose} from "redux";
import { connect } from 'react-redux'
import { checkAuth } from '../../../features/auth/authActions';
import LoadingComponent from '../../layout/LoadingComponent';

const withAuth = (AuthComponent) => {
    return class AuthWrapper extends React.Component {
        state = {
            authenticated: false
        }
        componentWillMount(){
            checkAuth(this.props.history, (cb)=> {
                this.setState({authenticated: cb.authenticated})
                if (!cb.authenticated){
                    setTimeout(()=>{
                        this.props.history.push('/');
                    },100)
                }
            });
        }
        render(){
            const { authenticated } = this.state;
            if (!authenticated) return <LoadingComponent content="Loading..." />
            return authenticated && <AuthComponent history={this.props.history} {...this.props} />
        }
    }
}

const mapActions = {
    checkAuth
}

const composedHoc = compose(
    connect(null, mapActions),
    withAuth
);

export default composedHoc;
