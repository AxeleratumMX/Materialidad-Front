import React, { useState, useEffect } from "react";
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Arrow from '@material-ui/icons/ArrowDropDownOutlined';
import ArrowUp from '@material-ui/icons/ArrowDropUpTwoTone';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative', backgroundColor: '#c8354e',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));
// eslint-disable-next-line react/display-name
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export function Take() {

};


export default function FullScreenDialog(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [openIndicadores, setIndicadores] = React.useState(false);
    const [openUsuarios, setUsuarios] = React.useState(false);
    const [openRoles, setRoles] = React.useState(false);
    const [openParamTemplate, setParamTemplate] = React.useState(false);
    const [openDominios, setDominios] = React.useState(false);
    const [openNotificaciones, setNotificaciones] = React.useState(false);
    const [openInbox, setInbox] = React.useState(false);
    const [openTemplates, setTemplates] = React.useState(false);
    const [openContratos, setContratos] = React.useState(false);

    const [rol, setRol] = React.useState('');
    
    const [checked, setChecked] = React.useState(true);
    const [state, setState] = React.useState({
        checkedA: true,
        checkedB: true,
        checkedC: true,
        checkedD: true,
        checkedE: true,
        checkedF: true,
        checkedG: true,
    });
    const [indicadores, setIndicador] = React.useState({
        checkedA: true,
        checkedB: true,
        checkedC: true,
        checkedD: true,
        checkedE: true,
        checkedF: true,
        checkedG: true,
    });
    const [adminRoles, setAdminRole] = React.useState({
        checkedA: true,
        checkedB: true,
        checkedC: true,
        checkedD: true,
        checkedE: true,
        checkedF: true,
        checkedG: true,
    });
    const [parametrosRoles, setParametrosRole] = React.useState({
        checkedA: true,
        checkedB: true,
        checkedC: true,
        checkedD: true,
        checkedE: true,
        checkedF: true,
        checkedG: true,
    });
    const [inbox, setInboxs] = React.useState({
        checkedA: true,
        checkedB: true,
        checkedC: true,
        checkedD: true,
        checkedE: true,
        checkedF: true,
        checkedG: true,
    });
    const [contratros, setContrato] = React.useState({
        checkedA: true,
        checkedB: true,
        checkedC: true,
        checkedD: true,
        checkedE: true,
        checkedF: true,
        checkedG: true,
    });
    const [adminUsuarios, setAdminUsuario] = React.useState({
        checkedA: true,
        checkedB: true,
        checkedC: true,
        checkedD: true,
        checkedE: true,
        checkedF: true,
        checkedG: true,
    });
    const [parametrosTemplate, setParametrosTemplate] = React.useState({
        checkedA: true,
        checkedB: true,
        checkedC: true,
        checkedD: true,
        checkedE: true,
        checkedF: true,
        checkedG: true,
    });
    const [notificaciones, setNotificacion] = React.useState({
        checkedA: true,
        checkedB: true,
        checkedC: true,
        checkedD: true,
        checkedE: true,
        checkedF: true,
        checkedG: true,
    });


    const handleChange = (event) => {
        setState({...state, [event.target.name]: event.target.checked});
    };
    const handleChanger = (event) => {
        setChecked(event.target.checked);
    };
    // OPEN-CLOSE MENU SECCIONES
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpenIndicadores = () => {
        setIndicadores(true);
    };
    const handleCloseIndicadores = () => {
        setIndicadores(false);
    };
    const handleOpenUsuarios = () => {
        setUsuarios(true);
    };
    const handleCloseUsuarios = () => {
        setUsuarios(false);
    };
    const handleOpenRoles = () => {
        setRoles(true);
    };
    const handleCloseRoles = () => {
        setRoles(false);
    };
    const handleOpenParamTemplate = () => {
        setParamTemplate(true);
    };
    const handleCloseParamTemplate = () => {
        setParamTemplate(false);
    };
    const handleOpenDominios = () => {
        setDominios(true);
    };
    const handleCloseDominios = () => {
        setDominios(false);
    };
    const handleOpenNotificaciones = () => setNotificaciones(true);
    const handleCloseNotificaciones = () => {
        setNotificaciones(false);
    };
    const handleOpenInbox = () => {
        setInbox(true);
    };
    const handleCloseInbox = () => {
        setInbox(false);
    };
    const handleOpenContratos = () => {
        setContratos(true);
    };
    const handleCloseContratos = () => {
        setContratos(false);
    };
    const handleOpenTemplate = () => {
        setTemplates(true);
    };
    const handleCloseTemplate = () => {
        setTemplates(false);
    };

    const handleTexte = (e) => {
        setRol(e.target.value);
    };

    const style = {
        container: {
            height: 'auto', width: '85%', marginTop: '50px', backgroundColor: 'whitesmoke',
        },
        containers: {
            height: 'auto', width: 'auto', marginTop: '2px', backgroundColor: 'white', padding: '1rem',
        },
        labelCustom: {
            fontSize: '9pt', color: '#838d93', margin: '10px',
        }, configSelect: {
            background: 'white', outline: 'none', border: '1.5px solid #C1C3C2',
            borderRadius: '6px', fontSize: '14px', height: '30px', padding: '5px',
            width: '360px', color: '#C1C3C2',
        },
        configSelectSpace: {
            background: 'white', outline: 'none', border: '6px solid whitesmoke',
            borderRadius: '50px 20px', fontSize: '14px', height: '30px', padding: '5px',
            paddingRight: '1rem', width: '360px', color: 'gray',
        },
        configTextArea: {
            background: 'white', outline: 'none', border: '1.5px solid #C1C3C2', borderRadius: '10px',
            fontSize: '14px', padding: '5px', width: '360px', color: '#C1C3C2',
        },
    };
    console.log('data', state);
    return (
        <div>
            {/*<Button className="ui green icon left labeled button" onClick={handleClickOpen}>
                <img className='customIcon' src={CancelarIcon}></img>
    </Button>*/}
                        {/*<button style={{float: 'left'}} onClick={handleClickOpen}
                            className="ui green icon left labeled button">
                            <i className="white icon plus"></i>
                                Nuevo  Rol
</button>*/}
            <Dialog fullScreen open={open} onClose={handleClose} style={{backgroundColor: 'whitesmoke'}} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>

                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                                Guardar Rol
                        </Button>
                    </Toolbar>
                </AppBar>
                <h1 style={{marginLeft: '35rem', marginTop: '2rem'}}>Rol</h1>
                <Paper elevation={3} style={style.container} className="ui container">
                    <List>
                        <div style={{marginTop: '10rem'}}>
                            <div style={{paddingBottom: '1rem'}}>
                                <label style={{paddingRight: '1.8rem', paddingLeft: '2rem', fontWeight: 'bold'}}>
                                    Nombre Rol: </label>
                                <input style={style.configSelect} type='text'></input>
                            </div>
                            <div style={{paddingBottom: '1rem'}}>
                                <div>
                                    <label style={{paddingRight: '2rem', paddingLeft: '2rem', paddingTop: '10rem', fontWeight: 'bold'}}>Descripcion: </label>
                                </div>
                                <div style={{paddingLeft: '9.5rem'}}>
                                    <textarea rows="8" cols="30" style={style.configTextArea} type=''></textarea>
                                </div>
                            </div>
                            <div>
                                <div style={{float: 'left', paddingLeft: '1rem'}}>
                                    <label style={{paddingTop: '10rem', paddingRight: '2rem', paddingLeft: '1rem', fontWeight: 'bold'}}>
                                        Secciones:
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div style={{paddingLeft: '0rem', paddingBottom: '2rem'}}>
                            <Grid container>
                                <Grid style={{paddingLeft: '1rem', paddingRight: '1rem'}} item xs={6}>
                                    <Button variant="contained" color="white" fullWidth='true' onClick={handleOpenIndicadores}>
                                            Indicadores de Seguimiento <Arrow/>
                                    </Button>
                                    {openIndicadores ?
                                        <div id='Indicadores de Seguimiento'style={{paddingLeft: '.1rem'}}>
                                            <Paper style={style.containers} className="ui container">
                                                <div>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedB} onChange={handleChange} name="checkedB" />}
                                                        label="Gráfica Vista General"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedC} onChange={handleChange} name="checkedC" />}
                                                        label="Gráfica Firmados por cliente"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedD} onChange={handleChange} name="checkedD" />}
                                                        label="Gráfica Cancelados por cliente"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedE} onChange={handleChange} name="checkedE" />}
                                                        label="Ultimos en activos"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedF} onChange={handleChange} name="checkedF" />}
                                                        label="Ultimos en firma"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedG} onChange={handleChange} name="checkedG" />}
                                                        label="Ultimos en revisión"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedH} onChange={handleChange} name="checkedH" />}
                                                        label="Ultimos cancelados"
                                                    />
                                                    <Button fullWidth={true} fontSize="large" onClick={handleCloseIndicadores}>
                                                        <ArrowUp style={{color: 'black'}}color="secondary"/>
                                                    </Button>
                                                </div>

                                            </Paper>
                                        </div>:''}
                                </Grid>
                                <Grid item style={{paddingRight: '1rem', paddingLeft: '1rem'}} xs={6}>
                                    <Button variant="contained" color="inherit" fullWidth='true' onClick={handleOpenUsuarios}>
                                            Administración de Usuarios <Arrow/>
                                    </Button>
                                    {openUsuarios ?
                                        <div id='Administración usuarios'style={{paddingLeft: '.1rem'}}>
                                            <Paper style={style.containers} className="ui container">
                                                <div>


                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Nuevo Usuario"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Ver Usuarios"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Editar"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Eliminar"
                                                    /><p/>
                                                    <Button fullWidth={true} fontSize="large" onClick={handleCloseUsuarios}>
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
                                    <Button variant="contained" color="gray" fullWidth='true' onClick={handleOpenRoles}>
                                            Administración de Roles <Arrow/>
                                    </Button>
                                    {openRoles ?
                                        <div id='Administración roles'style={{paddingLeft: '.1rem'}}>
                                            <Paper style={style.containers} className="ui container">
                                                <div>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedB} onChange={handleChange} name="checkedB" />}
                                                        label="Crear nuevo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedC} onChange={handleChange} name="checkedC" />}
                                                        label="Editar"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedD} onChange={handleChange} name="checkedD" />}
                                                        label="Eliminar"
                                                    /><p/>
                                                    <Button fullWidth={true} fontSize="large" onClick={handleCloseRoles}>
                                                        <ArrowUp style={{color: 'black'}}color="secondary"/>
                                                    </Button>
                                                </div>

                                            </Paper>
                                        </div>:''}
                                </Grid>
                                <Grid style={{paddingRight: '1rem', paddingLeft: '1rem'}} item xs={6}>
                                    <Button variant="contained" color="gray" fullWidth='true' onClick={handleOpenParamTemplate}>
                                            Párametros de Templates <Arrow/>
                                    </Button>
                                    {openParamTemplate ?
                                        <div id='Párametros Templates'style={{paddingLeft: '.1rem'}}>
                                            <Paper style={style.containers} className="ui container">
                                                <div>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Ver Párametros"
                                                    /><p/>
                                                    <Button fullWidth={true} fontSize="large" onClick={handleCloseParamTemplate}>
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
                                    <Button variant="contained" color="gray" fullWidth='true' onClick={handleOpenDominios}>
                                            Paramétrizacion de dominios <Arrow/>
                                    </Button>
                                    {openDominios ?
                                        <div id='Paramétrizacion de dominios'style={{paddingLeft: '.1rem'}}>
                                            <Paper style={style.containers} className="ui container">
                                                <div>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedB} onChange={handleChange} name="checkedB" />}
                                                        label="Crear nuevo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedC} onChange={handleChange} name="checkedC" />}
                                                        label="Editar"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedD} onChange={handleChange} name="checkedD" />}
                                                        label="Eliminar"
                                                    /><p/>
                                                    <Button fullWidth={true} fontSize="large" onClick={handleCloseDominios}>
                                                        <ArrowUp style={{color: 'black'}}color="secondary"/>
                                                    </Button>
                                                </div>

                                            </Paper>
                                        </div>:''}
                                </Grid>
                                <Grid style={{paddingRight: '1rem', paddingLeft: '1rem'}} item xs={6}>
                                    <Button variant="contained" color="gray" fullWidth='true' onClick={handleOpenNotificaciones}>
                                            Notificaciones <Arrow/>
                                    </Button>
                                    {openNotificaciones ?
                                        <div id='Notificaciones'style={{paddingLeft: '.1rem'}}>
                                            <Paper style={style.containers} className="ui container">
                                                <div>


                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Ver Notificaciones"
                                                    /><p/>
                                                    <Button fullWidth={true} fontSize="large" onClick={handleCloseNotificaciones}>
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
                                    <Button variant="contained" color="gray" fullWidth='true' onClick={handleOpenInbox}>
                                            Inbox <Arrow/>
                                    </Button>
                                    {openInbox ?
                                        <div id='Inbox'style={{paddingLeft: '.1rem'}}>
                                            <Paper style={style.containers} className="ui container">
                                                <div>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedB} onChange={handleChange} name="checkedB" />}
                                                        label="Mensajes"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedC} onChange={handleChange} name="checkedC" />}
                                                        label="Responder"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedD} onChange={handleChange} name="checkedD" />}
                                                        label="Ver Contrato"
                                                    /><p/>
                                                    <Button fullWidth={true} fontSize="large" onClick={handleCloseInbox}>
                                                        <ArrowUp style={{color: 'black'}}color="secondary"/>
                                                    </Button>
                                                </div>

                                            </Paper>
                                        </div>:''}
                                </Grid>
                                <Grid style={{paddingRight: '1rem', paddingLeft: '1rem'}} item xs={6}>
                                    <Button variant="contained" color="gray" fullWidth='true' onClick={handleOpenTemplate}>
                                            Templates <Arrow/>
                                    </Button>
                                    {openTemplates ?
                                        <div id='Templates'style={{paddingLeft: '.1rem'}}>
                                            <Paper style={style.containers} className="ui container">
                                                <div>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Nuevo Usuario"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Ver Usuarios"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Editar"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Eliminar"
                                                    /><p/>
                                                    <Button fullWidth={true} fontSize="large" onClick={handleCloseTemplate}>
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
                                    <Button variant="contained" color="gray" fullWidth='true' onClick={handleOpenContratos}>
                                            Contratos <Arrow/>
                                    </Button>
                                    {openContratos ?
                                        <div id='Contratos' style={{paddingLeft: '.1rem'}}>
                                            <Paper style={style.containers} className="ui container">
                                                <div>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedB} onChange={handleChange} name="checkedB" />}
                                                        label="Nuevo Contrato"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedC} onChange={handleChange} name="checkedC" />}
                                                        label="Contratos"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedD} onChange={handleChange} name="checkedD" />}
                                                        label="Trazabilidad"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedB} onChange={handleChange} name="checkedB" />}
                                                        label="Historial"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedC} onChange={handleChange} name="checkedC" />}
                                                        label="Ver Contrato"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedD} onChange={handleChange} name="checkedD" />}
                                                        label="Cancelar"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedD} onChange={handleChange} name="checkedD" />}
                                                        label="Descargar"
                                                    /><p/>
                                                    <Button fullWidth={true} fontSize="large" onClick={handleCloseContratos}>
                                                        <ArrowUp style={{color: 'black'}}color="secondary"/>
                                                    </Button>
                                                </div>
                                            </Paper>
                                        </div>:''}
                                </Grid>
                            </Grid>
                        </div>
                    </List>
                </Paper>
            </Dialog>
        </div>
    );
}
