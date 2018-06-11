import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card, Feed, Loader } from "semantic-ui-react";
import { load_history } from "../shipmentActions";
import ShipmentDetailsItem from "./ShipmentDetailsItem";
import "./ShipmentDetails.css";
// const mapState = state => {};

const mapActions = {
  load_history
};

class ShipmentDetails extends Component {
  state = {
    items: null,
    loading: false
  };

  componentDidMount() {
    const { refno } = this.props;
    this.setState({ loading: true });
    this.props.load_history(refno, data => {
      this.setState({ items: data });
      this.setState({ loading: false });
    });
  }

  render() {
    const { items, loading } = this.state;
    return (
      <Card className="shipment-items-card">
        <Card.Content>
          <Card.Header>Recent Activity</Card.Header>
        </Card.Content>
        <Card.Content>
          {loading ? (
            <Loader active className="card-loader" />
          ) : (
            <Feed>
              {items &&
                items.map((item, index) => {
                  return <ShipmentDetailsItem key={index} data={item} />;
                })}
            </Feed>
          )}
        </Card.Content>
      </Card>
    );
  }
}

ShipmentDetails.propTypes = {
  refno: PropTypes.string.isRequired
};

export default connect(null, mapActions)(ShipmentDetails);
