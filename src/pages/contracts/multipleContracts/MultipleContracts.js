import React, {Fragment} from 'react';
import Container from '@material-ui/core/Container';
import MultipleContractsSideMenu from './MultipleContractsSideMenu';
import {useLocation} from 'react-router-dom';
import ContractsApi from '../ContractsApi';
import Alert from '@material-ui/lab/Alert';
import Loading from '../../../components/Loading';
import Paper from '@material-ui/core/Paper';
import DynamicTable from './DynamicTable';
import _ from 'lodash';
import Tooltip from '@material-ui/core/Tooltip';
import LinearLoading from '../../../components/LinearLoading';
import Util from '../ContractsUtil';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import GetAppIcon from '@material-ui/icons/GetApp';
import Typography from '@material-ui/core/Typography';
import PrintIcon from '@material-ui/icons/Print';
import JSZip from 'jszip';
import {saveAs} from 'save-as';
import DocumentsApi from '../../templates/DocumentsApi';
import PropTypes from 'prop-types';
import ConfirmDialog from '../../../components/ConfirmDialog';

const useQueryParams = () => new URLSearchParams(useLocation().search);

const MultipleContracts = (props) => {
    const queryParams = useQueryParams();
    const id = props.match.params.id;
    const masterId = queryParams.get('master');

    const [errorMessage, setErrorMessage] = React.useState(null);
    const [columns, setColumns] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [masterContract, setMasterContract] = React.useState(null);
    const [contracts, setContracts] = React.useState([]);
    const [addRows, setAddRows] = React.useState(1);
    const [documentsAnchor, setDocumentsAnchor] = React.useState(null);

    const [openConfirmSave, setOpenConfirmSave] = React.useState(false);
    const [openConfirmRevision, setOpenConfirmRevision] = React.useState(false);


    const handleError = (error) => {
        console.log(error);
        setErrorMessage(error.message);
    };

    const handleDeleteColumn = (deletedColumn) => {
        setColumns(columns.filter((column) => column.id !== deletedColumn.id));
    };

    const handleAddColumn = (newColumn) => {
        if (columns.findIndex((column) => column.id === newColumn.id) < 0) {
            setColumns([...columns, newColumn]);
        }
    };

    const handleAddRow = () => {
        const newContracts = [...contracts];

        for (let i = 0; i < addRows; i++) {
            const newContract = _.cloneDeep(masterContract);
            newContract.id = undefined;
            newContract.templateInstance._status = undefined;
            newContract.templateInstance.estado = Util.DRAFT_STATUS;
            newContract.templateInstance.values.forEach((v) => v.operationErrors = []);
            newContracts.push(newContract);
        }

        setContracts(newContracts);
    };

    React.useEffect(() => {
        if (masterId !== null && masterId!==undefined) {
            ContractsApi.find(masterId)
                .then((contract) => {
                    setMasterContract(contract);
                    setContracts([contract]);
                })
                .catch(handleError)
                .finally(() => setLoading(false));
        }
    }, [masterId]);

    React.useEffect(() => {
        if (id !== null && id!==undefined) {
            ContractsApi.findGroup(id)
                .then((group) => {
                    setMasterContract(group._master);
                    setContracts(group._contracts);
                    setColumns(group._values);
                })
                .catch(handleError)
                .finally(() => setLoading(false));
        }
    }, [id]);


    const updateContract = (contract, newValue) => {
        return {
            ...contract,
            templateInstance: {
                ...contract.templateInstance,
                values: contract.templateInstance.values.map(
                    (prevValue) => prevValue.id === newValue.id ? newValue : prevValue,
                ),
            },
        };
    };

    const handleCalculate = () => {
        setLoading(true);
        const nextContracts = [...contracts];
        Promise.all(nextContracts.filter((c) => c.templateInstance.estado === Util.DRAFT_STATUS).map((contract) => {
            return ContractsApi.validate(contract).then((contractResponse) => {
                contract.templateInstance.values = contractResponse.templateInstance.values;
            });
        })).then(() => {
            setContracts(nextContracts);
            setLoading(false);
        });
    };

    const handleValueChange = (rowIndex, value) => {
        const nextContracts = [...contracts];
        nextContracts[rowIndex] = updateContract(nextContracts[rowIndex], value);
        setContracts(nextContracts);
    };
    const handleDeleteRow = (contract, contractsIndex) => {
        if (!contract.id) {
            setContracts(contracts.filter((c, index) => index !== contractsIndex));
        }
    };

    const handleAssetNumberChange = (event, rowIndex) => {
        const idActivo = event.target.value;
        const nextContracts = [...contracts];
        const contract = contracts[rowIndex];
        nextContracts[rowIndex] = {...contract, templateInstance: {...contract.templateInstance, idActivo: idActivo}};
        setContracts(nextContracts);
    };

    const getOptions = () => {
        return masterContract.templateInstance.values.filter((value) => {
            const section = masterContract.templateInstance.sections.find((s) => s.id === value.sectionId);
            return section && section.type !== 'list';
        });
    };

    const saveGroup = (contracts) => {
        return ContractsApi.saveGroup({
            id,
            contractIds: contracts.map((c) => c.id),
            valuesIds: columns.map((c) => c.id),
            masterContractId: masterContract.id,
        });
    };

    const save = (prevContracts) => {
        const contracts = [...prevContracts];
        return Promise.all(contracts.map((contract) => {
            if (contract.templateInstance.estado === Util.DRAFT_STATUS) {
                return ContractsApi.save(contract).then(async (contractResponse) => {
                    const contractValidation = await ContractsApi.validate(contract);
                    contractResponse.templateInstance.values.forEach((v, index) =>
                        v.operationErrors = contractValidation.templateInstance.values[index].operationErrors);

                    return Promise.resolve(contractResponse);
                });
            } else return Promise.resolve(contract);
        }));
    };

    const onSave = () => {
        setOpenConfirmSave(false);
        setLoading(true);

        save(contracts)
            .then((nextContracts) => {
                setContracts(nextContracts);
                return saveGroup(nextContracts);
            }).then((group) => {
                if (!id) props.history.push(`/multipleContracts/${group.id}`);
            }).catch((error) => setErrorMessage(error))
            .finally(() => setLoading(false));
    };

    const handleSave = () => {
        if (contracts.some((c) => !c.id)) setOpenConfirmSave(true);
        else onSave();
    };

    const handleToRevision = () => {
        setOpenConfirmRevision(true);
    };


    const toRevision = (contract) => {
        const isIncomplete = Util.buildValidations(contract);
        if (contract.templateInstance.estado === Util.DRAFT_STATUS && !isIncomplete && Util.isOkForRevision(contract)) {
            return ContractsApi.changeStatus(contract.id, Util.REVISION_STATUS)
                .then(() => ContractsApi.find(contract.id));
        } else {
            return Promise.resolve(contract);
        }
    };

    const onToRevision = () => {
        setOpenConfirmRevision(false);
        setLoading(true);

        save(contracts)
            .then((nextContracts) => {
                return Promise.all(nextContracts.map((contract) => toRevision(contract)));
            })
            .then((nextContracts) => {
                setContracts(nextContracts);
                return saveGroup(nextContracts);
            }).then((group) => {
                if (!id) props.history.push(`/multipleContracts/${group.id}`);
            }).catch((error) => {
                console.log(error);
                setErrorMessage(error.message);
            }).finally(() => setLoading(false));
    };

    // const isAssetNumberIncomplete = () => {
    //     return contracts.findIndex((c) => c.templateInstance &&
    //         (!c.templateInstance.idActivo || c.templateInstance.idActivo === '') >= 0);
    // };

    const handleDocumentsClicked = (event) => {
        setDocumentsAnchor(event.currentTarget);
    };

    const handleCloseDocuments = () => setDocumentsAnchor(null);

    const handlePrint = async () => {
        handleCloseDocuments();
        setLoading(true);
        DocumentsApi.buildMultiplePdf(contracts.map((c)=> c.templateInstance, 'group.pdf'))
            .toPdf().get('pdf')
            .then((pdf) => {
                pdf.autoPrint();
                window.open(pdf.output('bloburl'), '_blank');
            }).finally(() => setLoading(false));
    };

    const handleDownload = () => {
        const zip = new JSZip();
        const documents = zip.folder('contratos');

        Promise.all(contracts.map((contract, index) => {
            const pdfName = ContractsApi.pdfName(contract.id ? contract.id : index+1)+'.pdf';
            return DocumentsApi.buildPdf(contract.templateInstance, pdfName)
                .output('blob').then((pdf) => documents.file(pdfName, pdf));
        })).then(() => {
            zip.generateAsync({type: 'blob'}).then((blob) => saveAs(blob, 'contratos.zip'));
        });
    };

    const hasEditableContracts = () => {
        return contracts.some((c) => c.templateInstance.estado === Util.DRAFT_STATUS);
    };

    return (
        <Fragment>
            <ConfirmDialog
                open={openConfirmSave}
                title="¿Está Seguro?"
                message='Se crearán nuevos contratos en estado "Borrador". Los nuevos contratos no se podrán eliminar.'
                onClose={() => setOpenConfirmSave(false)}
                onConfirm={onSave}
            />
            <ConfirmDialog
                open={openConfirmRevision}
                title="¿Está Seguro?"
                message="Los contratos pasarán a Revisión y no podrán ser modificados"
                onClose={() => setOpenConfirmRevision(false)}
                onConfirm={onToRevision}
            />
            {loading && !masterContract ? <Loading/> : <div>
                {errorMessage &&
                <Alert className="top alert"
                    severity='error'
                    onClose={() => setErrorMessage(null)}>
                    {errorMessage}
                </Alert>}
                {masterContract ? <div className="mainContainer vertical-overflow" style={{overflowX: 'hidden'}}>
                    <div className="leftContainer">
                        <MultipleContractsSideMenu
                            backUrl={`/contract/${masterContract.id}`}
                            values={getOptions()}
                            columns={columns}
                            onDelete={handleDeleteColumn}
                            onAdd={handleAddColumn}
                        />
                    </div>
                    <Container maxWidth="xl" className="rightContainer">
                        <div className="innerContainer">

                            <div style={{display: 'flex', marginBottom: '5px', width: '100%'}}>
                                <div style={{display: 'flex', width: '50%'}}>
                                    <div style={{width: '70px', padding: '2px'}}>
                                        <input value={addRows}
                                            onChange={((e) => setAddRows(parseInt(e.target.value, 10)))}
                                            className="formInput"
                                            type="number"
                                        />
                                    </div>

                                    <button disabled={loading}
                                        className="ui circular plus icon button"
                                        onClick={handleAddRow}>
                                        <Tooltip title="Agregar" arrow>
                                            <span>
                                                <i className="plus icon" style={{color: 'green', margin: 0}} />
                                            </span>
                                        </Tooltip>
                                    </button>

                                </div>
                                <div style={{display: 'flex', width: '50%', justifyContent: 'flex-end'}}>
                                    <div style={{display: 'flex', justifyContent: 'flex-end', height: '33px'}}>
                                        <button onClick={handleDocumentsClicked}
                                            disabled={loading}
                                            style={{marginRight: '10px'}}
                                            className="ui icon left labeled button">
                                            <i className="white icon file pdf outline red"/>
                                            Documentos
                                        </button>
                                        <Menu keepMounted
                                            open={Boolean(documentsAnchor)}
                                            anchorEl={documentsAnchor}
                                            getContentAnchorEl={null}
                                            onClose={handleCloseDocuments}
                                            marginThreshold={5}
                                            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                                            transformOrigin={{vertical: 'top', horizontal: 'center'}}
                                        >
                                            <MenuItem onClick={handleDownload}>
                                                <ListItemIcon>
                                                    <GetAppIcon/>
                                                </ListItemIcon>
                                                <Typography variant="inherit">Descargar</Typography>
                                            </MenuItem>
                                            <MenuItem onClick={handlePrint}>
                                                <ListItemIcon>
                                                    <PrintIcon/>
                                                </ListItemIcon>
                                                <Typography variant="inherit">Imprimir</Typography>
                                            </MenuItem>
                                        </Menu>

                                        <button onClick={handleCalculate}
                                            disabled={loading || !hasEditableContracts()}
                                            style={{marginRight: '10px'}}
                                            className="ui icon left labeled button">
                                            <i className="white icon calculator violet"/>
                                            Calcular
                                        </button>

                                        <button onClick={handleSave}
                                            disabled={loading || !hasEditableContracts()}
                                            // disabled={loading || isAssetNumberIncomplete()}
                                            style={{marginRight: '10px'}}
                                            className="ui icon left labeled button">
                                            <i className="green icon save"/>
                                            Guardar
                                        </button>

                                        <button onClick={handleToRevision}
                                            disabled={loading || !hasEditableContracts()}
                                            // disabled={loading || isAssetNumberIncomplete()}
                                            className="ui green icon left labeled button">
                                            <i className="white icon check"/>
                                            Revisión
                                        </button>
                                    </div>

                                </div>
                            </div>

                            <div className="overflow" style={{position: 'relative', height: '77vh', left: 0, right: 0}}>
                                <Paper variant="outlined">
                                    <LinearLoading show={loading}/>
                                    <DynamicTable
                                        loading={loading}
                                        rows={contracts}
                                        columns={columns}
                                        onChange={handleValueChange}
                                        onDelete={handleDeleteRow}
                                        assetNumberChange={handleAssetNumberChange}
                                    />
                                </Paper>
                            </div>
                        </div>
                    </Container>
                </div> : null}
            </div>}
        </Fragment>
    );
};

MultipleContracts.propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
};

export default MultipleContracts;
