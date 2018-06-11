import React from "react";
import PropTypes from 'prop-types';
import { Modal, Button, Header } from "semantic-ui-react";

const ShipmentConfirmModal = ({
  open,
  handleOpenModal,
  triggerButton,
  actionButton,
  title,
  content
}) => {
  return (
    <Modal
      trigger={triggerButton}
      open={open}
      closeOnEscape={true}
      closeOnRootNodeClick={false}
      size='small'
    >
      <Header icon="warning sign" content={title} />
      <Modal.Content>
        {content}
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="grey"
          content="Cancel"
          onClick={() => handleOpenModal(false)}
        />
        {actionButton}
      </Modal.Actions>
    </Modal>
  );
};

ShipmentConfirmModal.propTypes = {
    title: PropTypes.string,
    content: PropTypes.object,
    open: PropTypes.bool.isRequired,
    handleOpenModal: PropTypes.func.isRequired,
    triggerButton: PropTypes.object.isRequired,
    actionButton: PropTypes.object.isRequired
}

export default ShipmentConfirmModal;
