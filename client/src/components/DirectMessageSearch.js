import React, { Component } from "react";
import { Input, Button, Header, List, Icon } from "semantic-ui-react";
import soa from "../utils/socketActions";
import {
  getRoomsByGroup,
  getDirectMessage,
  setDirectMessageName
} from "../utils/chat";

class DirectMessageSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      matchedUsers: this.getMatchedUsers(props.users, "")
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
  }

  getMatchedUsers(users, inputValue) {
    const { currentUser } = this.props;
    const upperCaseInputValue = inputValue.toUpperCase();

    //Remove the current user from matched users
    const { [currentUser.id]: removedUser, ...remainingUsers } = users;

    return Object.values(remainingUsers).filter((user, index) => {
      if (user.name.toUpperCase().indexOf(upperCaseInputValue) !== -1)
        return user;
    });
  }

  handleInputChange(e) {
    const { users } = this.props;
    const inputValue = e.target.value;

    this.setState({
      inputValue,
      matchedUsers: this.getMatchedUsers(users, inputValue)
    });
  }

  handleUserClick(e, { userid, roomid }) {
    const {
      socket,
      currentUser,
      rooms,
      users,
      showRoom,
      addRoom,
      openChatRoom,
      setMenuVisibility
    } = this.props;

    const directRooms = getRoomsByGroup(rooms, "direct");
    const directMessage = getDirectMessage(directRooms, userid);
    setMenuVisibility(false);

    if (directMessage) {
      soa.openRoom(
        {
          socket,
          currentUserId: currentUser.id,
          roomId: directMessage.id
        },
        response => {
          if (response.success) {
            const { activeRoom, messages } = response.data;

            const updatedRoom = setDirectMessageName({
              room: activeRoom,
              currentUser,
              users
            });

            openChatRoom({
              currentUser,
              room: updatedRoom,
              messages
            });

            showRoom();
          }
        }
      );
    } else {
      //create
      soa.createRoom(
        {
          socket,
          group: "direct",
          name: "Direct Message",
          users: [currentUser.id, userid]
        },
        response => {
          if (response.success) {
            const { room, messages } = response.data;

            const updatedRoom = setDirectMessageName({
              room,
              currentUser,
              users
            });

            addRoom(updatedRoom);

            openChatRoom({
              currentUser,
              room: updatedRoom,
              messages
            });

            showRoom();
          }
        }
      );
    }
  }

  render() {
    const { users } = this.props;
    const { inputValue, matchedUsers } = this.state;

    return (
      <div id="chat-add-direct-message">
        <Header as="h2" content="Direct Messages" />
        <Button
          className="escape-chat-menu-btn"
          icon="remove"
          floated="right"
          size="big"
          onClick={this.props.showRoom}
        />
        <Input
          className="direct-message-search-input"
          size="huge"
          placeholder="Find or start a conversation"
          onChange={this.handleInputChange}
          value={this.state.inputValue}
        />
        <List id="direct-message-list" divided relaxed>
          {matchedUsers.map((user, index) => {
            return (
              <List.Item
                key={user.id}
                userid={user.id}
                style={{ cursor: "pointer" }}
                onClick={this.handleUserClick}
              >
                <List.Content>
                  <Icon
                    color={user.socketId ? "green" : null}
                    name={user.socketId ? "circle" : "circle outline"}
                  />
                  {user.name}
                </List.Content>
              </List.Item>
            );
          })}
        </List>
      </div>
    );
  }
}

export default DirectMessageSearch;
