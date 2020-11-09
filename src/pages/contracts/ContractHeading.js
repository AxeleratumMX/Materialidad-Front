import React from 'react';
import Grid from '@material-ui/core/Grid';
import DomainsApi from '../domains/DomainsApi';
import PropTypes from 'prop-types';

const ContractHeading = (props) => {
    const [abstractType, setAbstractType] = React.useState(null);
    const [leaseType, setLeaseType] = React.useState(null);

    const handleError = (e) => console.log(e);

    React.useEffect(() => {
        if (props.contract.templateInstance.abstractType) {
            DomainsApi.findAbstractType(props.contract.templateInstance.abstractType)
                .then((data) => setAbstractType(data))
                .catch(handleError);
        }
    }, [props.contract.templateInstance.abstractType]);

    React.useEffect(() => {
        if (props.contract.templateInstance.leaseType) {
            DomainsApi.findLeaseType(props.contract.templateInstance.leaseType)
                .then((data) => setLeaseType(data))
                .catch(handleError);
        }
    }, [props.contract.templateInstance.leaseType]);

    const timeFormat = {hour: '2-digit', minute: '2-digit'};

    return (
        <div style={{padding: '25px 0px 25px 40px'}}>
            <Grid container spacing={3}>
                <Grid item xl={7} lg={10} md={11} sm={12} xs={12}>
                    <Grid container spacing={3}>

                        <Grid item>Cliente: <b>{props.contract.templateInstance._client ?
                            props.contract.templateInstance._client.nombre : props.contract.templateInstance.clientId}
                        </b></Grid>

                        <Grid item>Código de Propiedad:<b>{props.contract.templateInstance.idActivo}</b></Grid>

                        <Grid item>Estado: <b>{props.contract.templateInstance._status ?
                            props.contract.templateInstance._status.value : props.contract.templateInstance.estado}
                        </b></Grid>

                        <Grid item>Tipo de contrato: <b>{props.contract.templateInstance.tipoContrato}</b></Grid>

                        {abstractType && <Grid item>Tipo de cliente: <b>{abstractType.description}</b></Grid>}

                        {leaseType && <Grid item>Tipo de inmueble: <b>{leaseType.description}</b></Grid>}

                        <Grid item>Plantilla: <b>{props.contract.templateInstance.name}</b></Grid>

                        <Grid item>Última Modificación: <b> {
                            new Date(props.contract.lastModifiedDate).toLocaleDateString('es')+ ' '+
                            new Date(props.contract.lastModifiedDate).toLocaleTimeString('es', timeFormat)
                        }</b></Grid>

                    </Grid>
                </Grid>
                {props.children}
            </Grid>
        </div>
    );
};

ContractHeading.propTypes = {
    contract: PropTypes.object,
    children: PropTypes.node,
};

export default ContractHeading;
