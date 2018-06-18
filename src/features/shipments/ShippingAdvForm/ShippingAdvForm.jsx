import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import ShippingAdvHeader from "./ShippingAdvHeader";
import ShippingAdvInvoiceList from "./ShippingAdvInvoiceList";
import { Header, Checkbox, Icon, Button, Grid, Form, Segment } from "semantic-ui-react";
import { reduxForm, getFormValues } from "redux-form";
import {
  find_customer_invoice,
  find_shipment,
  update_shipment,
  create_shipment,
  delete_shipment
} from "../shipmentActions";
import withAuth from "../../../app/common/hoc/withAuth";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import cuid from "cuid";
import moment from "moment";
import { combineValidators, isRequired } from "revalidate";
import "./ShippingAdvForm.css";

const mapState = (state, ownProps) => {
  const trxNo = ownProps.match.params.id;
  const commandType = ownProps.match.params.commandtype;
  const shipmentType = ownProps.match.params.shipmenttype;

  return {
    loading: state.async.loading,
    formValues: getFormValues("shippingAdvForm")(state),
    initialValues: {
      TrxNo: null,
      Mawb: "",
      Hawb: "",
      Port: "",
      Flt1: "",
      Flt2: "",
      Voy1: "",
      Voy2: "",
      Resend: "",
      SendInd: "",
      SendDate: null,
      Shiptype: "",
      TradCd: "",
      items: []
    },
    trxNo,
    commandType,
    shipmentType
  };
};

const mapActions = {
  find_customer_invoice,
  find_shipment,
  update_shipment,
  create_shipment,
  delete_shipment
};

const validate = combineValidators({
  Etd: isRequired({ message: "* required" }),
  Eta: isRequired({ message: "* required" }),
  BlDt: isRequired({ message: "* required" }),
  Mawb: isRequired({ message: "* required" }),
  Hawb: isRequired({ message: "* required" }),
  Flt1: isRequired({ message: "* required" })
});

export class ShippingAdvForm extends Component {
  state = {
    loading: false,
    isNewItem: false,
    isConfirmDelete: false,
    isSend: false,
    isResend: false,
    loadingMessage: "Loading...",
    deleteItems: []
  };

  componentDidMount() {
    const { trxNo, commandType, initialValues } = this.props;
    if (commandType === "edit") {
      this.showLoading();
      this.props.find_shipment(trxNo, callback => {
        if (callback) {
          const keys = Object.keys(callback);
          for (var i = 0; i < keys.length; i++) {
            this.changeFormValue(keys[i], callback[keys[i]]);
          }

          const {
            CompCd,
            Location,
            Measurement,
            MuesureUnit,
            InvNo,
            InvDt,
            SendInd,
            TradCd
          } = callback;
          const invItem = {
            id: cuid(),
            InvNo,
            InvDt: moment(InvDt).format("YYYY-MM-DD"),
            qty: Measurement,
            uom: MuesureUnit,
            cmp: CompCd,
            tradcd: TradCd,
            loc: Location,
            remark: "",
            isEdit: false,
            isUpdate: false
          };
          
          let updateItems = [...initialValues.items, invItem];
          this.changeFormValue("items", updateItems);
          this.setState({ isNewItem: true, isSend:SendInd === 'SEND'? true: false });
          this.hideLoading();
        }
      });
    }
  }

  componentWillUnmount() {
    const blankState = {};
    Object.keys(this.state).forEach(stateKey => {
      blankState[stateKey] = undefined;
    });
    this.setState(blankState);
  }

  showLoading = () => {
    this.setState({ loading: true });
  };

  hideLoading = () => {
    this.setState({ loading: false });
  };

  handlerCreatedInvoiceItem = () => {
    const { items } = this.props.formValues;
    const updateItems = [
      ...items,
      Object.assign(
        {},
        {
          id: cuid(),
          InvNo: "",
          InvDt: moment(Date.now()).format("YYYY-MM-DD"),
          qty: 0,
          uom: "CBM",
          cmp: "",
          loc: "",
          remark: "",
          isEdit: true,
          isUpdate: false
        }
      )
    ];

    this.changeFormValue("items", updateItems);
    this.setState({ isNewItem: true });
  };

  handlerDeleteRowInvoiceItem = item => {
    const { items } = this.props.formValues;
    const updateItems = items.filter(data => data.id !== item.id);
    this.changeFormValue("items", updateItems);
    this.setState({ isNewItem: true });
    if (updateItems.length === 0) {
      this.changeFormValue("Port", "");
    }
  };

  handlerDeleteInvoiceItems = () => {
    const { items } = this.props.formValues;
    const updateItems = items.filter(
      item => this.state.deleteItems.indexOf(item.id) < 0
    );

    this.changeFormValue("items", updateItems);
    this.setState({
      isNewItem: true,
      deleteItems: []
    });

    if (updateItems.length === 0) {
      this.changeFormValue("Port", "");
    }
  };

  handlerMaskDeleteRowFromInvoiceItem = item => {
    const { deleteItems } = this.state;
    if (item.isDelete) {
      deleteItems.push(item.id);
      this.setState({ deleteItems });
    } else {
      const updateDeleteItems = deleteItems.filter(q => q !== item.id);
      this.setState({ deleteItems: updateDeleteItems });
    }
  };

  handlerSaveRowInvoiceItem = (item, callback) => {
    // Check exists invoice no.
    const { Port, items } = this.props.formValues;
    const duplicateItems = items.filter(q => q.InvNo === item.InvNo);

    if (duplicateItems.length > 0) {
      callback({
        status: 400,
        message: "Your invoice number " + item.InvNo + " is duplicate."
      });
      return;
    }

    if (item.port) {
      if (Port !== item.port) {
        callback({ status: 400, message: "Destination port not match" });
        return;
      }
    }
    this.changeItemsOnState(item);
    callback({ status: 200, message: "OK" });
  };

  handlerCheckAndUpdateDestPort = (port, callback) => {
    const { Port } = this.props.formValues;
    if (Port === "") {
      this.props.change("Port", port);
      callback({ status: 200, message: "Found destination port." });
    } else {
      if (Port === port) {
        callback({ status: 200, message: "OK" });
      } else {
        callback({
          status: 404,
          message: "Destination port '" + port + "' is invalid."
        });
      }
    }
  };

  changeItemsOnState = item => {
    const { items } = this.props.formValues;
    const updateItems = items.map(data => {
      if (data.id !== item.id) {
        return data;
      }
      return {
        ...data,
        ...item
      };
    });
    this.changeFormValue("items", updateItems);
    this.setState({
      isNewItem: true,
      deleteItems: []
    });
  };

  handlerRowEdit = item => {
    this.changeItemsOnState(item);
  };

  changeFormValue = (name, value) => {
    this.props.change(name, value);
  };

  handleCreateShipmet = (values) => {
    
    const { items } = values;
    const { create_shipment } = this.props;

    let shipmets = [];
      for (let i = 0; i < items.length; i++) {
        const { InvNo, InvDt, qty, uom, loc, cmp, tradcd } = items[i];
        const data = {
          ...values,
          InvNo,
          Measurement: qty,
          MuesureUnit: uom,
          InvDt: InvDt,
          Location: loc,
          CompCd: cmp,
          TradCd: tradcd,
          Shiptype: this.props.shipmentType,
          Resend: this.state.isResend? 'R':''
        };
        shipmets.push(data);
      }

      create_shipment(shipmets, callback => {
        const incompletedItems = callback.successItems.filter(
          q => q.statusCode === 501
        );

        if (incompletedItems.length === 0) {
          this.props.history.goBack();
        } else {
          const { items } = this.props.formValues;
          const updateItems = items.filter(
            item => _.findIndex(incompletedItems, ["key", item.InvNo]) >= 0
          );

          for (let item of updateItems) {
            item.isError = true;
            item.remark = "invoice is exists";
          }

          this.changeFormValue("items", updateItems);
          toastr.error("Opps!", "Create shipping advice found error.");
          this.hideLoading();
        }
      });
  }

  onFormSubmit = values => {
    this.showLoading();
    this.setState({ loadingMessage: "Saving..." });
    const { items } = values;
    const {
      commandType,
      history,
      update_shipment,
      delete_shipment
    } = this.props;

    if (commandType === "new") {
      this.handleCreateShipmet(values);
    } else {
      const { InvDt, qty, uom, loc, cmp } = items[0];
      const data = {
        ...values,
        Measurement: qty,
        MuesureUnit: uom,
        InvDt: InvDt,
        Location: loc,
        CompCd: cmp
      };
      
      if (this.state.isConfirmDelete && commandType === 'edit'){
        this.setState({loadingMessage:'Deleting...'})
        delete_shipment(data.TrxNo, resp => {
          if (resp.statusCode === 200) {
            history.goBack();
          }
        })
      }else {
        if (this.state.isResend){
          this.handleCreateShipmet(values);
        }else{
          update_shipment(data, resp => {
            if (resp.statusCode === 201) {
              history.goBack();
            }
          });
        }
      }
    }
  };

  handleConfirmDelete = () => {
    this.setState({isConfirmDelete: !this.state.isConfirmDelete});
  }

  render() {
    const {
      invalid,
      submitting,
      pristine,
      handleSubmit,
      formValues,
      initialValues,
      commandType,
      shipmentType
    } = this.props;
    let items = initialValues.items;
    if (this.state.isNewItem) {
      items = formValues.items;
    }

    const validItems = items.filter(q => q.InvNo !== "");
    const titleIcon = shipmentType === "a" ? "plane" : "ship";
    let chkStyle = ["chk_confirme_delete"]
    
    if (this.state.isSend){
       chkStyle = ["chk_confirme_delete","chk_visible_send"]
    }

    if (this.state.loading)
      return <LoadingComponent content={this.state.loadingMessage} />;
    
    return (
      <Grid>
        <Grid.Column width={14}>
          <Segment>
            <Form size="tiny" onSubmit={handleSubmit(this.onFormSubmit)}>
              <Segment clearing color="grey">
                <Header as="h2" floated="left">
                  <Icon name={titleIcon} />
                  <Header.Content>SHIPMENT</Header.Content>
                </Header>
                
                <Button
                  circular
                  color={this.state.isConfirmDelete?'red':'green'}
                  icon={this.state.isConfirmDelete?'trash':'save'}
                  size="big"
                  type="submit"
                  floated="right"
                  disabled={
                    invalid || submitting || pristine || validItems.length === 0
                  }
                />

                <Button
                  circular
                  icon="undo"
                  size="big"
                  type="button"
                  floated="right"
                  onClick={() => this.props.history.goBack()}
                />
             
              </Segment>
              <ShippingAdvHeader shipmentType={shipmentType} />
              <ShippingAdvInvoiceList
                onCreated={this.handlerCreatedInvoiceItem}
                onDeleteRow={this.handlerDeleteRowInvoiceItem}
                onMaskDeleteItem={this.handlerMaskDeleteRowFromInvoiceItem}
                onSaveRow={this.handlerSaveRowInvoiceItem}
                onRowEdit={this.handlerRowEdit}
                onDeleteItems={this.handlerDeleteInvoiceItems}
                onCheckAndUpdateDestPort={this.handlerCheckAndUpdateDestPort}
                items={items}
                deleteItems={this.state.deleteItems}
                commandType={commandType}
              />
              <div style={{ paddingTop: "10px", textAlign: "right"}}>
                  {this.state.isSend && 
                      <Checkbox label='Make copy and re-send' 
                        defaultChecked={this.state.isResend} 
                        onChange={()=> {this.setState({isResend: !this.state.isResend})}} />
                  }  

                  {commandType === "edit" && (
                      <Checkbox 
                        toggle 
                        disabled={this.state.isSend}
                        defaultChecked={this.state.isConfirmDelete}
                        onChange={this.handleConfirmDelete}
                        label='Click enable confirm delete.' 
                        color='red' 
                        className={chkStyle.join(' ')} />
                )}
              </div>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default withAuth(
  connect(
    mapState,
    mapActions
  )(
    reduxForm({
      form: "shippingAdvForm",
      enableReinitialize: true,
      validate: validate
    })(ShippingAdvForm)
  )
);
