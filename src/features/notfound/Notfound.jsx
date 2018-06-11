import React from 'react';
import { Redirect } from 'react-router-dom';
const Notfound = () => {
  return (
    <div>
      <div className="ui inverted vertical masthead center aligned segment">
        <div className="ui text container">
          <h1 className="ui inverted stackable header">
            <div className="content">404: Page not found.</div>
          </h1>
          <br />
          <div
              onClick={() => <Redirect to='/' />}
              className="ui huge white inverted button"
            >
              Back to HomePage
              <i className="right arrow icon" />
            </div>
        </div>
      </div>
    </div>
  )
}

export default Notfound;
