import React from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Role from '../modals/User/dialogCreateRol.js';
import RoleEdit from '../modals/User/dialogEditRole.js';
import Button from '@material-ui/core/Button';
import CancelarIcon from '../assets/ico-cancelar-on.svg';
import LinearLoading from '../components/LinearLoading';
import Loading from '../components/Loading';
import Comfirm from '../components/ConfirmDialog';

import '../styles/generador.css';
import '../assets/font.css';

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            render: true,
            perPage: 10,
            currentPage: 0,
            data: [],
            load: true,
        };
        this.handlePageClick = this.handlePageClick.bind(this);
    }
    upddateFilter=(event)=>{
        this.setState({[event.target.name]: event.target.value, render: false, search: true,
        });
        if (event.target.value.length === 0) {
            this.setState({render: true, search: false});
        }
    };
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
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
    openModalCreateRole= (e) => {
        this.setState({modalCreateRol: true});
    }
    closeModalRole = () => {
        this.setState({modalCreateRol: false});
    }
    openModalConfimr= (data) => {
        this.setState({confirm: true, tempData: data});
    }
    closeModalConfimr = () => {
        this.setState({confirm: false});
    }
    openModalEditUser= (data) => {
        this.setState({modalEditUser: true, tempData: data});
    }
    closeModalEdit = () => {
        this.setState({modalEditUser: false});
    }
    deleteUsuario() {
        this.setState({refresh: true});
        const url = '/api/v1/admin/rols/';
        axios.delete(url+this.state.tempData.id).then((res) => {
            this.receivedData();
            this.setState({refresh: false});
            this.closeModalConfimr();
        });
    }
    componentDidMount() {
        this.receivedData();
    }
    render() {
        const style = {
            container: {
                height: 'auto', width: '85%', marginTop: '10px', backgroundColor: 'white',
            }, title: {
                textAlign: 'center ', height: '50px',
                margin: '2px', padding: '6px 6px', fontSize: '12pt',
            }, text: {
                padding: '4px', fontSize: '9pt', textAlign: 'center',
            },
        };
        return (
            <div className="vertical-overflow">
                <Container maxWidth='xl' style={{paddingBottom: '20px'}}>
                    <h1 style={{marginLeft: '10rem', marginTop: '2rem'}}>Roles</h1>
                    <Paper style={style.container} className="ui container">
                        <LinearLoading show={this.state.refresh} delay={15}/>
                        <div style={{float: 'left', marginLeft: '20px', paddingTop: '21px'}}>
                            <Role refresh={() => this.receivedData()}/>
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
                        {this.state.load ? <Loading/> :
                            <table style={{borderRadius: 0, borderLeft: 0, borderRight: 0}} className="ui striped table" >
                                <thead>
                                    <tr>
                                        <th style={style.title}>Roles</th>
                                        <th colSpan={3} style={style.title}></th>
                                        <th style={style.title}>Editar</th>
                                        <th style={style.title}>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.render ? this.state.postData : ' ' }
                                    {this.state.search ? this.searchTable() : ' '}

                                    {/*
                                        this.state.roles.map((rol, idx) => {
                                            return <tr key={idx} >
                                                <td style={style.text}>{rol.nombre}</td>
                                                <td colSpan={3}></td>
                                                <td style={style.text}><img className='customIcon'
                                                    onClick={() => this.openModalCreateRole(rol)} src={EditIcon}></img></td>
                                                <td style={style.text}><img className='customIcon'
                                                    onClick={() => this.openModalConfimr(rol)} src={CancelarIcon}></img></td>
                                            </tr>;
                                        })
                                    */}
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
                    <Comfirm open={this.state.confirm} message={'¿Está seguro que desea eliminar rol?'}
                        onConfirm={() => this.deleteUsuario()} onClose={() => this.closeModalConfimr()}/>
                </Container>
            </div>
        );
    };
    receivedData() {
        const style = {
            text: {
                padding: '4px', height: '50px', padding: '3px 3px', fontSize: '10pt', textAlign: 'center',
            },
        };
        axios
            .get('/api/v1/admin/rols')
            .then((res) => {
                const data = res.data;
                this.setState({data: data, load: false});
                const slice = data.content.slice(this.state.offset, this.state.offset + this.state.perPage);
                const postData = slice.map((pd, idx) =>
                // eslint-disable-next-line react/jsx-key
                    <React.Fragment>
                        <tr key={idx} >
                            <td style={style.text}>{pd.name}</td>
                            <td colSpan={3}></td>
                            <td style={style.text}>
                                <RoleEdit data={pd} refresh={() => this.receivedData()}/>
                            </td>
                            <td style={style.text}>
                                <Button variant="text" onClick={() => this.openModalConfimr(pd)}>
                                    <img className='customIcon' alt=''
                                        src={CancelarIcon}>
                                    </img>
                                </Button>
                            </td>
                        </tr>
                    </React.Fragment>);
                this.setState({
                    pageCount: Math.ceil(data.content.length / this.state.perPage),
                    postData,
                });
            });
    }
    searchTable() {
        const style = {
            text: {
                padding: '4px', height: '50px', padding: '3px 3px', fontSize: '10pt', textAlign: 'center',
            },
        };
        const items = this.state.data.content.filter((data)=>{
            const datas =
                    data.name;
            return datas.toLowerCase().includes(this.state.filter.toLowerCase().trim(),
            );
        }).map((pd, idx)=>{
            return (
            // eslint-disable-next-line react/jsx-key
                <React.Fragment>
                    <tr key={idx} >
                        <td style={style.text}>{pd.name}</td>
                        <td colSpan={3}></td>
                        <td style={style.text}>
                            <Button>
                                <RoleEdit data={pd} refresh={() => this.receivedData()}/>
                            </Button>
                        </td>
                        <td style={style.text}>
                            <Button variant="text" onClick={() => this.openModalConfimr(pd)}>
                                <img className='customIcon' alt=''
                                    src={CancelarIcon}>
                                </img>
                            </Button>
                        </td>
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
