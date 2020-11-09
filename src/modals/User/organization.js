import React from 'react';
import axios from 'axios';
import Close from '../../assets/ico_close.svg';
import {Button, Modal} from 'semantic-ui-react';
import Buttons from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearLoading from '../../components/LinearLoading';
import Comfirm from '../../components/ConfirmDialog';
import PropTypes from 'prop-types';


export default class Organization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openApprovalMail: false,
            openApprovalMailFinal: false,
            nombre: null,
            render: true,
            organizacion: null,
            disabled: true,
            load: false,
        };
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value});
        this.checkInput();
    }
    checkInput = () => {
        if (this.state.nombre===null) {
            // this.state.apellidos===null&&this.state.telefono===null&&this.state.rol===null&&this.state.organizacion===null) {
            this.setState({disabled: false});
        }
    }
    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        if (props.data && Object.keys(props.data).length > 0) {
            this.setState({organizacion: props.data});
        }
    }
    getOrganizaciones() {
        const url = '/api/v1/admin/organization/';
        axios
            .get(url).then((res) => {
                const data = res.data.content;
                this.setState({organizacion: data, nombre: null});
                // this.render();
            });
    }
    changeStatus() {
        const {tempData} = this.state;
        const status = tempData.activo === true ? false : true;
        this.setState({load: true});
        const url = '/api/v1/admin/organization/';
        axios({
            method: 'put',
            url: url,
            data: {
                name: tempData.name,
                id: tempData.id,
                activo: status,
            },
        }).then((response) => {
            this.setState({load: false});
            this.closeModalConfimr();
            this.handlePopulate();
        }).catch(function(error) {
            console.log('Error ', error);
        });
    }
    saveOrganization() {
        const nombre= this.state.nombre;
        this.setState({load: true});
        const url = '/api/v1/admin/organization/';
        axios({
            method: 'post',
            url: url,
            data: {
                name: nombre,
                activo: true,
            },
        }).then((response) => {
            console.log('Ok', response);
            this.setState({load: false, nombre: null});
            // this.handleCloseApproval();
            this.handlePopulate();
            // this.getOrganizaciones();
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
    openModalConfimr= (data) => {
        const status = data.activo ? 'desactivar':'activar';
        const message = '¿Está seguro que desea '+ status +' el usuario?';
        this.setState({confirm: true, message: message, tempData: data});
    }
    closeModalConfimr = () => {
        this.setState({confirm: false});
    }
    componentDidMount() {
        //
    }
    render() {
        return (
            <div>
                {  this.modalNewUser()}
                {<Comfirm open={this.state.confirm} message={this.state.message}
                    onConfirm={() => this.changeStatus()} onClose={() => this.closeModalConfimr()}/>}
            </div>
        );
    };
    modalNewUser(data) {
        const {open} = this.props;
        const style = {
            title: {
                textAlign: 'center ', margin: '2px', padding: '5px 5px', paddingTop: '20px', fontSize: '11pt',
            }, text: {
                cursor: 'pointer', textAlign: 'center ', margin: '2px', padding: '5px 5px', paddingTop: '20px', fontSize: '11pt',
            }, configSelect: {
                background: 'white', border: '1px solid #aaa',
                borderRadius: '5px', fontSize: '14px', height: '35px',
                padding: '5px', width: '270px', color: '#838d93',
            }, divCustom: {
                paddingTop: '-2rem', paddingBottom: '3rem', display: 'inline-block',
            },
        };
        return (
            <React.Fragment>
                <div style={{display: 'flex'}}>
                    <Modal size={'tiny'} style ={{backgroundColor: 'blue'}}open={open}>
                        <LinearLoading show={this.state.load} delay={15}/>
                        <Modal.Content style={{backgroundColor: 'whitesmoke'}}>
                            <div style={{textAlign: 'right'}}>
                                <Buttons onClick={this.handleClose} color="secondary">
                                    <img style={{width: '20px', paddingTop: '10px', paddingBottom: '10px'}} src={Close} alt='X'/>
                                </Buttons>
                            </div>
                            <div style={{paddingLeft: '1rem', paddingTop: '-1rem', marginTop: '10px'}}>
                                <strong><p style={{color: '#585656', fontSize: '13pt'}}>Organizaciones</p></strong>
                            </div>
                            <h4 style={{marginLeft: '1rem', marginTop: '3rem', marginBottom: '-.5rem'}}>Nueva Organización</h4>
                            <div style={style.divCustom}>
                                <div style={{padding: '.5rem'}}>
                                    <div style={{display: 'inline-block'}}>
                                        <input style={style.configSelect} name="nombre" type='text' value={this.state.nombre}
                                            onChange={this.onChange.bind(this)} /></div>
                                    <div style={{display: 'inline-block', paddingLeft: '2rem'}}>
                                        <button disabled={this.state.disabled}
                                            onClick={(e) => this.saveOrganization()} className="ui green icon left labeled button">
                                            <i className=" white icon plus"></i> Agregar</button></div>
                                </div>
                            </div>
                            <div style={{float: 'center'}}>
                                <table className='ui striped table' >
                                    <thead>
                                        <tr>
                                            <th style={style.title}>Nombre</th>
                                            <th style={style.title}>Estatus</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.organizacion!=null ? this.state.organizacion.map((rol, idx) => {
                                                return <tr key={idx} >
                                                    <td style={style.title}>{rol.name}</td>
                                                    <td style={style.text} onClick={() => this.openModalConfimr(rol)}>
                                                        <i className={rol.activo ? 'icon green checkmark' : 'icon red close' }></i>
                                                        {rol.activo ? 'Activado' : 'Desactivado' }
                                                    </td>
                                                </tr>;
                                            }) :''
                                        }
                                    </tbody>
                                    <tfoot>
                                    </tfoot>
                                </table>
                            </div>
                            <div style={{display: 'block', paddingLeft: '15rem', paddingTop: '1rem', marginTop: '-5px'}}>
                                <Button
                                    color='red'
                                    icon='close'
                                    labelPosition='left'
                                    content='Cerrar'
                                    onClick={this.handleClose}
                                />
                            </div>
                        </Modal.Content>
                    </Modal>
                </div>

            </React.Fragment>
        );
    };
}
Organization.propTypes = {
    close: PropTypes.bool,
    open: PropTypes.bool,
    data: PropTypes.object,
    refresh: PropTypes.object,
};
