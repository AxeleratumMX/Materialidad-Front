import React from 'react';
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
import ValidateInput from '../../components/ValidateInputGeneric';
import Alert from '@material-ui/lab/Alert';

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

export default function CustomizedDialogs(props) {
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
    const [touched, setTouched] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const [indicadores, setIndicador] = React.useState({
        checkedA: false, checkedB: false, checkedC: false,
        checkedD: false, checkedE: false, checkedF: false,
        checkedG: false, checkedH: false,
    });
    const [adminUsuarios, setAdminUsuario] = React.useState({
        checkedA: false, checkedB: false, checkedC: false,
        checkedD: false, checkedE: false, checkedF: false,
        checkedG: false, checkedH: false,
    });
    const [adminRoles, setAdminRole] = React.useState({
        checkedA: false, checkedB: false, checkedC: false,
        checkedD: false, checkedE: false, checkedF: false,
        checkedG: false, checkedH: false,
    });
    const [parametrosTemplate, setParametrosTemplate] = React.useState({
        checkedA: false, checkedB: false, checkedC: false,
        checkedD: false, checkedE: false, checkedF: false,
        checkedG: false, checkedH: false,
    });
    const [parametrosDominios, setParametrosDominios] = React.useState({
        checkedA: false, checkedB: false, checkedC: false,
        checkedD: false, checkedE: false, checkedF: false,
        checkedG: false, checkedH: false,
    });
    const [notificaciones, setNotificacion] = React.useState({
        checkedA: false, checkedB: false, checkedC: false,
        checkedD: false, checkedE: false, checkedF: false,
        checkedG: false, checkedH: false,
    });
    const [inbox, setInboxs] = React.useState({
        checkedA: false, checkedB: false, checkedC: false,
        checkedD: false, checkedE: false, checkedF: false,
        checkedG: false, checkedH: false,
    });
    const [template, setTemplate] = React.useState({
        checkedA: false, checkedB: false, checkedC: false,
        checkedD: false, checkedE: false, checkedF: false,
        checkedG: false, checkedH: false,
    });
    const [contratros, setContrato] = React.useState({
        checkedA: false, checkedB: false, checkedC: false,
        checkedD: false, checkedE: false, checkedF: false,
        checkedG: false, checkedH: false,
    });
    // Set state by checkbox
    const handleChangeIndicador = (event) => {
        setIndicador({...indicadores, [event.target.name]: event.target.checked});
    };
    const handleChangeAdminUsuarios = (event) => {
        setAdminUsuario({...adminUsuarios, [event.target.name]: event.target.checked});
    };
    const handleChangeAdminRoles = (event) => {
        setAdminRole({...adminRoles, [event.target.name]: event.target.checked});
    };
    const handleChangeparametrosTemplate = (event) => {
        setParametrosTemplate({...parametrosTemplate, [event.target.name]: event.target.checked});
    };
    const handleChangeParametrosDominios = (event) => {
        setParametrosDominios({...parametrosDominios, [event.target.name]: event.target.checked});
    };
    const handleChangeNotificaciones = (event) => {
        setNotificacion({...notificaciones, [event.target.name]: event.target.checked});
    };
    const handleChangeInboX = (event) => {
        setInboxs({...inbox, [event.target.name]: event.target.checked});
    };
    const handleChangeTemplate= (event) => {
        setTemplate({...template, [event.target.name]: event.target.checked});
    };
    const handleChangeContrato= (event) => {
        setContrato({...contratros, [event.target.name]: event.target.checked});
    };
    // Set  state
    const handleTexte = (e) => {
        setRols(e.target.value);
    };
    const handleDesc = (e) => {
        setDescripcion(e.target.value);
    };
    const clearState = () => {
        setRols('');
        setDescripcion('');
    };
    const setTrueIndicadores = () => {
        setIndicador({checkedA: true, checkedB: true, checkedC: true,
            checkedD: true, checkedE: true, checkedF: true,
            checkedG: true, checkedH: true});
    };
    const setTrueAdminUsuario = () => {
        setAdminUsuario({checkedA: true, checkedB: true, checkedC: true,
            checkedD: true, checkedE: true, checkedF: true,
            checkedG: true, checkedH: true});
    };
    const setTrueAdminRole = () => {
        setAdminRole({checkedA: true, checkedB: true, checkedC: true,
            checkedD: true, checkedE: true, checkedF: true,
            checkedG: true, checkedH: true});
    };
    const setTrueParametrosTemplate = () => {
        setParametrosTemplate({checkedA: true, checkedB: true, checkedC: true,
            checkedD: true, checkedE: true, checkedF: true,
            checkedG: true, checkedH: true});
    };
    const setTrueParametrosDominios= () => {
        setParametrosDominios({checkedA: true, checkedB: true, checkedC: true,
            checkedD: true, checkedE: true, checkedF: true,
            checkedG: true, checkedH: true});
    };
    const setTrueNotificacion= () => {
        setNotificacion({checkedA: true, checkedB: true, checkedC: true,
            checkedD: true, checkedE: true, checkedF: true,
            checkedG: true, checkedH: true});
    };
    const setTrueInboxs= () => {
        setInboxs({checkedA: true, checkedB: true, checkedC: true,
            checkedD: true, checkedE: true, checkedF: true,
            checkedG: true, checkedH: true});
    };
    const setTrueTemplate= () => {
        setTemplate({checkedA: true, checkedB: true, checkedC: true,
            checkedD: true, checkedE: true, checkedF: true,
            checkedG: true, checkedH: true});
    };
    const setTrueContrato= () => {
        setContrato({checkedA: true, checkedB: true, checkedC: true,
            checkedD: true, checkedE: true, checkedF: true,
            checkedG: true, checkedH: true});
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
            method: 'post', url: url,
            data: {
                'secciones': {
                    'autorizarContratos': {
                        'crear': contratros.checkedB,
                        'listar': contratros.checkedC,
                        'verTrazabilidad': contratros.checkedD,
                        'verHistorial': contratros.checkedE,
                        'ver': contratros.checkedF,
                        'cancelar': contratros.checkedG,
                        'descargar': contratros.checkedH,

                    },
                    'autorizarDominios': {
                        'crear': parametrosDominios.checkedB,
                        'editar': parametrosDominios.checkedC,
                        'eliminar': parametrosDominios.checkedD,
                    },
                    'autorizarInbox': {
                        'responderMensajes': inbox.checkedB,
                        'verContratos': inbox.checkedC,
                        'verMensajes': inbox.checkedD,
                    },
                    'autorizarIndicadores': {
                        'graficaVGeneral': indicadores.checkedB,
                        'graficaFirmados': indicadores.checkedC,
                        'graficaCancelados': indicadores.checkedD,
                        'ultimosActivos': indicadores.checkedE,
                        'ultimosFirma': indicadores.checkedF,
                        'ultimosRevision': indicadores.checkedG,
                        'ultimosCancelados': indicadores.checkedH,

                    },
                    'autorizarNotificaciones': {
                        'ver': notificaciones.checkedB,
                    },
                    'autorizarParamTemplates': {
                        'ver': parametrosTemplate.checkedB,
                    },
                    'autorizarRoles': {
                        'crear': adminRoles.checkedB,
                        'editar': adminRoles.checkedC,
                        'eliminar': adminRoles.checkedD,
                    },
                    'autorizarTemplates': {
                        'crear': template.checkedB,
                        'editar': template.checkedC,
                        'eliminar': template.checkedD,
                        'listar': template.checkedE,
                        'ver': template.checkedF,
                    },
                    'autorizarUsuarios': {
                        'crear': adminUsuarios.checkedB,
                        'ver': adminUsuarios.checkedC,
                        'editar': adminUsuarios.checkedD,
                        'eliminar': adminUsuarios.checkedE,
                        'listar': adminUsuarios.checkedF,
                    },
                },
                'description': descripcion,
                'name': rols,
            },
        }).then((response) => {
            setLoad(false);
            setOpen(false);
            handlePopulate();
            clearState();
        }).catch(handleError);
    };

    const handlePopulate = () => {
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
            borderRadius: '6px', fontSize: '14px', height: '30px', padding: '3px',
            width: '260px',
        }, configSelect2: {
            background: 'white', outline: 'none', border: '.5px solid #C1C3C2',
            borderRadius: '6px', fontSize: '14px', height: '50px', padding: '3px',
            width: '260px',
        },
        configTextArea: {
            background: 'white', outline: 'none', border: '.5px solid #C1C3C2', borderRadius: '6px',
            fontSize: '14px', padding: '5px', width: '260px',
        }, button: {
            fontSize: '10px', textAling: 'center', backgroundColor: 'white',
        }, buttonClose: {backgroundColor: '#F5F5F5'},
    };
    console.log("error",errorMessage);
    return (
        <div>
            <button style={{float: 'left'}} onClick={handleClickOpen}
                className="ui green icon left labeled button">
                <i className="white icon plus"></i>
          Nuevo  Rol
            </button>
            <Dialog onClose={handleClose} fullWidth={true}
                maxWidth={'sm'} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle style={{backgroundColor: 'whitesmoke'}} id="customized-dialog-title" onClose={handleClose}>
          Roles
                </DialogTitle>
                <LinearLoading show={load} delay={15}/>
                <DialogContent style={{backgroundColor: 'whitesmoke'}} dividers>
                    <Typography gutterBottom>
                        <List>
                            <div style={{marginTop: '4rem'}}>
                                <div style={{paddingBottom: '2rem', paddingLeft: '.3rem'}}>
                                    <label style={{paddingRight: '1.8rem', paddingLeft: '1.5rem'}}>
                                    Nombre Rol: </label>
                                    <ValidateInput invalid={touched && !rols} message='Este campo es requerido'><input style={style.configSelect} name="rols" type='text'
                                        value={rols} onChange={handleTexte}></input></ValidateInput>
                                </div>
                                <div style={{paddingBottom: '2rem'}}>
                                    <label style={{paddingRight: '1.8rem', paddingLeft: '2rem'}}>
                                    Descripción:
                                    </label>
                                    <textarea rows="1" cols="10" style={style.configSelect2} name="descripcion" type='text'
                                        value={descripcion} onChange={handleDesc}></textarea>
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
                                                            control={<Checkbox checked={indicadores.checkedA} onChange={setTrueIndicadores} name="checkedA" />}
                                                            label="Seleccionar todo"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={indicadores.checkedB} onChange={handleChangeIndicador} name="checkedB" />}
                                                            label="Gráfica Vista General"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={indicadores.checkedC} onChange={handleChangeIndicador} name="checkedC" />}
                                                            label="Gráfica Firmados por cliente"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={indicadores.checkedD} onChange={handleChangeIndicador} name="checkedD" />}
                                                            label="Gráfica Cancelados por cliente"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={indicadores.checkedE} onChange={handleChangeIndicador} name="checkedE" />}
                                                            label="Ultimos en activos"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={indicadores.checkedF} onChange={handleChangeIndicador} name="checkedF" />}
                                                            label="Ultimos en firma"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={indicadores.checkedG} onChange={handleChangeIndicador} name="checkedG" />}
                                                            label="Ultimos en revisión"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={indicadores.checkedH} onChange={handleChangeIndicador} name="checkedH" />}
                                                            label="Ultimos cancelados"
                                                        />
                                                        <Button fullWidth='true' style={style.buttonClose} onClick={handleCloseIndicadores}>
                                                            <ArrowUp style={{color: 'black'}} color="secondary"/>
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
                                                            control={<Checkbox checked={adminUsuarios.checkedA} onChange={setTrueAdminUsuario} name="checkedA" />}
                                                            label="Seleccionar todo"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={adminUsuarios.checkedB} onChange={handleChangeAdminUsuarios} name="checkedB" />}
                                                            label="Nuevo Usuario"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={adminUsuarios.checkedC} onChange={handleChangeAdminUsuarios} name="checkedC" />}
                                                            label="Ver Usuarios"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={adminUsuarios.checkedD} onChange={handleChangeAdminUsuarios} name="checkedD" />}
                                                            label="Editar"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={adminUsuarios.checkedE} onChange={handleChangeAdminUsuarios} name="checkedE" />}
                                                            label="Eliminar"
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
                                                            control={<Checkbox checked={adminRoles.checkedA} onChange={setTrueAdminRole} name="checkedA" />}
                                                            label="Seleccionar todo"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={adminRoles.checkedB} onChange={handleChangeAdminRoles} name="checkedB" />}
                                                            label="Crear nuevo"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={adminRoles.checkedC} onChange={handleChangeAdminRoles} name="checkedC" />}
                                                            label="Editar"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={adminRoles.checkedD} onChange={handleChangeAdminRoles} name="checkedD" />}
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
                                                        <FormControlLabel
                                                            control={<Checkbox checked={parametrosTemplate.checkedA} onChange={setTrueParametrosTemplate} name="checkedA" />}
                                                            label="Seleccionar todo"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={parametrosTemplate.checkedB} onChange={handleChangeparametrosTemplate} name="checkedB" />}
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
                                                            control={<Checkbox checked={parametrosDominios.checkedA} onChange={setTrueParametrosDominios} name="checkedA" />}
                                                            label="Seleccionar todo"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={parametrosDominios.checkedB} onChange={handleChangeParametrosDominios} name="checkedB" />}
                                                            label="Crear nuevo"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={parametrosDominios.checkedC} onChange={handleChangeParametrosDominios} name="checkedC" />}
                                                            label="Editar"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={parametrosDominios.checkedD} onChange={handleChangeParametrosDominios} name="checkedD" />}
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
                                                            control={<Checkbox checked={notificaciones.checkedA} onChange={setTrueNotificacion} name="checkedA" />}
                                                            label="Seleccionar todo"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={notificaciones.checkedB} onChange={handleChangeNotificaciones} name="checkedB" />}
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
                                                            control={<Checkbox checked={inbox.checkedA} onChange={setTrueInboxs} name="checkedA" />}
                                                            label="Seleccionar todo"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={inbox.checkedB} onChange={handleChangeInboX} name="checkedB" />}
                                                            label="Mensajes"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={inbox.checkedC} onChange={handleChangeInboX} name="checkedC" />}
                                                            label="Responder"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={inbox.checkedD} onChange={handleChangeInboX} name="checkedD" />}
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
                                                            control={<Checkbox checked={template.checkedA} onChange={setTrueTemplate} name="checkedA" />}
                                                            label="Seleccionar todo"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={template.checkedB} onChange={handleChangeTemplate} name="checkedB" />}
                                                            label="Nuevo Usuario"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={template.checkedC} onChange={handleChangeTemplate} name="checkedC" />}
                                                            label="Ver Usuarios"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={template.checkedD} onChange={handleChangeTemplate} name="checkedD" />}
                                                            label="Editar"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={template.checkedE} onChange={handleChangeTemplate} name="checkedE" />}
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
                                                            control={<Checkbox checked={contratros.checkedA} onChange={setTrueContrato} name="checkedA" />}
                                                            label="Seleccionar todo"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={contratros.checkedB} onChange={handleChangeContrato} name="checkedB" />}
                                                            label="Nuevo Contrato"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={contratros.checkedC} onChange={handleChangeContrato} name="checkedC" />}
                                                            label="Contratos"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={contratros.checkedD} onChange={handleChangeContrato} name="checkedD" />}
                                                            label="Trazabilidad"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={contratros.checkedE} onChange={handleChangeContrato} name="checkedE" />}
                                                            label="Historial"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={contratros.checkedF} onChange={handleChangeContrato} name="checkedF" />}
                                                            label="Ver Contrato"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={contratros.checkedG} onChange={handleChangeContrato} name="checkedG" />}
                                                            label="Cancelar"
                                                        /><p/>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={contratros.checkedH} onChange={handleChangeContrato} name="checkedH" />}
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
                <DialogActions style={{backgroundColor: 'whitesmoke'}}>
                    <Button autoFocus onClick={saveUser} color="primary">
            Guardar Rol
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

