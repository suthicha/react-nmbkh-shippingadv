import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Grid, Input, Menu, Button, Form } from "semantic-ui-react";
import { load_shipments, filter_shipment } from "../shipmentActions";
import ShipmentList from "../ShipmentList/ShipmentList";
import ShipmentSearch from "../ShipmentSearch/ShipmentSearch";
import withAuth from "../../../app/common/hoc/withAuth";

const optTradCode = [
  { key: "", value: "", text: "Select Transaction Type"},
  { key: "A", value: "A", text: "Air Export" },
  { key: "O", value: "O", text: "Ocean Export" }
];

const mapState = (state, ownProps) => {
  const { goBack } = ownProps.history;
  return {
    goBack,
    loading: state.async.loading,
    shipments: state.shipments
  };
};

const mapActions = {
  load_shipments,
  filter_shipment
};

class ShipmentDashboard extends Component {
  state = {
    timer: null,
    tradCode: "",
    searchText: ""
  };

  componentDidMount() {
    if (this.props.shipments && this.props.shipments.length === 0) {
      this.props.load_shipments(data => {
        const currentShipmentView = [...data];
        this.setState({ currentShipmentView });
        this.forceUpdate();
      });
    }
    this.triggerAsync();
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  triggerAsync = () => {
    let timer = setInterval(() => {
      this.props.load_shipments();
    }, 1200000);
    this.setState({ timer });
  };

  handleSearch = evt => {
    evt.preventDefault();
    this.setState({ searchText: evt.target.value });
  };

  handlerSelectChange = (evt, data) => {
    this.setState({tradCode: data.value})
  }

  render() {
    const { loading } = this.props;
    const filteredShipments = this.props.shipments.filter(shipment => {
      return (
        shipment.InvNo.toLowerCase().indexOf(
          this.state.searchText.toLowerCase()
        ) !== -1
      );
    });

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Form size="small">
              <Form.Group>
                <Form.Select
                  width={4}
                  fluid
                  options={optTradCode}
                  value={this.state.tradCode}
                  placeholder="Select Transaction Type"
                  onChange={this.handlerSelectChange}
                />
                <Button
                  as={Link}
                  positive
                  disabled={this.state.tradCode === ''? true: false}
                  to={`/create-shipment/${this.state.tradCode}`}
                  content="CREATE NEW"
                />
              </Form.Group>
            </Form>
            <Menu pointing secondary>
              <Menu.Item>
                <span className="content-header">LAST TRANSACTION</span>
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item>
                  <Input
                    value={this.state.searchText}
                    onChange={evt => {
                      this.handleSearch(evt);
                    }}
                    icon="search"
                    placeholder="Search..."
                  />
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            <ShipmentList shipments={filteredShipments} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8} />
          <Grid.Column width={8}>{!loading && <ShipmentSearch />}</Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withAuth(
  connect(
    mapState,
    mapActions
  )(ShipmentDashboard)
);
