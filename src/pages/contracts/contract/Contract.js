import React, {Fragment} from 'react';
import PdfDocument from './PdfDocument';
import SectionDialog from './SectionDialog';
import ContractsApi from '../ContractsApi';
import CreateContractDialog from './CreateContractDialog';
import Loading from '../../../components/Loading';
import Alert from '@material-ui/lab/Alert';
import _ from 'lodash';
import ContractHeading from '../ContractHeading';
import Paper from '@material-ui/core/Paper';
import ConfirmDialog from '../../../components/ConfirmDialog';
import ContractSideMenu from './ContractSideMenu';
import DocumentsApi from '../../templates/DocumentsApi';
import LinearLoading from '../../../components/LinearLoading';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Util from '../ContractsUtil';


export default class Contract extends React.Component {
    state = {
        id: this.props.match.params.id,
        loading: false,
        currentSection: null,
        sectionValues: null,
        sectionIndex: null,
        contract: null,
        errorMessage: null,
        documentType: 'html',
        confirm: false,
        incomplete: true,
        validations: [],
    }

    handleError = (error) => {
        console.log(error);
        this.setState({errorMessage: error.message});
    }

    loadingFinished = () => this.setState({loading: false});
    startLoading = () => this.setState({loading: true});

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.populate(this.state.id);
    }

    populate(contractId) {
        this.startLoading();
        if (contractId) {
            ContractsApi.find(contractId)
                .then((contract) => this.populateContract(contract))
                .catch(this.handleError)
                .finally(this.loadingFinished);
        } else this.loadingFinished();
    }

    populateContract(contract) {
        this.populateValidations(contract);
        this.setState({contract: contract, validations: contract.templateInstance.values});
    }

    handleSectionClicked(section, index) {
        const currentSection = _.cloneDeep(section);
        this.setState({
            currentSection: currentSection,
            sectionIndex: index,
            sectionValues: currentSection ? Util.getSectionValues(
                this.state.contract.templateInstance.values,
                currentSection,
                index,
            ) : null,
        });
    }

    handleCloseSectionDialog() {
        this.setState({currentSection: null});
    }

    handleCloseCreateContractDialog() {
        this.props.history.push('/contracts');
    }

    async save(contract) {
        this.startLoading();
        return await ContractsApi.save(contract)
            .then((response) => {
                this.populateContract(response);
                return response;
            })
            .catch(this.handleError)
            .finally(this.loadingFinished);
    }


    isCurrentSectionValid(contract) {
        const validationErrors = Util.filterValidationErrors(contract.templateInstance.values);
        return validationErrors.findIndex((v) => v.sectionId === this.state.currentSection.id) < 0;
    }

    async handleSectionSaveAndNextClicked(newValues) {
        const prevSection = {...this.state.currentSection};
        const noErrors = await this.sectionSave(newValues);

        if (noErrors) {
            const next = Util.getNextSection(
                prevSection,
                this.state.sectionIndex,
                this.state.contract.templateInstance.sections,
            );
            this.handleSectionClicked(next.section, next.index);
        }
    }

    merge(contract, newValues) {
        // on lists, value's content is stored inside sections
        if (this.state.currentSection.type === 'list') {
            const newItem = newValues.reduce((obj, value) =>
                Object.assign(obj, {[value.id]: value.content}), {},
            ); // build new row object from values

            // select current section from contract
            const section = contract.templateInstance.sections.find((s) => s.id === this.state.currentSection.id);

            if (Array.isArray(section.content)) { // check array
                const index = this.state.sectionIndex;
                if (index === undefined) section.content.push(newItem); // new item
                else section.content[index] = newItem; // edit item
            } else {
                section.content = [newItem]; // init array
            }
        } else { // otherwise value's content is stored in values themselves
            newValues.forEach((newValue) => {
                const index = contract.templateInstance.values.findIndex((oldValue) => oldValue.id === newValue.id);
                contract.templateInstance.values[index] = newValue;
            });
        }
    }

    handleCalculate(newValues) {
        const contract = _.cloneDeep(this.state.contract);
        this.merge(contract, newValues);
        this.startLoading();
        ContractsApi.validate(contract).then((contractResponse) => {
            const sectionValues = Util.getSectionValues(
                contractResponse.templateInstance.values,
                contractResponse.templateInstance.sections.find((s) => this.state.currentSection.id === s.id),
                this.state.sectionIndex,
            );
            this.setState({sectionValues: sectionValues, validations: contractResponse.templateInstance.values});
        }).catch(this.handleError).finally(this.loadingFinished);
    }

    handleSectionSave(newValues) {
        if (!this.state.loading) {
            this.sectionSave(newValues)
                .then((saved) => {
                    if (saved) this.handleCloseSectionDialog();
                });
        }
    }

    async sectionSave(newValues) {
        this.startLoading();
        const contract = _.cloneDeep(this.state.contract);
        this.merge(contract, newValues);
        this.setState({contract: contract});

        return await ContractsApi.validate(contract).then((contractValid) => {
            this.setState({validations: contractValid.templateInstance.values});

            // save only if no errors were found on current section
            if (this.isCurrentSectionValid(contractValid)) {
                return this.save(contract).then(() => true);
            } else return false;
        }).catch(this.handleError).finally(this.loadingFinished);
    }

    populateValidations(contract) {
        const isIncomplete = Util.buildValidations(contract);
        this.setState({incomplete: isIncomplete});
    }

    handleCreateContract(template, assetNumber) {
        ContractsApi.save({templateInstance: {...template, idActivo: assetNumber}})
            .then((contract) => {
                this.props.history.push(`/contract/${contract.id}`);
                this.populateContract(contract);
            })
            .catch(this.handleError)
            .finally(this.loadingFinished);
    }

    async handleChangeStatus() {
        this.handleCloseErrorMessage();
        this.handleCloseConfirmDialog();

        this.startLoading();
        const contract = await ContractsApi.validate(this.state.contract).catch(this.handleError);
        this.populateValidations(contract);
        if (Util.isOkForRevision(contract)) {
            this.changeStatus(Util.REVISION_STATUS);
        } else {
            this.setState({
                errorMessage:
                    'Para pasar a revisión estado todos los campos requeridos deben ser completados correctamente',
            });
            this.loadingFinished();
        }
    }

    changeStatus(newStatus) {
        this.startLoading();
        ContractsApi.changeStatus(this.state.contract.id, newStatus)
            .then(() => this.populate(this.state.contract.id))
            .catch(this.handleError).finally(this.loadingFinished);
    }

    handleDownloadPdf() {
        DocumentsApi.buildPdf(
            this.state.contract.templateInstance,
            ContractsApi.pdfName(this.state.contract.id),
        ).save();
    }

    handleOpenConfirmDialog() {
        this.setState({confirm: true});
    }

    handleMultipleContracts() {
        this.props.history.push({
            pathname: '/multipleContracts',
            search: '?master='+this.state.contract.id,
        });
    }

    handleCloseConfirmDialog() {
        this.setState({confirm: false});
    }

    changeDocumentType() {
        const changed = this.state.documentType === 'html' ? 'pdf' : 'html';
        this.setState({documentType: changed});
    }

    handleCloseErrorMessage() {
        this.setState({errorMessage: null});
    }

    handleDeleteListItem(section, index) {
        const contract = {...this.state.contract};
        const contractSection = this.state.contract.templateInstance.sections.find((s) => s.id === section.id);
        contractSection.content.splice(index, 1);
        this.save(contract).then();
    }

    isEditable() {
        return this.state.contract.templateInstance.estado === Util.DRAFT_STATUS;
    }

    render() {
        const style = {
            button: {
                marginRight: '10px',
            },
            formControl: {
                minWidth: 120,
                marginRight: '10px',
            },
            buttons: {
                marginTop: '15px',
                marginRight: '15px',
            },
        };

        return (
            <div>
                {this.state.errorMessage &&
                <Alert severity='error' className="top alert" onClose={this.handleCloseErrorMessage.bind(this)}>
                    {this.state.errorMessage}
                </Alert>}
                {!this.state.id &&
                <CreateContractDialog
                    open={!this.state.contract}
                    close={this.handleCloseCreateContractDialog.bind(this)}
                    save={this.handleCreateContract.bind(this)}
                />}
                <ConfirmDialog
                    open={this.state.confirm}
                    title="¿Está Seguro?"
                    message="El contrato pasará a Revisión y no podrá ser modificado"
                    onClose={this.handleCloseConfirmDialog.bind(this)}
                    onConfirm={this.handleChangeStatus.bind(this)}
                />
                {!this.state.contract && !!(this.state.id) ?
                    <Loading/> : <div className="mainContainer vertical-overflow">
                        {this.state.contract &&
                        <div className="leftContainer">
                            <ContractSideMenu
                                items={this.state.contract ?
                                    this.state.contract.templateInstance.sections : undefined
                                }
                                onClick={this.handleSectionClicked.bind(this)}
                                deleteListItemClicked={this.handleDeleteListItem.bind(this)}
                                loading={this.state.loading}
                            />
                        </div>}
                        <div className="rightContainer">
                            <div className="innerContainer">
                                <div style={{position: 'relative', height: '77vh', left: 0, right: 0}}>
                                    {this.state.currentSection && this.state.sectionValues &&
                                    <SectionDialog
                                        loading={this.state.loading}
                                        title={this.state.currentSection.description}
                                        editable={this.isEditable()}
                                        values={this.state.sectionValues}
                                        sections={this.state.contract.templateInstance.sections}
                                        sectionId={this.state.currentSection.id}
                                        validations={this.state.validations}
                                        open={!!this.state.currentSection}
                                        close={this.handleCloseSectionDialog.bind(this)}
                                        save={this.handleSectionSave.bind(this)}
                                        calculate={this.handleCalculate.bind(this)}
                                        saveAndNext={this.handleSectionSaveAndNextClicked.bind(this)}
                                    />}
                                    {this.state.contract &&
                                    <Paper variant="outlined" square style={{marginBottom: '20px'}}>
                                        <ContractHeading contract={this.state.contract}>
                                            <Grid container direction="row"
                                                justify="flex-end"
                                                alignItems="flex-end"
                                                style={style.buttons}
                                            >
                                                <Grid item>
                                                    <button onClick={this.handleDownloadPdf.bind(this)}
                                                        style={style.button}
                                                        disabled={this.state.loading}
                                                        className="ui icon left labeled button">
                                                        <i className="white icon download"/>
                                                        Descargar
                                                    </button>
                                                </Grid>

                                                <Grid item>
                                                    <button onClick={this.handleMultipleContracts.bind(this)}
                                                        style={style.button}
                                                        disabled={this.state.incomplete || this.state.loading}
                                                        className="ui icon left labeled button">
                                                        <i className="white icon list"/>
                                                        Alta Masiva
                                                    </button>
                                                </Grid>

                                                {this.isEditable() &&
                                                <Fragment>
                                                    <Grid item>
                                                        <button onClick={this.handleOpenConfirmDialog.bind(this)}
                                                            style={style.button}
                                                            disabled={this.state.incomplete || this.state.loading}
                                                            className="ui green icon left labeled button">
                                                            <i className="white icon check"/>
                                                            Revisión
                                                        </button>
                                                    </Grid>
                                                </Fragment>}
                                            </Grid>
                                        </ContractHeading>
                                    </Paper>}

                                    <LinearLoading show={this.state.loading && !this.state.currentSection}/>
                                    {this.state.contract &&
                                    <PdfDocument
                                        type={this.state.documentType}
                                        loading={this.state.loading}
                                        template={this.state.contract.templateInstance}
                                        fileName={ContractsApi.pdfName(this.state.contract.id)}
                                    />}
                                </div>
                            </div>
                        </div>
                    </div>}
            </div>
        );
    }
}

Contract.propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
};
