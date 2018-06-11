import axios from '../config/axios';
import delay from '../common/util/delay';
import * as Cookies from 'js-cookie';

export const loginUser = (email, password) => {
    return delay().then(() => {
        return new Promise((resolve, reject) => {
            axios.post(`/user/login`, {
                    userId: email,
                    password
                })
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    })
}

export const fetchUserProfile = () => {
    return delay().then(() => {
        const cookie = Cookies.getJSON('USER-SESSION'); 
        return new Promise((resolve, reject) => {
            axios.get(`/user/${cookie.id}?token=${cookie.token}`)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    })
}

export const fetchUsers = () => {
    return delay().then(() => {
        const cookie = Cookies.getJSON('USER-SESSION');         
        return new Promise((resolve, reject) => {
            axios.get(`/user?token=${cookie.token}`)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    })
}

export const insertUser = (data) => {
    return delay().then(() => {
        const cookie = Cookies.getJSON('USER-SESSION');         
        return new Promise((resolve, reject) => {
            axios.put(`/user?token=${cookie.token}`, data)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    })
}

export const updateUser = (id, data) => {
    return delay().then(() => {
        const cookie = Cookies.getJSON('USER-SESSION');         
        return new Promise((resolve, reject) => {
            axios.post(`/user/${id}?token=${cookie.token}`, data)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    })
}

export const deleteUser = (id, username) => {
    return delay().then(() => {
        const cookie = Cookies.getJSON('USER-SESSION');         
        return new Promise((resolve, reject) => {
            axios.delete(`/user/${id}/${username}?token=${cookie.token}`)
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    })
}

export const recoveryPassword = (user) => {
    return delay().then(()=> {
        const cookie = Cookies.getJSON('USER-SESSION');
        return new Promise((resolve, reject) => {
            axios.patch(`/user/recovery?token=${cookie.token}`, user)
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    })
}
