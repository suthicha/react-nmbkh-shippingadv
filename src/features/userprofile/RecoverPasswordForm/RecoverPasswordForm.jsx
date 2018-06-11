import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Button } from "semantic-ui-react";
import { reduxForm, Field } from "redux-form";
import {
  get_userinfoFromCookie
} from "../userprofileActions";
import TextInput from "../../../app/common/form/TextInput";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";

const mapState = state => ({
  loading: state.async.loading
});

const mapActions = {
  get_userinfoFromCookie
};

const validate = combineValidators({
  Password: composeValidators(
    isRequired({ message: "Enter new password" }),
    hasLengthGreaterThan(5)({
      message: "Password needs to be at greater 6 charector"
    })
  )()
});

export class RecoverPasswordForm extends Component {
 state = {
     userId: 0,
 }
  componentDidMount() {
    const { change, get_userinfoFromCookie } = this.props;
    get_userinfoFromCookie(data => {
      this.setState({userId: data.userId});
      change("LoginName", data.loginName);
    });
  }

  componentWillUnmount() {
    this.props.change("Password", "");
  }

  onFormSubmit = values => {
    const updateUser = {...values, UserID: this.state.userId};
    this.props.changePassword(updateUser);
  };
  render() {
    const { invalid, submitting, pristine } = this.props;
      
    return (
      <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
        <Field
          name="LoginName"
          type="email"
          component={TextInput}
          placeholder="Account"
          disabled={true}
        />
        <Field
          name="Password"
          type="password"
          component={TextInput}
          placeholder="Password"
        />
        <div style={{ marginTop: "10px" }}>
          <Button 
            loading={this.props.loading}
            disabled={
                invalid || submitting || pristine
              }
            type="submit" positive>
            Reset password
          </Button>
        </div>
      </Form>
    );
  }
}

export default connect(
  mapState,
  mapActions
)(
  reduxForm({
    form: "recoverPasswordForm",
    enableReinitialize: true,
    validate
  })(RecoverPasswordForm)
);
