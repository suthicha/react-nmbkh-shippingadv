import React from "react";
import { connect } from "react-redux";
import { Form, Segment, Button } from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import { login } from "../authActions";
import {
  combineValidators,
  isRequired
} from "revalidate";
import TextInput from "../../../app/common/form/TextInput";
import LoadingComponent from "../../../app/layout/LoadingComponent";


const mapState = (state) => {
  return {
    loading: state.async.loading
  }
}

const mapActions = {
  login
};

const validate = combineValidators({
  email: isRequired({message: 'Email is require please enter'}),
  password: isRequired({message: 'Password is require'})
})

const LoginForm = ({ login, handleSubmit, loading }) => {
  if (loading) return <LoadingComponent content="Please wait ..." />;
  
  return (
    <Form error size="large" onSubmit={handleSubmit(login)}>
      <Segment>
        <Field
          name="email"
          component={TextInput}
          type="email"
          placeholder="Email Address"
        />
        <Field
          name="password"
          component={TextInput}
          type="password"
          placeholder="password"
        />
        <Button fluid size="large" color="blue">
          Login
        </Button>
      </Segment>
    </Form>
  );
};

export default connect(mapState, mapActions)(
  reduxForm({ form: "loginForm", validate })(LoginForm)
);
