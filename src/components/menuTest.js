import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconMenu from '../assets/menu.svg';
import MenuItem from '@material-ui/core/MenuItem';
import {Link} from 'react-router-dom';
import LogoAt from '../images/logo-cibanco.png';
import Contract from '@material-ui/icons/DescriptionTwoTone';
import AddUser from '@material-ui/icons/PersonAddTwoTone';
import History from '@material-ui/icons/HistoryTwoTone';
import Notify from '@material-ui/icons/NotificationsNoneTwoTone';
import Email from '@material-ui/icons/EmailTwoTone';
import Template from '@material-ui/icons/InsertDriveFileTwoTone';
import Params from '@material-ui/icons/AssignmentOutlined';
import Roles from '@material-ui/icons/SupervisorAccountOutlined';

const useStyles = makeStyles({
    list: {
        width: 350,
        backgroundColor: '#F4F3F3',
    },
    fullList: {
        width: 100,
        backgroundColor: '#F4F3F3',


    },
});

export default function TemporaryDrawer() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({...state, [anchor]: open});
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list)}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List className={clsx(classes.list)}>
                <div style={{height: '100%', 
                }} className="ui right">
                    <img src={LogoAt} style={{marginLeft: '9rem', width: '100px'}} alt="Logo"/>

                </div>

                <Link to={{pathname: `/contracts`,
                }}><MenuItem style={{color: '#7D7C7C'}}>
                        <Contract style={{color: '#7D7C7C', fontSize: 25, margin: '1rem'}} />
                          Contratos
                    </MenuItem></Link> <Divider />

                <Link to={{pathname: `/history`,
                }}><MenuItem style={{color: '#7D7C7C'}}>
                        <History style={{color: '#7D7C7C', fontSize: 25, margin: '1rem'}} />
                          Historial
                    </MenuItem></Link> <Divider />

                <Link to={{pathname: `/alarm`,
                }}><MenuItem style={{color: '#7D7C7C'}} >
                        <Notify style={{color: '#7D7C7C', fontSize: 25, margin: '1rem'}} />
                            Alarmas
                    </MenuItem></Link> <Divider />
                <Link to={{pathname: `/inbox`, username: 'userRevisor',
                }}><MenuItem style={{color: '#7D7C7C'}} >
                        <Email style={{color: '#7D7C7C', fontSize: 25, margin: '1rem'}} />
                          Inbox
                    </MenuItem></Link> <Divider />

                {/* <Link to={{pathname: `/inbox`, username: 'userAbogadoCreador',
                }}><MenuItem style={{color: '#7D7C7C'}}>
                        <Email style={{color: '#7D7C7C', fontSize: 25, margin: '1rem'}} />
                        Inbox Abogado Creador
                    </MenuItem></Link> <Divider />

                <Link to={{pathname: `/inbox`, username: 'userFirmante',
                }}><MenuItem style={{color: '#7D7C7C'}}>
                        <Email style={{color: '#7D7C7C', fontSize: 25, margin: '1rem'}} />
                        Inbox Firmante
                    </MenuItem></Link> <Divider />

                <Link to={{pathname: `/inbox`, username: 'userFirmante2',
                }}><MenuItem style={{color: '#7D7C7C'}}>
                        <Email style={{color: '#7D7C7C', fontSize: 25, margin: '1rem'}} />
                        Inbox Firmante 2
                    </MenuItem></Link> <Divider />

                <Link to={{pathname: `/inbox`, username: 'userRevisor2',
                }}><MenuItem style={{color: '#7D7C7C'}}>
                        <Email style={{color: '#7D7C7C', fontSize: 25, margin: '1rem'}} />
                        Inbox Activar
            </MenuItem></Link> <Divider />*/}

                <Link to={{pathname: `/parameter`,
                }}><MenuItem style={{color: '#7D7C7C'}}>
                        <Params style={{color: '#7D7C7C', fontSize: 25, margin: '1rem'}} />
                          Parametros
                    </MenuItem></Link> <Divider />

                <Link to={{pathname: `/templates`,
                }}><MenuItem style={{color: '#7D7C7C'}}>
                        <Template style={{color: '#7D7C7C', fontSize: 25, margin: '1rem'}} />
                    Plantillas
                    </MenuItem></Link> <Divider />
                <Link to={{pathname: `/user`,
                }}><MenuItem style={{color: '#7D7C7C'}}>
                        <AddUser style={{color: '#7D7C7C', fontSize: 25, margin: '1rem'}} />
              Gestión Usuarios
                    </MenuItem></Link><Divider />
                <Link to={{pathname: `/userRoles`,
                }}><MenuItem style={{color: '#7D7C7C'}}>
                        <Roles style={{color: '#7D7C7C', fontSize: 25, margin: '1rem'}} />
              Gestión Roles
                    </MenuItem></Link><Divider />
            </List>
        </div>
    );
    return (
        <div>

            {['left'].map((anchor) => (
                <React.Fragment key={anchor}>

                    <Button onClick={toggleDrawer(anchor, true)}>
                        <img src={IconMenu} style={{width: '25px'}} />
                    </Button>
                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}
