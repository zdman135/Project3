import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
});

class Register extends React.Component {
    state = {
        firstName: "",
        lastName: ""
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };


    render() {
        const { classes } = this.props;

        return (
            <div className="container">
                <div className="card">
                    <div className="card-content">
                    <span className="card-title">Register Now</span>
                        <form className={classes.container} noValidate autoComplete="off">
                            {/* <TextField
                                id="standard-name"
                                label="Name"
                                className={classes.textField}
                                value={this.state.name}
                                onChange={this.handleChange('name')}
                                margin="normal"
                            /> */}

                            <TextField
                                id="standard-textarea"
                                label="First Name"
                                placeholder="John"
                                multiline
                                className={classes.textField}
                                margin="normal"
                                value={this.state.firstName}
                                onChange={this.handleChange('firstName')}
                            />

                            <TextField
                                id="standard-textarea"
                                label="Last Name"
                                placeholder="Doe"
                                multiline
                                className={classes.textField}
                                margin="normal"
                                value={this.state.lastName}
                                onChange={this.handleChange('lastName')}
                            />

                        </form>
                    </div>
                </div >
            </div>
        );
    }
}

Register.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Register);