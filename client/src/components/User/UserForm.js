import React from 'react';
import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';
import localStyles from './User.module.css';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { withFirebase } from '../Auth/Firebase/FirebaseContext';
import UserAPI from "./UserAPI";
  
const styles = theme => ({
  container: {
      display: 'flex',
      flexWrap: 'wrap',
  },
  inputFix: {
      marginTop: 5
  },
  textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 300,
  },
  menu: {
      width: 200,
  },
  formControl: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      minWidth: 300,
  },
  selectEmpty: {
      marginTop: theme.spacing.unit * 2,
  },
});

function NumberFormatPhone(props) {
  const { inputRef, onChange, ...other } = props;

  return (
      <NumberFormat
          {...other}
          className={localStyles.input}
          getInputRef={inputRef}
          onValueChange={values => {
              onChange({
                  target: {
                      value: values.value,
                  },
              });
          }}
          format="(###) ###-####"
          mask=""
      />
  );
}
class UserForm extends React.Component {
  state = {
    id: this.props.id,
    firstName: "",
    lastName: "",
    photoURL: "",
    phoneNumber: "",
    email: "",
    uid: "",
    claims: "noauth",
    isAdmin: false,
    isCashier: false,
    isBanker: false,
    isUser: false,
    message: ""
  };

  fetchUser = (id) => {
    UserAPI.get(id)
    .then(user => {
      this.setState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        photoURL: user.photoURL || "",
        phoneNumber: user.phoneNumber || "",
        uid: user.uid,
        claims: user.claims,
        isAdmin: user.isAdmin,
        isCashier: user.isCashier,
        isBanker: user.isBanker,
        isUser: user.isUser,
        email: user.email
      });
      // Dont need to get custom claims since they are passed in props from context
      // and can not be changed here
    })
    .catch(err => {
      console.error(`Error getting user ${err}`);
      this.setState({error: `Error getting user ${err}`});
    });
  };

  componentDidMount() {
    console.log(`id: ${this.state.id}`);
    if (this.state.id) {
      this.fetchUser(this.state.id);
    } else {
    }
  }

  // Create a new user 
  // Create the user in firebase AUTH with email and random password
  // Save that user in firestore
  // -- The above is like the sign up process
  // Then, generate change password link for user and send to their email address
  createUser = () => {  
    // eslint-disable-next-line no-unused-vars
    const user = this.state;

    // First, create the auth user in firebase
    // must be done on server for security reasons
    UserAPI.createAuthUser(user)
      .then(response => {
        const authUser = {};
        authUser.user = response.data;
        // Temp override these due to errors in stroing null values.
        authUser.user.phoneNumber = user.phoneNumber;
        authUser.user.photoURL = user.photoURL;
        // Now Create the user in firestore
        UserAPI.addAuthUserToFirestore(authUser).then( (id) => {
          this.props.firebase.doPasswordReset(user.email).then(() => {
            this.setState({
              message: "New User Added.  Password reset Link sent - user must reset password login",
              id: id
            });
          }).catch(err => {
            this.setState({ message: err.message });
          });    
        }).catch(err => {
            this.setState({ message: `Error adding user ${err}` });
        });  
      })
      .catch(err => {
        this.setState({ message: `Error adding user ${err}` });
    });  
  }

  updateUser = () => {
    console.log(`updating db with user.uid:${this.state.uid}`);

    const user = this.state;
    UserAPI.update(user).then (user => {
      this.setState({message: "User Updated"});
      // should we go to user list page??  Passing message??
      this.props.history.push({
        pathname: '/admin',
        state: {message: "User Updated" }
      });
    }).catch (err => {
      // set message to show update
      this.setState({message: `Error updating user ${err}`});
    });
  }

  saveUser = (e) => {
    e.preventDefault();
    // Update current user in firestore (and auth for some fields)
    if (this.state.id) {
      this.updateUser();
    } else {
      this.createUser();
    }
  };

  onChange = event => {

    this.setState({
        [event.target.name]: event.target.value
    });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  // Make Admin
  userMakeAdmin = (id) => {

    console.log(`Trying to make User ${id} Admin`);

    UserAPI.makeAdmin( id )
    .then(res => {
        console.log(`Made User ${id} Admin`);
        this.setState({message: `Made User Admin`});
        this.fetchUser(id);
    })
    .catch(err => {
      this.setState({message: `Error: ${err}`});
      console.error(err); 
    });
  }        
  
  // Make Cashier
  userMakeCashier = (id) => {
      UserAPI.makeCashier( id )
      .then(res => {
          console.log(`Made User ${id} Cashier`);
          this.setState({message: `Made User Cashier`});
          this.fetchUser(id);
      })
      .catch(err => {
        this.setState({message: `Error: ${err}`});
        console.error(err); 
      });
  }   

  // Make User - essentailly dispables the user
  userMakeUser = (id) => {
      UserAPI.makeUser( id )
      .then(res => {
          console.log(`Made User ${id} User`);
          this.setState({message: `Disabled User (i.e. made them a user)`});
          this.fetchUser(id);
      })
      .catch(err => {
        this.setState({message: `Error: ${err}`});
        console.error(err); 
      });
  }       

  // Make Banker
  userMakeBanker = (id) => {
      UserAPI.makeBanker( id )
      .then(res => {
          console.log(`Made User ${id} Banker`);
          this.setState({message: `Made User Banker`});
          this.fetchUser(id);
      })
      .catch(err => {
        this.setState({message: `Error: ${err}`});
        console.error(err); 
      });
  }

  render() {
    const { classes } = this.props;

    const {
      firstName,
      lastName,
      photoURL,
      phoneNumber,
      email,
      claims,
      message
      } = this.state;

    let buttonText, emailEnabled;
    if (this.state.id) {
      buttonText = "Update";
      emailEnabled = false;
    } else {
      buttonText = "Create";
      emailEnabled = true;
    }

    const isValid = 
      firstName !== "" &&
      lastName !== "" &&
      phoneNumber !== "";

    return ( 
      <div className="container">
        <div className="card">
          <div className="card-content">
            <span className="card-title">User (Role: {claims})</span>

            <form className={classes.container} onSubmit={this.saveUser} >
              <TextField
              disabled={!emailEnabled}
              id="email"
              name="email"
              label="Email"
              placeholder="example@gmail.com"
              multiline
              className={classes.textField}
              type="email"
              autoComplete="email"
              margin="normal"
              value={email}
              onChange={this.onChange}
              />

              <TextField
              id="firstName"
              name="firstName"
              label="First Name"
              value={firstName}
              placeholder="John"
              multiline
              className={classes.textField}
              type="text"
              margin="normal"
              onChange={this.onChange}
              />

              <TextField
              id="lastName"
              name="lastName"
              label="Last Name"
              value={lastName}
              placeholder="Smith"
              multiline
              className={classes.textField}
              type="text"
              margin="normal"
              onChange={this.onChange}
              />

              <TextField
              id="photoURL"
              name="photoURL"
              value={photoURL}
              label="Photo URL"
              placeholder="http://www.image.com/image.png"
              multiline
              className={classes.textField}
              type="text"
              margin="normal"
              onChange={this.onChange}
              />

              <TextField
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              label="Phone Number"
              multiline
              className={classes.textField}
              margin="normal"
              onChange={this.handleChange('phoneNumber')}
              InputProps={{
                  inputComponent: NumberFormatPhone,
              }}
              />

              {/* Only display roles if user exists */}
              {this.state.id ? 
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Current Roles</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    disabled={this.state.isCashier}
                    control={
                      <Checkbox checked={this.state.isCashier} onClick={() => this.userMakeCashier(this.state.id)}/>
                    }
                    label="Cashier"
                  />
                  <FormControlLabel
                    disabled={this.state.isAdmin}
                    control={
                      <Checkbox checked={this.state.isAdmin} onClick={() => this.userMakeAdmin(this.state.id)}/>
                    }
                    label="Admin"
                  />
                  <FormControlLabel
                    disabled={this.state.isBanker}
                    control={
                      <Checkbox checked={this.state.isBanker} onClick={() => this.userMakeBanker(this.state.id)}/>
                    }
                    label="Banker"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={this.state.isUser} onClick={() => this.userMakeUser(this.state.id)}/>
                    }
                    label="User"
                  />
                </FormGroup>
              </FormControl>
              : ""}

            </form>
            <br />
            <div className="row">
                <Button disabled={!isValid} onClick={this.saveUser} variant="contained" color="primary" className={classes.button}>
                  {buttonText}
                </Button>
            </div>
            {/* Only display custom claims updates if existing user - cant set until they exist */}
            {this.state.id ? 
            <div className="row">
                <Button onClick={() => this.userMakeCashier(this.state.id)} variant="contained" color="primary" className={classes.button}>
                  Make Cashier
                </Button>{" "}
                <Button onClick={() => this.userMakeAdmin(this.state.id)} variant="contained" color="primary" className={classes.button}>
                  Make Admin
                </Button>{" "}
                <Button onClick={() => this.userMakeBanker(this.state.id)} variant="contained" color="primary" className={classes.button}>
                  Make Banker
                </Button>{" "}
                <Button onClick={() => this.userMakeUser(this.state.id)} variant="contained" color="primary" className={classes.button}>
                  Make User
                </Button>
            </div> 
            : ""}

            <p>{message}</p>

          </div>
        </div>
      </div>
    );  
  }
}

export default withFirebase(withRouter(withStyles(styles)(UserForm)));