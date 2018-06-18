import React from "react";
import { Header, Form, Divider } from "semantic-ui-react";
import { Field } from "redux-form";
import TextInput from "../../../app/common/form/TextInput";
import DateInput from "../../../app/common/form/DateInput";
import { AirFreightItem, SeaFreightItem } from './FreightItemDetail';

const ShippingAdvHeader = (props)=> {
  const { shipmentType } = props;
  return (
    <div>
      <Header sub color="teal" content="Shipment Information" />
      <Divider fitted />
      {shipmentType === 'a' ?
          <AirFreightItem />
          :
          <SeaFreightItem />
      }
      <Form.Group widths="equal">
        <Field
          name="Etd"
          type="text"
          component={DateInput}
          dateFormat="YYYY-MM-DD"
          placeholder="ETD"
          readOnly
        />
        <Field
          name="BlDt"
          type="text"
          component={DateInput}
          dateFormat="YYYY-MM-DD"
          placeholder="BL.Date"
          readOnly
        />
        <Field
          name="Eta"
          type="text"
          component={DateInput}
          dateFormat="YYYY-MM-DD"
          placeholder="ETA"
          readOnly
        />
        <Field
          name="Port"
          type="text"
          component={TextInput}
          placeholder="Destination Port"
        />
      </Form.Group>
    </div>
  );
};

export default ShippingAdvHeader;
