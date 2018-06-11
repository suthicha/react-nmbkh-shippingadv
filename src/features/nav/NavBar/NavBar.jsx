import React, { Component } from "react";
import { connect } from 'react-redux';
import { Menu, Container } from "semantic-ui-react";
import { NavLink, Link, withRouter } from "react-router-dom";
import { openModal } from '../../modals/modalActions';
import { logout } from '../../auth/authActions'
import SignedInMenu from "../Menus/SignedInMenu";
import SignedOutMenu from "../Menus/SignedOutMenu";
import LoadingComponent from '../../../app/layout/LoadingComponent';

const actions = {
  openModal,
  logout
}

const mapState = ({session}) => ({
  email: session.user,
  authenticated: session.authenticated
})

class NavBar extends Component {
  state = {
    loading: false
  }

  handleSignIn = () => {
    this.props.openModal('LoginModal');
  };

  handleRegister = () => {
    this.props.openModal('RegisterModal');
  }

  handleSignOut = () => {
    this.setState({loading:true});
    this.props.logout((cb)=>{
      this.setState({loading: false})
      this.props.history.push("/");
    });
    
  };

  render() {
    const { authenticated, email } = this.props;
    const currentUser = email.length === undefined? 'Loading...': email;
    
    if(this.state.loading) return <LoadingComponent content="Session clearing..." />
    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item header as={Link} to="/">
            <img src="/assets/logo.png" alt="logo" style={{width: '100%', height: '90%'}}/>
            
          </Menu.Item>
          <Menu.Item as={NavLink} to="/shipments" name="SHIPMENTS" />
          
          {authenticated ? (
            <SignedInMenu currentUser={currentUser} signOut={this.handleSignOut} />
          ) : (
            <SignedOutMenu signIn={this.handleSignIn} register={this.handleRegister} />
          )}
        </Container>
      </Menu>
    );
  }
}

export default withRouter(connect(mapState, actions)(NavBar));
