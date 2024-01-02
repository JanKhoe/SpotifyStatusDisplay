import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl"
import { Link } from "react-router-dom";
import Radio from '@material-ui/core/Radio';
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { FormLabel } from "@material-ui/core";


export default class CreateRoomPage extends Component {
  static defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallBack: () => {},
  }
  // defaultVotes = 2;
  // x = 1

  constructor(props) {
    super(props);
    // A state is basically the storage for all the values of the props
    // can be updated really easily and used to update the model dynamically
    this.state = {
      guestCanPause: this.props.guestCanPause,
      votesToSkip: this.props.votesToSkip,
      errorMsg: "",
      succesMsg: "",
    };

    //binding methods to the class
    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    this.handleVotesChange = this.handleVotesChange.bind(this);
    this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
    this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
  }

  // e is the object that called the method
  handleVotesChange(e){
    this.setState({
      votesToSkip: e.target.value,
    });
  }

  handleGuestCanPauseChange(e){
    this.setState({
      guestCanPause: e.target.value ==="true" ? true : false,
    })
  }

  //takes no parameters because we are binding it to the class
  // Making it so that within the class we have access to the "this" keyword

  handleRoomButtonPressed(){
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        // data has to match the ones inside views.py
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
      }),
    };
    fetch("/api/create-room/", requestOptions)
    .then((response) => response.json())
    .then((data) => this.props.history.push('/room/' + data.code))
    ;
  }

  handleUpdateButtonPressed(){
    const requestOptions = {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        // data has to match the ones inside views.py
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
        code: this.props.roomCode
      }),
    };
    fetch("/api/update-room", requestOptions)
    .then((response) => {
      if (response.ok){
        this.setState({
          succesMsg : "Room updated successfully! :D"
        });
      }else{
        this.setState({
          errorMsg : "Error updating room. D:"
        });
      }
      this.props.updateCallback();
    });

  }

  renderCreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  } 

  renderUpdateButtons(){
    return(
      <Grid item xs={12} align="center">
        <Button 
        color ="primary" 
        variant="contained"
        onClick={this.handleUpdateButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
    );
  }

  render(){
    const title = this.props.update ? "Update Room" : "Create a Room"
    // The standard thing used in material ui to align things vertically and horizontally
    // spacing(n) = n*8
    return (
    <Grid container spacing ={1}>
      <Grid item xs={12} align="center">
        {/* in is bool val to see if collapse tag will be shown */}
        <Collapse in={this.state.errorMsg != "" || this.state.succesMsg != ""}>
          {this.state.succesMsg != "" 
          ? (<Alert severity="success" onClose={() => {this.setState({
            succesMsg: ""
          })}}>
            {this.state.succesMsg}
          </Alert>) 
          : (<Alert severity="error" onClose={() => {this.setState({
            errorMsg: ""
          })}}>
            {this.state.errorMsg}
            </Alert>)};
        </Collapse>
      </Grid>
      {/* creates a grid item aligned at the center and takes up the whole grid
      since the size is 12(the max size) */}
      <Grid item xs={12} align="center">
        {/* Typography is a nicely styled header from material-ui */}
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">
              Guest Control of Playback State
            </div>
          </FormHelperText>
          <RadioGroup 
          row  
          defaultValue={this.state.guestCanPause.toString()} 
          onChange={this.handleGuestCanPauseChange}
          >
            <FormControlLabel 
            value="true" 
            control={<Radio color="primary" />}
            label="Play/Pause"
            labelPlacement="bottom"
            />
            <FormControlLabel 
            value="false" 
            control={<Radio color="secondary" />}
            label="No Control"
            labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>  
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          {/* inputProps makes it so that the suer must input a min value of 1 so we dont get negative votes or 0 votes minimum required to skip
          Abstractly it inputs extra "props" which were the parameters used to initilize the model*/}
          <TextField 
          required={true} 
          type="number" 
          defaultValue={this.state.votesToSkip} 
          inputProps={{min: 1, style: {textAlign: "center"},}}
          onChange={this.handleVotesChange}
          />
          <FormHelperText>
            <div align="center">
              Votes Required To Skip Song
            </div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {this.props.update 
      ? this.renderUpdateButtons()
      : this.renderCreateButtons()}
    </Grid>
    );
  }
}