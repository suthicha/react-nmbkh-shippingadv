import React from "react";
import { connect } from "react-redux";
import { openModal } from "../modals/modalActions";

const mapState = ({session}) => ({
  authenticated: session.authenticated
})

const actions = {
  openModal
};

const HomePage = ({ history, authenticated, openModal }) => {
  return (
    <div>
      <div className="ui inverted vertical masthead center aligned segment">
        <div className="ui text container">
          <h1 className="ui inverted stackable header">
            <div className="content">CTI</div>
          </h1>
          <h2>Better Logistics,Greater Success</h2>
          {authenticated ? (
            <div
              onClick={() => history.push("/shipments")}
              className="ui huge white inverted button"
            >
              Go to Dashboard
              <i className="right arrow icon" />
            </div>
          ) : (
            <div
              onClick={() => openModal("LoginModal")}
              className="ui huge white inverted button"
            >
              Sign In
              <i className="right arrow icon" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default connect(mapState, actions)(HomePage);
