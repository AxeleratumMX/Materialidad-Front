import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import SeeIcon from '../assets/ico-ver.svg';
import DownloadIcon from '../assets/ico-descarga.svg';
import CorreoIcon from '../assets/ico-mail.svg';
import '../styles/generador.css';
import '../assets/font.css';


export default class Alarm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            data: [],
            perPage: 10,
            currentPage: 0,
            search: null,
            filter: '',
            render: true,
        };
        this.handlePageClick = this
            .handlePageClick
            .bind(this);
    }


    upddateFilter=(event)=>{
        console.log('event.target.value', event.target.value+'_'+event.target.value.length);

        this.setState({[event.target.name]: event.target.value,
        });
        if (event.target.value.length===0) {
            console.log('event.target.value', event.target.value);
            this.setState({render: true});
        }
    }


    componentDidMount() {
        this.receivedData();
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
    formatDate(date) {
        console.log('click date', date);
        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }
        const d = new Date(date);
        return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('-');
    }
    receivedData() {
        const style = {
            container: {
                height: 'auto',
                width: '95%',
                marginTop: '50px',
                backgroundColor: 'white',
            }, title: {
                textAlign: 'center ',
                margin: '2px', padding: '5px 5px', paddingTop: '20px',
                fontSize: '11pt',
            }, text: {
                padding: '8px',
                fontSize: '9pt', textAlign: 'center',

            },
        };

        axios
            .get('/api/v1/alerts?page=1&size=50')
            .then((res) => {
                const data = res.data;
                this.setState({data: data});

                console.log('axios', data.content);
                const slice = data.content.slice(this.state.offset, this.state.offset + this.state.perPage);
                const postData = slice.map((pd) =>
                    // eslint-disable-next-line react/jsx-key
                    <React.Fragment>

                        <tr>
                            <td style={style.text}>{pd.notify ?<label style={{color: '#DAE064', fontSize: '80px'}}>{'.'}</label> : ''}</td>
                            <td style={style.text}>{pd.status}</td>
                            <td style={style.text}>{pd.assetId}</td>
                            <td style={style.text}>{pd.folio}</td>
                            <td style={style.text}>{pd.client}</td>
                            <td style={style.text}>{pd.tipoContrato}</td>
                            <td style={style.text}>{pd.subTipoContrato}</td>
                            <td style={style.text}>{this.formatDate(pd.createdDate)}</td>
                            <td style={style.text}><img className='customIcon' src={SeeIcon}></img></td>
                        </tr>
                    </React.Fragment>);

                this.setState({
                    pageCount: Math.ceil(data.content.length / this.state.perPage),
                    postData,
                });
            });
    }


    render() {
        const style = {
            container: {
                height: 'auto',
                width: '95%',
                marginTop: '50px',
                backgroundColor: 'white',
            }, title: {
                textAlign: 'center ',
                margin: '2px', padding: '5px 5px', paddingTop: '20px',
                fontSize: '11pt',
            }, text: {
                padding: '8px',
                fontSize: '9pt', textAlign: 'center',

            },
        };
        return (

            <div className="bodyContainer">

                <div style={{display: 'flex', paddingLeft: '3rem', paddingTop: '2rem', marginTop: '10px'}}>
                    <label style={{fontSize: '20pt'}}>
                                Alarmas(4)
                    </label>
                </div>
                <div style={style.container} className="ui container">
                    <div style={{textAlign: 'center', paddingTop: '20px'}}>
                        <div style={{float: 'left', marginLeft: '20px'}}>
                            <button style={{width: '220px', backgroundColor: 'white', border: '4px', borderRadius: ' 4px', border: '1px solid #E1E3E2'}}
                                className="ui  icon right labeled button dropdown button" >
                                <i className="filter icon"></i>
                                <span className="text"> Ordenar por...</span>
                                <div className={'menu ' + (this.state.activeDrop ? 'transition visible' : '')} >
                                    <div className="header">
                                                  Ordenar por
                                    </div>
                                    <div className="divider"></div>
                                    <div className="item">
                                        <span className="text">Important</span>
                                    </div>
                                    <div className="item">
                                        <span className="text">Hopper</span>
                                    </div>
                                    <div className="item">
                                        <span className="text">Discussion</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                        <div style={{float: 'right', marginRight: '15px', width: 'auto'}}>
                            <div>
                                <div className="right floated column">
                                    <div className="ui action input">
                                        <input style={{width: 'auto'}} type="text" id='filter' name='filter' value={this.state.filter} onChange={this.upddateFilter} placeholder="Buscar..." />
                                        <button className="ui icon button">
                                            <i className="search icon"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="divider"></div>
                    <table className="ui striped table" >
                        <thead>
                            <tr>
                                <th style={style.title}>{' '}</th>
                                <th style={style.title}>Alarma</th>
                                <th style={style.title}>Asset Number</th>
                                <th style={style.title}>Folio</th>
                                <th style={style.title}>Cliente</th>
                                <th style={style.title}>Tipo Contrato</th>
                                <th style={style.title}>Sub-tipo Contrato</th>
                                <th style={style.title}>Fecha</th>
                                <th style={style.title}>Ver detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.render ? this.state.postData:

                                this.searchTable()}
                        </tbody>
                    </table>
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
                </div>
            </div>
        );
    }

    searchTable() {
        const style = {
            container: {
                height: 'auto',
                width: '95%',
                marginTop: '50px',
                backgroundColor: 'white',
            }, title: {
                textAlign: 'center ', color: '#59666e',
                margin: '2px', padding: '5px 5px', paddingTop: '20px',
                fontSize: '11pt', fontFamily: 'Montserrat, semibold ',
            }, text: {
                color: '#838d93 ', padding: '8px',
                fontSize: '9pt', textAlign: 'center',
                fontFamily: 'Montserrat, medium ',
            },
        };
        const styleInfo = {
            paddingRight: '10px',
        };
        const elementStyle ={
            border: 'solid',
            borderRadius: '10px',
            position: 'relative',
            left: '10vh',
            height: '3vh',
            width: '20vh',
            marginTop: '5vh',
            marginBottom: '10vh',
        };

        const items = this.state.data.filter((data)=>{
            (data.title.includes(this.state.filter));
        }).map((items)=>{
            return (
                // eslint-disable-next-line react/jsx-key
                <div>
                    <ul>
                        <li style={{position: 'relative', left: '10vh'}}>
                            <span style={styleInfo}>{items.title}</span>
                            <span style={styleInfo}>{items.id}</span>
                            <span style={styleInfo}>{items.title}</span>
                        </li>
                    </ul>
                </div>
            );
        });

        return (
            <div>
                {items}
                <label>search</label>
            </div>
        );
    }
}
