import React from 'react';
import Contract from './Contract';
import {mount} from 'enzyme';
import {createBrowserHistory} from 'history';
import CreateContractDialog from './CreateContractDialog';

describe('Contract', () => {
    it('displays create dialog', () => {
        const contract = mount(
            <Contract history={createBrowserHistory()} match={{params: {id: undefined}}}/>,
        );

        const createDialog = contract.find(CreateContractDialog);
        expect(createDialog).toHaveLength(1);

        const generateButton = createDialog.find('#generateContract');
        expect(generateButton.type()).toBe('button');
        expect(generateButton.getDOMNode()).toBeVisible();
        expect(generateButton.getDOMNode()).toBeDisabled();
    });
});

