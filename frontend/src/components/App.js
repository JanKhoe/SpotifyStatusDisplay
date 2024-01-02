import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // used to rerender a specific componet instead ofg the entire page
    }
  }

  render(){
    // return <h1> {this.props.name} </h1>;
    return (
    <div className="center">
      <HomePage/>
      
    </div>
    );
  }
}

const appDiv = document.getElementById("app");
render (<App name="Jansen"/>, appDiv);
