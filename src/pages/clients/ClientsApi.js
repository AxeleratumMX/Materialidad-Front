import Axios from 'axios';

export default class ClientsApi {
    static URL = '/api/v1/clients/';


    static async findAllPaged(size, page, sort) {
        const params = {
            size: size,
            page: page,
            sort: sort,
        };

        return await Axios.get(this.URL, {params})
            .then((response) => response.data.content);
    }

    static async findAll() {
        return await Axios.get(this.URL + 'all')
            .then((response) => response.data);
    }

    static async find(id) {
        return await Axios.get(this.URL + id)
            .then((response) => response.data);
    }
}
