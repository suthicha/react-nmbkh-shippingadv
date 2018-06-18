import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Table, Checkbox, Input, Loader } from "semantic-ui-react";
import { find_customer_invoice } from "../shipmentActions";
import DatePicker from "react-datepicker";
import moment from "moment";
import "./ShippingAdvForm.css";

const mapActions = {
  find_customer_invoice
};

export class ShippingAdvInvoiceItems extends Component {
  state = {
    id: "",
    InvNo: "",
    InvDt: moment(Date.now()).format("YYYY-MM-DD"),
    qty: 0,
    uom: "CBM",
    cmp: "",
    loc: "",
    remark: "",
    port: "",
    tradcd: "",
    isUpdate: false,
    isEdit: false,
    isDelete: false,
    loading: false,
    isValid: true
  };

  componentDidMount() {
    this.showLoading();
    setTimeout(() => {
      const keys = Object.keys(this.props.item);
      for (var i = 0; i < keys.length; i++) {
        this.setState({ [keys[i]]: this.props.item[keys[i]] });
      }
      this.hideLoading();
    }, 500);
  }

  showLoading = () => {
    this.setState({ loading: true });
  };

  hideLoading = () => {
    this.setState({ loading: false });
  };

  handleDateChange = date => {
    this.setState({ InvDt: moment(date._d).format("YYYY-MM-DD") });
  };

  handlerInputChange = evt => {
    const { id, value } = evt.target;
    this.setState({ [id]: value.toUpperCase() });
  };

  handlerCheckboxChange = (evt, data) => {
    const item = { ...this.state, isDelete: data.checked };
    this.props.maskDeleteItem(item);
  };

  handlerDeleteRow = evt => {
    evt.preventDefault();
    this.showLoading();
    setTimeout(() => {
      this.props.deleteRow(this.state);
      this.hideLoading();
    }, 300);
  };

  handlerSaveRow = evt => {
    evt.preventDefault();
    const { InvNo, cmp, loc, port, isValid } = this.state;
    if (this.props.item.isUpdate) {
      if (cmp === "" || loc === "") {
        return;
      }
      let data = { ...this.state, isEdit: false, isUpdate: false };
      this.updateRowEdit(data);

    } else {
      if (InvNo === "" || cmp === "" || loc === "") {
        return;
      }

      if (port && !isValid) {
        return;
      }

      this.showLoading();
      setTimeout(() => {
        let data = { ...this.state, isEdit: false, isUpdate: false };
        this.props.saveRow(data, ({ status, message }) => {
          this.setState({
            isValid: status === 200 ? true : false,
            remark: message,
            isEdit: false,
            loading: false
          });
        });
      }, 300);
    }
  };

  handlerOnBlur = evt => {
    if (evt.target.value === "") {
      this.setState({
        cmp: "",
        loc: "",
        remark: "",
        tradcd: "",
        port: null,
        isValid: true,
        InvDt: moment(Date.now()).format("YYYY-MM-DD")
      });
      return;
    }

    this.props.find_customer_invoice(evt.target.value, data => {
      if (data) {
        const { COMCD, IHCORP, IHDEST, IHINVYMD, IHTRAD } = data;
        this.setState({
          cmp: IHCORP,
          loc: COMCD,
          port: IHDEST,
          tradcd: IHTRAD,
          InvDt: moment(IHINVYMD).format("YYYY-MM-DD")
        });

        this.props.checkAndUpdateDestPort(IHDEST, ({ status, message }) => {
          this.setState({
            isValid: status === 200 ? true : false,
            remark: message
          });
        });
      } else {
        this.setState({
          isValid: false,
          port: null,
          remark: "Not found invoice."
        });
      }
    });
  };

  handlerUndoEdit = () => {
    let data = { ...this.props.item, isEdit: false, isUpdate: false };
    this.updateRowEdit(data);
  };

  handlerRowEdit = () => {
    let data = { ...this.state, isEdit: true, isUpdate: true };
    this.updateRowEdit(data);
  };

  updateRowEdit = data => {
    this.showLoading();
    setTimeout(() => {
      this.props.rowEdit(data);
      this.hideLoading();
    }, 300);
  }

  render() {
    const { item } = this.props;
    const { loading } = this.state;
    let invalidRowStyle = this.state.isValid ? "" : "tr_invalid";

    if (item.isError){
      invalidRowStyle = "tr_invalid";
    }

    if (loading)
      return (
        <Table.Row>
          <Table.Cell collapsing />
          <Table.Cell colSpan="7">
            <Loader active inline="centered" />
          </Table.Cell>
        </Table.Row>
      );

    let renderEl = null;
    if (item.isEdit) {
      renderEl = (
        <Table.Row className={invalidRowStyle}>
          <Table.Cell collapsing textAlign="right">
            {item.isUpdate ? (
              <Button
                circular
                type="button"
                icon="history"
                onClick={this.handlerUndoEdit}
              />
            ) : (
              <Button
                circular
                type="button"
                icon="undo"
                color="orange"
                onClick={this.handlerDeleteRow}
              />
            )}
            <Button
              circular
              positive
              icon="save"
              onClick={this.handlerSaveRow}
            />
          </Table.Cell>
          <Table.Cell>
            <Input
              fluid
              focus={true}
              type="text"
              id="InvNo"
              disabled={item.isUpdate}
              value={this.state.InvNo}
              onChange={this.handlerInputChange}
              onBlur={this.handlerOnBlur}
            />
          </Table.Cell>
          <Table.Cell>
            <DatePicker
              readOnly
              value={this.state.InvDt}
              onChange={this.handleDateChange}
            />
          </Table.Cell>
          <Table.Cell>
            <Input
              fluid
              type="number"
              id="qty"
              min={0}
              max={9999999999}
              step="0.001"
              value={this.state.qty}
              onChange={this.handlerInputChange}
            />
          </Table.Cell>
          <Table.Cell>
            <Input
              fluid
              type="text"
              id="uom"
              value={this.state.uom}
              onChange={this.handlerInputChange}
            />
          </Table.Cell>
          <Table.Cell>
            <Input
              fluid
              type="text"
              id="loc"
              value={this.state.loc}
              onChange={this.handlerInputChange}
            />
          </Table.Cell>
          <Table.Cell>
            <Input
              fluid
              type="text"
              id="cmp"
              value={this.state.cmp}
              onChange={this.handlerInputChange}
            />
          </Table.Cell>
          <Table.Cell>{this.state.remark}</Table.Cell>
        </Table.Row>
      );
    } else {
      renderEl = (
        <Table.Row className={invalidRowStyle}>
          <Table.Cell collapsing>
            <Checkbox slider onChange={this.handlerCheckboxChange} disabled={this.props.commandType === 'edit'} />
          </Table.Cell>
          <Table.Cell>
            <a style={{ cursor: "pointer" }} onClick={this.handlerRowEdit}>
              {item.InvNo}
            </a>
          </Table.Cell>
          <Table.Cell>{item.InvDt}</Table.Cell>
          <Table.Cell>{item.qty}</Table.Cell>
          <Table.Cell>{item.uom}</Table.Cell>
          <Table.Cell>{item.loc}</Table.Cell>
          <Table.Cell>{item.cmp}</Table.Cell>
          <Table.Cell>{item.remark}</Table.Cell>
        </Table.Row>
      );
    }

    return renderEl;
  }
}

export default connect(
  null,
  mapActions
)(ShippingAdvInvoiceItems);
