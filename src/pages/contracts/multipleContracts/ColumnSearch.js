import React from 'react';
import SearchInput from '../../../components/SearchInput';
import PropTypes from 'prop-types';

const ColumnSearch = (props) => {
    const [input, setInput] = React.useState('');

    const handleSearchChange = (e, value) => {
        if (value) {
            props.onChange(value);
            setInput('');
        }
    };

    const handleInputChange = (event) => {
        if (event) {
            setInput(event.target.value);
        } else {
            setInput('');
        }
    };

    const filterColumns = (options) => {
        return options.filter((opt) =>
            props.filterOptions.findIndex((filterOption) => filterOption.id === opt.id) < 0);
    };

    return (
        <SearchInput
            icon="plus"
            clearOnBlur={true}
            clearOnEscape={true}
            blurOnSelect={true}
            defaultValue={{id: '', description: ''}}
            inputValue={input}
            options={props.options ? [{id: '', description: ''}, ...filterColumns(props.options)] : []}
            loading={!props.options}
            getOptionLabel={(option) => option ? option.description ? option.description : option.id : ''}
            getOptionSelected={(option, value) => option.id === value.id} // force it function as a select combobox
            getOptionDisabled={(option) => option.id === ''}
            filterSelectedOptions={true}
            onChange={handleSearchChange}
            onInputChange={handleInputChange}
        />
    );
};

const optionType = PropTypes.shape({
    id: PropTypes.string,
    description: PropTypes.string,
});

ColumnSearch.propTypes = {
    onChange: PropTypes.func,
    filterOptions: PropTypes.arrayOf(optionType),
    options: PropTypes.arrayOf(optionType),
};

export default ColumnSearch;
