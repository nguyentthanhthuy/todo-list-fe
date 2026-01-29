import axios from "axios";

const apiUrl = "http://127.0.0.1:8000/api/";

export default {
    // Lấy header kèm token client
    getHeader() {
        let token = window.localStorage.getItem('auth_token');
        if (!token) {
            return {};
        }
        return { Authorization: 'Bearer ' + token };
    },

    // GET request
    get(url) {
        return axios.get(apiUrl + url, { headers: this.getHeader() });
    },

    // POST request
    post(url, data = {}) {
        return axios.post(apiUrl + url, data, { headers: this.getHeader() });
    },

    // DELETE request
    delete(url) {
        return axios.delete(apiUrl + url, { headers: this.getHeader() });
    },

    // PUT request
    put(url, data = {}) {
        return axios.put(apiUrl + url, data, { headers: this.getHeader() });
    },
};
