import React from 'react';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import {render} from '@testing-library/react';
import PropTypes from 'prop-types';

const Wrapper = ({children}) => (
    <Router history={history}>{children}</Router>
);

Wrapper.propTypes = {
    children: PropTypes.any,
};

export const renderWithRouter = (
    ui,
    {
        route = '/',
        history = createMemoryHistory({initialEntries: [route]}),
    } = {},
) => {
    return {
        ...render(ui, {wrapper: Wrapper}),
        // adding `history` to the returned utilities to allow us
        // to reference it in our tests (just try to avoid using
        // this to test implementation details).
        history,
    };
};


