import React from "react";
import { Button, Header, Divider, Icon, Table } from "semantic-ui-react";
import ShippingAdvInvoiceItems from "./ShippingAdvInvoiceItems";

const ShippingAdvInvoiceList = ({
  items,
  deleteItems,
  onCreated,
  onDeleteRow,
  onDeleteItems,
  onSaveRow,
  onRowEdit,
  onMaskDeleteItem,
  onCheckAndUpdateDestPort,
  commandType
}) => {
  return (
    <div style={{ paddingTop: "10px" }}>
      <Header sub color="teal" content="Items" />
      <Divider fitted />
      <Table compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell width={2}>Invoice No.</Table.HeaderCell>
            <Table.HeaderCell width={2}>Date</Table.HeaderCell>
            <Table.HeaderCell width={2}>Measurement</Table.HeaderCell>
            <Table.HeaderCell width={2}>UOM</Table.HeaderCell>
            <Table.HeaderCell width={1}>LOC.</Table.HeaderCell>
            <Table.HeaderCell width={2}>CMP.</Table.HeaderCell>
            <Table.HeaderCell>Remark</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items &&
            items.map((item, index) => {
              return (
                <ShippingAdvInvoiceItems
                  key={item.id}
                  item={item}
                  deleteRow={onDeleteRow}
                  saveRow={onSaveRow}
                  rowEdit={onRowEdit}
                  maskDeleteItem={onMaskDeleteItem}
                  checkAndUpdateDestPort={onCheckAndUpdateDestPort}
                  commandType={commandType}
                />
              );
            })}
        </Table.Body>
        { commandType === 'new' &&
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan="7">
              <Button
                icon
                labelPosition="left"
                primary
                size="mini"
                type="button"
                onClick={onCreated}
              >
                <Icon name="plus" /> Add
              </Button>
              <Button
                icon
                labelPosition="left"
                size="mini"
                type="button"
                onClick={onDeleteItems}
                disabled={deleteItems.length === 0 && true}
                color={deleteItems.length === 0 ? "grey" : "red"}
              >
                <Icon name="trash" />
                Delete
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>}
      </Table>
    </div>
  );
};

export default ShippingAdvInvoiceList;
