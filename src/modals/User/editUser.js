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
import ValidateInput from '../../components/ValidateInputGeneric';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';


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
            touched: false,
            errorMessage: null,
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
    setErrorMessage() {
        this.setState({errorMessage: null});
    }
    handleError(error) {
        const data = error.response.data;
        const errorMessage = data && Array.isArray(data.errors) ? data.errors.map((e) => e.message.split(',')) : null;
        this.setState({errorMessage: errorMessage});
    };
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
        this.setState({touched: true});
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
            this.setState({load: false, openApprovalMail: true});
            this.saveAvatar(tempData.id);
            this.handleClose();
            this.handlePopulate();
        }).catch((error) => {
            this.setState({load: false});
            this.handleError(error);
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
        this.saveUser();
        this.setState({load: true});
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
                cursor: 'pointer', width: '100px', height: '100px', borderRadius: '150px', border: '6px solid #666',
            },
        };
        return (
            <React.Fragment>
                <div style={{display: 'flex'}}>
                    <Modal size={'tiny'} open={open}>
                        <LinearLoading show={this.state.load} delay={15}/>
                        <Modal.Content style={{backgroundColor: 'whitesmoke'}}>
                            <div style={{textAlign: 'right'}}>
                                <Buttons onClick={this.handleClose} color="secondary">
                                    <img style={{width: '20px', paddingTop: '10px', paddingBottom: '10px'}} src={Close} alt='X'/>
                                </Buttons>
                            </div>
                            <div style={{paddingLeft: '3rem', paddingTop: '-1rem', marginTop: '10px'}}>
                                <strong><p style={{color: '#585656', fontSize: '13pt'}}>Editar Usuario</p></strong>
                            </div>
                            <div style={{display: 'block', paddingLeft: '2rem', paddingTop: '1rem', marginTop: '-5px'}}>
                                <List>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar style={{width: '110px', height: '110px'}}>
                                                <label htmlFor="file-upload" className="custom-file-upload">
                                                    { this.state.file ? <img style={style.imagen} src={this.state.file} alt="image_blob"/> :
                                                        this.state.image_preview ? <img style={style.imagen} src={this.state.image_preview} alt="image_preview"/> :
                                                            <AddAPhotoIcon style={{width: '80px', height: '80px', cursor: 'pointer'}} />
                                                    }
                                                </label>
                                                <input id="file-upload" onChange={this.handleImagePreview.bind(this)} style={{display: 'none'}} type="file" accept="image/*"/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong>Usuario</strong>} style={{paddingLeft: '1rem'}}
                                            secondary={<ValidateInput invalid={this.state.touched && !tempData.username} message='Este campo es requerido'><input name={tempData.username} value={tempData.username}
                                                onChange={(e)=>this.change('username', e.target.value)}
                                                style={style.configSelect}></input></ValidateInput>} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong>Nombre</strong>} style={{paddingLeft: '5rem'}}
                                            secondary={<ValidateInput invalid={this.state.touched && !tempData.name} message='Este campo es requerido'><input name="name" value={tempData.name}
                                                onChange={(e)=>this.change('name', e.target.value)}style={style.configSelect}></input></ValidateInput>} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong>Correo</strong>} style={{paddingLeft: '5rem'}}
                                            secondary={<ValidateInput invalid={this.state.touched && !tempData.correo} message='Este campo es requerido'><input name="correo" value={tempData.correo}
                                                onChange={(e)=>this.change('correo', e.target.value)}style={style.configSelect}></input></ValidateInput>}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong>Apellidos</strong>} style={{paddingLeft: '5rem'}}
                                            secondary={<ValidateInput invalid={this.state.touched && !tempData.apellidos} message='Este campo es requerido'><input name="apellidos" value={tempData.apellidos}
                                                onChange={(e)=>this.change('apellidos', e.target.value)} style={style.configSelect}></input></ValidateInput>} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong>Teléfono</strong>} style={{paddingLeft: '5rem'}}
                                            secondary={<ValidateInput invalid={this.state.touched && !tempData.telefono} message='Este campo es requerido'><input name="telefono" value={tempData.telefono}
                                                onChange={(e)=>this.change('telefono', e.target.value)} style={style.configSelect}></input></ValidateInput>} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong>Rol</strong>} style={{paddingLeft: '5rem'}}
                                            secondary={<ValidateInput invalid={this.state.touched && !tempData.role} message='Este campo es requerido'><select id="rol" style={style.configSelect}
                                                value={tempData.role}
                                                name="role"
                                                onChange={(e)=>this.change('role', e.target.value)}>
                                                <option disabled selected>Seleccione una opción</option>
                                                {
                                                    this.state.rols!=null ? this.state.rols.map((rol, idx) => {
                                                        return <option key={idx} value={rol.name}>{ rol.name }</option>;
                                                    }) :''
                                                }
                                            </select></ValidateInput>} />
                                    </ListItem> <ListItem>
                                        <ListItemAvatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong>Organización</strong>} style={{paddingLeft: '5rem'}}
                                            secondary={<ValidateInput invalid={this.state.touched && !tempData.role} message='Este campo es requerido'><select id="organizacion" style={style.configSelect}
                                                name="organizacion" value={tempData.organizacion}
                                                onChange={(e)=>this.change('organizacion', e.target.value)}>
                                                <option disabled selected>Seleccione una opción</option>
                                                {
                                                    this.state.organizaciones!=null ? this.state.organizaciones.map((org, idx) => {
                                                        return org.activo === true ? <option key={idx} value={org.name}>{ org.name }</option> : '';
                                                    }) :''
                                                }
                                            </select></ValidateInput>} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong></strong>} style={{paddingLeft: '5rem'}}
                                            secondary={
                                                <Buttons onClick={() => this.openModalConfimr(tempData.username)} variant="contained" color="secondary" >
                                                Reestablecer contraseña
                                                </Buttons>
                                            } />
                                    </ListItem>
                                </List>
                            </div>
                            {this.state.errorMessage &&
                <Alert className="top"
                    severity='error'
                    onClose={() => this.setErrorMessage(null)}>
                    {this.state.errorMessage[0].map((re, idx) => {
                        return <li key={idx}>{re}</li>;
                    }) }
                </Alert>}
                            <div style={{display: 'block', paddingLeft: '12rem', paddingTop: '1rem', marginTop: '-5px'}}>
                                <Button
                                    negative
                                    icon='close'
                                    labelPosition='left'
                                    content='Cancelar'
                                    onClick={this.handleClose}
                                />
                                <Button
                                    positive
                                    icon='checkmark'
                                    labelPosition='left'
                                    content='Guardar Usuario'
                                    onClick={() => this.openModalApprovalUser()}
                                />
                            </div>
                        </Modal.Content>
                    </Modal>
                </div>
            </React.Fragment>
        );
    };
    modalUserCreated() {
        return (
            <React.Fragment>
                <div style={{display: 'flex'}}>
                    <Modal size={'tiny'} open={this.state.openApprovalMail}>
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
