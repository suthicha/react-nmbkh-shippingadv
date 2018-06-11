import axios from '../config/axios';
import delay from '../common/util/delay';
import * as Cookies from 'js-cookie';

export const fetchShipment = () => {
    return delay().then(() => {
        const cookie = Cookies.getJSON('USER-SESSION');        
        const email = Cookies.get('USER_DATA');
        return new Promise((resolve, reject) => {
            axios.get(`/shipment/select/${email}?token=${cookie.token}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    })
}


export const fetchHistory = (invno) => {
    return delay().then(() => {
        const cookie = Cookies.getJSON('USER-SESSION');
        return new Promise((resolve, reject) => {
            axios.get(`/shipment/history/${invno}?token=${cookie.token}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    })
}

export const insertShipment = (data) => {
    return delay().then(() => {
        const cookie = Cookies.getJSON('USER-SESSION');
        const email = Cookies.get('USER_DATA');
        const shipmentData = {...data, UpdateBy: email};
        return new Promise((resolve, reject)=>{
            axios.put(`/shipment?token=${cookie.token}`, shipmentData)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    })
}

export const updateShipment = (data) => {
    return delay().then(() => {
        const cookie = Cookies.getJSON('USER-SESSION');
        const email = Cookies.get('USER_DATA');
        const shipmentData = {...data, UpdateBy: email};
        return new Promise((resolve, reject) => {
            axios.patch(`/shipment/${shipmentData.TrxNo}?token=${cookie.token}`, shipmentData)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
        
        })
    })
}

export const findShipment = (id) => {
    return delay().then(() => {
        const cookie = Cookies.getJSON('USER-SESSION');        
        return new Promise((resolve, reject) => {
            axios.get(`/shipment/${id}?token=${cookie.token}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    })
}

export const findInvoice = (invno) => {
    return delay().then(() => {
        const cookie = Cookies.getJSON('USER-SESSION');        
        return new Promise((resolve, reject) => {
            axios.get(`/shipment/invoice/${invno}?token=${cookie.token}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    })    
}

export const fetchCommercialInvoice = (invno) => {
    return delay().then(() => {
        const cookie = Cookies.getJSON('USER-SESSION');        
        return new Promise((resolve, reject) => {
            axios.get(`/shipment/transaction/query/${invno}?token=${cookie.token}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    })    
}

export const deleteShipment = (id) => {
    return delay().then(() => {
        const cookie = Cookies.getJSON('USER-SESSION');        
        const email = Cookies.get('USER_DATA');    
        return new Promise((resolve, reject) => {
            axios.delete(`/shipment/${id}/${email}?token=${cookie.token}`)
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    })
}