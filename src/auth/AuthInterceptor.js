import Axios from 'axios';
import React, {Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthInterceptor = ({history}) => {
    Axios.interceptors.request.use((config) => {
        const token = localStorage.getItem('Authorization');

        if ( token != null ) {
            config.headers.Authorization = token;
        }

        return config;
    }, (error) => Promise.reject(error));

    Axios.interceptors.response.use((config) => {
        return config;
    }, (error) => {
        switch (error.response.status) {
        case 401:
            history.push('/login');
            break;
        case 403:
            error.message = 'No tiene los permisos necesarios para realizar esta acción';
            break;
        default:
            error.message = `Error inesperado (${error.response.status})`;
        }

        return Promise.reject(error);
    });

    return (<Fragment/>);
};

AuthInterceptor.propTypes = {
    history: PropTypes.object,
};

export default withRouter(AuthInterceptor);
