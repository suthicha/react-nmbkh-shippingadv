import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Grid, Input } from "semantic-ui-react";
import withAuth from "../../../app/common/hoc/withAuth";
import ShipmentList from "../ShipmentList/ShipmentList";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { fetch_commercialInvoice, reset_shipments } from "../../shipments/shipmentActions";

const mapState = (state, ownProps) => {
  const searchText = ownProps.match.params.searchText;
  return {
    searchText,
    shipments: state.shipments,
    loading: state.async.loading
  };
};

const mapActions = {
  fetch_commercialInvoice,
  reset_shipments
};

class ShipmentSearchPage extends Component {
  state = {
    searchValue: ""
  };

  componentDidMount() {
    this.forceUpdate(() => {
        const { searchText } = this.props;
        this.setState({ searchValue: searchText });
        if (searchText) {
          this.findCommercialInvoice(searchText);
        }
    });
  }

  componentWillUnmount(){
    this.props.reset_shipments(this.props.shipments);
  }

  findCommercialInvoice = invno => {
    const { history, location } = this.props;
    this.props.fetch_commercialInvoice(invno);
    history.replace({
        ...location,
        pathname:'/query-shipments/' + invno
    })
  };

  handleInputChange = (e, { name, value }) =>
    this.setState({ [name]: value.toUpperCase() });

  handleSubmit = () => {
    if (this.state.searchValue.length === 0) return;
    this.findCommercialInvoice(this.state.searchValue);
  };

  render() {
    const { shipments, loading } = this.props;
    if (loading) return <LoadingComponent content="Loading..." />
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <div style={{ textAlign: "center" }}>
            {shipments.length === 0 && 
              <h1>Oops! We couldn’t find what you are looking for.</h1>
            }
              <span style={{ fontSize: "18px" }}>
                Please try searching for a
                transaction by entering a invoice no, master waybill, house waybill, transaction show less then 60 days.
              </span>
            </div>
            <div style={{ paddingTop: "20px" }}>
              <Form onSubmit={this.handleSubmit}>
                <Input
                  fluid
                  icon="search"
                  placeholder="Search..."
                  name="searchValue"
                  value={this.state.searchValue}
                  onChange={this.handleInputChange}
                />
              </Form>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <ShipmentList shipments={shipments} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withAuth(connect(mapState, mapActions)(ShipmentSearchPage));
