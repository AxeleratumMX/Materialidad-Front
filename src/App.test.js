import React from 'react';
import App from './App';
import {mount} from 'enzyme';

describe('test', () => {
    it('works', () => {
        expect(true).toBeTruthy();
    });
});

describe('login page', () => {
    it('renders', () => {
        const app = mount(<App />);

        const loginBtn = app.find('#loginBtn');
        expect(loginBtn.getDOMNode()).toBeVisible();
        expect(loginBtn.getDOMNode()).toBeEnabled();
    });
});
