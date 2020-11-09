import React from 'react';
import Alert from '@material-ui/lab/Alert';
import SideMenu from '../../../components/SideMenu';
import TemplateEditor from './TemplateEditor';
import TemplateHeading from './TemplateHeading';
import Grid from '@material-ui/core/Grid';
import ClientSelect from '../../clients/ClientSelect';
import ContractTypeSelect from '../../domains/ContractTypeSelect';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TemplatesApi from '../TemplatesApi';
import ClientsApi from '../../clients/ClientsApi';
import DocumentsApi from '../DocumentsApi';
import AbstractTypeSelect from '../../domains/AbstractTypeSelect';
import DomainsApi from '../../domains/DomainsApi';
import LeaseTypeSelect from '../../domains/LeaseTypeSelect';
import AgreementSelect from '../../domains/AgreementSelect';
import ValidateInput from '../../../components/ValidateInput';
import Loading from '../../../components/Loading';
import OracleTypeSelect from '../../domains/OracleTypeSelect';
import OracleSubTypeSelect from '../../domains/OracleSubTypeSelect';
import Container from '@material-ui/core/Container';
import LinearLoading from '../../../components/LinearLoading';
import PropTypes from 'prop-types';
import ConfirmDialog from '../../../components/ConfirmDialog';

const Template = (props) => {
    const [template, setTemplate] = React.useState(null);
    const [errorMessage, setErrorMessage] = React.useState(null);

    const [client, setClient] = React.useState(null);
    const [contractType, setContractType] = React.useState(null);
    const [abstractType, setAbstractType] = React.useState(null);
    const [leaseType, setLeaseType] = React.useState(null);
    const [agreement, setAgreement] = React.useState(null);
    const [oracleType, setOracleType] = React.useState(null);
    const [oracleSubType, setOracleSubType] = React.useState(null);

    const [content, setContent] = React.useState('');
    const [touched, setTouched] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const [_isDirty, _setDirty] = React.useState(false);
    const [showConfirmLeave, setShowConfirmLeave] = React.useState(false);
    const [navigationLocation, setNavigationLocation] = React.useState(false);

    const blockedNavigation = React.useRef();
    const isMounted = React.useRef(null);
    const isDirty = React.useRef(_isDirty);

    const id = props.match.params.id;

    const setDirty = (dirty) => {
        isDirty.current = dirty;
        _setDirty(dirty);
    };

    React.useEffect(() => {
        if (id) {
            setLoading(true);
            TemplatesApi.find(id)
                .then((template) => {
                    if (isMounted.current) populate(template);
                })
                .catch(handleError)
                .finally(() => setLoading(false));
        }
    }, [id]);

    React.useEffect(() => {
        isMounted.current = true;

        blockedNavigation.current = props.history.block((targetLocation) => {
            if (isDirty.current) {
                setNavigationLocation(targetLocation);
                setShowConfirmLeave(true);
                return false;
            }
            return true;
        });


        return () => {
            blockedNavigation.current && blockedNavigation.current.current && blockedNavigation.current.current();
            isMounted.current = false;
        };
    }, []);

    const handleConfirm = async () => {
        await handleSave(false);
        handleLeave();
    };
    const handleLeave = () => {
        if (blockedNavigation) {
            blockedNavigation.current();
        }
        props.history.push(navigationLocation.pathname);
    };

    const onUnload = (event) => {
        if (isDirty.current) {
            event.preventDefault();
            event.returnValue = true;
        }
    };

    React.useEffect(() => {
        window.addEventListener('beforeunload', onUnload);

        return () => window.removeEventListener('beforeunload', onUnload);
    }, []);

    const populate = (template) => {
        setTemplate(template);
        setContent(decode(template.content));

        if (template.clientId) {
            ClientsApi.find(template.clientId)
                .then((client) => {
                    if (isMounted.current) setClient(client);
                })
                .catch(handleError);
        }

        if (template.abstractType) {
            DomainsApi.findAbstractType(template.abstractType)
                .then((abstract) => {
                    if (isMounted.current) setAbstractType(abstract);
                })
                .catch(handleError);
        }

        if (template.leaseType) {
            DomainsApi.findLeaseType(template.leaseType)
                .then((lease) => {
                    if (isMounted.current) setLeaseType(lease);
                })
                .catch(handleError);
        }

        if (template.acuerdo) {
            DomainsApi.findAgreement(template.acuerdo)
                .then((lease) => {
                    if (isMounted.current) setAgreement(lease);
                })
                .catch(handleError);
        }

        if (template.tipoContratoOracle) {
            DomainsApi.findOracleType(template.tipoContratoOracle)
                .then((agree) => {
                    if (isMounted.current) setOracleType(agree);
                })
                .catch(handleError);
        }

        if (template.subTipoContratoOracle) {
            DomainsApi.findOracleSubType(template.subTipoContratoOracle)
                .then((agree) => {
                    if (isMounted.current) setOracleSubType(agree);
                })
                .catch(handleError);
        }

        setContractType(template.tipoContrato);
    };

    const handleDownload = () => {
        DocumentsApi.buildPdf({...template, content: encode(content)}, template.name).save();
    };

    const encode = (text) => {
        if (!text) return '';
        return Buffer.from(text, 'utf8').toString('base64');
    };

    const decode = (text) => {
        if (!text) return '';
        return Buffer.from(text, 'base64').toString('utf8');
    };

    const handleSave = () => {
        setTouched(true);
        if (template.name && client && abstractType && leaseType && agreement && oracleType && oracleSubType) {
            setLoading(true);
            return TemplatesApi.save(
                {
                    ...template,
                    clientId: client.id,
                    content: encode(content),
                    abstractType: abstractType.key,
                    leaseType: leaseType.key,
                    acuerdo: agreement.key,
                    tipoContratoOracle: oracleType.key,
                    subTipoContratoOracle: oracleSubType.key,
                })
                .then((template) => {
                    if (isMounted.current) {
                        setDirty(false);
                        populate(template);
                        if (props.match.params.id === undefined) {
                            props.history.push(`/template/${template.idTemplate}`);
                        }
                    }
                })
                .catch(handleError)
                .finally(() => {
                    if (isMounted.current) setLoading(false);
                });
        }
    };

    const handleError = (error) => {
        console.log(error);
        const data = error.response.data;
        const errorMessage = data && Array.isArray(data.errors) ? data.errors.map((e) => e.message).join(' - ') : null;
        setErrorMessage(errorMessage ? errorMessage : error.message);
    };

    const handleContractTypeChange = (type) => {
        setContractType(type);
        TemplatesApi.create(type)
            .then((template) => {
                setTemplate(template);
            })
            .catch((e) => {
                setContractType(null);
                handleError(e);
            });
    };

    const handleTemplateNameChange = (name) => {
        setDirty(true);
        setTemplate({...template, name: name});
    };

    const handleAbstractTypeChange = (event, value) => {
        setDirty(true);
        setAbstractType(value);
    };

    const handleLeaseTypeChange = (event, value) => {
        setDirty(true);
        setLeaseType(value);
    };

    const handleAgreementChange = (event, value) => {
        setDirty(true);
        setAgreement(value);
    };

    const handleOracleTypeChange = (event, value) => {
        setDirty(true);
        setOracleType(value);
        setOracleSubType(null);
    };

    const handleOracleSubTypeChange = (event, value) => {
        setDirty(true);
        setOracleSubType(value);
    };

    const handleEditorChange = (newContent) => {
        setDirty(true);
        setContent(newContent);
    };

    const handleClientSelect = (newClient) => {
        setDirty(true);
        setClient(newClient);
    };

    const style = {
        editor: {
            width: '85%',
            height: '75%',
            position: 'relative',
            margin: '0 auto',
            marginTop: '30px',
        },
        editorPlaceholder: {
            width: '100%',
            height: '100%',
            textAlign: 'center',
            placeItems: 'center',
            display: 'grid',
            color: '#dadada',
        },
    };

    return (
        <div>
            {errorMessage &&
            <Alert className="top"
                severity='error'
                onClose={() => setErrorMessage(null)}>
                {errorMessage}
            </Alert>}
            <ConfirmDialog
                disableBackdropClick
                open={showConfirmLeave}
                title="¿Desea guardar los cambios?"
                message="Hay cambios en la plantilla, si no los guarda los mismos se perderán."
                onClose={handleLeave}
                onConfirm={handleConfirm}
                cancelText='Salir'
                confirmText='Guardar'
            />

            <div className="mainContainer vertical-overflow">
                <div className="leftContainer">
                    <SideMenu backTo='/templates'>
                        <Grid container direction="column" style={{padding: '0 25px 0 30px'}} spacing={2}>
                            <Grid item>
                                <ContractTypeSelect
                                    onChange={(e) => handleContractTypeChange(e.target.value)}
                                    value={contractType ? contractType : ''}
                                    disabled={template && template.templateId}
                                />
                            </Grid>
                            <Grid item>
                                <label className="formInputLabel">Nombre de la plantilla</label>
                                <ValidateInput invalid={touched && !template.name} message='Este campo es requerido'>
                                    <input className="formInput flex"
                                        id="templateName" name="templateName"
                                        onChange={(e) => handleTemplateNameChange(e.target.value)}
                                        value={template && template.name ? template.name : ''}
                                        type="text"
                                        disabled={!contractType}
                                    />
                                </ValidateInput>
                            </Grid>

                            <Grid item>
                                <ClientSelect
                                    value={client}
                                    onSelect={handleClientSelect}
                                    disabled={!contractType}
                                    onError={props.onError}
                                    invalid={touched && !client}
                                />
                            </Grid>

                            <Grid item>
                                <AbstractTypeSelect
                                    value={abstractType}
                                    onChange={handleAbstractTypeChange}
                                    disabled={!contractType}
                                    onError={handleError}
                                    invalid={touched && !abstractType}
                                />
                            </Grid>

                            <Grid item>
                                <LeaseTypeSelect
                                    value={leaseType}
                                    onChange={handleLeaseTypeChange}
                                    disabled={!contractType}
                                    onError={handleError}
                                    invalid={touched && !leaseType}
                                />
                            </Grid>

                            <Grid item>
                                <AgreementSelect
                                    value={agreement}
                                    onChange={handleAgreementChange}
                                    disabled={!contractType}
                                    onError={handleError}
                                    invalid={touched && !agreement}
                                />
                            </Grid>

                            <Grid item>
                                <OracleTypeSelect
                                    value={oracleType}
                                    onChange={handleOracleTypeChange}
                                    disabled={!contractType}
                                    onError={handleError}
                                    invalid={touched && !oracleType}
                                />
                            </Grid>

                            <Grid item>
                                <OracleSubTypeSelect
                                    value={oracleSubType}
                                    oracleTypeKey={oracleType ? oracleType.key : null}
                                    onChange={handleOracleSubTypeChange}
                                    disabled={!contractType || !oracleType}
                                    onError={handleError}
                                    invalid={touched && !oracleSubType}
                                />
                            </Grid>
                        </Grid>
                    </SideMenu>
                </div>
                <Container maxWidth="xl" className="rightContainer">

                    <div className="innerContainer">
                        {template && <TemplateHeading
                            download={handleDownload.bind(this)}
                            save={handleSave}
                            disable={loading}
                        />}

                        {loading && (template ? <LinearLoading show={loading}/> : <Loading/>)}
                        {template ?
                            <TemplateEditor
                                style={style.editor}
                                sections={template.sections}
                                values={template.values}
                                onEditorChange={handleEditorChange}
                                initialValue={content}
                            /> :
                            !loading && <Paper variant="outlined" square style={style.editorPlaceholder}>
                                <Typography variant="h4" style={{fontWeight: '100'}}>
                                    Seleccione <span style={{color: '#c1c1c1'}}>Tipo de Contrato</span> para continuar
                                </Typography>
                            </Paper>
                        }
                    </div>
                </Container>
            </div>
        </div>
    );
};

Template.propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    onError: PropTypes.func,
};

export default Template;
