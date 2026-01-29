import baseAxios from "./baseAxios";

export default {
    // GET
    get(url, params = {}) {
        return baseAxios.get(url, { params });
    },

    // POST
    post(url, data = {}) {
        return baseAxios.post(url, data);
    },

    // PUT
    put(url, data = {}) {
        return baseAxios.put(url, data);
    },

    // DELETE
    delete(url) {
        return baseAxios.delete(url);
    },

    // UPLOAD FILE
    upload(url, formData) {
        return baseAxios.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};
