import React from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import IcoBorrador from '../assets/ico-borrador.svg';
import IcoRevision from '../assets/ico-revision.svg';
import IcoAprobado from '../assets/ico-aprobado.svg';
import IcoFirma from '../assets/ico-firma.svg';
import IcoActivo from '../assets/ico-activo.svg';
import IcoRechazado from '../assets/ico-rechazado.svg';
import IcoActivoOff from '../assets/ico-activo-off.svg';
import IcoAprobadoOff from '../assets/ico-aprobado-off.svg';
import IcoFirmaOff from '../assets/ico-firma-off.svg';
import ContractHeading from '../pages/contracts/ContractHeading.js';
import ContractsApi from '../pages/contracts/ContractsApi';
import Paper from '@material-ui/core/Paper';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Typography from '@material-ui/core/Typography';
import '../styles/generador.css';
import '../assets/font.css';


export default class Traceability extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // eslint-disable-next-line react/prop-types
            id: this.props.match.params.id,
            offset: 0,
            data: [],
            perPage: 10,
            currentPage: 0,
            search: null,
            filter: '',
            render: true,
            header: null,
            REVISION: [],
            FIRMA: [],
            SIGNATORY: [],
            FINAL_STATE: [],
            BLOCKCHAIN: false,
            contract: null,
            documentType: 'html',
            confirm: false,
            template: null,
            REVIEWSIZE: null,
            INITIAL: null,
            review: [],
            traceRevision: [],
            reviewLoad: true,
            blockchainSize: 'https://e0mx7mi0eh-e0lvep4mdp-connect.de0-aws.kaleido.io/instances/0xb3f4ad6e8ef5b126b78de68dab6a278eb34047f1/getSizeHistoryContractByID?id=5f21d342a3a3356c56ccf75d&kld-from=0x0ABa2720bCcE58FB221637a9D5Fc54dE1d593156',
            blockchainHistory: 'https://e0mx7mi0eh-e0lvep4mdp-connect.de0-aws.kaleido.io/instances/0xb3f4ad6e8ef5b126b78de68dab6a278eb34047f1/getStatusHistoryContractByID?id=5f21d342a3a3356c56ccf75d&index=0&kld-from=0x0ABa2720bCcE58FB221637a9D5Fc54dE1d593156',
            uname: 'e0zz5ih3dw',
            pass: 'DSeElK7FMMUGxOHa9laGMsl6D7IuhKyayZPXb7lIUvg',
        };
    }
    downloadPdf() {
        this.pdfRef.current.downloadPdf();
    }
    populate(contractId) {
        if (contractId) {
            ContractsApi.find(contractId)
                .then((contract) => this.setState({contract: contract,
                    template: contract.templateInstance.idTemplate}),
                )
                .catch(this.handleError)
                .finally(this.kaleidoRequest());
        } else this.loadingFinished();
    }
    componentDidMount() {
        this.setTimeout();
        this.populate(this.state.id);
    }
    kaleidoRequest() {
        this.getSizeTrace();
    }
    getSizeTrace() {
        const uname = 'u1qlpkbgbf';
        const pass = '1jCeGYtwCiJyRLGcA8OiNeT9bb_SjSW2yKbihOfLhe8';
        const _url='https://u1bgxqcgm9-u1u89pwd0u-connect.us1-azure.kaleido.io/instances/0xf3eeda9d65e2baacaf2fb4e79161ad5a8583251b/getSizeHistoryContractByID?id=';
        const id=this.state.id;
        // let id = '00'
        const url_='&kld-from=0x4a58073784b7eBF6F7c0812283AEDAFb58D8331A';
        const urlFull = _url+id+url_;
        // axios.get(url, {
        axios.get(urlFull, {
            auth: {
                username: uname,
                password: pass,
            },
        }).then((res) => {
            this.getHistoryTrace(res.data);
        });
    }
    async getHistoryTrace(data) {
        let i;
        const uname = 'u1qlpkbgbf';
        const pass = '1jCeGYtwCiJyRLGcA8OiNeT9bb_SjSW2yKbihOfLhe8';
        const _url='https://u1bgxqcgm9-u1u89pwd0u-connect.us1-azure.kaleido.io/instances/0xf3eeda9d65e2baacaf2fb4e79161ad5a8583251b/getStatusHistoryContractByID?id=';
        const id = this.state.id;
        // let id = '00'
        const url='&index=';
        const url_='&kld-from=0x4a58073784b7eBF6F7c0812283AEDAFb58D8331A';
        const size= data.output;
        const array=[].sort((a, b) => a - b);
        const arrayState=[];

        for ( i = 0; i < size; i++) {
            const idx=i;
            const urlFull=_url+id+url+idx+url_;
            await axios.get(urlFull, {
                auth: {
                    username: uname,
                    password: pass,
                },
            }).then((res) => {
                array.push(res.data);
            });
        } this.setState({
            review: array, reviewLoad: false, traceRevision: arrayState,
        });
    }
    formatDate(date) {
        console.log('click date', date);
        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }
        const d = new Date(date);
        return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('-');
    }
    setTimeout() {
        setTimeout(this.setState.bind(this, {BLOCKCHAIN: true}), 5000);
    }

    render() {
        const style = {
            container: {
                paddingLeft: '3rem',
                marginTop: '10rem',
                marginBottom: '10rem',
                height: 'auto',
                width: '95%',
                backgroundColor: 'white',
            }, divCustom: {
                marginBottom: '-6px', padding: '5px',
            }, label: {
                color: '#585656', fontSize: '12pt', fontFamily: 'Montserrat, semibold ',
            }, labelCustom: {
                fontSize: '9pt', color: '#838d93', margin: '10px',
            }, iconFlecha: {
                display: 'inline-block',
                position: 'relative', top: '-80px',
                textAlign: 'center', marginTop: '10rem',
            }, dataEstatus: {
                display: 'inline-block', margin: '8px', textAlign: 'center',
            }, adjustText: {
                position: 'relative', top: '-10px',
            },
        };
        return (
            <React.Fragment>
                <div className="bodyContainer">
                    <div style={{display: 'flex', paddingLeft: '3rem', paddingTop: '2rem', marginTop: '10px', marginBottom: '10px'}}>
                        <label style={{paddingLeft: '2rem', fontSize: '20pt', fontFamily: 'Montserrat, semibold ', color: '#59666e'}}>Trazabilidad</label>
                    </div>
                    {this.state.contract && <Paper variant="outlined" square style={{marginBottom: '20px', marginLeft: '20px', marginRight: '20px'}}>
                        <ContractHeading contract={this.state.contract}/>
                    </Paper>}
                    {
                        this.state.BLOCKCHAIN ?
                            <Paper variant="outlined" square style={{marginBottom: '20px', marginLeft: '20px', marginRight: '20px'}}>
                                <div style={{float: 'left', paddingLeft: '-1rem', paddingTop: '2rem'}}>
                                    <p style={{textAlign: 'center'}}>
                                        <img style={{width: '35px', verticalAlign: 'middle', marginRight: '10px'}} src={IcoBorrador} alt=''></img>
                                                Borrador
                                    </p>
                                    <p style={{textAlign: 'center', paddingLeft: '1rem', clear: 'both'}}>
                                        <img style={{width: '35px', verticalAlign: 'middle', marginRight: '10px'}} src={IcoRevision}></img>
                                                En revisión
                                    </p>
                                    <p style={{textAlign: 'center', paddingLeft: '1.3rem'}}>
                                        <img style={{width: '35px', verticalAlign: 'middle', marginRight: '10px'}} src={IcoAprobado}></img>
                                                Aprobación
                                    </p>
                                    <p style={{textAlign: 'center', paddingLeft: '1rem'}}>
                                        <img style={{width: '35px', verticalAlign: 'middle', marginRight: '10px'}} src={IcoRechazado}></img>
                                                Rechazado
                                    </p>
                                    <p style={{textAlign: 'center'}}>
                                        <img style={{width: '35px', verticalAlign: 'middle', marginRight: '10px'}} src={IcoFirma}></img>
                                                En Firma
                                    </p>
                                    <p style={{textAlign: 'center', marginLeft: '-1rem'}}>
                                        <img style={{width: '35px', verticalAlign: 'middle', marginRight: '10px'}} src={IcoActivo}></img>
                                            Activo
                                    </p>
                                </div>
                                <div style={style.container} className="ui container">
                                    {this.renderTraceability()}
                                </div>
                            </Paper> :
                            <div style={{paddingLeft: '55rem', paddingTop: '1rem'}}>
                                <div style={{paddingLeft: '5rem'}}>
                                    <CircularProgress size={100} color="secondary" />
                                </div>
                                <strong><p style={{paddingLeft: '2rem'}}>Conectando con Blockchain ....</p></strong>
                            </div>
                    }
                </div>
            </React.Fragment>
        );
    }


    renderTraceability() {
        const {review} = this.state;
        let array;
        if (review.length > 1) {
            array = review.sort((a, b) => a.output5 - b.output5);
        }
        return (
            <React.Fragment>
                {
                    array!=null ?
                        array.map((reviews, idx) => {
                            console.log('data data x', reviews);
                            return <div key={idx} style={{paddingLeft: '4rem', paddingTop: '-10rem'}}>

                                {
                                    <React.Fragment>
                                        <Timeline align="alternate">
                                            <TimelineItem>
                                                {
                                                    reviews.output4==='BORRADOR'?
                                                        <TimelineOppositeContent>
                                                            <Typography>Estatus: {<strong>{reviews.output1}</strong>}</Typography>
                                                            <Typography>Usuario:{<strong>{reviews.output}</strong>}</Typography>
                                                            <Typography>Recibido: {<strong>{reviews.output3}</strong>}</Typography>
                                                        </TimelineOppositeContent> :
                                                        reviews.output4==='REVISION_OK'?
                                                            <TimelineOppositeContent>
                                                                <Typography>Estatus: {<strong>{reviews.output1}</strong>}</Typography>
                                                                <Typography>Usuario:{<strong>{reviews.output}</strong>}</Typography>
                                                                <Typography>Recibido: {<strong>{reviews.output3}</strong>}</Typography>
                                                            </TimelineOppositeContent>:
                                                            reviews.output4==='APROBADO'?
                                                                <TimelineOppositeContent>
                                                                    <Typography>Estatus: {<strong>{reviews.output1}</strong>}</Typography>
                                                                    <Typography>Usuario:{<strong>{reviews.output}</strong>}</Typography>
                                                                    <Typography>Recibido: {<strong>{reviews.output3}</strong>}</Typography>
                                                                </TimelineOppositeContent>:
                                                                ''}
                                                <TimelineSeparator>
                                                    <img style={{width: '65px'}} alt='' src={
                                                        reviews.output4==='BORRADOR' ? IcoBorrador:
                                                            reviews.output4==='REVISION_OK' ? IcoAprobado:
                                                                reviews.output4==='REVISION' ? IcoRevision :
                                                                    reviews.output4==='FIRMA' ? IcoFirma :
                                                                        reviews.output4==='APROBADO' ? IcoAprobado :
                                                                            reviews.output4==='ACTIVADO' ? IcoActivo :
                                                                                reviews.output4==='RECHAZADO' ? IcoRechazado :
                                                                                    IcoRevision
                                                    }></img>
                                                    <TimelineConnector />
                                                </TimelineSeparator>
                                                {
                                                    <React.Fragment>
                                                        {
                                                            reviews.output4==='BORRADOR'? <TimelineContent alt=''></TimelineContent> :
                                                                reviews.output4==='APROBADO'? <TimelineContent alt=''></TimelineContent> :
                                                                    reviews.output4==='REVISION_OK'? <TimelineContent alt=''></TimelineContent> :
                                                                        reviews.output4==='ACTIVADO'?
                                                                            <TimelineContent>
                                                                                <Typography>Activación de Contracto</Typography>
                                                                                <Typography>Fecha: {<strong>{reviews.output3}</strong>}</Typography>
                                                                            </TimelineContent> :

                                                                            <TimelineContent>
                                                                                <Typography>Estatus: {<strong>{reviews.output1}</strong>}</Typography>
                                                                                <Typography>Usuario:{<strong>{reviews.output}</strong>}</Typography>
                                                                                <Typography>Recibido: {<strong>{reviews.output3}</strong>}</Typography>
                                                                            </TimelineContent>
                                                        }
                                                    </React.Fragment>
                                                }
                                            </TimelineItem>

                                            <TimelineItem>
                                                <TimelineSeparator>
                                                    <TimelineConnector />
                                                </TimelineSeparator>
                                                <TimelineContent></TimelineContent>
                                            </TimelineItem>
                                        </Timeline>
                                    </React.Fragment>
                                }
                            </div>;
                        }) :
                        <Timeline>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <img style={{width: '65px'}} src={IcoBorrador}></img>
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>No hay datos en Blockchain.</TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <img style={{width: '65px'}} src={IcoAprobadoOff}></img>
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent></TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <img style={{width: '65px'}} src={IcoFirmaOff}></img>
                                    <TimelineConnector />
                                </TimelineSeparator>

                                <TimelineContent></TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <img style={{width: '65px'}} src={IcoActivoOff}></img>
                                </TimelineSeparator>
                                <TimelineContent></TimelineContent>
                            </TimelineItem>
                        </Timeline>
                }
            </React.Fragment>
        );
    }
}
