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
                    <option key='FIDEICOMISO' value='FIDEICOMISO'>Fideicomiso</option>
                    <option key='FIDEICOMISOADMINISTRACION' value='FIDEICOMISOADMINISTRACION'>Fideicomiso Administración</option>

                </select>
            </div>
        </Fragment>
    );
};


export default ContractTypeSelect;
