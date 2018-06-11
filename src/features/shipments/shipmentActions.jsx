import { toastr } from "react-redux-toastr";
import {
  CREATE_SHIPMENT,
  UPDATE_SHIPMENT,
  DELETE_SHIPMENT,
  FETCH_SHIPMENT,
  FILTER_SHIPMENT
} from "./shipmentConstants";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions";
import {
  insertShipment,
  deleteShipment,
  updateShipment,
  findInvoice,
  findShipment,
  fetchHistory,
  fetchShipment,
  fetchCommercialInvoice
} from "../../app/data/mockShipmentApi";

export const fetchShipmentAction = data => {
  return {
    type: FETCH_SHIPMENT,
    payload: {
      shipments: data
    }
  };
};

export const createShipmentAction = data => {
  return {
    type: CREATE_SHIPMENT,
    payload: {
      shipment: data
    }
  }
}

export const updateShipmentAction = data => {
  return {
    type: UPDATE_SHIPMENT,
    payload: {
      shipment: data
    }
  }
}

export const deleteShipmentAction = id => {
  return {
    type: DELETE_SHIPMENT,
    payload: {
      id
    }
  }
}

export const load_shipments = (callback) => {
  return async dispatch => {
    try {
      dispatch(asyncActionStart());
      let promise = await fetchShipment();
      dispatch(fetchShipmentAction(promise.data));
      dispatch(asyncActionFinish());
      toastr.clean();
      toastr.success("Success!", "Shipments have been loaded.");
      callback(promise.data);
    } catch (e) {
      callback(null);
      dispatch(asyncActionError());
      toastr.error("Oops", "Found error something went wrong");
    }
  };
};

export const find_shipment = (id, callback) => {
  return async dispatch => {
    try {
      let promise = await findShipment(id);
      callback(promise.data[0]);
      toastr.success("Success!", "Shipment have been loaded.");
    } catch (e) {
      toastr.error("Oops", "Found error something went wrong");
      callback(null);
      dispatch(asyncActionError());
    }
  };
};


export const find_invoice = (invno, callback) => {
  return async dispatch => {
    try {
      let promise = await findInvoice(invno);
      callback(promise.data[0]);
      // toastr.success("Success!", "Shipment have been loaded.");
    } catch (e) {
      callback(null);
      toastr.error("Oops", "Found error something went wrong");
      dispatch(asyncActionError());
    }
  };
};

export const fetch_commercialInvoice = (invno) => {
  return async dispatch => {
    try {
      dispatch(asyncActionStart());
      let promise = await fetchCommercialInvoice(invno);
      dispatch(fetchShipmentAction(promise.data));
      dispatch(asyncActionFinish());
      toastr.success("Success!", "Shipment have been loaded.");
    } catch (e) {
      // callback(null);
      toastr.error("Oops", "Found error something went wrong");
      dispatch(asyncActionError());
    }
  };
};

export const reset_shipments = (shipments) => {
  return dispatch => {
    localStorage.setItem('shipments', JSON.stringify(shipments));
    dispatch(fetchShipmentAction([]));
  }
}

export const load_history = (invno, callback) => {
  return async dispatch => {
    try {
      let promise = await fetchHistory(invno);
      if (promise){
        callback(promise.data);
      }
      // toastr.success("Success!", "Shipment have been loaded.");
    } catch (e) {
      callback(null);
      // toastr.error("Oops", "Found error something went wrong");
      dispatch(asyncActionError());
    }
  };
};

export const filter_shipment = (invno) => {
  return dispatch => {
    dispatch({type: FILTER_SHIPMENT, payload: invno})
  }
}

export const create_shipment = (shipment, callback) => {
  return async dispatch => {
    try {
      dispatch(asyncActionStart());
      const promise = await insertShipment(shipment);
      if (promise){
        dispatch(createShipmentAction(promise.data[0]));
        toastr.success("Success!", "Shipment have been added.")
        callback({statusCode:201,statusText:'success'});
        dispatch(asyncActionFinish());
      }
    }catch(e){
      dispatch(asyncActionError());
      toastr.error("Oops", "Something went wrong cound not add the shipment.")
      callback({statusCode:500, statusText: e.message});
    }
  }
}

export const update_shipment = (shipment, callback) => {
  return async dispatch => {
    try {
      const promise = await updateShipment(shipment);
      if (promise){
        dispatch(updateShipmentAction(promise.data[0]));
        toastr.success("Success!", "Shipment have been updated.")
        callback({statusCode:201,statusText:'success'});
      }
    }catch(e){
      dispatch(asyncActionError());
      toastr.error("Oops", "Something went wrong cound not add the shipment.")
      callback({statusCode:500, statusText: e.message});
    }
  }
}

export const delete_shipment = (id, callback) => {
  return async dispatch => {
    try {
      dispatch(asyncActionStart());
      const promise = await deleteShipment(id);
      if (promise){
        dispatch(deleteShipmentAction(id));
        dispatch(asyncActionFinish());
        toastr.warning("Deleted!", "Shipment have been deleted.")
        callback({statusCode:200,statusText:'success'});
      }
    }catch(e){
      dispatch(asyncActionError());
      toastr.error("Oops", "Something went wrong cound not add the shipment.")
      callback({statusCode:500, statusText: e.message});
    }
  }
}
