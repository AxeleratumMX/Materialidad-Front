import React, {Fragment} from 'react';
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
import TemplatesApi from './TemplatesApi';
import VerIcon from '../../assets/ico-ver.svg';
import DownloadIcon from '../../assets/ico_download.svg';
import Container from '@material-ui/core/Container';
import LinearLoading from '../../components/LinearLoading';
import PropTypes from 'prop-types';

const Templates = (props) => {
    const rowsPerPage = 7;

    const [templates, setTemplates] = React.useState(null);
    const [templatesFiltered, setTemplatesFiltered] = React.useState(null);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [loading, setLoading] = React.useState(null);
    const [pageCount, setPageCount] = React.useState(null);


    const handleError = (error) => {
        console.log(error);
        setErrorMessage(error.message);
    };

    const populate = (page) => {
        setLoading(true);
        TemplatesApi.findAllPaged(rowsPerPage, page)
            .then((data) => {
                setTemplates(data.content);
                setTemplatesFiltered(data.content);
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
        darkRow: {
            backgroundColor: '#f9fafb',
        },
    };

    const handleSearchChange = (event) => {
        const query = event.target.value;
        if (query && query.length > 2) {
            setTemplatesFiltered(templates.filter((template) => {
                const search =
                    template.name + ' ' +
                    template.client + ' ' +
                    template.tipoContrato + ' ' +
                    template.abstractType + ' ' +
                    template.leaseType;

                return search.toLowerCase().includes(query.toLowerCase().trim());
            }));
        } else {
            setTemplatesFiltered(templates);
        }
    };

    const handleViewTemplate = (template) => {
        props.history.push(`/template/${template.idTemplate}`);
    };
    const handleDownloadPdf = (id) => {
        TemplatesApi.savePdf(id);
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
                    {loading && !templatesFiltered && <Loading/>}
                    {templatesFiltered && <div className="innerContainer">
                        <h1 style={{marginLeft: '10px'}}>Plantillas de Contratos</h1>

                        <TableContainer component={Paper} style={{paddingBottom: '-50px'}}>
                            <LinearLoading show={loading}/>
                            <div style={style.tableHeader}>
                                <Link to={{pathname: '/template'}}>
                                    <button style={{height: '33px'}} className="ui green icon left labeled button">
                                        <i className="large white icon plus"/>
                                        Nuevo Template
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
                                        <TableCell><h4>Nombre</h4></TableCell>
                                        <TableCell><h4>Cliente</h4></TableCell>
                                        <TableCell><h4>Tipo</h4></TableCell>
                                        <TableCell><h4>Abstract Type</h4></TableCell>
                                        <TableCell><h4>Lease Type</h4></TableCell>
                                        <TableCell align='center'><h4>Ver</h4></TableCell>
                                        <TableCell align='center'><h4>Descargar</h4></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {templatesFiltered.map((template, index) =>
                                        <TableRow key={template.idTemplate}
                                            style={index % 2 === 0 ? style.darkRow : undefined}>
                                            <TableCell>{template.name}</TableCell>
                                            <TableCell>{template.client}</TableCell>
                                            <TableCell>{template.tipoContrato}</TableCell>
                                            <TableCell>{template.abstractType}</TableCell>
                                            <TableCell>{template.leaseType}</TableCell>
                                            <TableCell style={style.iconRow} align='center'>
                                                <IconButton style={style.iconButton}
                                                    onClick={() => handleViewTemplate(template)}>
                                                    <img style={{height: '18pt'}} src={VerIcon} alt=''/>
                                                </IconButton>
                                            </TableCell>
                                            <TableCell style={style.iconRow} align='center'>
                                                <IconButton style={style.iconButton}
                                                    onClick={() => handleDownloadPdf(template.idTemplate)}>
                                                    <img style={{height: '18pt'}} src={DownloadIcon} alt=''/>
                                                </IconButton>

                                            </TableCell>
                                        </TableRow>,
                                    )}
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
                                    onPageChange={handlePageClick.bind(this)}
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

Templates.propTypes = {
    history: PropTypes.object,
};

export default Templates;
