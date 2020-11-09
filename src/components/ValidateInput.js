import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

const ValidateInput = ({invalid, message, ...props}) => {
    const errorColor = '#f44336';

    const style = {
        invalid: {
            border: '1px solid',
            borderColor: errorColor,
            borderRadius: '6px',
            boxShadow: '0px 0px 3px 0px '+errorColor,
        },
        error: {
            color: errorColor,
        },
    };

    return (
        <Fragment>
            <div style={{display: 'inline-flex', width: '100%', position: 'relative'}} className="innerIconContainer">
                {invalid && message ?
                    <Tooltip arrow title={message ? message : ''}>
                        <ReportProblemOutlinedIcon
                            style={{color: '#f10000', margin: '7px 5px', position: 'absolute', display: 'block'}}
                        />
                    </Tooltip> : null}
                <div style={{...(invalid ? style.invalid : null), width: '100%'}}
                    className={invalid ? 'inputIcon' : ''}>
                    {props.children}
                </div>
            </div>
        </Fragment>

    );
};


ValidateInput.propTypes = {
    invalid: PropTypes.bool,
    message: PropTypes.string,
    children: PropTypes.element,
};

export default ValidateInput;
