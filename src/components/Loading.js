import React, {Fragment} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

const Loading = ({hide = false}) => {
    return (
        <Fragment>
            <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                {!hide && <CircularProgress disableShrink />}
            </div>
        </Fragment>
    );
};

Loading.propTypes = {
    hide: PropTypes.bool,
};

export default Loading;
