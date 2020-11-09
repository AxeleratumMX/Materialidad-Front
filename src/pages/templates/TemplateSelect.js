import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from '../../components/SearchInput';
import TemplatesApi from './TemplatesApi';
import Typography from '@material-ui/core/Typography';

const TemplateSelect = ({contractType, ...props}) => {
    const [options, setOptions] = React.useState(null);
    const [optionsFiltered, setOptionsFiltered] = React.useState(null);
    const [loading, setLoading] = React.useState(false);


    React.useEffect(() => {
        let mounted = true;

        if (props.client) {
            setLoading(true);
            TemplatesApi.findAllByClient(props.client.id)
                .then((options) => {
                    if (mounted) {
                        setOptions(options);
                        setLoading(false);
                    }
                })
                .catch(props.onError);
        }

        return () => mounted = false;
    }, [props.client]);

    React.useEffect(() => {
        setOptionsFiltered(options && contractType ? options.filter((c) => c.tipoContrato === contractType) : null);
    }, [contractType]);


    const style = {
        datalist: {
            width: '100%',
            display: 'flex',
            fontSize: '11pt',
            textTransform: 'capitalize',
        },
    };


    return (
        <SearchInput
            {...props}
            options={optionsFiltered ? optionsFiltered : []}
            loading={loading}
            label="Plantilla de Contrato"
            onError={props.onError}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option.idTemplate === value.idTemplate}
            renderOption={(template, {selected}) => (
                <div style={{padding: '5px'}}>
                    <div>
                        <Typography
                            component="span"
                            variant="h6"
                            style={style.datalist}
                            color="textPrimary"
                        >{template.name}</Typography>
                        <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                        >{template.abstractType}{', '}{template.leaseType}{', '}{template.agreement}
                        </Typography>
                    </div>
                </div>
            )}
        />
    );
};

TemplateSelect.propTypes = {
    value: PropTypes.any,
    onError: PropTypes.func,
    contractType: PropTypes.string,
    client: PropTypes.object,
};

export default TemplateSelect;
