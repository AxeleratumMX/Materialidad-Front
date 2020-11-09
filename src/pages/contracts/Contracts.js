import React, {Fragment} from 'react';
import ContractsApi from './ContractsApi';
import Alert from '@material-ui/lab/Alert';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import Loading from '../../components/Loading';
import IconButton from '@material-ui/core/IconButton';
import ReactPaginate from 'react-paginate';
import {Link} from 'react-router-dom';
import DownloadIcon from '../../assets/ico_download.svg';
import VerIcon from '../../assets/ico-ver.svg';
import TrackIcon from '../../assets/ico-trazabilidad.svg';
import Container from '@material-ui/core/Container';
import LinearLoading from '../../components/LinearLoading';
import PropTypes from 'prop-types';

const Contracts = (props) => {
    const rowsPerPage = 7;

    const [contracts, setContracts] = React.useState(null);
    const [contractsFiltered, setContractsFiltered] = React.useState(null);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [loading, setLoading] = React.useState(null);
    const [pageCount, setPageCount] = React.useState(null);


    const handleError = (error) => {
        console.log(error);
        setErrorMessage(error.message);
    };

    const populate = (page) => {
        setLoading(true);
        ContractsApi.findAllPaged(rowsPerPage, page)
            .then((data) => {
                setContracts(data.content);
                setContractsFiltered(data.content);
                setPageCount(data.totalPages);
            })
            .catch(handleError)
            .finally(() => setLoading(false));
    };

    React.useEffect(() => {
        populate(0);
    }, []);

    const style = {
        tableTitles: {
            borderTop: '1px solid rgba(224, 224, 224, 1)',
        },
        tableHeader: {
            padding: '20px',
        },
        viewIcon: {
            color: '#63a8db',
        },
        downloadIcon: {
            color: '#a98eaa',
        },
        iconRow: {
            padding: 0,
        },
        iconButton: {
            padding: '4px',
        },
        icon: {
            height: '18pt',
        },
        darkRow: {
            backgroundColor: '#f9fafb',
        },
    };

    const handleSearchChange = (event) => {
        const query = event.target.value;
        if (query && query.length > 2) {
            setContractsFiltered(contracts.filter((contract) => {
                const contractSearch =
                    contract.idActivo + ' ' +
                    contract.client + ' ' +
                    contract.tipoContrato + ' ' +
                    contract.abstractType + ' ' +
                    contract.leaseType;

                return contractSearch.toLowerCase().includes(query.toLowerCase().trim());
            }));
        } else {
            setContractsFiltered(contracts);
        }
    };

    const handleTrackContract = (contractId) => {
        props.history.push(`/traceability/${contractId.id}`);
    };

    const handleViewContract = (contract) => {
        props.history.push(`/contract/${contract.id}`);
    };

    const handleDownloadPdf = (id) => {
        ContractsApi.savePdf(id);
    };

    const handlePageClick = (page) => {
        populate(page.selected);
    };

    return (
        <Fragment>
            {errorMessage &&
            <Alert className="top alert"
                severity='error'
                onClose={() => setErrorMessage(null)}>
                {errorMessage}
            </Alert>}

            <div className="vertical-overflow">
                <Container maxWidth='xl' style={{paddingBottom: '20px'}}>
                    {loading && !contractsFiltered && <Loading/>}
                    {contractsFiltered && <div className="innerContainer">
                        <h1 style={{marginLeft: '10px'}}>Contratos</h1>

                        <TableContainer component={Paper}>
                            <LinearLoading show={loading}/>
                            <div style={style.tableHeader}>
                                <Link to={{pathname: '/contract'}}>
                                    <button style={{height: '33px'}} className="ui green icon left labeled button">
                                        <i className="large white icon plus"/>
                                        Nuevo Contrato
                                    </button>
                                </Link>

                                <div style={{display: 'flex', width: '400px', float: 'right'}}>
                                    <input onChange={handleSearchChange}
                                        className="formInput searchInput"
                                        type="search"
                                        placeholder="Buscar..."/>
                                    <button className="formInputButton">
                                        <i className="search icon"/>
                                    </button>
                                </div>
                            </div>

                            <Table>
                                <TableHead>
                                    <TableRow style={style.tableTitles}>
                                        <TableCell align='right'><h4>Código de propiedad</h4></TableCell>
                                        <TableCell><h4>Cliente</h4></TableCell>
                                        <TableCell><h4>Tipo Contrato</h4></TableCell>
                                        <TableCell><h4>Subtipo de Contrato</h4></TableCell>
                                        <TableCell><h4>Estatus</h4></TableCell>
                                        <TableCell align='center'><h4>Trazabilidad</h4></TableCell>
                                        <TableCell align='center'><h4>Ver</h4></TableCell>
                                        <TableCell align='center'><h4>Descargar</h4></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {contractsFiltered.map((contract, index) => (
                                        <TableRow key={contract.id} style={index % 2 === 0 ? style.darkRow : undefined}>
                                            <TableCell align='right'>{contract.idActivo}</TableCell>
                                            <TableCell>{contract.client}</TableCell>
                                            <TableCell>{contract.tipoContrato}</TableCell>
                                            <TableCell>{contract.abstractType}</TableCell>
                                            <TableCell>
                                                {contract.status ? contract.status.value : contract.estado}
                                            </TableCell>
                                            <TableCell style={style.iconRow} align='center'>
                                                <IconButton style={style.iconButton}
                                                    onClick={() => handleTrackContract(contract)}>
                                                    <img style={style.icon} src={TrackIcon} alt=''/>
                                                </IconButton>
                                            </TableCell>

                                            <TableCell style={style.iconRow} align='center'>
                                                <IconButton style={style.iconButton}
                                                    onClick={() => handleViewContract(contract)}>
                                                    <img style={style.icon} src={VerIcon} alt=''/>
                                                </IconButton>
                                            </TableCell>

                                            <TableCell style={style.iconRow} align='center'>
                                                <IconButton style={style.iconButton}
                                                    onClick={() => handleDownloadPdf(contract.id)}>
                                                    <img style={style.icon} src={DownloadIcon} alt=''/>
                                                </IconButton>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {pageCount !== null ? <div>
                                <ReactPaginate
                                    disabled={loading}
                                    style={{marginBottom: '0'}}
                                    previousLabel={'<'}
                                    nextLabel={'>'}
                                    breakLabel={'...'}
                                    breakClassName={'break-me'}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={handlePageClick}
                                    containerClassName={'pagination'}
                                    subContainerClassName={'pages pagination'}
                                    activeClassName={'active'}/>
                            </div> : null}
                        </TableContainer>
                    </div>}
                </Container>
            </div>
        </Fragment>
    );
};

Contracts.propTypes = {
    history: PropTypes.object,
};
export default Contracts;
