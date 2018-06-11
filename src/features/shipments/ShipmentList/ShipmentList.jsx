import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import ShipmentListItem from "./ShipmentListItem";
import "./ShipmentList.css";

class ShipmentList extends Component {
  render() {
    const { shipments } = this.props;
    return (
      <div id="shipment-list-container">
        <Table basic='very' celled collapsing striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Commercial Invoice</Table.HeaderCell>
              <Table.HeaderCell>TRDCD</Table.HeaderCell>
              <Table.HeaderCell>MAWB</Table.HeaderCell>
              <Table.HeaderCell>HAWB</Table.HeaderCell>
              <Table.HeaderCell>First FlightNo.</Table.HeaderCell>
              <Table.HeaderCell>Resend</Table.HeaderCell>                            
              <Table.HeaderCell>LastUpdate</Table.HeaderCell>
              <Table.HeaderCell>Send date</Table.HeaderCell>
              <Table.HeaderCell>Send status</Table.HeaderCell>              
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {shipments &&
              shipments.map(shipment => (
                <ShipmentListItem key={shipment.TrxNo} shipment={shipment} />
              ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default ShipmentList;
