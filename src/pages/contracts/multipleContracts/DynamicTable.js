import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import PropTypes from 'prop-types';
import DynamicInput from '../contract/DynamicInput';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Tooltip from '@material-ui/core/Tooltip';
import Util from '../ContractsUtil';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const DynamicTable = ({rows, columns, ...props}) => {
    const [validations, setValidations] = React.useState([]);

    const isEmptyString = (str) => str === null || str === undefined || str === '';

    const handleCellChange = (event, rowIndex, column) => {
        const content = event.target.type === 'checkbox' ? event.target.checked.toString() : event.target.value;
        props.onChange(rowIndex, {...column, content});
    };


    const handleCellBlur = (event, rowIndex, column) => {
        if (event.target.type === 'checkbox') return;

        const content = event.target.value;
        if (!isEmptyString(content) && !isEmptyString(column.regex) && !new RegExp(column.regex).test(content)) {
            props.onChange(rowIndex, {...column, content: ''});
        }
    };

    const style = {
        tableTitles: {
            borderTop: '1px solid rgba(224, 224, 224, 1)',
        },
        darkRow: {
            backgroundColor: '#f9fafb',
        },
    };

    const findValue = (row, column) => {
        return row.templateInstance.values.find((v) => v.id === column.id);
    };

    const hasEmptyListValue = (contents, valueId) => {
        return Array.isArray(contents) && contents.some((content) => isEmptyString(content[valueId]));
    };

    const hasEmptyDependency = (value, values, sections) => {
        return value && value.operation && value.operation.params
            .map((param) => values.find((v) => v.id === param.value))
            .filter((value) => !!value)
            .some((value) => {
                const section = sections.find((section) => value.sectionId === section.id);
                return section.type === 'list' ?
                    hasEmptyListValue(section.content, value.id) : isEmptyString(value.content);
            });
    };

    const isEditable = (row, column) => {
        return row.templateInstance.estado === Util.DRAFT_STATUS && findValue(row, column).editable &&
            !hasEmptyDependency(findValue(row, column), row.templateInstance.values, row.templateInstance.sections);
    };

    React.useEffect(() => {
        const newValidations = [];
        rows.forEach((contract) => {
            if (!!contract.templateInstance) newValidations.push(Util.getValidationMessage(contract));
        });
        setValidations(newValidations);
    }, [rows]);


    return (
        <TableContainer>
            <Table stickyHeader>
                <TableHead>
                    <TableRow style={style.tableTitles}>

                        <TableCell align='left'/>

                        {/* <TableCell align='left'>*/}
                        {/*    <h4>Asset Number</h4>*/}
                        {/* </TableCell>*/}

                        {columns.map((column) =>
                            <TableCell key={column.id} align='left'>
                                <h4>{column.description ? column.description : column.id}</h4>
                            </TableCell>,
                        )}

                        <TableCell align='left'>
                            <h4>Estado</h4>
                        </TableCell>

                        <TableCell align='center'/>
                    </TableRow>

                </TableHead>
                <TableBody>
                    {rows.filter((row) => !!row.templateInstance).map((row, rowIndex) => (
                        <TableRow key={rowIndex}
                            style={rowIndex % 2 === 0 ? style.darkRow : undefined}
                        >
                            <TableCell align='left'>
                                {row.templateInstance && row.templateInstance.estado === Util.DRAFT_STATUS &&
                                validations[rowIndex] ?
                                    <Tooltip arrow title={validations[rowIndex]}>
                                        <ErrorOutlineIcon style={{color: '#f10000'}}/>
                                    </Tooltip> : null}

                                {row.templateInstance && row.templateInstance.estado !== Util.DRAFT_STATUS ?
                                    <CheckCircleOutlinedIcon style={{color: '#5cc000'}}/> : null}
                            </TableCell>
                            {/* <TableCell align='left'>*/}
                            {/*    <div style={{maxWidth: '300px'}}>*/}
                            {/*        <ValidateInput*/}
                            {/*            invalid={*/}
                            {/*                row.templateInstance &&*/}
                            {/*                Util.isInvalidValue(row.templateInstance.idActivo, false)*/}
                            {/*            }*/}
                            {/*            message='El campo es requerido'>*/}
                            {/*            <input id="assetNumber" name="assetNumber"*/}
                            {/*                onChange={(e) => props.assetNumberChange(e, rowIndex)}*/}
                            {/*                value={row.templateInstance ? row.templateInstance.idActivo : ''}*/}
                            {/*                disabled={row.id && row.id !== ''}*/}
                            {/*                className="formInput textField"*/}
                            {/*                type="number"*/}
                            {/*            />*/}
                            {/*        </ValidateInput>*/}
                            {/*    </div>*/}
                            {/* </TableCell>*/}

                            {columns.map((column) =>
                                <TableCell key={column.id+''+rowIndex}>
                                    <div style={{display: 'inline-flex', width: '100%'}}>
                                        <div style={{maxWidth: '300px', width: '100%'}}>
                                            <DynamicInput
                                                {...column}
                                                id={column.id+''+rowIndex}
                                                validation={findValue(row, column)}
                                                value={findValue(row, column).content}
                                                iconMessage={true}
                                                onBlur={(e) => handleCellBlur(e, rowIndex, column)}
                                                onChange={(e) => handleCellChange(e, rowIndex, column)}
                                                editable={isEditable(row, column)}
                                            />
                                        </div>
                                    </div>
                                </TableCell>,
                            )}

                            <TableCell align='left'>
                                {row.templateInstance._status ? row.templateInstance._status.value : ''}
                            </TableCell>

                            <TableCell style={style.iconRow} align='center'>
                                {!row.id ? <IconButton style={style.iconButton}
                                    disabled={!!row.id || props.loading}
                                    onClick={() => props.onDelete(row, rowIndex)}>
                                    <Tooltip arrow title="Eliminar">
                                        <DeleteOutlineIcon/>
                                    </Tooltip>
                                </IconButton> : null}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

DynamicTable.propTypes = {
    rows: PropTypes.array,
    columns: PropTypes.array,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    assetNumberChange: PropTypes.func,
    loading: PropTypes.bool,
};

export default DynamicTable;
