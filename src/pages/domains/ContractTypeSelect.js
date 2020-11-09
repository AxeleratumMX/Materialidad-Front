import React, {Fragment} from 'react';

const ContractTypeSelect = (props) => {
    return (
        <Fragment>
            <label className="formInputLabel">Tipo de Contrato</label>
            <div style={{display: 'flex'}} className="ui action input">
                <select id='contractType'
                    className="formInput"
                    {...props}>
                    <option/>
                    <option key='HABITACIONAL' value='HABITACIONAL'>Habitacional</option>
                    <option key='COMERCIAL' value='COMERCIAL'>Comercial</option>
                </select>
            </div>
        </Fragment>
    );
};


export default ContractTypeSelect;
