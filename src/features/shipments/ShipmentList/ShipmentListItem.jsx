import React, { Component } from "react";
import {
  Table,
  Menu
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

class ShipmentListItem extends Component {
  render() {
    const { shipment } = this.props;
    const utcFormat = (dateStr) => moment(dateStr)
      .utc()
      .format("YYYY-MM-DD HH:mm A");
    const blinkStyle = shipment.SendInd === 'SEND'?'':'blink';
    return (
      <Table.Row>
        <Table.Cell>
          <Menu.Item as={Link} to={`/create-shipment/${shipment.TradCd}/${shipment.TrxNo}`}>
            {" "}
            {shipment.InvNo}{" "}
          </Menu.Item>
        </Table.Cell>
        <Table.Cell>{shipment.TradCd}</Table.Cell>        
        <Table.Cell>{shipment.Mawb}</Table.Cell>
        <Table.Cell>{shipment.Hawb}</Table.Cell>
        <Table.Cell>{shipment.Flt1}</Table.Cell>
        <Table.Cell>
          {shipment.Resend}
        </Table.Cell>
        <Table.Cell>
          {utcFormat(shipment.UpdateDate)}
        </Table.Cell>
        <Table.Cell>{shipment.SendDate && utcFormat(shipment.SendDate)}</Table.Cell>
        <Table.Cell>
          <div className={blinkStyle}>
            <span>
              {shipment.SendInd}
            </span>
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default ShipmentListItem;
