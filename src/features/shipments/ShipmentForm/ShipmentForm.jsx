import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field, getFormValues } from "redux-form";
import {
  Segment,
  Form,
  Button,
  Grid,
  Header,
  Icon
} from "semantic-ui-react";
import TextInput from "../../../app/common/form/TextInput";
import DateInput from "../../../app/common/form/DateInput";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ShipmentCofirmModal from "./ShipmentCofirmModal";
import ShipmentDetails from "../ShipmentDetails/ShipmentDetails";
import "./ShipmentForm.css";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthLessThan
} from "revalidate";
import {
  create_shipment,
  update_shipment,
  delete_shipment,
  find_invoice,
  find_shipment,
  find_customer_invoice
} from "../shipmentActions";
import withAuth from "../../../app/common/hoc/withAuth";
import { toastr } from "react-redux-toastr";

const mapState = (state, ownProps) => {
  const trxno = ownProps.match.params.id;
  const tradcode = ownProps.match.params.tradcode;
  let shipment = {};
  let isUpdate = trxno ? true : false;
  let isSend = false;

  if (trxno && state.shipments.length > 0) {
    shipment = state.shipments.filter(q => {
      return q.TrxNo === Number(trxno);
    })[0];
    if (shipment) {
      isSend = shipment.SendInd === "SEND" ? true : false;
    }
    isUpdate = true;
  } else {
    shipment = {
      ...shipment,
      CompCd: "B",
      Location: "P",
      InvNo: "",
      TradCd: tradcode,
      MuesureUnit: "CBM",
      Measurement: 0.0
    };
  }
  return {
    formValues: getFormValues("shipmentForm")(state),
    loading: state.async.loading,
    initialValues: shipment,
    isUpdate,
    isSend,
    trxno,
    tradcode
  };
};

const mapActions = {
  create_shipment,
  update_shipment,
  delete_shipment,
  find_shipment,
  find_invoice,
  find_customer_invoice
};

const validate = combineValidators({
  InvNo: composeValidators(
    isRequired({ message: "The invoice number is required" }),
    hasLengthLessThan(12)({
      message: "Invoice No. needs to be at least 12 charector"
    })
  )(),
  CompCd: composeValidators(
    isRequired({ message: "The company code is required" }),
    hasLengthLessThan(2)({
      message: "Company code needs to be at least 1 charector"
    })
  )(),
  Location: composeValidators(
    isRequired({ message: "The location code is required" }),
    hasLengthLessThan(2)({
      message: "Location code needs to be at least 1 charector"
    })
  )(),
  Hawb: composeValidators(
    isRequired({ message: "The house waybill is required" }),
    hasLengthLessThan(15)({
      message: "Hawb needs to be at least 15 charector"
    })
  )(),
  Mawb: hasLengthLessThan(15)({
    message: "Mawb needs to ne at least 15 charector"
  }),
  Voy1: hasLengthLessThan(10)({
    message: "Voy#1 needs to ne at least 10 charector"
  }),
  Voy2: hasLengthLessThan(10)({
    message: "Voy#2 needs to ne at least 10 charector"
  }),
  Flt1: hasLengthLessThan(20)({
    message: "Flt#1 needs to ne at least 20 charector"
  }),
  Flt2: hasLengthLessThan(20)({
    message: "Flt#2 needs to ne at least 20 charector"
  }),
  Etd: isRequired("Etd"),
  InvDt: isRequired("InvDt")
});

class ShipmentForm extends Component {
  state = {
    loading: false,
    duplicate: false,
    isSend: false,
    isOpenModal: false,
    resendWithoutFlag: false,
    authenticated: false,
    loadingMessage: ""
  };

  componentDidMount = () => {
    // if refresh page we will retrive data from api.
    const {
      trxno,
      find_shipment,
      isUpdate,
      initialValues,
      change
    } = this.props;
    
    if (isUpdate && !initialValues.TrxNo) {
      find_shipment(trxno, callback => {
        if (callback) {
          const keys = Object.keys(callback);
          for (var i = 0; i < keys.length; i++) {
            change(keys[i], callback[keys[i]]);
          }
          this.setState({ isSend: callback.SendInd === "SEND" ? true : false });
        } else {
          this.props.history.push("/shipments");
        }
      });
    } else {
      this.setState({ isSend: this.props.isSend });
    }
  };

  historyAction = () => {
    const { goBack, location, push } = this.props.history;
    if (location.pathname === "/create-shipment") {
      push({ 
        pathname: "/shipments",
        state: {
          from: this.props.location.pathname
        }
      });
    } else {
      goBack();
    }
  };

  onFormSubmit = values => {
    this.setState({ loading: true });
    if (this.props.isUpdate) {
      this.props.update_shipment(values, rest => {
        this.setState({ loading: false });
        if (rest && rest.statusCode === 201) {
          this.historyAction();
        }
      });
    } else {
      const { find_invoice, create_shipment } = this.props;
      find_invoice(this.InvNo.value, cb => {
        if (cb.StatusText === "OK") {
          create_shipment(values, rest => {
            this.setState({ loading: false });
            if (rest && rest.statusCode === 201) {
              this.historyAction();
            }
          });
        } else {
          this.setState({ loading: false, duplicate: true });
          toastr.warning(
            "Duplicate!!!",
            `Your invoice no. ${this.InvNo.value} is duplicate`,
            { hideDuration: 600, timeOut: 6000 }
          );
        }
      });
    }
  };

  handleDelete = () => {
    const { trxno, delete_shipment } = this.props;
    this.setState({ loadingMessage: "Deleting..." });
    delete_shipment(trxno, callback => {
      if (callback.statusCode === 200) {
        this.setState({ isOpenModal: false });
        this.historyAction();
      }
    });
  };

  handleOpenModal = status => {
    this.setState({ isOpenModal: status });
  };

  handleCheckboxClick = () => {
    this.setState({ resendWithoutFlag: !this.state.resendWithoutFlag });
  };

  handleResendShipment = evt => {
    evt.preventDefault();
    const { formValues, create_shipment } = this.props;
    this.setState({ loadingMessage: "Transaction sending..." });
    if (formValues) {
      const values = {
        ...formValues,
        Resend: this.state.resendWithoutFlag ? "" : "R"
      };
      create_shipment(values, rest => {
        if (rest && rest.statusCode === 201) {
          this.setState({ isOpenModal: false });
          this.historyAction();
        }
      });
    }
  };

  handleOnBlur = (evt) => {
    const { value } = evt.target;
    const { change } = this.props;
    this.props.find_customer_invoice(value, (data) => {
      
      if (data){
        const { COMCD, IHCORP, IHDEST, IHINVYMD} = data;
        change('CompCd', COMCD);
        change('Location', IHCORP);
        change('Port', IHDEST);
        change('InvDt', IHINVYMD);
      }else {
        const fields = ['CompCd','Location','Port'];
        for(var i = 0; i < fields.length; i++){
          change(fields[i],'');
        }
        change('InvDt', Date.now());
        toastr.warning('Opps!', 'Find not found ' + this.InvNo.value + ' on data transfer system.');
      }
    })
  }

  render() {
    const { invalid, submitting, pristine, isUpdate, formValues, initialValues, tradcode } = this.props;
    const InvNo = formValues && formValues.InvNo;
    const fieldStyle = {
      textTransform: "uppercase"
    };
    const titleHead = ()=>{
      switch(tradcode)
      {
        case 'A': return 'Air Export';
        case 'O': return 'Ocean Export';
        default:
          return '';
      }
    }
    const confirmButton = () => {
      if (InvNo) {
        if (isUpdate && this.state.isSend) {
          return (
            <ShipmentCofirmModal
              title={`RESEND ${InvNo}`}
              open={this.state.isOpenModal}
              handleOpenModal={this.handleOpenModal}
              triggerButton={
                <Button
                  color="blue"
                  type="button"
                  floated="right"
                  onClick={() => this.setState({ isOpenModal: true })}
                >
                  Resend
                </Button>
              }
              actionButton={
                <Button
                  color="green"
                  inverted
                  onClick={this.handleResendShipment}
                >
                  <Icon name="checkmark" /> Confirm to sent
                </Button>
              }
              content={
                <div>
                  <span>Do you want resend invoice no. {InvNo} ?</span>
                  {/* <div style={{ paddingTop: "10px" }}>
                    <Checkbox
                      label="Without flag (R)"
                      onChange={this.handleCheckboxClick}
                      checked={this.state.resendWithoutFlag}
                    />
                  </div> */}
                </div>
              }
            />
          );
        } else {
          return (
            <ShipmentCofirmModal
              title={`DELETE ${InvNo}`}
              open={this.state.isOpenModal}
              handleOpenModal={this.handleOpenModal}
              triggerButton={
                <Button
                  color="orange"
                  type="button"
                  floated="right"
                  onClick={() => this.handleOpenModal(true)}
                >
                  Delete
                </Button>
              }
              actionButton={
                <Button color="red" inverted onClick={this.handleDelete}>
                  <Icon name="remove" /> Confirm to delete
                </Button>
              }
              content={<div>Do you want delete invoice no. {InvNo} ?</div>}
            />
          );
        }
      }
    };

    if (this.props.loading && this.state.isOpenModal)
      return <LoadingComponent content={this.state.loadingMessage} />;
    
    return (
      <Grid>
        <Grid.Column width={10}>
          {isUpdate ? (
            <span className="content-header">Update : {titleHead()} transaction</span>
          ) : (
            <span className="content-header">Create : {titleHead()} transaction</span>
          )}
          <Segment>
            <Header sub color="teal" content="Shipment Information" />
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Form.Group widths="equal">
                <Field
                  width="8"
                  name="CompCd"
                  type="text"
                  component={TextInput}
                  placeholder="COMCD"
                />
                <Field
                  width="8"
                  name="Location"
                  type="text"
                  component={TextInput}
                  placeholder="Location"
                />
                <Field
                  name="InvNo"
                  type="text"
                  disabled={isUpdate}
                  component={TextInput}
                  placeholder="Invoice No."
                  style={fieldStyle}
                  cssName={this.state.duplicate ? "duplicate" : ""}
                  refName={ref => (this.InvNo = ref)}
                  handleOnBlur={this.handleOnBlur}
                />
                <Field
                  name="InvDt"
                  type="text"
                  component={DateInput}
                  dateFormat="YYYY-MM-DD"
                  placeholder="Invoice Date"
                />
              </Form.Group>
              <Header sub color="teal" content="Transport Details" />
              <Form.Group widths="equal">
                <Field
                  name="Mawb"
                  type="text"
                  component={TextInput}
                  placeholder="Master waybill"
                  style={fieldStyle}
                />
                <Field
                  name="Hawb"
                  type="text"
                  component={TextInput}
                  placeholder="House waybill"
                  style={fieldStyle}
                />
                <Field
                  name="BlDt"
                  type="text"
                  component={DateInput}
                  dateFormat="YYYY-MM-DD"
                  placeholder="BL DATE."
                />
              </Form.Group>
              {tradcode === 'A' && 
              <Form.Group widths="equal">
                <Field
                  name="Flt1"
                  type="text"
                  component={TextInput}
                  placeholder="First FlightNo."
                  style={fieldStyle}
                />
                <Field
                  name="Flt2"
                  type="text"
                  component={TextInput}
                  placeholder="Second FlightNo."
                  style={fieldStyle}
                />
              </Form.Group>}
              <Form.Group widths="equal">
                <Field
                  name="Etd"
                  type="text"
                  component={DateInput}
                  dateFormat="YYYY-MM-DD"
                  placeholder="ETD"
                />
                <Field
                  name="Eta"
                  type="text"
                  component={DateInput}
                  dateFormat="YYYY-MM-DD"
                  placeholder="ETA"
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Field
                  name="Measurement"
                  type="number"
                  step="0.1"
                  component={TextInput}
                  placeholder="Measurement"
                />
                <Field
                  name="MuesureUnit"
                  type="text"
                  component={TextInput}
                  placeholder="Unit"
                  style={fieldStyle}
                />
              </Form.Group>
              <Field
                name="Port"
                type="text"
                component={TextInput}
                placeholder="Destination Port"
                style={fieldStyle}
              />
              {tradcode === 'O' && 
              <div style={{paddingBottom: '20px'}}>
              <Field
                name="Voy1"
                type="text"
                component={TextInput}
                placeholder="Voy1"
                style={fieldStyle}
              />
              
              <Field
                name="Voy2"
                type="text"
                component={TextInput}
                placeholder="Voy2"
                style={fieldStyle}
              /></div>}
              <Button
                disabled={
                  invalid || submitting || pristine || this.state.isSend
                }
                positive
                loading={this.state.loading}
                type="submit"
              >
                {isUpdate ? 'Update': 'Add'}
              </Button>
              <Button onClick={this.props.history.goBack} type="button">
                Cancel
              </Button>
              {confirmButton()}
            </Form>
          </Segment>
        </Grid.Column>
        <Grid.Column width={6}>
          {(isUpdate && initialValues &&  InvNo) && <ShipmentDetails refno={InvNo} />}
        </Grid.Column>
      </Grid>
    );
  }
}

export default withAuth(
  connect(mapState, mapActions)(
    reduxForm({
      form: "shipmentForm",
      enableReinitialize: true,
      validate
    })(ShipmentForm)
  )
);
