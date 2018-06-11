import React, { Component } from 'react'
import withAuth from '../../../app/common/hoc/withAuth';
import { Grid, Menu  } from 'semantic-ui-react';
import UserProfileForm from '../UserProfileForm/UserProfileForm';

export class UserProfileDashboard extends Component {
  render() {
    return (
      <Grid>
        <Grid.Column width={10}>
          <Menu pointing secondary>
            <Menu.Item>
              <span className='content-header'>USER PROFILE</span>
            </Menu.Item>
          </Menu>
          <UserProfileForm />
        </Grid.Column>
      </Grid>
    )
  }
}

export default withAuth(UserProfileDashboard);
