import React from "react";
import { Menu, Dropdown, Image } from "semantic-ui-react";
import { Link } from 'react-router-dom'

const SignedInMenu = ({signOut, currentUser}) => {
  
  return (
    <Menu.Item position="right">
      <Image avatar spaced="right" src="/assets/user.png" />
      <Dropdown pointing="top left" text={currentUser}>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to='/user-profile' text="My Profile" icon="user" />
          <Dropdown.Item onClick={signOut} text="Sign Out" icon="power" />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
};

export default SignedInMenu;
