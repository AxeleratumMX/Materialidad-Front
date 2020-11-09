import React from 'react';
import axios from 'axios';
import LinearLoading from '../../components/LinearLoading';
import Close from '../../assets/ico_close.svg';
import {Button, Modal} from 'semantic-ui-react';
import Buttons from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Comfirm from '../../components/ConfirmDialog';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Arrow from '@material-ui/icons/ArrowDropDownOutlined';
import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import ArrowUp from '@material-ui/icons/ArrowDropUpTwoTone';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

export default class EditUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Orgs: ['AT&T', 'AXTEL'],
            ROL: ['Administrador', 'Supervisor', 'Abogado', 'Cliente'],
            nombre: null,
            apellido: null,
            telefono: null,
            rol: null,
            organizacion: null,
            disable: false,
            password: false,
            tempData: null,
            load: false,
            file: null,
            confirm: false,
            userTemp: null,
            modalResetSucces: false,
            image_file: null,
            image_preview: '',
            rols: null,
        };
    }
    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        if (props.tempData && Object.keys(props.tempData).length > 0) {
            this.setState({tempData: props.tempData, file: null, image_preview: ''});
            this.getAvatar(props.tempData);
        }
        if (props.data && Object.keys(props.data).length > 0) {
            this.setState({organizaciones: props.data});
        }
        if (props.rols && Object.keys(props.rols).length > 0) {
            this.setState({rols: props.rols});
        }
    }
    openModalConfimr= (data) => {
        this.setState({confirm: true, userTemp: data});
    }
    closeModalConfimr = () => {
        this.setState({confirm: false});
    }
    change(key, value) {
        const tempData = {...this.state.tempData};
        tempData[key] = value;
        this.setState({tempData});
    }
    onChangeSwicth(e) {
        this.setState({
            [e.target.name]: e.target.checked,
        });
    }
    getAvatar(data) {
        if (data.idPhoto!=null) {
            axios.get('/api/v1/admin/users/'+data.id+'/photo', {responseType: 'blob'})
                .then((response) => this.setState({file: URL.createObjectURL(response.data), image_preview: URL.createObjectURL(response.data)}));
        }
    }
    handleImagePreview = (e) => {
        const imageBase64 = URL.createObjectURL(e.target.files[0]);
        const imageFiles = e.target.files[0];
        this.setState({
            file: null,
            image_preview: imageBase64,
            image_file: imageFiles,
        });
    }
    saveAvatar(id) {
        const url = '/api/v1/admin/users/'+id+'/photo';
        const formData = new FormData();
        formData.append('photo', this.state.image_file);
        axios.post(
            url,
            formData,
            {
                headers: {
                    'Content-type': 'multipart/form-data',
                },
            },
        ).then((res) => {
            this.handlePopulate();
        }).catch((err) => {
            console.log(err);
        });
    }
    resetPassword() {
        const {userTemp} = this.state;
        axios.put('/api/v1/admin/users/reset/'+userTemp, {responseType: 'json'})
            .then((response) => this.setState({confirm: false, modalResetSucces: true}));
    }
    saveUser() {
        const {tempData}=this.state;
        const usuario = tempData.username;
        const nombre= tempData.name;
        const apellidos = tempData.apellidos;
        const telefono = tempData.telefono;
        const correo = tempData.correo;
        const rol = tempData.role;
        const organizacion = tempData.organizacion;
        const url = '/api/v1/admin/users/';
        axios({
            method: 'put',
            url: url,
            data: {
                apellidos: apellidos,
                id: tempData.id,
                correo: correo,
                name: nombre,
                organizacion: organizacion,
                role: rol,
                telefono: telefono,
                username: usuario,
            },
        }).then((response) => {
            this.setState({load: false});
            this.saveAvatar(tempData.id);
            this.handlePopulate();
        }).catch(function(error) {
            console.log('Error task');
        });
    };
    handleClose = () => {
        this.setState({file: null});
        this.props.close();
    };
    handlePopulate = () => {
        this.props.refresh();
    };
    fileSelectedHandler = (event) =>{
        this.setState({avatar: event.target.files[0]});
    }
    handleCloseApproval() {
        this.setState({openApprovalMail: false});
    };
    handleCloseResetSuccess() {
        this.setState({modalResetSucces: false});
    };
    openModalApprovalUser() {
        this.handleClose();
        this.saveUser();
        this.setState({openApprovalMail: true, load: true});
    }
    componentDidMount() {

    }
    render() {
        return (
            <div>
                { this.state.tempData != null ? this.modalNewUser() : ''}
                { this.modalResetSucces()}
                { this.modalUserCreated() }
                {<Comfirm open={this.state.confirm} message={'¿Está seguro que desea reestablecer contraseña?'}
                    onConfirm={() => this.resetPassword()} onClose={() => this.closeModalConfimr()}/>}
            </div>
        );
    };
    modalNewUser() {
        const {open} = this.props;
        const {tempData} = this.state;
        const style = {
            divCustom: {
                marginBottom: '-6px', padding: '5px',
            }, label: {
                color: '#585656', fontSize: '12pt', fontFamily: 'Montserrat, semibold ',
            },
            labelCustom: {
                fontSize: '9pt', color: '#838d93', margin: '10px',
            }, configSelect: {
                background: 'white',
                border: '1px solid #aaa',
                borderRadius: '5px',
                fontSize: '14px',
                height: '35px',
                padding: '5px',
                width: '290px', color: '#838d93',
            }, imagen: {
                width: '100px', height: '100px', borderRadius: '150px', border: '6px solid #666',
            },
        };
        return (
            <React.Fragment>
                <div style={{display: 'flex'}}>
                <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                
                <DialogContent dividers>
                    <Typography gutterBottom>
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
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedB} name="checkedB" />}
                                                        label="Gráfica Vista General"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedC} name="checkedC" />}
                                                        label="Gráfica Firmados por cliente"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={true} name="checkedD" />}
                                                        label="Gráfica Cancelados por cliente"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedE} name="checkedE" />}
                                                        label="Ultimos en activos"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedF} name="checkedF" />}
                                                        label="Ultimos en firma"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedG} name="checkedG" />}
                                                        label="Ultimos en revisión"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedH} name="checkedH" />}
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
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
                                                        label="Nuevo Usuario"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
                                                        label="Ver Usuarios"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
                                                        label="Editar"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
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
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedB} name="checkedB" />}
                                                        label="Crear nuevo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedC} name="checkedC" />}
                                                        label="Editar"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedD} name="checkedD" />}
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
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
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
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedB} name="checkedB" />}
                                                        label="Crear nuevo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedC} name="checkedC" />}
                                                        label="Editar"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedD} name="checkedD" />}
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
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
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
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedB} name="checkedB" />}
                                                        label="Mensajes"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedC} name="checkedC" />}
                                                        label="Responder"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedD} name="checkedD" />}
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
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
                                                        label="Nuevo Usuario"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
                                                        label="Ver Usuarios"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
                                                        label="Editar"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
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
                                                        control={<Checkbox checked={state.checkedA} name="checkedA" />}
                                                        label="Seleccionar todo"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedB} name="checkedB" />}
                                                        label="Nuevo Contrato"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedC} name="checkedC" />}
                                                        label="Contratos"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedD} name="checkedD" />}
                                                        label="Trazabilidad"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedB} name="checkedB" />}
                                                        label="Historial"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedC} name="checkedC" />}
                                                        label="Ver Contrato"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.checkedD} name="checkedD" />}
                                                        label="Cancelar"
                                                    /><p/>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={true} name="checkedD" />}
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
                    </Typography>
                 
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
            Save changes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
            </React.Fragment>
        );
    };
    modalUserCreated() {
        return (
            <React.Fragment>
                <div style={{display: 'flex'}}>
                    <Modal size={'tiny'} open={this.state.openApprovalMail}>
                        <LinearLoading show={this.state.load} delay={15}/>
                        <Modal.Content>
                            <div style={{textAlign: 'right'}}>
                                <Buttons onClick={() => this.handleCloseApproval()} color="secondary">
                                    <img style={{width: '20px', paddingTop: '10px', paddingBottom: '10px'}} src={Close} alt='X'/>
                                </Buttons>
                            </div>
                            <div style={{paddingLeft: '3rem', paddingTop: '1rem', marginTop: '10px'}}>
                                <strong><p style={{color: '#585656', fontSize: '13pt', paddingBottom: '1rem'}}>Actualizar Usuario</p></strong>
                                <p>Se ha guardado con éxito los cambios del usuario  </p>
                                <p>{<strong>{this.state.usuario}</strong>}</p>
                            </div>
                            <div style={{display: 'block', paddingLeft: '14rem', paddingTop: '1rem', marginTop: '-5px'}}>
                                <Button
                                    positive
                                    icon='checkmark'
                                    labelPosition='left'
                                    content='Cerrar'
                                    onClick={() => this.handleCloseApproval()}
                                />
                            </div>

                        </Modal.Content>
                    </Modal>
                </div>
            </React.Fragment>
        );
    };
    modalResetSucces() {
        return (
            <React.Fragment>
                <div style={{display: 'flex'}}>
                    <Modal size={'mini'} open={this.state.modalResetSucces}>
                        <Modal.Content style={{backgroundColor: 'F5F5F5'}}>
                            <div style={{textAlign: 'right'}}>
                                <Buttons onClick={() => this.handleCloseResetSuccess()} color="secondary">
                                    <img style={{width: '20px', paddingTop: '10px', paddingBottom: '10px'}} src={Close} alt='X'/>
                                </Buttons>
                            </div>
                            <div style={{paddingLeft: '3rem', paddingTop: '1rem'}}>
                                <strong><p style={{color: '#585656', fontSize: '13pt', paddingBottom: '1rem'}}>Reestablecer Contraseña</p></strong>
                                <p>Se ha reestablecido con éxito la contraseña </p>
                                <p>{<strong>{this.state.usuario}</strong>}</p>
                            </div>
                            <div style={{display: 'block', paddingLeft: '8rem', paddingTop: '1rem', marginTop: '-5px'}}>
                                <Button
                                    positive
                                    icon='checkmark'
                                    labelPosition='left'
                                    content='Cerrar'
                                    onClick={() => this.handleCloseResetSuccess()}
                                />
                            </div>
                        </Modal.Content>
                    </Modal>
                </div>
            </React.Fragment>
        );
    };
}
EditUser.propTypes = {
    close: PropTypes.bool,
    open: PropTypes.bool,
    data: PropTypes.object,
    tempData: PropTypes.object,
    refresh: PropTypes.object,
    rols: PropTypes.object,

};
