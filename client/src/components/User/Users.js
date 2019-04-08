import React from 'react';
import User from './User';
import UserAPI from "./UserAPI"

class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [
            ]
        };
    }

    refreshPage = async () => {
        // Get with security
        UserAPI.getUsers()
        .then(users => {
            console.log(`Users in refresh page: ${users}`);

            this.setState({ users: users });
        })
        .catch(err => {
            console.error(err); 
        });        
    };


    // Scrape all the users on mount
    componentDidMount() {
        this.refreshPage();
    }

    // Delete this article from MongoDB
    userDelete = (id) => {

        UserAPI.delete( id )
        .then(res => {
            console.log("Deleted user");
        })
        .catch(err => {
            console.error(err); 
        });
    }

    // Make Admin
    userMakeAdmin = (id) => {

        console.log(`Trying to make User ${id} Admin`);

        UserAPI.makeAdmin( id )
        .then(res => {
            console.log(`Made User ${id} Admin`);
        })
        .catch(err => {
            console.error(err); 
        });
    }        
    
    // Make Cashier
    userMakeCashier = (id) => {

        console.log(`Trying to make User ${id} Cashier`);

        UserAPI.makeAdmin( id )
        .then(res => {
            console.log(`Made User ${id} Cashier`);
        })
        .catch(err => {
            console.error(err); 
        });
    }        
    
    render() {
        return (
            <div className="row">
            {this.state.users.map((user) => {
                return(            
                    <div key={user.id} className="col s12 m6 l6">
                        <User 
                        userDelete={this.userDelete}
                        userMakeAdmin={this.userMakeAdmin}
                        userMakeCashier={this.userMakeCashier}
                        id={user.id}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        phoneNumber={user.phoneNumber}
                        email={user.email}
                        role={user.role}
                        />
                    </div>
                    );
            })}
            </div>
        );
    }
}

export default Users;