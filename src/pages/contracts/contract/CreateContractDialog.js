
 
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import Close from '../../../assets/ico_close.svg';
import Alert from '@material-ui/lab/Alert';
import ClientSelect from '../../clients/ClientSelect';
import ContractTypeSelect from '../../domains/ContractTypeSelect';
import TemplatesApi from '../../templates/TemplatesApi';
import TemplateSelect from '../../templates/TemplateSelect';
import AssetSelect from '../../templates/AssetNumberSelect';
import PropTypes from 'prop-types';

const CreateContractDialog = (props) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [client, setClient] = React.useState(null);

    const [templateOptions, setTemplateOptions] = React.useState(null);
    const [templateOptionsFiltered, setTemplateOptionsFiltered] = React.useState(null);
    const [template, setTemplate] = React.useState(null);

    const [contractType, setContractType] = React.useState(null);

    const [assetNumber, setAssetNumber] = React.useState(null);

    const [errorMessage, setErrorMessage] = React.useState(null);

    const [loading, setLoading] = React.useState(null);


    const handleError = (error) => {
        console.log(error);
        setErrorMessage(error.message);
    };

    const handleSave = () => {
        setLoading(true);
        props.save(template, assetNumber);
    };

    const style = {
        inputContainer: {
            maxWidth: '90%',
            minWidth: '400px',
            padding: '0px 20px 20px',
        },
        actions: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',

        },
    };


    const handleClientChange = (client) => {
        setClient(client);
        populateTemplate(client);
    };

    const populateTemplate = (client) => {
        setTemplate(null);
        setTemplateOptions(null);
        setTemplateOptionsFiltered(null);
        setTemplate(null);
        setContractType(null);

        if (client) {
            TemplatesApi.findAllByClient(client.id)
                .then((contracts) => {
                    setTemplateOptions(contracts);
                    setTemplateOptionsFiltered(contracts);
                })
                .catch(handleError);
        }
    };

    const handleContractTypeChange = (value) => {
        setContractType(value);
        setTemplateOptionsFiltered(templateOptions ? templateOptions.filter((c) => c.tipoContrato === value) : null);
        setTemplate(null);
    };

    const handleTemplateChange = (event, newTemplate) => {
        setTemplate(newTemplate);
    };

    const handleAssetNumberChange = (event) => {
        setAssetNumber(event.target.value);
    };

console.log("templateOptions",templateOptions)
console.log("templateOptionsFiltered",templateOptionsFiltered)
console.log("template",template)
console.log("client",client)

console.log("contractType",contractType)
console.log("assetNumber",assetNumber)

    return (
        <Dialog fullScreen={fullScreen}
            maxWidth='xl'
            open={props.open}
            PaperProps={{
                style: {
                    backgroundColor: 'whitesmoke',
                },
            }}>

            <div style={{textAlign: 'right'}}>
                <Button onClick={props.close} color="secondary">
                    <img style={{width: '20px', paddingTop: '10px', paddingBottom: '10px'}} src={Close} alt='X'/>
                </Button>
            </div>
            <DialogTitle>
                {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
            </DialogTitle>
            <DialogContent>

                <div style={style.inputContainer}>
                    <ClientSelect
                        value={client}
                        onSelect={handleClientChange}
                        onError={handleError}
                        style={style.input}/>
                </div>
                {/* <div style={style.inputContainer}>
                    <label className="formInputLabel">Asset Number</label>
                    <input id="assetNumber" name="assetNumber"
                        onChange={handleAssetNumberChange.bind(this)}
                        value={assetNumber ? assetNumber : ''}
                        className="formInput"
                        type="number"
                    />
        </div>*/}
                <div style={style.inputContainer}>
                    <AssetSelect
                        client={client}
                        onChange={handleAssetNumberChange.bind(this)}
                        disabled={!templateOptionsFiltered}
                        value={assetNumber}
                    />
                </div>

                <div style={style.inputContainer}>
                    <ContractTypeSelect
                        onChange={(e) => handleContractTypeChange(e.target.value)}
                        disabled={!templateOptionsFiltered}
                        value={contractType ? contractType : ''}/>
                </div>
                <div style={style.inputContainer}>
                    <TemplateSelect
                        client={client}
                        contractType={contractType}
                        onChange={handleTemplateChange.bind(this)}
                        disabled={!templateOptionsFiltered || !contractType}
                        value={template}
                    />
                </div>
            </DialogContent>
            <DialogActions style={style.actions}>
                <button type="submit" id="generateContract"
                    disabled={!template || !assetNumber || loading}
                    onClick={handleSave.bind(this)}
                    className="ui green icon left labeled button">
                    <i className="white icon check"/>
                    Generar Contrato
                </button>
            </DialogActions>
        </Dialog>
    );
};

CreateContractDialog.propTypes = {
    save: PropTypes.func,
    open: PropTypes.bool,
    close: PropTypes.func,
};

export default CreateContractDialog;

