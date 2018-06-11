import { createReducer } from "../../app/common/util/reducerUtil";
import {
  CREATE_SHIPMENT,
  UPDATE_SHIPMENT,
  DELETE_SHIPMENT,
  FETCH_SHIPMENT
} from "./shipmentConstants";

const initialState = [];

export const createShipment = (state, payload) => {
  return [Object.assign({}, payload.shipment), ...state];
};

export const updateShipment = (state, payload) => {
  const updateState = state.filter(shp => shp.TrxNo !== payload.shipment.TrxNo);
  return [Object.assign({}, payload.shipment), ...updateState];
};

export const deleteShipment = (state, payload) => { 
  return [...state.filter(shp => shp.TrxNo !== Number(payload.id))];
};

export const fetchShipment = (state, payload) => {
  return payload.shipments;
};

export default createReducer(initialState, {
  [CREATE_SHIPMENT]: createShipment,
  [UPDATE_SHIPMENT]: updateShipment,
  [DELETE_SHIPMENT]: deleteShipment,
  [FETCH_SHIPMENT]: fetchShipment
});
