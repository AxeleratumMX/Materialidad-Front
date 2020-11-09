import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import Icon from '../assets/ico_back.svg';
import PropTypes from 'prop-types';
import DataIcon from '../assets/ico_contract.svg';

const SideMenu = (props) => {
    const style = {
        content: {
            paddingTop: '30px',
            borderTop: '1px solid white',
            paddingBottom: '20px',
            minWidth: '200px',
            height: '80%',
            overflowY: 'auto',
            overflowX: 'hidden',
        },
        backImg: {
            marginLeft: '30px',
            width: '25px',
            display: 'block',
        },
        backSpan: {
            marginLeft: '10px',
            color: '#a0adb3',
            fontSize: '1.4em',
        },
    };

    return (
        <Fragment>
            <Link to={props.backTo}>
                <div className="ui grid" style={{margin: '10px'}}>
                    <div className="row">
                        <img style={style.backImg} src={Icon} alt=''/>
                        <span style={style.backSpan}>Regresar</span>
                    </div>
                </div>
            </Link>

            <div className="row" style={style.content}>
                {props.title && <div style={{paddingBottom: '25px'}} className="row">
                    <img style={{marginLeft: '30px', width: '25px', float: 'left'}} src={DataIcon} alt=''/>
                    <span style={{
                        marginLeft: '10px',
                        float: 'center',
                        color: '#59666e',
                        fontSize: '1.2em',
                    }}>{props.title}</span>
                </div>}
                {props.children}
            </div>
        </Fragment>
    );
};

SideMenu.propTypes = {
    backTo: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node,
};

export default SideMenu;
