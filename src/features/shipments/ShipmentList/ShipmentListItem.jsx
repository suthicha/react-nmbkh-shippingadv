import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import {
  Button,
  Icon,
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
    const blinkStyle = shipment.SendInd === 'SEND'?'slink':'blink';

    return (
      <Table.Row>
        <Table.Cell collapsing>
          <Button
            circular
            icon="list"
            size="small"
            type="button"
            onClick={()=>{this.props.history.push(`/create-shipment/${shipment.SHIPTYPE.toLowerCase()}/edit/${shipment.TrxNo}`)}}
          />
        </Table.Cell>
        <Table.Cell>
          <Menu.Item as={Link} to={`/create-shipment/${shipment.SHIPTYPE.toLowerCase()}/edit/${shipment.TrxNo}`}>
            {" "}
            {shipment.InvNo}{" "}
          </Menu.Item>
        </Table.Cell>
        <Table.Cell textAlign='center'>{shipment.SHIPTYPE}</Table.Cell>  
        <Table.Cell>{shipment.Hawb}</Table.Cell>
        <Table.Cell>{shipment.Flt1}</Table.Cell>
        <Table.Cell>{shipment.Voy1}</Table.Cell>
        <Table.Cell textAlign='center'>
          {shipment.Resend}
        </Table.Cell>
        <Table.Cell>{shipment.SendDate && utcFormat(shipment.SendDate)}</Table.Cell>
        <Table.Cell>
          {utcFormat(shipment.UpdateDate)}
        </Table.Cell>
        <Table.Cell textAlign='center'>
          <div className={blinkStyle}>
            <span>
              {shipment.SendInd === 'SEND'?
               <Icon name='exchange' size='big' />
               :
               <Icon name='circle' size='big' />
              }
              
            </span>
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default withRouter(ShipmentListItem);
