import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {closeModal} from "./modalActions";
import LoginForm from '../auth/Login/LoginForm';

const actions = {closeModal};

class LoginModal extends Component {
    render() {
        return (
            <Modal
                size='mini'
                open={true}
                onClose={this.props.closeModal}
            >
                <Modal.Header>
                    Login to CTI Logistics
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <LoginForm />
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}

LoginModal.contextTypes = {
    store: PropTypes.object.isRequired
}

export default connect(null, actions)(LoginModal);
