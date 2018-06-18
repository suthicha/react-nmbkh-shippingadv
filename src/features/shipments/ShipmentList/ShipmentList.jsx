import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import ShipmentListItem from "./ShipmentListItem";
import "./ShipmentList.css";

class ShipmentList extends Component {
  render() {
    const { shipments } = this.props;
    return (
      <div>
        <Table id='shipment-list-container' compact celled definition size='small'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>INVNO.</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>SHP.</Table.HeaderCell>
              <Table.HeaderCell>HAWB</Table.HeaderCell>
              <Table.HeaderCell>FLNO.</Table.HeaderCell>
              <Table.HeaderCell>VOY.</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>RSND.</Table.HeaderCell>                            
              <Table.HeaderCell>SEND</Table.HeaderCell>
              <Table.HeaderCell>UPDATE</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>STATUS</Table.HeaderCell> 
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
