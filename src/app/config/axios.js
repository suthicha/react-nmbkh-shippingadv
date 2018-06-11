import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://202.183.213.177/shippingadviceapi'
})

export default axiosClient;