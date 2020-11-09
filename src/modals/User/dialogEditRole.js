import React, {useState, useEffect} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Arrow from '@material-ui/icons/ArrowDropDownOutlined';
import ArrowUp from '@material-ui/icons/ArrowDropUpTwoTone';
import Grid from '@material-ui/core/Grid';
import LinearLoading from '../../components/LinearLoading';
import EditarIcon from '../../assets/ico_edit.svg';
import ValidateInput from '../../components/ValidateInputGeneric';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: 'red',
    },
});
const DialogTitle = withStyles(styles)((props) => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon color='red' />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});
const DialogContent = withStyles((theme) => ({
    root: {padding: theme.spacing(1)},
}))(MuiDialogContent);
const DialogActions = withStyles((theme) => ({
    root: {margin: 0, padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const App = (props) => {
    const [open, setOpen] = React.useState(false);
    const [load, setLoad] = React.useState(false);
    const [openIndicadores, setIndicadores] = React.useState(false);
    const [openUsuarios, setUsuarios] = React.useState(false);
    const [openRoles, setRoles] = React.useState(false);
    const [openParamTemplate, setParamTemplate] = React.useState(false);
    const [openDominios, setDominios] = React.useState(false);
    const [openNotificaciones, setNotificaciones] = React.useState(false);
    const [openInbox, setInbox] = React.useState(false);
    const [openTemplates, setTemplates] = React.useState(false);
    const [openContratos, setContratos] = React.useState(false);
    const [rols, setRols] = React.useState('');
    const [descripcion, setDescripcion] = React.useState('');
    const [rolRolInfo, setRolInfo] = useState(props);
    const [rolState, setRolState] = useState(props);
    const [touched, setTouched] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    useEffect(() => {
        setRolInfo(props.data);
    }, [props]);

    useEffect(() => {
        setRolState(props.data.secciones);
    }, [props]);

    const clearState = () => {
        setRols('');
        setDescripcion('');
    };
    const handleChangeIndicador = (event) => {
        setRolInfo({...rolState, [event.target.name]: event.target.checked});
    };
    const change = (key, value) => {
        const tempData = {...rolRolInfo};
        tempData[key] = value;
        setRolInfo(tempData); 
    };
    const onChange = (e) => {
        if (e.target.type === 'checkbox') {
            const changedReason = e.target.getAttribute('name');
            setRolState({...rolState, autorizarIndicadores:
                {...rolState.autorizarIndicadores, [changedReason]:
                    !rolState.autorizarIndicadores[changedReason]}});
        }
    };
    const onChangeB = (e) => {
        if (e.target.type === 'checkbox') {
            const changedReason = e.target.getAttribute('name');
            setRolState({...rolState, autorizarUsuarios:
                {...rolState.autorizarUsuarios, [changedReason]:
                    !rolState.autorizarUsuarios[changedReason]}});
        }
    };
    const onChangeC = (e) => {
        if (e.target.type === 'checkbox') {
            const changedReason = e.target.getAttribute('name');
            setRolState({...rolState, autorizarRoles:
                {...rolState.autorizarRoles, [changedReason]:
                    !rolState.autorizarRoles[changedReason]}});
        }
    };
    const onChangeD = (e) => {
        if (e.target.type === 'checkbox') {
            const changedReason = e.target.getAttribute('name');
            setRolState({...rolState, autorizarParamTemplates:
                {...rolState.autorizarParamTemplates, [changedReason]:
                    !rolState.autorizarParamTemplates[changedReason]}});
        }
    };
    const onChangeE = (e) => {
        if (e.target.type === 'checkbox') {
            const changedReason = e.target.getAttribute('name');
            setRolState({...rolState, autorizarDominios:
                {...rolState.autorizarDominios, [changedReason]:
                    !rolState.autorizarDominios[changedReason]}});
        }
    };
    const onChangeF = (e) => {
        if (e.target.type === 'checkbox') {
            const changedReason = e.target.getAttribute('name');
            setRolState({...rolState, autorizarNotificaciones:
                {...rolState.autorizarNotificaciones, [changedReason]:
                    !rolState.autorizarNotificaciones[changedReason]}});
        }
    };
    const onChangeG = (e) => {
        if (e.target.type === 'checkbox') {
            const changedReason = e.target.getAttribute('name');
            setRolState({...rolState, autorizarInbox:
                {...rolState.autorizarInbox, [changedReason]:
                    !rolState.autorizarInbox[changedReason]}});
        }
    };
    const onChangeH = (e) => {
        if (e.target.type === 'checkbox') {
            const changedReason = e.target.getAttribute('name');
            setRolState({...rolState, autorizarTemplates:
                {...rolState.autorizarTemplates, [changedReason]:
                    !rolState.autorizarTemplates[changedReason]}});
        }
    };
    const onChangeI = (e) => {
        if (e.target.type === 'checkbox') {
            const changedReason = e.target.getAttribute('name');
            setRolState({...rolState, autorizarContratos:
                {...rolState.autorizarContratos, [changedReason]:
                    !rolState.autorizarContratos[changedReason]}});
        }
    };
    // OPEN-CLOSE MENU SECCIONES
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenIndicadores = () => setIndicadores(true);
    const handleCloseIndicadores = () => setIndicadores(false);
    const handleOpenUsuarios = () => setUsuarios(true);
    const handleCloseUsuarios = () => setUsuarios(false);
    const handleOpenRoles = () => setRoles(true);
    const handleCloseRoles = () => setRoles(false);
    const handleOpenParamTemplate = () => setParamTemplate(true);
    const handleCloseParamTemplate = () => setParamTemplate(false);
    const handleOpenDominios = () => setDominios(true);
    const handleCloseDominios = () => setDominios(false);
    const handleOpenNotificaciones = () => setNotificaciones(true);
    const handleCloseNotificaciones = () => setNotificaciones(false);
    const handleOpenInbox = () => setInbox(true);
    const handleCloseInbox = () => setInbox(false);
    const handleOpenContratos = () => setContratos(true);
    const handleCloseContratos = () => setContratos(false);
    const handleOpenTemplate = () => setTemplates(true);
    const handleCloseTemplate = () => setTemplates(false);

    const saveUser = () => {
        setLoad(true);
        const url = '/api/v1/admin/rols';
        axios({
            method: 'put', url: url,
            data: {
                'secciones': {
                    'autorizarContratos': {
                        'cancelar': rolState.autorizarContratos.cancelar,
                        'crear': rolState.autorizarContratos.crear,
                        'descargar': rolState.autorizarContratos.descargar,
                        'listar': rolState.autorizarContratos.listar,
                        'ver': rolState.autorizarContratos.ver,
                        'verHistorial': rolState.autorizarContratos.verHistorial,
                        'verTrazabilidad': rolState.autorizarContratos.verTrazabilidad,
                    },
                    'autorizarDominios': {
                        'crear': rolState.autorizarDominios.crear,
                        'editar': rolState.autorizarDominios.editar,
                        'eliminar': rolState.autorizarDominios.eliminar,
                    },
                    'autorizarInbox': {
                        'responderMensajes': rolState.autorizarInbox.responderMensajes,
                        'verContratos': rolState.autorizarInbox.verContratos,
                        'verMensajes': rolState.autorizarInbox.verMensajes,
                    },
                    'autorizarIndicadores': {
                        'graficaCancelados': rolState.autorizarIndicadores.graficaCancelados,
                        'graficaFirmados': rolState.autorizarIndicadores.graficaFirmados,
                        'graficaVGeneral': rolState.autorizarIndicadores.graficaVGeneral,
                        'ultimosActivos': rolState.autorizarIndicadores.ultimosActivos,
                        'ultimosCancelados': rolState.autorizarIndicadores.ultimosCancelados,
                        'ultimosFirma': rolState.autorizarIndicadores.ultimosFirma,
                        'ultimosRevision': rolState.autorizarIndicadores.ultimosRevision,
                    },
                    'autorizarNotificaciones': {
                        'ver': rolState.autorizarNotificaciones.ver,
                    },
                    'autorizarParamTemplates': {
                        'ver': rolState.autorizarParamTemplates.ver,
                    },
                    'autorizarRoles': {
                        'crear': rolState.autorizarRoles.crear,
                        'editar': rolState.autorizarRoles.editar,
                        'eliminar': rolState.autorizarRoles.eliminar,
                    },
                    'autorizarTemplates': {
                        'crear': rolState.autorizarTemplates.crear,
                        'editar': rolState.autorizarTemplates.editar,
                        'eliminar': rolState.autorizarTemplates.eliminar,
                        'listar': rolState.autorizarTemplates.listar,
                        'ver': rolState.autorizarTemplates.ver,
                    },
                    'autorizarUsuarios': {
                        'crear': rolState.autorizarUsuarios.crear,
                        'editar': rolState.autorizarUsuarios.editar,
                        'eliminar': rolState.autorizarUsuarios.eliminar,
                        'listar': rolState.autorizarUsuarios.listar,
                        'ver': rolState.autorizarUsuarios.ver,
                    }},
                'description': rolRolInfo.description,
                'id': rolRolInfo.id,
                'name': rolRolInfo.name,
            },
        }).then((response) => {
            setLoad(false);
            setOpen(false);
            handlePopulate();
            clearState();
        }).catch(handleError);
    };
    const handlePopulate = () => {
        setTouched(false);
        // eslint-disable-next-line react/prop-types
        props.refresh();
    };
    const handleError = (error) => {
        setLoad(false);
        setTouched(true);
        const data = error.response.data;
        const errorMessage = data && Array.isArray(data.errors) ? data.errors.map((e) => e.message.split(',')): null;
        setErrorMessage(errorMessage ? errorMessage : error.message);
    };
    const style = {
        container: {
            height: 'auto', width: '55%', marginTop: '50px', backgroundColor: 'whitesmoke',
        },
        containers: {
            height: 'auto', width: 'auto', backgroundColor: 'white', padding: '1rem',
        },
        labelCustom: {
            fontSize: '9pt', color: '#838d93', margin: '10px',
        }, configSelect: {
            background: 'white', outline: 'none', border: '.5px solid #C1C3C2',
            borderRadius: '6px', fontSize: '12px', height: '30px', padding: '3px',
            width: '260px',
        }, configSelect2: {
            background: 'white', outline: 'none', border: '.5px solid #C1C3C2',
            borderRadius: '6px', fontSize: '12px', height: '50px', padding: '3px',
            width: '260px',
        },
        configTextArea: {
            background: 'white', outline: 'none', border: '.5px solid #C1C3C2', borderRadius: '6px',
            fontSize: '14px', padding: '5px', width: '260px',
        }, button: {
            fontSize: '10px', textAling: 'center', backgroundColor: 'white',
        }, buttonClose: {backgroundColor: '#F5F5F5'},
    };
    return (
        <div className="App">
            <Button onClick={handleClickOpen}>
                <img style={{width: '25px'}} src={EditarIcon} alt=''></img>
            </Button>
            <div>
                <Dialog onClose={handleClose} fullWidth={true}
                    maxWidth={'sm'} aria-labelledby="customized-dialog-title" open={open}>
                    <DialogTitle style={{backgroundColor: 'whitesmoke'}} id="customized-dialog-title" onClose={handleClose}>
         Editar Rol
                    </DialogTitle>
                    <LinearLoading show={load} delay={15}/>

                    <DialogContent style={{backgroundColor: 'whitesmoke'}} dividers>

                        <Typography gutterBottom>
                            <List>
                                <div style={{marginTop: '4rem'}}>
                                    <div style={{paddingBottom: '2rem', paddingLeft: '.3rem'}}>
                                        <label style={{paddingRight: '1.8rem', paddingLeft: '1.5rem'}}>
                                    Nombre Rol: </label>
                                        <ValidateInput invalid={touched && !rolRolInfo.name} message='Este campo es requerido'><input style={style.configSelect} name="name" type='text'
                                            value={rolRolInfo.name} onChange={(e)=>change('name', e.target.value)}></input></ValidateInput>
                                    </div>
                                    <div style={{paddingBottom: '2rem'}}>
                                        <label style={{paddingRight: '1.8rem', paddingLeft: '2rem'}}>
                                    Descripción:
                                        </label>
                                        <textarea rows="1" cols="10" style={style.configSelect2} name="descripcion" type='text'
                                            value={rolRolInfo.description} onChange={(e)=>change('description', e.target.value)}></textarea>
                                    </div>
                                    <div style={{paddingBottom: '2rem'}}>
                                        <div style={{float: 'left', paddingLeft: '-1rem'}}>
                                            <label style={{paddingBottom: '10rem', paddingRight: '2rem', paddingLeft: '2rem'}}>
                                    Secciones:
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div style={{paddingLeft: '0rem', paddingBottom: '2rem'}}>
                                    <Grid container>
                                        <Grid style={{paddingLeft: '1rem', paddingRight: '1rem'}} item xs={6}>
                                            <Button variant="outlined" style={style.button} fullWidth='true' onClick={handleOpenIndicadores}>
                                            Indicadores de Seguimiento <Arrow/>
                                            </Button>
                                            {openIndicadores ?
                                                <div id='Indicadores de Seguimiento'style={{paddingLeft: '.1rem'}}>
                                                    <Paper style={style.containers} className="ui container">
                                                        <div style={{fontSize: '9px'}}>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarIndicadores.graficaVGeneral} onChange={onChange} name="graficaVGeneral" />}
                                                                label="Gráfica Vista General"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarIndicadores.graficaFirmados} onChange={onChange} name="graficaFirmados" />}
                                                                label="Gráfica Firmados por cliente"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarIndicadores.graficaCancelados} onChange={onChange} name="graficaCancelados" />}
                                                                label="Gráfica Cancelados por cliente"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarIndicadores.ultimosActivos} onChange={onChange} name="ultimosActivos" />}
                                                                label="Ultimos en activos"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarIndicadores.ultimosFirma} onChange={onChange} name="ultimosFirma" />}
                                                                label="Ultimos en firma"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarIndicadores.ultimosRevision} onChange={onChange} name="ultimosRevision" />}
                                                                label="Ultimos en revisión"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarIndicadores.ultimosCancelados} onChange={onChange} name="ultimosCancelados" />}
                                                                label="Ultimos cancelados"
                                                            />
                                                            <Button fullWidth={true} style={style.buttonClose} fontSize="large" onClick={handleCloseIndicadores}>
                                                                <ArrowUp style={{color: 'black'}}color="secondary"/>
                                                            </Button>
                                                        </div>

                                                    </Paper>
                                                </div>:''}
                                        </Grid>
                                        <Grid item style={{paddingRight: '1rem', paddingLeft: '1rem'}} xs={6}>
                                            <Button variant="outlined" style={style.button} fullWidth='true' onClick={handleOpenUsuarios}>
                                            Administración de Usuarios <Arrow/>
                                            </Button>
                                            {openUsuarios ?
                                                <div id='Administración usuarios'style={{paddingLeft: '.1rem'}}>
                                                    <Paper style={style.containers} className="ui container">
                                                        <div>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarUsuarios.listar} onChange={onChangeB} name="listar" />}
                                                                label="Ver Usuarios"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarUsuarios.crear} onChange={onChangeB} name="crear" />}
                                                                label="Crear Usuarios"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarUsuarios.ver} onChange={onChangeB} name="ver" />}
                                                                label="Editar Usuarios"
                                                            /><p/>

                                                            <Button fullWidth={true} style={style.buttonClose} fontSize="large" onClick={handleCloseUsuarios}>
                                                                <ArrowUp style={{color: 'black'}}color="gray"/>
                                                            </Button>
                                                        </div>

                                                    </Paper>
                                                </div>:''}
                                        </Grid>
                                    </Grid>
                                </div>
                                <div style={{paddingBottom: '2rem'}}>
                                    <Grid container>
                                        <Grid style={{paddingLeft: '1rem', paddingRight: '1rem'}} item xs={6}>
                                            <Button variant="outlined" style={style.button} fullWidth='true' onClick={handleOpenRoles}>
                                            Administración de Roles <Arrow/>
                                            </Button>
                                            {openRoles ?
                                                <div id='Administración roles'style={{paddingLeft: '.1rem'}}>
                                                    <Paper style={style.containers} className="ui container">
                                                        <div>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarRoles.crear} onChange={onChangeC} name="crear" />}
                                                                label="Crear nuevo"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarRoles.editar} onChange={onChangeC} name="editar" />}
                                                                label="Editar"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarRoles.eliminar} onChange={onChangeC} name="eliminar" />}
                                                                label="Eliminar"
                                                            /><p/>
                                                            <Button fullWidth={true} style={style.buttonClose} fontSize="large" onClick={handleCloseRoles}>
                                                                <ArrowUp style={{color: 'black'}}color="secondary"/>
                                                            </Button>
                                                        </div>

                                                    </Paper>
                                                </div>:''}
                                        </Grid>
                                        <Grid style={{paddingRight: '1rem', paddingLeft: '1rem'}} item xs={6}>
                                            <Button variant="outlined" style={style.button} fullWidth='true' onClick={handleOpenParamTemplate}>
                                            Párametros de Templates <Arrow/>
                                            </Button>
                                            {openParamTemplate ?
                                                <div id='Párametros Templates'style={{paddingLeft: '.1rem'}}>
                                                    <Paper style={style.containers} className="ui container">
                                                        <div>
                                                            {/* <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarParamTemplates.graficaVGeneral} onChange={onChange} name="graficaVGeneral" />}
                                                                label="Seleccionar todo"
                                                            /><p/>*/}
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarParamTemplates.ver} onChange={onChangeD} name="ver" />}
                                                                label="Ver Párametros"
                                                            /><p/>
                                                            <Button fullWidth={true} style={style.buttonClose} fontSize="large" onClick={handleCloseParamTemplate}>
                                                                <ArrowUp style={{color: 'black'}}color="secondary"/>
                                                            </Button>
                                                        </div>

                                                    </Paper>
                                                </div>:''}
                                        </Grid>
                                    </Grid>
                                </div>
                                <div style={{paddingBottom: '2rem'}}>
                                    <Grid container>
                                        <Grid style={{paddingRight: '1rem', paddingLeft: '1rem'}} item xs={6}>
                                            <Button variant="outlined" style={style.button} fullWidth='true' onClick={handleOpenDominios}>
                                            Paramétrizacion de dominios <Arrow/>
                                            </Button>
                                            {openDominios ?
                                                <div id='Paramétrizacion de dominios'style={{paddingLeft: '.1rem'}}>
                                                    <Paper style={style.containers} className="ui container">
                                                        <div>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarDominios.crear} onChange={onChangeE} name="crear" />}
                                                                label="Crear nuevo"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarDominios.editar} onChange={onChangeE} name="editar" />}
                                                                label="Editar"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarDominios.eliminar} onChange={onChangeE} name="eliminar" />}
                                                                label="Eliminar"
                                                            /><p/>
                                                            <Button fullWidth={true} style={style.buttonClose} fontSize="large" onClick={handleCloseDominios}>
                                                                <ArrowUp style={{color: 'black'}}color="secondary"/>
                                                            </Button>
                                                        </div>

                                                    </Paper>
                                                </div>:''}
                                        </Grid>
                                        <Grid style={{paddingRight: '1rem', paddingLeft: '1rem'}} item xs={6}>
                                            <Button variant="outlined" style={style.button} fullWidth='true' onClick={handleOpenNotificaciones}>
                                            Notificaciones <Arrow/>
                                            </Button>
                                            {openNotificaciones ?
                                                <div id='Notificaciones'style={{paddingLeft: '.1rem'}}>
                                                    <Paper style={style.containers} className="ui container">
                                                        <div>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarNotificaciones.ver} onChange={onChangeF} name="ver" />}
                                                                label="Ver Notificaciones"
                                                            /><p/>
                                                            <Button fullWidth={true} style={style.buttonClose} fontSize="large" onClick={handleCloseNotificaciones}>
                                                                <ArrowUp style={{color: 'black'}}color="secondary"/>
                                                            </Button>
                                                        </div>

                                                    </Paper>
                                                </div>:''}
                                        </Grid>
                                    </Grid>
                                </div>
                                <div style={{paddingBottom: '2rem'}}>
                                    <Grid container>
                                        <Grid style={{paddingRight: '1rem', paddingLeft: '1rem'}} item xs={6}>
                                            <Button variant="outlined" style={style.button} fullWidth='true' onClick={handleOpenInbox}>
                                            Inbox <Arrow/>
                                            </Button>
                                            {openInbox ?
                                                <div id='Inbox'style={{paddingLeft: '.1rem'}}>
                                                    <Paper style={style.containers} className="ui container">
                                                        <div>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarInbox.verMensajes} onChange={onChangeG} name="verMensajes" />}
                                                                label="Mensajes"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarInbox.responderMensajes} onChange={onChangeG} name="responderMensajes" />}
                                                                label="Responder"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarInbox.verContratos} onChange={onChangeG} name="verContratos" />}
                                                                label="Ver Contrato"
                                                            /><p/>
                                                            <Button fullWidth={true} style={style.buttonClose} fontSize="large" onClick={handleCloseInbox}>
                                                                <ArrowUp style={{color: 'black'}}color="secondary"/>
                                                            </Button>
                                                        </div>

                                                    </Paper>
                                                </div>:''}
                                        </Grid>
                                        <Grid style={{paddingRight: '1rem', paddingLeft: '1rem'}} item xs={6}>
                                            <Button variant="outlined" style={style.button} fullWidth='true' onClick={handleOpenTemplate}>
                                            Templates <Arrow/>
                                            </Button>
                                            {openTemplates ?
                                                <div id='Templates'style={{paddingLeft: '.1rem'}}>
                                                    <Paper style={style.containers} className="ui container">
                                                        <div>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarTemplates.crear} onChange={onChangeH} name="crear" />}
                                                                label="Nuevo Usuario"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarTemplates.listar} onChange={onChangeH} name="listar" />}
                                                                label="Ver Usuarios"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarTemplates.editar} onChange={onChangeH} name="editar" />}
                                                                label="Editar"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarTemplates.eliminar} onChange={onChangeH} name="eliminar" />}
                                                                label="Eliminar"
                                                            /><p/>
                                                            <Button fullWidth={true} style={style.buttonClose} fontSize="large" onClick={handleCloseTemplate}>
                                                                <ArrowUp style={{color: 'black'}}color="secondary"/>
                                                            </Button>
                                                        </div>

                                                    </Paper>
                                                </div>:''}
                                        </Grid>
                                    </Grid>
                                </div>
                                <div style={{paddingBottom: '2rem'}}>
                                    <Grid container>
                                        <Grid style={{paddingRight: '1rem', paddingLeft: '1rem'}} item xs={6}>
                                            <Button variant="outlined" style={style.button} fullWidth='true' onClick={handleOpenContratos}>
                                            Contratos <Arrow/>
                                            </Button>
                                            {openContratos ?
                                                <div id='Contratos' style={{paddingLeft: '.1rem'}}>
                                                    <Paper style={style.containers} className="ui container">
                                                        <div>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarContratos.crear} onChange={onChangeI} name="crear" />}
                                                                label="Nuevo Contrato"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarContratos.ver} onChange={onChangeI} name="ver" />}
                                                                label="Contratos"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarContratos.verTrazabilidad} onChange={onChangeI} name="verTrazabilidad" />}
                                                                label="Trazabilidad"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarContratos.verHistorial} onChange={onChangeI} name="verHistorial" />}
                                                                label="Historial"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarContratos.listar} onChange={onChangeI} name="listar" />}
                                                                label="Ver Contrato"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarContratos.cancelar} onChange={onChangeI} name="cancelar" />}
                                                                label="Cancelar"
                                                            /><p/>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={rolState.autorizarContratos.descargar} onChange={onChangeI} name="descargar" />}
                                                                label="Descargar"
                                                            /><p/>
                                                            <Button fullWidth={true} style={style.buttonClose} fontSize="large" onClick={handleCloseContratos}>
                                                                <ArrowUp style={{color: 'black'}}color="secondary"/>
                                                            </Button>
                                                        </div>
                                                    </Paper>
                                                </div>:''}
                                        </Grid>
                                    </Grid>
                                </div>
                            </List>
                        </Typography>
                        {errorMessage &&
            <Alert className="top"
                severity='error'
                onClose={() => setErrorMessage(null)}>
                { errorMessage[0].map((re, idx) => {
                    return <li key={idx}>{re}</li>;
                }) }
            </Alert>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button style={{backgroundColor: 'whitesmoke'}} autoFocus onClick={saveUser} color="primary">
            Guardar Rol
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};
App.propTypes = {
    refresh: PropTypes.object,
    close: PropTypes.bool,
    data: PropTypes.object,
};
export default App;
