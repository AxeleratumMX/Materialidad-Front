import React from 'react';
import SeeIcon from '../assets/ico-ver.svg';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import DownloadIcon from '../assets/ico-descarga.svg';
import ClonarIcon from '../assets/ico-clonar.svg';
import '../styles/generador.css';
import '../assets/font.css';


export default class History extends React.Component {
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
            header: null,
            API_URL: '/api/v1/dynamicinterface/template/contract/dkclksl',
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
                .get('/api/v1/dynamicinterface/template/contract/dkclksl')
                .then((res) => {
                    const data = res.data;
                    this.setState({data: data, header: data.content});

                    console.log('axios', data.content);
                    const slice = data.content.slice(this.state.offset, this.state.offset + this.state.perPage);
                    const postData = slice.map((pd) =>
                        // eslint-disable-next-line react/jsx-key
                        <React.Fragment>
                            <tr>
                                <td style={style.text}>{pd.status}</td>
                                <td style={style.text}>{this.formatDate(pd.createdDate)}</td>
                                <td style={style.text}>{' '}</td>
                                <td style={style.text}>{' '}</td>
                                <td style={style.text}>{' '}</td>
                                <td style={style.text}>{' '}</td>
                                <td style={style.text}><img className='customIcon' src={SeeIcon}></img></td>
                                <td style={style.text}><img className='customIcon' src={DownloadIcon}></img></td>
                                <td style={style.text}><img className='customIcon' src={ClonarIcon}></img></td>
                            </tr>
                        </React.Fragment>);
                    this.setState({
                        pageCount: Math.ceil(data.content.length / this.state.perPage),
                        postData,
                    });
                });
        }


        render() {
            console.log('ttt', this.state);
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
                }, label: {
                    fontSize: '12pt',
                },
                labelCustom: {
                    fontSize: '12pt', margin: '15px',
                }, divCustom: {
                    marginBottom: '-6px',
                },
            };
            return (


                <div className="bodyContainer">

                    <div style={{paddingLeft: '3rem', paddingTop: '2rem', marginTop: '10px'}}>
                        <div id='asset' style={style.divCustom}>
                            <label style={style.labelCustom}>Asset Number: {<strong><label style={style.label}>{'custom'}</label></strong>}</label>
                            <label style={style.labelCustom}>Folio : {<strong><label style={style.label}>custom</label></strong>}</label>
                            <label style={style.labelCustom}>Cliente : {<strong><label style={style.label}>{'custom'}</label></strong>}</label>
                            <label style={style.labelCustom}>Estatus Actual : {<strong><label style={style.label}>custom</label></strong>}</label>
                        </div>
                        <br ></br>
                        <div id='type' style={style.divCustom}>
                            <label style={style.labelCustom}>Tipo de Contrato : {<strong><label style={style.label}>custom</label></strong>}</label>
                            <label style={style.labelCustom}>Subtipo de Contrato : {<strong><label style={style.label}>{'custom'}</label></strong>}</label>
                        </div>
                        <br></br>
                        <div id='modify' style={style.divCustom}>
                            <label style={style.labelCustom}>Ultima modificacion : {<strong><label style={style.label}>custom</label></strong>}</label>
                            <label style={style.labelCustom}>Modificado por : {<strong><label style={style.label}>custom</label></strong>}</label>
                        </div>
                    </div>
                    <div style={style.container} className="ui container">
                        <div style={{textAlign: 'center', paddingTop: '20px'}}>
                            <div style={{float: 'left', marginLeft: '20px'}}>
                                <button style={{width: '220px', backgroundColor: 'white', border: '4px', borderRadius: ' 4px', border: '1px solid #E1E3E2'}}
                                    className="ui  icon right labeled button dropdown button" >
                                    <i className="filter icon"></i>
                                    <span className="text">Sort by...</span>
                                    <div className={'menu ' + (this.state.activeDrop ? 'transition visible' : '')} >
                                        <div className="header">
                                                      Filter by
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
                                            <input style={{width: 'auto'}} type="text" id='filter' name='filter' value={this.state.filter} onChange={this.upddateFilter} placeholder="Search..." />
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
                                    <th style={style.title}>Estatus</th>
                                    <th style={style.title}>Fecha</th>
                                    <th style={style.title}>{' '}</th>
                                    <th style={style.title}>{' '}</th>
                                    <th style={style.title}>{' '}</th>
                                    <th style={style.title}>{' '}</th>
                                    <th style={style.title}>Ver detalle</th>
                                    <th style={style.title}>Descargar</th>
                                    <th style={style.title}>Clonar</th>
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
