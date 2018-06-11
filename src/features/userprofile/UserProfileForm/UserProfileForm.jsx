import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { reduxForm, Field, getFormValues } from "redux-form";
import TextInput from "../../../app/common/form/TextInput";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
import {
  Grid,
  Segment,
  Header,
  Form,
  Checkbox,
  Button
} from "semantic-ui-react";
import { update_userprofile, get_userinfoFromCookie, resetpassword_userprofile } from "../userprofileActions";
import RecoverPasswordForm from "../RecoverPasswordForm/RecoverPasswordForm";

const mapState = state => {
  return {
    loading: state.async.loading,
    initialValues: state.user,
    formValues: getFormValues("userprofileForm")(state)
  };
};

const mapActions = {
  update_userprofile,
  get_userinfoFromCookie,
  resetpassword_userprofile
};

const validate = combineValidators({
  FirstName: isRequired({ message: "Enter your firstname." }),
  LastName: isRequired({ message: "Enter your lastname" }),
  Password: composeValidators(
    isRequired({ message: "Password field must required" }),
    hasLengthGreaterThan(5)({
      message: "Password needs to be at greater 6 charector"
    })
  )()
});

export class UserProfileForm extends Component {
  state = {
    resetPassword: false
  };

  componentDidMount(){
    const { change, get_userinfoFromCookie } = this.props;
    get_userinfoFromCookie((data, user)=>{
      const keys = Object.keys(user);
      for(var i = 0; i < keys.length; i++){
        change(keys[i], user[keys[i]])
      }
    }) 
  }

  handleToggleChange = () => {
    this.setState({ resetPassword: !this.state.resetPassword });
  };

  onFormSubmit = values => {
    this.props.update_userprofile(values);
  };

  handlerChangePassword = (values) => {
    this.props.resetpassword_userprofile(null, (cb)=> {
      if (cb === 'OK'){
        this.setState({resetPassword: false});
      }
    })
  }

  render() {
    const { loading }= this.props;
    return (
      <Grid>
        <Grid.Column width={16}>
          <Segment>
            <Header sub color="teal" content="Update your information" />
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Form.Group widths="equal">
                <Field
                  name="FirstName"
                  type="text"
                  component={TextInput}
                  placeholder="FirstName"
                />
                <Field
                  name="LastName"
                  type="text"
                  component={TextInput}
                  placeholder="LastName"
                />
              </Form.Group>

              <Field
                name="Email"
                type="email"
                component={TextInput}
                placeholder="Email address"
              />
              { !this.state.resetPassword &&
              <div style={{ marginTop: "10px" }}>
                <Button type="submit" primary loading={loading}>
                  Update
                </Button>
                <Button
                  type="button"
                  onClick={() => this.props.history.goBack()}
                >
                  Cancel
                </Button>
              </div>}
            </Form>
            <Header
              sub
              color="teal"
              content="Enable Toggle to reset password"
            />
            <Checkbox
              toggle
              onChange={this.handleToggleChange}
              checked={this.state.resetPassword}
            />
            {this.state.resetPassword && <RecoverPasswordForm changePassword={this.handlerChangePassword} />}
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default withRouter(
  connect(
    mapState,
    mapActions
  )(
    reduxForm({
      form: "userprofileForm",
      enableReinitialize: true,
      validate
    })(UserProfileForm)
  )
);
