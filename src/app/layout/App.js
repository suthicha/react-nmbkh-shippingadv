import React from "react";
import PropTypes from 'prop-types';
import { Container } from "semantic-ui-react";
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from "react-router-dom";
import ShipmentDashboard from "../../features/shipments/ShipmentDashboard/ShipmentDashboard";
import NavBar from "../../features/nav/NavBar/NavBar";
import ShipmentForm from "../../features/shipments/ShipmentForm/ShipmentForm";
import HomePage from "../../features/home/HomePage";
import ModalManager from '../../features/modals/ModalManager';
import ShipmentSearchPage from '../../features/shipments/ShipmentSearch/ShipmentSearchPage';
import UserProfileDashboard from '../../features/userprofile/UserProfileDashboard/UserProfileDashboard';

class App extends React.Component {

  render(){
    const { checked } = this.props;
    return(
      <div>
      <ModalManager />
      <Switch>
        <Route exact={true} path="/" component={HomePage} />
      </Switch>
      { checked &&
        <Route
          path="/(.+)"
          render={() => (
            <div>
              <NavBar />
              <Container className="main">
                <Switch>
                  <Route path="/shipments" component={ShipmentDashboard} />
                  <Route path="/query-shipments/:searchText" component={ShipmentSearchPage} />                  
                  <Route path="/create-shipment/:tradcode/:id" component={ShipmentForm} />
                  <Route path="/create-shipment/:tradcode" component={ShipmentForm} />
                  <Route path="/user-profile" component={UserProfileDashboard} />
                </Switch>
              </Container>
            </div> 
          )}
        /> }
    </div>
    )
  }
}

App.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired
}

const mapState = ({ session }) => ({
  checked: session.checked,
  authenticated: session.authenticated
});

export default withRouter(connect(mapState)(App));
