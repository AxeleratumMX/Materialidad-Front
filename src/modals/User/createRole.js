import React from 'react';
import axios from 'axios';
import Close from '../../assets/ico_close.svg';
import {Button, Modal} from 'semantic-ui-react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import LinearLoading from '../../components/LinearLoading';
import PropTypes from 'prop-types';

export default class CreateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openApprovalMail: false,
            openApprovalMailFinal: false,
            firmantes: true,
            Orgs: ['AT&T', 'AXTEL'],
            ROL: ['Administrador', 'Supervisor', 'Abogado', 'Cliente'],
            numbers: [4, 9, 16, 25],
            usuario: null,
            nombre: null,
            apellidos: null,
            telefono: null,
            rol: null,
            organizacion: null,
            avatar: null,
            disabled: true, load: false,
        };
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value});
        this.checkInput();
    }
    checkInput = () => {
        if (this.state.usuario===null&&this.state.nombre===null) {
            // this.state.apellidos===null&&this.state.telefono===null&&this.state.rol===null&&this.state.organizacion===null) {
            this.setState({disabled: false});
        }
    }
    getOrganization(data) {// edit pent
        const url = '/api/v1/inbox/tasks/comments/58112807-e3b0-11ea-8395-000d3aebfaf7';
        axios
            .get(url)
            .then((res) => {
                const data = res;
                this.setState({Orgs: data.data,
                    firmantes: false});
            });
    }
    saveUser() {
        const usuario = this.state.usuario;
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
                correo: usuario,
                name: nombre,
                organizacion: organizacion,
                role: rol,
                telefono: telefono,
                username: usuario,
            },
        }).then((response) => {
            console.log('Ok', response);
            this.setState({load: false});
            // this.handleCloseApproval();
            this.handlePopulate();
        }).catch(function(error) {
            console.log('Error ', error);
        });
    };
    handleClose = () => {
        this.props.close();
    };
    handlePopulate = () => {
        this.props.refresh();
    };
    fileSelectedHandler = (event) =>{
        console.log(event.target.files[0]);
        this.setState({
            avatar: event.target.files[0],
        });
    }
    openModalApprovalUser(data) {
        this.handleClose();
        this.saveUser();
        this.setState({openApprovalMail: true, load: true,
        });
    }
    handleCloseApproval() {
        this.setState({openApprovalMail: false});
    };
    componentDidMount() {
        //
    }
    render() {
        const {data} = this.props;
        console.log('create user', this.state);
        return (
            <div>
                {this.modalNewUser(data)}
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
                color: '#585656', fontSize: '12pt', fontFamily: 'Montserrat, semibold ',
            },
            labelCustom: {
                fontSize: '9pt', color: '#838d93', margin: '10px',
            }, configSelect: {
                background: 'white', border: '1px solid gray',
                borderRadius: '5px', fontSize: '14px', height: '35px',
                padding: '5px', width: '330px', color: '#838d93',
            },
        };
        return (
            <React.Fragment>
                <div style={{display: 'flex'}}>
                    <Modal size={'tiny'} style ={{backgroundColor: '#838d93'}}open={open}>
                        <Modal.Content>
                            <div style={{paddingBottom: '1px', display: 'block'}} className="row">
                                <div style={{paddingLeft: '33rem'}} onClick={this.handleClose}>
                                    <img style={{width: '20px'}} alt="" src={Close}/>
                                </div>
                            </div>
                            <div style={{paddingLeft: '3rem', paddingTop: '-1rem', marginTop: '10px'}}>
                                <strong><p style={{color: '#585656', fontSize: '13pt'}}>Nuevo Rol</p></strong>
                            </div>
                            <div style={{display: 'block', paddingLeft: '2rem', paddingTop: '1rem', marginTop: '-5px'}}>
                                <List>
                                    <ListItem>
                                        <ListItemText primary={<strong>Nombre Rol</strong>} style={{paddingLeft: '1rem'}}
                                            secondary={<input name="usuario" type='text' value={this.state.usuario}
                                                onChange={this.onChange.bind(this)} style={style.configSelect}></input>} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={<strong>Descripción</strong>} style={{paddingLeft: '1rem'}}
                                            secondary={<input name="nombre" type='text'
                                                onChange={this.onChange.bind(this)} style={style.configSelect}></input>} />
                                    </ListItem>
                                </List>
                            </div>
                            <div style={{display: 'block', paddingLeft: '7rem', paddingTop: '1rem', marginTop: '-5px'}}>
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
                                    content='Guardar Rol'
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
                        <LinearLoading show={this.state.load} delay={15}/>
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
};
