import React from 'react';
import Client from '../../assets/ico_client.svg';
import CircularProgress from '@material-ui/core/CircularProgress';
import {grey} from '@material-ui/core/colors';
import ClientsApi from './ClientsApi';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ValidateInput from '../../components/ValidateInput';

const ClientSelect = (props) => {
    const [clientOptions, setClientOptions] = React.useState(null);

    React.useEffect(() => {
        let mounted = true;

        ClientsApi.findAll().then((customers) => {
            if (mounted) setClientOptions(customers);
        }).catch(props.onError);

        return () => mounted = false;
    }, []);

    const style = {
        inputBlock: {
            display: 'flex',
        },
        progress: {
            margin: '0 2px 0 2px',
            color: grey[500],
        },
    };

    const handleClientChange = (event, newClient) => {
        props.onSelect(newClient);
    };

    return (
        <div>
            <Autocomplete
                disabled={!clientOptions || props.disabled}
                id='customer'
                value={props.value}
                getOptionLabel={(client) => client.nombre}
                getOptionSelected={(option, value) => option.id === value.id}
                options={clientOptions ? clientOptions : []}
                onChange={handleClientChange.bind(this)}
                renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                        <img style={{width: '12px', marginRight: '5px'}} src={Client} alt=''/>
                        <label className="formInputLabel">Cliente</label>
                        <ValidateInput invalid={props.invalid} message='Este campo es requerido'>
                            <div style={style.inputBlock}>
                                <input {...params.inputProps}
                                    className="formInput searchInput"
                                    type="search"
                                    name='customer'
                                    id='customer'
                                    placeholder="Buscar..."/>
                                <button className="formInputButton">
                                    {clientOptions ? <i className="search icon"/> :
                                        <CircularProgress size={12} style={style.progress}/>}
                                </button>
                            </div>
                        </ValidateInput>
                    </div>
                )}
            />
        </div>
    );
};

ClientSelect.propTypes = {
    onSelect: PropTypes.func,
    onError: PropTypes.func,
    disabled: PropTypes.bool,
    invalid: PropTypes.bool,
    value: PropTypes.object,
};

export default ClientSelect;
