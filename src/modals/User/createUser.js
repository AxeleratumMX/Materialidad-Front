import React from 'react';
import axios from 'axios';
import Close from '../../assets/ico_close.svg';
import {Button, Modal} from 'semantic-ui-react';
import Buttons from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Alert from '@material-ui/lab/Alert';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import LinearLoading from '../../components/LinearLoading';
import ValidateInput from '../../components/ValidateInputGeneric';
import PropTypes from 'prop-types';


export default class CreateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openApprovalMail: false,
            openApprovalMailFinal: false,
            firmantes: true,
            ROL: ['Administrador', 'Supervisor', 'Abogado', 'Cliente'],
            numbers: [4, 9, 16, 25],
            usuario: null,
            correo: null,
            nombre: null,
            apellidos: null,
            telefono: null,
            rols: null,
            organizacion: null,
            organizaciones: null,
            avatar: null,
            disabled: true, load: false,
            image_file: null,
            image_preview: '',
            touched: false,
            errorMessage: null,
        };
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value});
        this.checkInput();
    }
    fileSelectedHandler = (event) =>{
        console.log(event.target.files[0]);
        this.setState({
            avatar: event.target.files[0],
        });
    }
    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        if (props.data && Object.keys(props.data).length > 0) {
            this.setState({organizaciones: props.data});
        }
        if (props.rols && Object.keys(props.rols).length > 0) {
            this.setState({rols: props.rols});
        }
    }
    checkInput = () => {
        if (this.state.usuario===null&&this.state.nombre===null) {
            // this.state.apellidos===null&&this.state.telefono===null&&this.state.rol===null&&this.state.organizacion===null) {
            this.setState({disabled: false});
        }
    }
    setErrorMessage() {
        this.setState({errorMessage: null});
    }

    handleError(error) {
        const data = error.response.data;
        const errorMessage = data && Array.isArray(data.errors) ? data.errors.map((e) => e.message.split(',')) : null;
        this.setState({errorMessage: errorMessage});
    };
    saveUser() {
        this.setState({touched: true});
        const usuario = this.state.usuario;
        const correo = this.state.correo;
        const nombre= this.state.nombre;
        const apellidos = this.state.apellidos;
        const telefono = this.state.telefono;
        const rol = this.state.rol;
        const organizacion = this.state.organizacion;
        // const avatar = this.state.avatar;
        const url = '/api/v1/admin/users/';
        axios({
            method: 'post',
            url: url,
            data: {
                apellidos: apellidos,
                correo: correo,
                name: nombre,
                organizacion: organizacion,
                role: rol,
                telefono: telefono,
                username: usuario,
            },
        }).then((response) => {
            this.setState({errorMessage: null, touched: false, openApprovalMail: true, load: false,
                correo: null, usuario: null, nombre: null, apellidos: null,
                telefono: null, organizacion: null, rol: null});
            // this.handleCloseApproval();
            this.handleClose();
            this.handlePopulate();
            this.saveAvatar(response.data.id);
        }).catch((error) => {
            this.setState({load: false});
            this.handleError(error);
        });
    };
    handleImagePreview = (e) => {
        const imageBase64 = URL.createObjectURL(e.target.files[0]);
        const imageFiles = e.target.files[0];
        this.setState({
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
            this.setState({load: false});
        }).catch((err) => {
            console.log(err);
        });
    }
    handleClose = () => {
        this.props.close();
    };
    handlePopulate = () => {
        this.props.refresh();
    };
    openModalApprovalUser(data) {
        this.saveUser();
        this.setState({load: true});
    }
    handleCloseApproval() {
        this.setState({openApprovalMail: false});
    };
    componentDidMount() {
        //
    }
    render() {
        const {data} = this.props;
        console.log(this.state);
        return (
            <div>
                {/* this.state.organizaciones && this.state.rols != null ? this.modalNewUser() : ''*/}
                { this.modalNewUser() }

                {this.modalUserCreated(data)}
            </div>
        );
    };
    modalNewUser(data) {
        const {open} = this.props;
        const style = {
            divCustom: {
                marginBottom: '-6px', padding: '5px',
            }, label: {
                color: '#585656', fontSize: '12pt',
            },
            labelCustom: {
                fontSize: '9pt', color: '#838d93', margin: '10px',
            }, configSelect: {
                background: 'white', border: '1px solid #aaa',
                borderRadius: '5px', fontSize: '14px', height: '35px',
                padding: '5px', width: '341px', color: '#838d93',
            }, imagen: {
                cursor: 'pointer', width: '100px', height: '100px', borderRadius: '150px', border: '5px solid #666',
            },
        };
        return (
            <React.Fragment>
                <div style={{display: 'flex'}}>
                    <Modal size={'tiny'} style ={{backgroundColor: '#838d93'}}open={open}>
                        <LinearLoading show={this.state.load} delay={15}/>
                        <Modal.Content style={{backgroundColor: 'whitesmoke'}}>
                            <div style={{textAlign: 'right'}}>
                                <Buttons onClick={this.handleClose} color="secondary">
                                    <img style={{width: '20px', paddingTop: '10px', paddingBottom: '10px'}} src={Close} alt='X'/>
                                </Buttons>
                            </div>
                            <div style={{paddingLeft: '3rem', paddingTop: '-1rem', marginTop: '10px'}}>
                                <strong><p style={{color: '#585656', fontSize: '13pt'}}>Nuevo Usuario</p></strong>
                            </div>
                            <div style={{display: 'block', paddingLeft: '2rem', paddingTop: '1rem', marginTop: '-5px'}}>
                                <List>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar style={{width: '110px', height: '110px'}}>
                                                <label htmlFor="file-upload" className="custom-file-upload">
                                                    { this.state.image_preview ? <img style={style.imagen} src={this.state.image_preview} alt="image_preview"/> :
                                                        <AddAPhotoIcon style={{width: '80px', height: '80px', cursor: 'pointer'}} /> }
                                                </label>
                                                <input id="file-upload" onChange={this.handleImagePreview.bind(this)} style={{display: 'none'}} type="file" accept="image/*"/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong>Correo</strong>} style={{paddingLeft: '1rem'}}
                                            secondary={<ValidateInput invalid={this.state.touched && !this.state.correo} message='Este campo es requerido'><input name="correo" type='text' value={this.state.correo}
                                                onChange={this.onChange.bind(this)} style={style.configSelect}></input></ValidateInput>} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong>Usuario</strong>} style={{paddingLeft: '5rem'}}
                                            secondary={<ValidateInput invalid={this.state.touched && !this.state.usuario} message='Este campo es requerido'><input name="usuario" type='text' value={this.state.usuario}
                                                onChange={this.onChange.bind(this)} style={style.configSelect}></input></ValidateInput>} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong>Nombre</strong>} style={{paddingLeft: '5rem'}}
                                            secondary={<ValidateInput invalid={this.state.touched && !this.state.nombre} message='Este campo es requerido'><input name="nombre" type='text' value={this.state.nombre}
                                                onChange={this.onChange.bind(this)} style={style.configSelect}></input></ValidateInput>} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong>Apellidos</strong>} style={{paddingLeft: '5rem'}}
                                            secondary={<ValidateInput invalid={this.state.touched && !this.state.apellidos} message='Este campo es requerido'><input name="apellidos" type='text' value={this.state.apellidos}
                                                onChange={this.onChange.bind(this)} style={style.configSelect}></input></ValidateInput>} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong>Teléfono</strong>} style={{paddingLeft: '5rem'}}
                                            secondary={<ValidateInput invalid={this.state.touched && !this.state.telefono} message='Este campo es requerido'><input name="telefono" type='number' value={this.state.telefono}
                                                onChange={this.onChange.bind(this)} style={style.configSelect}></input></ValidateInput>} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong>Rol</strong>} style={{paddingLeft: '5rem'}}
                                            secondary={<ValidateInput invalid={this.state.touched && !this.state.rol} message='Este campo es requerido'><select id="rol" style={style.configSelect}
                                                value={this.state.rol}
                                                name="rol"
                                                onChange={this.onChange.bind(this)}>
                                                <option disabled selected>Seleccione una opción</option>
                                                {
                                                    this.state.rols!=null ? this.state.rols.map((rol, idx) => {
                                                        return <option key={idx} value={rol.name}>{ rol.name }</option>;
                                                    }): ''
                                                }
                                            </select></ValidateInput>} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong>Organización</strong>} style={{paddingLeft: '5rem'}}
                                            secondary={<ValidateInput invalid={this.state.touched && !this.state.organizacion} message='Este campo es requerido'><select id="organizacion" style={style.configSelect}
                                                value={this.state.organizacion}
                                                name="organizacion"
                                                onChange={this.onChange.bind(this)}>
                                                <option disabled selected>Seleccione una opción</option>
                                                {
                                                    this.state.organizaciones!= null ?this.state.organizaciones.map((org, idx) => {
                                                        return org.activo === true ? <option key={idx} value={org.name}>{ org.name }</option>:'';
                                                    }) : ''
                                                }
                                            </select></ValidateInput>} />
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
                                    disabled={this.state.disabled}
                                    content='Guardar Usuario'
                                    onClick={() => this.openModalApprovalUser(data)}
                                />
                            </div>
                        </Modal.Content>
                    </Modal>
                </div>

            </React.Fragment>
        );
    };
    modalUserCreated(data) {
        return (
            <React.Fragment>
                <div style={{display: 'flex'}}>
                    <Modal size={'tiny'} open={this.state.openApprovalMail}>
                        <Modal.Content>
                            <div style={{paddingBottom: '1px', display: 'block'}} className="row">
                                <div style={{paddingLeft: '32rem'}} onClick={() => this.handleCloseApproval()}>
                                    <img style={{width: '20px'}} alt='' src={Close}/>
                                </div>
                            </div>
                            <div style={{paddingLeft: '3rem', paddingTop: '1rem', marginTop: '10px'}}>
                                <strong><p style={{color: '#585656', fontSize: '13pt', paddingBottom: '1rem'}}>Nuevo Usuario</p></strong>
                                <p>Se ha creado con éxito el usuario {this.state.usuario} </p>
                                < p>Recibirá por correo un link de activación de la cuenta </p>
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
}
CreateUser.propTypes = {
    close: PropTypes.bool,
    open: PropTypes.bool,
    data: PropTypes.object,
    refresh: PropTypes.object,
    rols: PropTypes.object,
};
