import React, { Component } from "react";
import { Icon, Menu, Dropdown } from "semantic-ui-react";

const Navbar = props => {
  const { currentUser } = props;

  const trigger = (
    <span>
      <Icon
        color={currentUser.socketId ? "green" : null}
        name={currentUser.socketId ? "circle" : "circle outline"}
      />
      {currentUser.name}
    </span>
  );

  return (
    <Menu>
      <Menu.Item name="sidebar-menu" onClick={props.handleMenuClick}>
        <Icon name="sidebar" size="large" />
      </Menu.Item>

      <Menu.Menu position="right">
        <Dropdown
          id="user-settings-menu"
          trigger={trigger}
          icon="dropdown"
          item
        >
          <Dropdown.Menu position="right">
            <Dropdown.Item text="Logout" onClick={props.handleLogoutClick} />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>
  );
};

export default Navbar;
