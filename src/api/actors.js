import axios from 'axios';
const BASE_URL = process.env.VUE_APP_BASE_API_URL;

const requests = {
    /**
     * Get API request to get actors list from API endpoint
     * @param data
     * @param filters
     * @param page
     * @param perPage
     * @returns {Promise<AxiosResponse<T>>}
     */
    getActors(data, filters, page, perPage) {
        return axios.
            get(`${BASE_URL}/actors`, {params: Object.assign({}, data, filters, {page, perPage})});
    },

    /**
     * Get API request to get actor list from API endpoint
     * @param data
     * @returns {Promise<AxiosResponse<T>>}
     */
    createActor(data) {
        return axios.
            post(`${BASE_URL}/actors`, Object.assign({}, data));
    },

    /**
     * Get API request to edit actor list from API endpoint
     * @param id Id of actor to edit
     * @param data
     * @returns {Promise<AxiosResponse<T>>}
     */
    patchActor(id, data) {
        return axios.
            patch(`${BASE_URL}/actors/${id}`, Object.assign({}, data));
    },

    /**
     * Get API request to delete actor list from API endpoint
     * @param id Id of actor to edit
     * @returns {Promise<AxiosResponse<T>>}
     */
    deleteActor(id) {
        return axios.
            delete(`${BASE_URL}/actors/${id}`);
    },
};

export default {
    namespaced: true,
    requests
}