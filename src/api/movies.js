import axios from 'axios';
const BASE_URL = process.env.VUE_APP_BASE_API_URL;

const requests = {
    /**
     * Get API request to get movies list from API endpoint
     * @param data
     * @param filters
     * @param page
     * @param perPage
     * @returns {Promise<AxiosResponse<T>>}
     */
    getMovies(data, filters, page, perPage) {
        return axios.
            get(`${BASE_URL}/movies`, {params: Object.assign({}, data, filters, {page, perPage})});
    },

    /**
     * Get API request to get movie list from API endpoint
     * @param data
     * @returns {Promise<AxiosResponse<T>>}
     */
    createMovie(data) {
        return axios.
            post(`${BASE_URL}/movies`, Object.assign({}, data));
    },

    /**
     * Get API request to edit movie list from API endpoint
     * @param id Id of movie to edit
     * @param data
     * @returns {Promise<AxiosResponse<T>>}
     */
    patchMovie(id, data) {
        return axios.
            patch(`${BASE_URL}/movies/${id}`, Object.assign({}, data));
    },

    /**
     * Get API request to delete movie list from API endpoint
     * @param id Id of movie to delete
     * @returns {Promise<AxiosResponse<T>>}
     */
    deleteMovie(id) {
        return axios.
            delete(`${BASE_URL}/movies/${id}`);
    },
};

export default {
    namespaced: true,
    requests
}