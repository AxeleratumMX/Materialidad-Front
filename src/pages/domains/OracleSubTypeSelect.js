import React from 'react';
import PropTypes from 'prop-types';
import DomainsApi from './DomainsApi';
import SearchInput from '../../components/SearchInput';

const OracleTypeSelect = ({onError = ()=>{}, oracleTypeKey, ...props}) => {
    const [options, setOptions] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        let mounted = true;

        if (oracleTypeKey) {
            setLoading(true);
            DomainsApi.findAllOracleSubTypes(oracleTypeKey).then((options) => {
                if (mounted) {
                    setOptions(options);
                    setLoading(false);
                }
            }).catch(onError);
        } else setOptions(null);

        return () => mounted = false;
    }, [oracleTypeKey]);

    return (
        <SearchInput
            {...props}
            options={options ? options : []}
            loading={loading}
            label="Subtipo de contrato"
            onError={props.onError}
            getOptionLabel={(option) => option.description}
            getOptionSelected={(option, value) => option.key === value.key}
        />
    );
};

OracleTypeSelect.propTypes = {
    oracleTypeKey: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    onError: PropTypes.func,
};

export default OracleTypeSelect;
