import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      roomCode: null,
    };
    this.clearRoomCode = this.clearRoomCode.bind(this);
  }


  

  // render() {
  //   return ( 
  //       <Router>
  //           <Routes>
  //               <Route path='/' element={<p>This is the home page</p>}/>
  //               <Route path='/join' element={<RoomJoinPage/>}/>
  //               <Route path='/create' element={<CreateRoomPage/>}/>
  //           </Routes>
  //     </Router>
  //   );


  // Life cycle methods (like Mono behavior) : alters the behaviour of the component
  // component didmount executes the method when the component is first rendered on the sceen
  // Like an awake monobehavior

  //async keyword is sued to operate a asynchornous method so it runs with everything else instead of waiting for everything to render first
  async componentDidMount() {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          roomCode: data.code,
        });
      });
  }

  renderHomePage() {
    return(
      <Grid container spacing={3}>
        <Grid item xs={12} align ="center">
          <Typography variant="h3" compact ="h3">
            Music Controller
          </Typography>

        </Grid>
        <Grid item xs={12} align ="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component ={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to="/create" component ={Link}>
              Host a Room
            </Button>
          </ButtonGroup>
        </Grid>

      </Grid>
    );
  }

  // callbacks are a way the child can modify or affect its parent
clearRoomCode() {
  this.setState({
    roomCode: null,
  });
}

  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return this.state.roomCode ? (
                <Redirect to={`/room/${this.state.roomCode}`} />
              ) : (
                this.renderHomePage()
              );
            }}
          />
          <Route path="/join" component={RoomJoinPage} />
          <Route path="/create" component={CreateRoomPage} />
          <Route
            path="/room/:roomCode"
            render={(props) => {
              return <Room {...props} leaveRoomCallback={this.clearRoomCode} />;
            }}
          />
        </Switch>
      </Router>
    );
  }
}
//   // callbacks are a way the child can modify or affect its parent
//   clearRoomCode() {
//     this.setState({
//       roomCode: null,
//     });
//   }
//   render(){
//     // return <p> This is the home page </p>
//     return (
//     <Router>
//       <Switch>
//         <Route exact path='/' render={() => {
//           return this.state.roomCode ? (<Redirect to={ `/room/${this.state.roomCode}`}/>) : this.renderHomePage()
//         }}></Route>
        
//         <Route path="/join" component={RoomJoinPage}></Route>
        
//         <Route path='/create' component={CreateRoomPage}></Route>
//         {/* using colon denotes that part of the path will be variable 
//         the variable is then passed */}
//         <Route
//             path="/room/:roomCode"
//             render={(props) => {
//               return <Room {...props} leaveRoomCallback={this.clearRoomCode} />;
//             }}
//           />
//       </Switch>
//     </Router>
//     );
//   }
// }