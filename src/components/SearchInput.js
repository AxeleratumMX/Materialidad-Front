import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {grey} from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ValidateInput from './ValidateInput';

const SearchInput = ({invalid, icon = 'search', placeholder = 'Buscar...', ...props}) => {
    const style = {
        inputBlock: {
            display: 'flex',
        },
        progress: {
            margin: '0 2px 0 2px',
            color: grey[500],
        },
    };

    return (
        <div>
            <Autocomplete
                {...props}
                disabled={!props.options || props.disabled}
                renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                        {props.children}
                        {props.label && <label className="formInputLabel">{props.label}</label>}
                        <ValidateInput invalid={invalid} message='Este campo es requerido'>
                            <div style={style.inputBlock}>
                                <input {...params.inputProps}
                                    className={'formInput' + (icon ? ' searchInput' : '')}
                                    type="search"
                                    placeholder={placeholder}/>
                                {icon ? (<button className="formInputButton">
                                    {props.loading ? <CircularProgress size={12} style={style.progress}/> :
                                        <i className={`${icon} icon`}/>
                                    }
                                </button>) : null}
                            </div>
                        </ValidateInput>
                    </div>
                )}
            />
        </div>
    );
};

SearchInput.propTypes = {
    invalid: PropTypes.bool,
    children: PropTypes.element,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    options: PropTypes.array,
    label: PropTypes.string,
    icon: PropTypes.string,
    placeholder: PropTypes.string,
    onError: PropTypes.func,
    getOptionLabel: PropTypes.func,
};

export default SearchInput;
