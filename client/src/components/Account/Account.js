import React from 'react';
import UserAPI from "../User/UserAPI"
import Users from "../User/Users"
import { withAuthUserContext } from "../Auth/Session/AuthUserContext";

class Account extends React.Component {

    state = {};

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    componentDidMount() {
      // props are null here - how do I initialize
      console.log(this.props.user);
    }
  
    getCurrentUser = (e) => {
      e.preventDefault();

      UserAPI.getCurrentUser()
      .then(data => {
        const user = data;
        this.setState({
          uid: user.uid,
          displayName: user.displayName || "",
          email: user.email,
          phoneNumber: user.phoneNumber || ""
        });
  
        //console.log(`Got current user from auth: ${JSON.stringify(user)}`);
        UserAPI.getUsersClaims(user.uid).then(res => {
            // console.log(`claims: ${JSON.stringify(res.data.customClaims)}`) 
            this.setState({
              claims: res.data.customClaims || "user"
            });
        });  
      })
      .catch(err => {
        console.error(`Error getting user ${err}`);
      })
    }

    render() {

      console.log(this.props.user);
      // destructure
      let {
        displayName,
        email,
        phoneNumber,
        claims
      } = this.props.user;
      displayName = displayName || "";
      email = email || "";
      phoneNumber = phoneNumber || "";
      claims = claims || "";


      const {
        error
      } = this.state;

      const isInvalid =
        displayName !== "" ||
        email !== "" ||
        phoneNumber !== "";

        let userRole;
        if (claims && claims.admin) {
            userRole = "admin"
        } else if (claims && claims.cashier){
            userRole = "admin"
        } else {
            userRole = "user"
        }

        return ( 
            <div className="container">
            <form className="white" onSubmit={this.onSubmit}>
                  <h5 className="grey-text text-darken-3">Account <span>(Role: {userRole})</span></h5>

              <div className="input-field">
                <label htmlFor="displayName">Display Name</label>
                <input type="text" name='displayName' value={displayName} onChange={this.onChange} />
              </div>
              <div className="input-field">
                <label htmlFor="email">Email</label>
                <input type="email" name='email' value={email} onChange={this.onChange} />
              </div>
              <div className="input-field">
                <label htmlFor="phoneNumber">Password</label>
                <input type="text" name='phoneNumber' value={phoneNumber} onChange={this.onChange} />
              </div>
              <div className="input-field">
                <button disabled={isInvalid} className="btn lighten-1 z-depth-0">Sign Up</button>
                {error && <p>{error.message}</p>}
              </div>
              <button onClick={this.getCurrentUser} className="btn lighten-1 z-depth-0">Test Get User</button>  
            </form>
            <Users />
          </div>
          );
    }
}

export default withAuthUserContext(Account);