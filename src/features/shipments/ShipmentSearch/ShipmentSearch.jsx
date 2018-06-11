import React, { Component } from "react";
import {  withRouter } from 'react-router-dom';
import { Segment,  Form } from "semantic-ui-react";
import './ShipmentSearch.css';

class ShipmentSearch extends Component {
  state ={
    searchText: ''
  }

  handleInputChange = (e, { name, value }) => this.setState({ [name]: value.toUpperCase() })
  handleSubmit = () => {
    if(this.state.searchText.length === 0) return;
    this.props.history.push({
      pathname: '/query-shipments/' + this.state.searchText,
      state: {
        from: this.props.location.pathname
      }
      }
    )
  }

  render() {
    return (
      <Segment padded className='shipment-search'>
        <span className='header'>search</span>
        <div style={{paddingTop: '10px'}}>
        You may enter a commercial invoice number to be seen history or resend a transaction...
        </div>
        <div style={{paddingTop: '10px'}}>
            <Form onSubmit={this.handleSubmit}>
                <Form.Group>
                    <Form.Input width='14' placeholder='Commercial Invoice' value={this.state.searchText} name='searchText' onChange={this.handleInputChange} />
                    <Form.Button content='Search' color='blue' />
                </Form.Group>
            </Form>
        </div>
      </Segment>
    );
  }
}

export default withRouter(ShipmentSearch);
