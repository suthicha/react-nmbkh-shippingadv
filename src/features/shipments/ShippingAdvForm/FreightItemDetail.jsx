import React from "react";
import { Field } from "redux-form";
import { Form } from 'semantic-ui-react';
import Aux from "../../../app/common/hoc/Aux";
import TextInput from "../../../app/common/form/TextInput";

const AirFreightItem = props => {
  return (
    <Aux>
      <Form.Group widths='equal'>
        <Field
          name="Mawb"
          type="text"
          component={TextInput}
          placeholder="Master waybill"
        />
        <Field
          name="Hawb"
          type="text"
          component={TextInput}
          placeholder="House waybill"
        />
        <Field
          name="Flt1"
          type="text"
          component={TextInput}
          placeholder="First FlightNo."
        />
        <Field
          name="Flt2"
          type="text"
          component={TextInput}
          placeholder="Second FlightNo."
        />
      </Form.Group>
    </Aux>
  );
};

const SeaFreightItem = props => {
  return (
    <Aux>
      <Form.Group>
        <Field
          width="4"
          name="Mawb"
          type="text"
          component={TextInput}
          placeholder="Master waybill"
        />
        <Field
          width="4"
          name="Hawb"
          type="text"
          component={TextInput}
          placeholder="House waybill"
        />
      </Form.Group>
      <Form.Group>
        <Field
          width="4"
          name="Flt1"
          type="text"
          component={TextInput}
          placeholder="Vessel Name"
        />
        <Field
          width="4"
          name="Voy1"
          type="text"
          component={TextInput}
          placeholder="VoyNo. #1"
        />
        <Field
          width="4"
          name="Flt2"
          type="text"
          component={TextInput}
          placeholder="Feeder Name"
        />
        <Field
          width="4"
          name="Voy2"
          type="text"
          component={TextInput}
          placeholder="VoyNo. #2"
        />
      </Form.Group>
    </Aux>
  );
};

export { AirFreightItem, SeaFreightItem };
