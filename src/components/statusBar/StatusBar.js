import React, {Fragment} from 'react';
import LogoAt from '../../images/logo-city.svg';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import IconAlert from '../../assets/icoo-alerta.svg';
import Menu2 from '../menuTest.js';
import NotificationsApi from './NotificationsApi';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import Divider from '@material-ui/core/Divider';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import AuthApi from '../../auth/AuthApi';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItemIcon from '@material-ui/core/ListItemIcon';

const StatusBar = (props) => {
    const [userName, setUserName] = React.useState('');
    const [notifications, setNotifications] = React.useState([]);
    const [openNotification, setOpenNotification] = React.useState(false);
    const [notificationsAnchor, setNotificationsAnchor] = React.useState(false);
    const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);

    const authenticated = AuthApi.isAuthenticated();

    const style = {
        header: {
            height: '80px',
            padding: '15px',
            margin: 0,
            backgroundColor: '#044f9d',//gb(18, 154, 196)  '#007836'
            borderBottom: '3px solid #616161',
            minWidth: '400px',
        },
        logo: {
            height: '90%',
            marginLeft: '20px',
        },
        userName: {
            fontSize: '1em',
            fontFamily: 'Montserrat, Medium, 12pt, #ffffff',
            fontWeight: 'bold',
            color: '#EFF0F3',
            display: 'inline-block',
            marginBottom: 'auto',
            marginTop: 'auto',
            marginRight: '20px',
        },
    };

    const handleShowNotifications = (event) => {
        setNotificationsAnchor(event.currentTarget);
        if (Array.isArray(notifications) && notifications.length > 0) {
            setOpenNotification(true);
        }
        populateNotifications();
    };

    const populateNotifications = () => {
        NotificationsApi.findAll().then((notifications) =>{
            setNotifications(
                notifications.filter((n) => !!n.comments && n.comments !=='' && n.createdDate != null)
                    .map((n) => {
                        return {...n, date: new Date(n.createdDate)};
                    }),
            );
        });
    };

    const dateFormat = (date) => {
        const format = {year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'};
        return date.toLocaleDateString('es', format);
    };

    const deleteNotification = (event, notification) => {
        event.stopPropagation();
        NotificationsApi.delete(notification.id).then(() => {
            setNotifications(notifications.filter((n) => n.id !== notification.id));
        });
    };
    const navigateToInbox = () => {
        setOpenNotification(false);
        props.history.push('/inbox');
    };

    React.useEffect(() => {
        if (authenticated) {
            populateNotifications();
            AuthApi.getCurrentUser().then((user) => setUserName(user.name));
        } else {
            setNotifications([]);
            setUserName('');
        }
    }, [authenticated]);

    const handleUserMenuOpen = (event) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };

    const handleLogout = () => {
        handleUserMenuClose();
        AuthApi.logout();
        props.history.push('/login');
    };

    return (
        <div style={style.header} className="ui menu">
            {authenticated ? <div className="ui left">
                <Menu2/>
            </div> : null}
            <div style={style.logo} className="ui left">
                <img src={LogoAt} style={style.logo} alt="American Tower Logo"/>
            </div>
            {authenticated ? <div style={{marginRight: '70px'}} className="right menu">
                <div style={{marginRight: '50px', marginTop: '10px'}}>
                    <Badge color="secondary"
                        badgeContent={notifications ? notifications.length : null}
                        onClick={handleShowNotifications}>
                        <img src={IconAlert} style={{width: '30px', cursor: 'pointer'}} alt=""/>
                    </Badge>

                    <Popover style={{marginTop: '25px'}}
                        open={openNotification}
                        anchorEl={notificationsAnchor}
                        onClose={() => setOpenNotification(false)}
                        marginThreshold={20}
                        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                        transformOrigin={{vertical: 'top', horizontal: 'center'}}
                    ><List style={{width: '400px', maxHeight: '500px'}}>
                            {Array.isArray(notifications) && notifications.length > 0 &&
                                notifications.map((notification, index) => (
                                    <Fragment key={notification.id}>
                                        {index > 0 && <Divider variant="inset" component="li" />}
                                        <ListItem button onClick={navigateToInbox}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <PermIdentityIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={notification.comments}
                                                secondary={dateFormat(notification.date)}
                                            />
                                            <IconButton onClick={(e) => deleteNotification(e, notification)}>
                                                <ClearIcon fontSize="small"/>
                                            </IconButton>
                                        </ListItem>
                                    </Fragment>
                                ))}
                        </List>
                    </Popover>
                </div>

                <p style={style.userName}>{userName}</p>

                <Avatar alt={userName}
                    style={{cursor: 'pointer'}}
                    src="/static/images/avatar/1.jpg"
                    onClick={handleUserMenuOpen}
                />
                <Menu getContentAnchorEl={null}
                    anchorEl={userMenuAnchor}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                    transformOrigin={{vertical: 'top', horizontal: 'right'}}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                ><MenuItem onClick={handleLogout}>
                        <ListItemIcon><ExitToAppIcon color="primary"/></ListItemIcon>
                        <ListItemText className="center aligned">Salir</ListItemText></MenuItem>
                </Menu>

            </div> : null}
        </div>
    );
};

StatusBar.propTypes = {
    history: PropTypes.object,
};

export default withRouter(StatusBar);
