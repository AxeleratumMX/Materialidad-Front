import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Fade from '@material-ui/core/Fade';
import PropTypes from 'prop-types';

const LinearLoading = ({show, delay = 800}) => {
    return (
        <Fade
            in={show}
            style={{transitionDelay: show ? `${delay}ms` : '0ms'}}
            unmountOnExit
        >
            <LinearProgress/>
        </Fade>
    );
};

LinearLoading.propTypes = {
    show: PropTypes.bool,
    delay: PropTypes.number,
};

export default LinearLoading;
