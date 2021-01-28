import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import TemplatesApi from './TemplatesApi';

const AssetNumberSelect = ({contractType, ...props}) => {
    const [options, setOptions] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        let mounted = true;

        if (props.client) {
            setLoading(true);
            TemplatesApi.findAssetByClient(props.client.idCliente)
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

    return (
        <Fragment>
            <label className="formInputLabel">Código de Cliente</label>
            <div style={{display: 'flex'}} className="ui action input">
                <select id='contractType'
                    className="formInput"
                    {...props}>
                    <option/>
                    {
                        options!=null ? options.map((data, idx) => {
                            return <option key={idx} value={data.idActivo}>{ data.idActivo }</option>
                        }) : ''
                    }
                </select>
            </div>
        </Fragment>
    );
};

AssetNumberSelect.propTypes = {
    value: PropTypes.any,
    onError: PropTypes.func,
    contractType: PropTypes.string,
    client: PropTypes.object,
};

export default AssetNumberSelect;
