import Axios from 'axios';

export default class AuthApi {
    static LOGIN_URL = '/login'
    static USERS_URL = '/api/v1/admin/users/logged/user'

    static async login(username, password) {
        const response = await Axios.post(this.LOGIN_URL, {username, password});
        localStorage.setItem('Authorization', response.headers.authorization);
    }

    static isAuthenticated() {
        const token = localStorage.getItem('Authorization');
        return token !== null && token !== undefined && token.length > 0;
    }

    static logout() {
        localStorage.removeItem('Authorization');
    }


    static async getCurrentUser() {
        return await Axios.get(this.USERS_URL).then((response) => response.data);
    }
}
