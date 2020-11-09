import React from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import CancelarIcon from '../assets/ico-cancelar-on.svg';
import Button from '@material-ui/core/Button';
import EditIcon from '../assets/ico_edit.svg';
import CreateUser from '../modals/User/createUser.js';
import Organization from '../modals/User/organization.js';
import EditUser from '../modals/User/editUser.js';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import LinearLoading from '../components/LinearLoading';
import Loading from '../components/Loading';
import Comfirm from '../components/ConfirmDialog';
import PropTypes from 'prop-types';

import '../styles/generador.css';
import '../assets/font.css';
export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            perPage: 10,
            currentPage: 0,
            data: [],
            filter: '',
            render: true,
            search: false,
            sort: false,
            load: true,
            confirm: false,
            tempData: [],
            step: 1,
            modalCreateUser: false,
            modalEditUser: false,
            modalCreateOrg: false,
        };
        this.handlePageClick = this.handlePageClick.bind(this);
    }
    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;
        this.setState({
            currentPage: selectedPage,
            offset: offset,
        }, () => {
            this.receivedData();
        });
    };
    /* formatDate(date) {
        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }
        const d = new Date(date);
        return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('-');
    }*/
    formatDate() {
        const f = new Date();
        return f.getDate() + '/' + (f.getMonth() +1) + '/' + f.getFullYear();
    }
    upddateFilter=(event)=>{
        this.setState({[event.target.name]: event.target.value, render: false, search: true});
        if (event.target.value.length===0) {
            this.setState({render: true, search: false});
        }
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value});
    }
    setTimeout() {
        setTimeout(this.setState.bind(this, {block: false}), 4000);
    }
    openModalCreateUser= (e) => {
        this.setState({modalCreateUser: true});
    }
    closeModalCreate = () => {
        this.setState({modalCreateUser: false});
    }
    openModalEditUser= (data) => {
        this.setState({modalEditUser: true, tempData: data});
    }
    closeModalEdit = () => {
        this.setState({modalEditUser: false});
    }
    openModalConfimr= (data) => {
        this.setState({confirm: true, tempData: data});
    }
    closeModalConfimr = () => {
        this.setState({confirm: false});
    }
    openModalOrg= (data) => {
        this.setState({modalCreateOrg: true, tempData: data});
    }
    closeModalOrg = () => {
        this.setState({modalCreateOrg: false});
    }
    closeModalConfimrAndLoad = () => {
        this.setState({confirm: false, refresh: true});
    }
    deleteUsuario() {
        this.closeModalConfimrAndLoad();
        const url = '/api/v1/admin/users/';
        axios.delete(url+this.state.tempData.id).then((res) => {
            this.receivedData();
            this.setState({refresh: false});
        });
    }
    async getOrganizaciones() {
        const url = '/api/v1/admin/organization/';
        await axios.get(url)
            .then((res) => {
                const data = res.data.content;
                this.setState({organization: data});
            });
    }
    async getRoles() {
        const url = '/api/v1/admin/rols/all';
        await axios.get(url)
            .then((res) => {
                const data = res.data;
                this.setState({rols: data});
            });
    }
    componentDidMount() {
        this.receivedData();
        this.getOrganizaciones();
        this.getRoles();
    }
    render() {
        const style = {
            container: {
                height: 'auto', width: '85%', marginTop: '10px', backgroundColor: 'white',
            }, title: {
                width: '90px', height: '60px', textAlign: 'center ', margin: '2px', padding: '6px 6px', fontSize: '12pt',
            },
        };
        return (
            <div className="vertical-overflow">
                <Container maxWidth='xl' style={{paddingBottom: '20px'}}>
                    <h1 style={{marginLeft: '10rem', marginTop: '2rem'}}>Usuarios</h1>
                    <Paper style={style.container} className='ui container'>
                        <LinearLoading show={this.state.refresh} delay={15}/>
                        <div style={{float: 'left', marginLeft: '20px', paddingTop: '21px'}}>
                            <button style={{float: 'left'}}
                                onClick={(e) => this.openModalCreateUser()}
                                className="ui green icon left labeled button">
                                <i className="white icon plus"></i>
                                Nuevo Usuario
                            </button>
                        </div>
                        <div style={{float: 'left', marginLeft: '20px', paddingTop: '21px'}}>
                            <button style={{float: 'left'}}
                                onClick={(e) => this.openModalOrg()}
                                className="ui green icon left labeled button">
                                <i className="white icon edit"></i>
                                Organización
                            </button>
                        </div>
                        <div style={{textAlign: 'center', paddingTop: '20px'}}>
                            <div style={{display: 'flex', width: '400px', float: 'right', paddingRight: '2rem'}}>
                                <input id='filter' name='filter' value={this.state.filter} onChange={this.upddateFilter}
                                    className="formInput searchInput"
                                    type='text'
                                    placeholder="Buscar..."/>
                                <button className="formInputButton">
                                    <i className="search icon"/>
                                </button>
                            </div>
                        </div>
                        <div className="divider"/>
                        {this.state.load ? <Loading/>:
                            <table style={{borderRadius: 0, borderLeft: 0, borderRight: 0}} className="ui striped table" >
                                <thead>
                                    <tr>
                                        <th style={style.title}>Nombre</th>
                                        <th style={style.title}>Usuario</th>
                                        <th style={style.title}>Rol</th>
                                        <th style={style.title}>Ultimo acceso</th>
                                        <th style={style.title}>Editar</th>
                                        <th style={style.title}>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.render ? this.state.postData : ' '}
                                    {this.state.search ? this.searchTable() : ' '}
                                </tbody>
                                <tfoot>
                                </tfoot>
                            </table>}
                        <ReactPaginate
                            previousLabel={'<'}
                            nextLabel={'>'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}/>
                    </Paper>
                    <Organization open={this.state.modalCreateOrg} data={this.state.organization} close={() => this.closeModalOrg()} refresh={() => this.getOrganizaciones()}/>
                    <Comfirm open={this.state.confirm} message={'¿Está seguro que desea eliminar el usuario?'}
                        onConfirm={() => this.deleteUsuario()} onClose={() => this.closeModalConfimr()}/>
                    <CreateUser open={this.state.modalCreateUser} data={this.state.organization} rols={this.state.rols} close={() => this.closeModalCreate()} refresh={() => this.receivedData()}/>
                    <EditUser open={this.state.modalEditUser} data={this.state.organization} rols={this.state.rols} tempData={this.state.tempData} close={() => this.closeModalEdit()} refresh={() => this.receivedData()}/>
                </Container>
            </div>
        );
    };
    receivedData() {
        const style = {
            text: {
                width: '90px', height: '50px', padding: '3px 3px', fontSize: '11pt', textAlign: 'center',
            },
        };
        axios.get('/api/v1/admin/users')
            .then((res) => {
                const data = res.data.content;
                this.setState({data: data, load: false});
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage);
                const postData = slice.map((pd, i) =>
                // eslint-disable-next-line react/jsx-key
                    <React.Fragment>
                        <tr key={i}>
                            <td style={style.text}>{pd.name}</td>
                            <td style={style.text}>{pd.username}</td>
                            <td style={style.text}>{pd.role}</td>
                            <td style={style.text}>{this.formatDate(pd.sendDate)}</td>
                            <td style={style.text}><Button variant="text" onClick={() => this.openModalEditUser(pd)}>
                                <img className='customIcon'
                                    src={EditIcon}></img></Button></td>
                            <td style={style.text}><Button variant="text" onClick={() => this.openModalConfimr(pd)}>
                                <img className='customIcon'
                                    src={CancelarIcon}></img></Button></td>
                        </tr>
                    </React.Fragment>);
                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    postData,
                });
            });
    }
    searchTable() {
        const style = {
            text: {
                width: '90px', height: '50px', padding: '2px 2px', fontSize: '10pt', textAlign: 'center',
            }, textCustom: {
                width: 'auto', height: '50px', padding: '2px 2px', fontSize: '10pt', textAlign: 'justify',
            }, icon: {
                width: '90px', height: '50px', padding: '2px', fontSize: '10pt', textAlign: 'center',
            },
        };
        const items = this.state.data.filter((data)=>{
            const datas =
                data.username + ' ' +
                data.name + ' ' +
                data.role;
            return datas.toLowerCase().includes(this.state.filter.toLowerCase().trim(),
            );
        }).map((pd, i)=>{
            return (
            // eslint-disable-next-line react/jsx-key
                <React.Fragment>
                    <tr key={i}>
                        <td style={style.text}>{pd.name}</td>
                        <td style={style.text}>{pd.username}</td>
                        <td style={style.text}>{pd.role}</td>
                        <td style={style.text}>{this.formatDate(pd.sendDate)}</td>
                        <td style={style.text}><Button variant="text"><img className='customIcon'
                            onClick={() => this.openModalEditUser(pd)} src={EditIcon}></img></Button></td>
                        <td style={style.text}><Button variant="text"><img className='customIcon'
                            onClick={() => this.openModalConfimr(pd)} src={CancelarIcon}></img></Button></td>
                    </tr>
                </React.Fragment>
            );
        });
        return (
            <React.Fragment>
                {items}
            </React.Fragment>
        );
    }
}
User.propTypes = {
    history: PropTypes.object,
    close: PropTypes.bool,
    data: PropTypes.object,
};
