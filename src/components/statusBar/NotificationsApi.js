import Axios from 'axios';

export default class NotificationsApi {
    static URL = '/api/v1/inbox/notifications';

    static async findAll() {
        return await Axios.get(this.URL).then((response) => response.data);
    }

    static async delete(id) {
        return await Axios.delete(this.URL+'/'+id);
    }
}
