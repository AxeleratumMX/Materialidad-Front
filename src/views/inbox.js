import React from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import SeeIcon from '../assets/ico-ver.svg';
import {Link} from 'react-router-dom';
import Close from '../assets/ico_close.svg';
import {Button, Modal} from 'semantic-ui-react';
import Buttons from '@material-ui/core/Button';
import IconResponse from '@material-ui/icons/AssignmentTurnedInOutlined';
import Paper from '@material-ui/core/Paper';
import AuthApi from '../auth/AuthApi';
import CommentIcon from '@material-ui/icons/CommentOutlined';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import LinearLoading from '../components/LinearLoading';
import Loading from '../components/Loading';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';

export default class Inbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            perPage: 10,
            currentPage: 0,
            data: [],
            filter: null,
            render: true,
            search: false,
            sort: false,
            load: true,
            block: false,
            activeDrop: false,
            tempData: [],
            step: 1,
            comments: ' ',
            openNotify: false,
            openNotifyCreador: false,
            openCancelNotify: false,
            openAcceptNotify: false,
            openModalNotifyCancel: false,
            openObservaciones: false,
            openRejectedNotify: false,
            user: null,
            loading: false,
            loadingObservaciones: true,
            linearLoading: true,
            arrayObservaciones: null,
            usersFirms: null,
            userFirmsLoad: false,
            FIRMAS: [],
            updateLoad: true,
            userName: null,
        };
        this.handlePageClick = this.handlePageClick.bind(this);
        this.sortByPriceAsc = this.sortByPriceAsc.bind(this);
        this.sortByStatusDesc = this.sortByStatusDesc.bind(this);
    }
    sortByPriceAsc() {
        this.setState(
            this.state.data.sort((a, b) => (new Date(a.fecha).getTime() - new Date(b.fecha).getTime())));
        this.setState({sort: true, render: false});
    }
    sortByPriceDesc() {
        this.setState(
            this.state.data.sort((a, b) => (a.fecha > b.fecha ? 1 : a.fecha < b.fecha ? -1 : 0)));
        this.setState({sort: true, render: false});
    }
    sortByStatusDesc() {
        this.setState(
            this.state.data.sort((a, b) => (new Date(b.fecha).getTime() - new Date(a.fecha).getTime())));
        this.setState({sort: true, render: false});
    }
    dropDown() {
        this.setState({activeDrop: !this.state.activeDrop});
    }
    upddateFilter=(event)=>{
        this.setState({[event.target.name]: event.target.value, render: false, search: true, sort: false});
        if (event.target.value.length===0) {
            this.setState({render: true, search: false, sort: false});
        }
    }
    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;
        this.setState({
            currentPage: selectedPage, offset: offset}, () => {
            this.receivedData();
        });
    };
    setTimeoutO() {
        setTimeout(this.setState.bind(this, {loading: false}), 1000);
    }
    setTimeout() {
        setTimeout(this.setState.bind(this, {loading: false}), 10000);
    }
    formatDate(date) {
        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }
        const d = new Date(date);
        return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('-');
    }
    onChangeT(e) {
        this.setState({
            [e.target.name]: e.target.value});
    }
    getFirmantes(data) {
        const url = '/api/v1/dynamicinterface/templates/contract/';
        const contractId=data.contractId;
        axios
            .get(url+contractId+'/firmantes')
            .then((res) => {
                const data = res;
                this.setState({usersFirms: data.data, userFirmsLoad: true, linearLoading: false,
                    firmantes: false});
            });
    }
    responseTaskSimple(data) {
        const taskId = data.taskId;
        const contractId= data.contractId;
        const responseUser = this.state.user;
        const contractStatus = data.contractStatusKey;
        const url = '/api/v1/inbox/tasks/complete/task';
        axios({
            method: 'post',
            url: url,
            data: {
                taskId: taskId,
                responseUser: responseUser,
                contractStatusKey: contractStatus,
                contractId: contractId,
            },
        }).then((response) => {
            this.receivedData();
            this.setState({loading: false});
        }).catch(function(error) {
        });
    }
    responseTask(data) {
        const taskId = data.taskId;
        const contractId= data.contractId;
        const response = 'ACCEPT';
        const responseUser = this.state.user;
        const comments = this.state.comments;
        const contractStatus = data.contractStatusKey;
        const url = '/api/v1/inbox/tasks/response/task';
        axios({
            method: 'post',
            url: url,
            data: {
                taskId: taskId,
                response: response,
                comments: comments,
                contractStatusKey: contractStatus,
                contractId: contractId,
                responseUser: responseUser,
            },
        }).then((response) => {
            this.receivedData();
            this.setState({loading: false});
        }).catch(function(error) {
        });
    }
    responseTaskReject(data) {
        const taskId = data.taskId;
        const responseUser = this.state.user;
        const contractId= data.contractId;
        const response = 'REJECT';
        const comments = this.state.comments;
        const contractStatus = data.contractStatusKey;
        const url = '/api/v1/inbox/tasks/response/task';
        axios({
            method: 'post',
            url: url,
            data: {
                taskId: taskId,
                response: response,
                comments: comments,
                contractStatusKey: contractStatus,
                contractId: contractId,
                responseUser: responseUser,
            },
        }).then((response) => {
            this.receivedData();
            this.setState({loading: false});
        }).catch(function(error) {
        });
    }
    handleCloseModalNotifyCancel() {
        this.setState({openModalNotifyCancel: false});
    };
    openModalNotifyCancel() {
        this.setState({openModalNotifyCancel: true});
        this.handleCloseNotifyModal();
    };
    openNotifyCreador(data) {
        this.setState({openNotifyCreador: true, tempData: data});
        this.getFirmantes(data);
    }
    handleCloseModalNotifyCreador(data) {
        this.setState({openNotifyCreador: false, loading: true});
        this.responseTaskSimple(data);
    };
    handleCloseModalNotifyCreadoricon(data) {
        this.setState({openNotifyCreador: false});
    };
    onChangeUser(e) {
        const str = this.state.usersFirms;
        str[[e.target.name]].name = e.target.value;
        this.setState({usersFirms: str});
    }
    onChangeMail(e) {
        const str = this.state.usersFirms;
        str[[e.target.name]].email = e.target.value;
        this.setState({usersFirms: str});
    }
    handleCloseNotifyModalAccept() {
        this.setState({openModalNotifyAccept: false});
    };
    openModalNotifyRejected(data) {
        this.setState({openRejectedNotify: false, loading: true,
        });
        this.handleCloseModalNotifyCancel();
        this.responseTaskReject(data);
    };
    openObservaciones(data) {
        this.setState({openObservaciones: true});
        this.getObservaciones(data);
    }
    handleCloseObservaciones() {
        this.setState({openObservaciones: false});
    };
    getObservaciones(data) {
        const url = '/api/v1/inbox/tasks/comments/';
        const processInstanceId= data.processInstanceId;
        axios
            .get(url+processInstanceId)
            .then((res) => {
                const data = res.data;
                this.setState({arrayObservaciones: data, loadingObservaciones: false});
            });
    }
    handleCloseNotifyModal() {
        this.setState({openNotify: false});
    };
    openModalNotifyAccept(data) {
        this.setState({loading: true});
        this.handleCloseNotifyModal();
        this.responseTask(data);
    };
    openModalNotify(data, user) {
        this.setState({openNotify: true, user: user,
            tempData: data});
    }
    async getUser() {
        await AuthApi.getCurrentUser().then((user) => {
            this.setState({user: user.username});
            this.receivedData();
        });
    }
    componentDidMount(e) {
        this.getUser();
    }
    render() {
        const style = {
            container: {
                height: 'auto', width: '85%', marginTop: '10px', backgroundColor: 'white',
            }, title: {
                width: '90px', height: '60px', textAlign: 'center ', margin: '2px', padding: '6px 6px', fontSize: '12pt',
            }, titleS: {
                width: 'auto', height: '60px', textAlign: 'justify ', margin: '2px', padding: '6px 6px', fontSize: '12pt',
            },
        };
        return (
            <div className="vertical-overflow">
                <Container maxWidth='xl' style={{paddingBottom: '20px'}}>
                    <h1 style={{marginLeft: '10rem', marginTop: '2rem'}}>Inbox
                    </h1>
                    <Paper style={style.container} className='ui container'>
                        <LinearLoading show={this.state.loading} delay={10}/>
                        <div style={{textAlign: 'center', paddingTop: '20px'}}>
                            <div style={{display: 'flex', float: 'left', marginLeft: '20px'}}>
                                <button style={{width: '200px', height: '32px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #E1E3E2'}}
                                    className='ui  icon right labeled button dropdown button' onClick={() => this.dropDown()}>
                                    <i className='filter icon'></i>
                                    <span className='text' >Ordenar por...</span>
                                    <div className={'menu ' + (this.state.activeDrop ? 'transition visible' : '')} >
                                        <div className='item' onClick={this.sortByStatusDesc}>
                                            <span className='text'>Asc</span>
                                        </div>
                                        <div className='item' onClick={this.sortByPriceAsc}>
                                            <span className='text'>Desc</span>
                                        </div>
                                    </div>
                                </button>
                            </div>
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
                        <div className='divider'></div>
                        {this.state.load ? <Loading/> :
                            <table style={{borderRadius: 0, borderLeft: 0, borderRight: 0}} className='ui striped table'>
                                <thead>
                                    <tr>
                                        <th style={style.title}><h4>Estado</h4></th>
                                        <th style={style.title}><h4>Cliente</h4></th>
                                        <th style={style.title}><h4>Tipo de contracto</h4></th>
                                        <th style={style.title}><h4>Código de propiedad</h4></th>
                                        <th style={style.title}><h4>Folio</h4></th>
                                        <th style={style.title}><h4>Fecha</h4></th>
                                        <th style={style.title}><h4>Observaciones</h4></th>
                                        <th style={style.title}><h4>Responder</h4></th>
                                        <th style={style.title}><h4>Ver Contrato</h4></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.render ? this.state.postData : ' ' }
                                    {this.state.search ? this.searchTable() : ' '}
                                    {this.state.sort ? this.sortTable(): ' '}
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
                    {this.modalNotify()}
                    {this.modalNotifyCreador()}
                    {this.modalNotifyAccept()}
                    {this.modalNotifyCancel()}
                    {this.modalObservacione()}
                </Container>
            </div>


        );
    };
    async receivedData(data) {
        const {user} = this.state;
        const url ='/api/v1/inbox/tasks';
        const style = {
            text: {
                width: '90px', height: '60px', padding: '2px 2px', fontSize: '10pt', textAlign: 'center',
            }, textCustom: {
                width: 'auto', height: '60px', padding: '2px 2px', fontSize: '10pt', textAlign: 'justify',
            }, icon: {
                width: '90px', height: '60px', padding: '2px', fontSize: '10pt', textAlign: 'center',
            },
        };
        await axios.get(url)
            .then((res) =>{
                const data = res.data;
                this.setState({data: data, load: false});
                const slice =data.slice(this.state.offset, this.state.offset + this.state.perPage);
                const postData = slice.map((pd, i) =>
                    // eslint-disable-next-line react/jsx-key
                    <React.Fragment>
                        <tr>
                            <td style={style.text}>{pd.contractStatus}</td>
                            <td style={style.textCustom}>{pd.cliente}</td>
                            <td style={style.text}>{pd.tipoContrato}</td>
                            <td style={style.text}>{pd.assetNumber}</td>
                            <td style={style.text}>{pd.folio}</td>
                            <td style={style.text}>{this.formatDate(pd.fecha)}</td>
                            <td style={style.icon}>
                                <Buttons variant="text"><CommentIcon
                                    style={{fontSize: 30, color: '#456BF7',
                                        cursor: 'pointer'}} onClick={() => this.openObservaciones(pd, user)}/> </Buttons></td>
                            {pd.asssignCreateContractUser===user ?
                                <td style={style.icon}><Buttons variant="text"><IconResponse
                                    style={{fontSize: 30, color: '#1FC054',
                                        cursor: 'pointer'}} onClick={() => this.openNotifyCreador(pd, user)}/></Buttons>
                                </td> :
                                <td style={style.icon}><Buttons variant="text"><IconResponse
                                    style={{fontSize: 30, color: '#1FC054',
                                        cursor: 'pointer'}} onClick={() => this.openModalNotify(pd, user)}/></Buttons>
                                </td>
                            }
                            <td style={style.icon}>
                                <Link to={{pathname: `/Contract/${pd.contractId}`, ruta: '/inbox'}}>
                                    <Buttons variant="text"><img className='customIcon' src={SeeIcon}></img></Buttons>
                                </Link>
                            </td>
                        </tr>
                    </React.Fragment>);
                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    postData,
                });
            });
    }
    sortTable() {
        const {user} = this.state;
        const style = {
            text: {
                width: '90px', height: '50px', padding: '2px 2px', fontSize: '10pt', textAlign: 'center',
            }, textCustom: {
                width: 'auto', height: '50px', padding: '2px 2px', fontSize: '10pt', textAlign: 'justify',
            }, icon: {
                width: '90px', height: '50px', padding: '2px', fontSize: '10pt', textAlign: 'center',
            },
        };
        return (
            <React.Fragment>
                { this.state.data.map((pd)=>{
                    return (
                        // eslint-disable-next-line react/jsx-key
                        <tr>
                            <td style={style.text}>{pd.contractStatus}</td>
                            <td style={style.textCustom}>{pd.cliente}</td>
                            <td style={style.text}>{pd.tipoContrato}</td>
                            <td style={style.text}>{pd.assetNumber}</td>
                            <td style={style.text}>{pd.folio}</td>
                            <td style={style.text}>{this.formatDate(pd.fecha)}</td>
                            <td style={style.icon}>
                                <CommentIcon
                                    style={{fontSize: 30, color: '#456BF7',
                                        cursor: 'pointer'}} onClick={() => this.openObservaciones(pd, user)}/></td>
                            {pd.asssignCreateContractUser===user ?
                                <td style={style.icon}><IconResponse
                                    style={{fontSize: 30, color: '#1FC054',
                                        cursor: 'pointer'}} onClick={() => this.openNotifyCreador(pd, user)}/>
                                </td> :
                                <td style={style.icon}><IconResponse
                                    style={{fontSize: 30, color: '#1FC054',
                                        cursor: 'pointer'}} onClick={() => this.openModalNotify(pd, user)}/>
                                </td>
                            }
                            <td style={style.icon}>
                                <Link to={{
                                    pathname: `/Contract/${pd.contractId}`, ruta: '/inbox',
                                }}>
                                    <img className='customIcon' src={SeeIcon}></img>
                                </Link>
                            </td>
                        </tr>
                    );
                })}
            </React.Fragment>
        );
    }
    searchTable() {
        const {user} = this.state;
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
            data.assetNumber + ' ' +
            data.client + ' ' +
            data.contractId + ' ' +
            data.contractStatus + ' ' +
            data.tipoContrato + ' ' +
            data.subTipoContrato + ' ' +
            data.folio;
            return datas.toLowerCase().includes(this.state.filter.toLowerCase().trim(),
            );
        }).map((pd)=>{
            return (
                // eslint-disable-next-line react/jsx-key
                <React.Fragment>
                    <tr>
                        <td style={style.text}>{pd.contractStatus}</td>
                        <td style={style.textCustom}>{pd.cliente}</td>
                        <td style={style.text}>{pd.tipoContrato}</td>
                        <td style={style.text}>{pd.assetNumber}</td>
                        <td style={style.text}>{pd.folio}</td>
                        <td style={style.text}>{this.formatDate(pd.fecha)}</td>
                        <td style={style.icon}>
                            <CommentIcon
                                style={{fontSize: 30, color: '#456BF7',
                                    cursor: 'pointer'}} onClick={() => this.openObservaciones(pd, user)}/></td>
                        {pd.asssignCreateContractUser===user ?
                            <td style={style.icon}><IconResponse
                                style={{fontSize: 30, color: '#1FC054',
                                    cursor: 'pointer'}} onClick={() => this.openNotifyCreador(pd, user)}/>
                            </td> :
                            <td style={style.icon}><IconResponse
                                style={{fontSize: 30, color: '#1FC054',
                                    cursor: 'pointer'}} onClick={() => this.openModalNotify(pd, user)}/>
                            </td>
                        }
                        <td style={style.icon}>
                            <Link to={{
                                pathname: `/Contract/${pd.contractId}`, ruta: '/inbox',
                            }}>
                                <img className='customIcon' src={SeeIcon}></img>
                            </Link>
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
    modalNotify() {
        const {tempData}= this.state;
        return (
            <React.Fragment>
                <div style={{display: 'flex'}}>
                    <Modal size={'tiny'} open={this.state.openNotify}>
                        <Modal.Content>
                            <div style={{paddingBottom: '1px', display: 'block'}} className='row'>
                                <div style={{paddingLeft: '35rem'}} onClick={() => this.handleCloseNotifyModal()}>
                                    <img style={{width: '20px'}} src={Close}/>
                                </div>
                            </div>
                            <div>
                                <strong><p style={{fontSize: '14pt', textAlign: 'center', paddingTop: '2rem', color: '#585656'}}>
                                    ¿Está usted de acuerdo con el contrato?
                                </p></strong>
                                <div style={{display: 'block', paddingLeft: '10rem', paddingTop: '1rem', marginTop: '-5px'}}>
                                    <Button
                                        negative
                                        icon='close'
                                        labelPosition='left'
                                        content='Rechazar'
                                        onClick={() => this.openModalNotifyCancel(tempData)}
                                    />
                                    <Button
                                        positive
                                        icon='checkmark'
                                        labelPosition='left'
                                        content='Aceptar'
                                        onClick={() => this.openModalNotifyAccept(tempData)}
                                    />
                                </div>
                            </div>
                        </Modal.Content>
                    </Modal>
                </div>
            </React.Fragment>
        );
    };
    modalNotifyCreador() {
        const {tempData, usersFirms, linearLoading}= this.state;
        let status= '';
        {tempData.contractStatusKey==='BORRADOR' ? status='Revision' :
            tempData.contractStatusKey==='REVISION' ? status='Firma' :
                tempData.contractStatusKey==='FIRMA' ? status='Activar' :
                    status=tempData.contractStatusKey;
        }
        return (
            <React.Fragment>
                <div style={{display: 'flex'}}>
                    <Modal size={'tiny'} open={this.state.openNotifyCreador}
                    >
                        {/* <LinearLoading show={linearLoading} delay={10}/>*/}
                        <Modal.Content>
                            <div style={{paddingBottom: '1px', display: 'block'}} className='row'>
                                <div style={{paddingLeft: '35rem'}} onClick={() => this.handleCloseModalNotifyCreadoricon()}>
                                    <img style={{width: '20px'}} src={Close}/>
                                </div>
                            </div>
                            <div>
                                <strong><p style={{fontSize: '14pt', textAlign: 'center', paddingTop: '2rem', color: '#585656', paddingBottom: '2rem'}}>
                                    ¿Desea enviar el contrato a {status}?
                                </p></strong>
                                {/* this.state.userFirmsLoad && tempData.contractStatusKey==='REVISION' ?
                                    <React.Fragment>
                                        {
                                            usersFirms.map((firm, idx) => {
                                                return <div style={{paddingLeft: '1rem'}} key={idx}>
                                                    {
                                                        <React.Fragment>
                                                            <List subheader={'Firmante:'}>
                                                                <ListItem alignItems="flex-start">

                                                                    <ListItemText
                                                                        primary={' '}
                                                                        secondary={
                                                                            <React.Fragment>
                                                                                <TextField id="outlined-basic" name={idx} onChange={this.onChangeUser.bind(this)} defaultValue={firm.name} variant="outlined" style={{paddingRight: '3rem', paddingLeft: '0rem'}}/>
                                                                                <TextField id="outlined-basic" name={idx} onChange={this.onChangeMail.bind(this)} defaultValue={firm.email} variant="outlined" />
                                                                            </React.Fragment>
                                                                        }
                                                                    />
                                                                </ListItem>
                                                                <Divider variant="middle" />
                                                            </List>

                                                        </React.Fragment>
                                                    }
                                                </div>;
                                            })
                                        }
                                    </React.Fragment> : ''*/
                                }
                                <div style={{display: 'block', paddingLeft: '13rem', paddingTop: '1rem', marginTop: '-5px'}}>
                                    <Button
                                        positive
                                        icon='checkmark'
                                        labelPosition='left'
                                        content='Aceptar'
                                        onClick={() => this.handleCloseModalNotifyCreador(tempData)}
                                    />
                                </div>
                            </div>
                        </Modal.Content>
                    </Modal>
                </div>
            </React.Fragment>
        );
    };
    modalNotifyAccept() {
        const {tempData}= this.state;

        const style = {
            divCustom: {
                marginBottom: '-6px', padding: '5px',
            }, label: {
                color: '#585656', fontSize: '10pt', fontFamily: 'Montserrat, semibold ',
            },
            labelCustom: {
                fontSize: '10pt', color: '#838d93', margin: '10px',
            },
        };
        return (
            <React.Fragment>
                <div style={{display: 'flex'}}>
                    <Modal size={'tiny'} open={this.state.openModalNotifyAccept}
                    >
                        <Modal.Content>
                            <div style={{paddingBottom: '1px', display: 'block'}} className='row'>
                                <div style={{paddingLeft: '32rem'}} onClick={() => this.handleCloseNotifyModalAccept()}>
                                    <img style={{width: '20px'}} src={Close}/>
                                </div>
                            </div>
                            <div style={{paddingLeft: '3rem', paddingTop: '-1rem', marginTop: '10px'}}>
                                <strong><p style={{color: '#585656', fontSize: '13pt'}}>Notificacion de contrato</p></strong>
                                <p style={{color: 'red', fontSize: '12pt', paddingBottom: '1rem'}}>{'en revisión'.toUpperCase()}</p>
                                <p>Agradecemos su aprobación del contrato:</p>
                            </div>
                            <div style={{paddingLeft: '2rem', paddingTop: '1rem', marginTop: '-5px'}}>
                                <div id='asset' style={style.divCustom}>
                                    <label style={style.labelCustom}>Asset Number: {<strong><label style={style.label}>{tempData.assetId}</label></strong>}</label>
                                    <label style={style.labelCustom}>Folio : {<strong><label style={style.label}>{tempData.folio}</label></strong>}</label>
                                </div>
                                <div id='asset' style={style.divCustom}>
                                    <label style={style.labelCustom}>Cliente : {<strong><label style={style.label}>{tempData.client}</label></strong>}</label>
                                </div>
                            </div>
                            <div style={{paddingLeft: '3rem', paddingBottom: '2rem', marginTop: '10px'}}>
                                <p>Enseguida enviaremos el contrato a Firma.</p>
                            </div>
                            <div style={{display: 'block', paddingLeft: '14.5rem', paddingTop: '1rem', marginTop: '-5px'}}>
                                <Button
                                    positive
                                    icon='checkmark'
                                    labelPosition='left'
                                    content='Cerrar'
                                    onClick={() => this.handleCloseNotifyModalAccept()}
                                />
                            </div>
                        </Modal.Content>
                    </Modal>
                </div>
            </React.Fragment>
        );
    };

    modalNotifyCancel() {
        const {tempData}= this.state;
        const style = {
            divCustom: {
                marginBottom: '-6px', padding: '5px',
            }, label: {
                color: '#585656', fontSize: '10pt', fontFamily: 'Montserrat, semibold ',
            },
            labelCustom: {
                fontSize: '9pt', color: '#838d93', margin: '10px',
            },
        };
        return (
            <React.Fragment>
                <div style={{display: 'flex'}}>
                    <Modal size={'tiny'} open={this.state.openModalNotifyCancel}
                    >
                        <Modal.Content>
                            <div style={{paddingBottom: '1px', display: 'block'}} className='row'>
                                <div style={{paddingLeft: '35rem'}} onClick={() => this.handleCloseModalNotifyCancel()}>
                                    <img style={{width: '20px'}} src={Close}/>
                                </div>
                            </div>
                            <div style={{paddingLeft: '3rem', paddingTop: '-1rem', marginTop: '10px'}}>
                                <strong><p style={{color: '#585656', fontSize: '13pt'}}>Notificacion de contrato</p></strong>
                                <p style={{color: 'red', fontSize: '12pt', paddingBottom: '1rem'}}>{'Usted ha rechazado el contrato:'}</p>                             </div>
                            <div style={{paddingLeft: '2rem', paddingTop: '1rem', marginTop: '-5px'}}>
                                <div id='asset' style={style.divCustom}>
                                    <label style={style.labelCustom}>Asset Number: {<strong><label style={style.label}>{tempData.assetNumber}</label></strong>}</label>
                                    <label style={style.labelCustom}>Folio : {<strong><label style={style.label}>{tempData.assetNumber}</label></strong>}</label>
                                </div>
                                <div id='asset' style={style.divCustom}>
                                    <label style={style.labelCustom}>Cliente : {<strong><label style={style.label}>{tempData.cliente}</label></strong>}</label>
                                </div>
                            </div>
                            <div style={{paddingLeft: '3rem', paddingBottom: '2rem', marginTop: '10px', width: 'auto', fontSize: '10pt'}}>
                                <p>Le pedimos que escriba las observaciones/ motivos por los que rechazo el contrato.</p>
                                <textarea style={{width: '470px', border: '1px solid gray', boxShadow: '0 0 10px #E6E6E5'}} name='comments' onChange={this.onChangeT.bind(this)} rows='10' cols='40'></textarea>
                            </div>
                            <div style={{display: 'block', paddingLeft: '15rem', paddingTop: '1rem', marginTop: '-5px'}}>
                                <Button
                                    positive
                                    icon='checkmark'
                                    labelPosition='left'
                                    content='Enviar'
                                    onClick={() => this.openModalNotifyRejected(tempData)}
                                />
                            </div>
                        </Modal.Content>
                    </Modal>
                </div>
            </React.Fragment>
        );
    };
    modalObservacione() {
        const {arrayObservaciones}= this.state;
        return (
            <React.Fragment>
                <div style={{display: 'flex', overflowY: 'auto'}}>
                    <Modal size={'mini'} open={this.state.openObservaciones}>
                        <Modal.Content>
                            <div style={{paddingBottom: '1px', display: 'block'}} className='row'>
                                <div style={{paddingLeft: '22rem'}} onClick={() => this.handleCloseObservaciones()}>
                                    <img style={{width: '20px'}} src={Close}/>
                                </div>
                            </div>
                            <div style={{paddingLeft: '3rem', paddingTop: '-1rem', marginTop: '10px'}}>
                                <strong><p style={{color: '#585656', fontSize: '13pt'}}>Observaciones</p></strong>
                            </div>
                            <div style={{paddingLeft: '2rem', paddingTop: '1rem', marginTop: '-5px'}}>
                                { this.state.loadingObservaciones ?
                                    <div style={{paddingLeft: '4rem', paddingTop: '1rem'}}>
                                        <div style={{paddingLeft: '5rem'}}>
                                            <CircularProgress color="secondary" />
                                        </div>
                                        <strong><p style={{paddingLeft: '4rem'}}>Cargando....</p></strong>
                                    </div>:
                                    <React.Fragment>
                                        {
                                            arrayObservaciones.map((obs, idx) => {
                                                return <div key={idx} >
                                                    {
                                                        <React.Fragment>
                                                            <List style={{overFlow: 'auto'}}>
                                                                <ListItem alignItems="flex-start">

                                                                    <ListItemText
                                                                        primary={obs.message === '' ? 'No hay observaciones':
                                                                            obs.message}
                                                                        secondary={
                                                                            <React.Fragment>
                                                                                {'Agregado por: '+obs.userId}
                                                                                <p/>
                                                                                {'Fecha: '+this.formatDate(obs.fecha)}

                                                                            </React.Fragment>
                                                                        }
                                                                    />
                                                                </ListItem>
                                                                <Divider variant="middle" />
                                                            </List>

                                                        </React.Fragment>
                                                    }
                                                </div>;
                                            })
                                        }
                                    </React.Fragment>
                                }
                            </div>
                            <div style={{display: 'block', paddingLeft: '8rem', paddingTop: '1rem', marginTop: '-5px'}}>
                                <Button
                                    positive
                                    icon='checkmark'
                                    labelPosition='left'
                                    content='Cerrar'
                                    onClick={() => this.handleCloseObservaciones()}
                                />
                            </div>
                        </Modal.Content>
                    </Modal>
                </div>
            </React.Fragment>
        );
    };
}
Inbox.propTypes = {
    history: PropTypes.object,
};
