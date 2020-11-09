import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import SwitchInput from '../../../components/SwitchInput';
import Box from '@material-ui/core/Box';
import ValidateInput from '../../../components/ValidateInput';

const DynamicInput = ({validation, loading, ...props}) => {
    const [changed, setChanged] = React.useState(false);

    let inputElement = null;

    const handleChange = (e) => {
        setChanged(true);
        props.onChange(e);
    };

    React.useEffect(() => {
        setChanged(false);
    }, [validation]);

    // add a new case when dataType differs from html input type
    const fixType = (dataType) => {
        switch (dataType) {
        case ('string'):
            return 'text';
        default:
            return dataType;
        }
    };

    // returns input element for given dataType
    if (props) {
        switch (props.dataType) {
        case ('option'):
            inputElement =
                    <select disabled={!props.editable}
                        onChange={handleChange}
                        id={props.id}
                        value={props.value ? props.value : ''}
                        className="formInput"
                    >
                        <option/>
                        {props._options.sort((a, b) => a - b).map((option) => (
                            <option key={option.key} value={option.value}>{option.value}</option>
                        ))}
                    </select>;
            break;
        case ('checkbox'):
            const checked = !!(props.value && props.value === 'true');
            inputElement =
                    <Box style={{marginLeft: '20px'}}>
                        No
                        <SwitchInput disabled={!props.editable}
                            checked={checked}
                            value={props.value}
                            onChange={handleChange}
                        />
                        Si
                    </Box>;
            break;
        default:
            inputElement =
                    <input disabled={!props.editable}
                        id={props.id}
                        name={props.label}
                        onChange={handleChange}
                        onBlur={props.onBlur}
                        value={props.value ? props.value : ''}
                        className="formInput textField"
                        type={fixType(props.dataType)}
                    />;
        }
    }

    const isInvalid = () => {
        return validation && validation.operationErrors && validation.operationErrors.length > 0;
    };
    const shouldValidate = () => {
        return !loading && !changed && props.editable && (props.touched === undefined || props.touched === true);
    };

    const isRequired = () => !props.optional && (!props.value || props.value==='');

    return (
        <Fragment>
            {props.label && <label className="formInputLabel">
                {props.label}
                {isRequired() ? <strong style={{color: '#d34343'}}> * </strong> : '' }
            </label>}
            <ValidateInput
                invalid={shouldValidate() && isInvalid()}
                message={validation ? validation.operationErrors.join('. ') : ''}
            >
                {inputElement}
            </ValidateInput>
        </Fragment>
    );
};


DynamicInput.propTypes = {
    id: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string,
    dataType: PropTypes.string,
    _options: PropTypes.array,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    validation: PropTypes.object,
    editable: PropTypes.bool,
    optional: PropTypes.bool,
    touched: PropTypes.bool,
    loading: PropTypes.bool,
    iconMessage: PropTypes.bool,
};

export default DynamicInput;
