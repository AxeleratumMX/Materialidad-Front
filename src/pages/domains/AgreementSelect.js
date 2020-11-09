import React from 'react';
import PropTypes from 'prop-types';
import DomainsApi from './DomainsApi';
import SearchInput from '../../components/SearchInput';

const AgreementSelect = ({onError = ()=>{}, ...props}) => {
    const [options, setOptions] = React.useState(null);

    React.useEffect(() => {
        let mounted = true;

        DomainsApi.findAllAgreements().then((options) => {
            if (mounted) setOptions(options);
        }).catch(onError);

        return () => mounted = false;
    }, []);


    return (
        <SearchInput
            {...props}
            options={options ? options : []}
            loading={!options}
            label="Tipo de fiador"
            onError={props.onError}
            getOptionLabel={(option) => option.description}
            getOptionSelected={(option, value) => option.key === value.key}
        />
    );
};

AgreementSelect.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    onError: PropTypes.func,
};

export default AgreementSelect;
