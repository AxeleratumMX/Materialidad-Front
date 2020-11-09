import React, {Fragment} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SideMenu from '../../../components/SideMenu';
import ConfirmDialog from '../../../components/ConfirmDialog';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import ColumnSearch from './ColumnSearch';
import ClearIcon from '@material-ui/icons/Clear';

const MultipleContractsSideMenu = (props) => {
    const [confirmDelete, setConfirmDelete] = React.useState(null);

    const handleShowConfirmDialog = (e, column) => {
        e.stopPropagation();
        setConfirmDelete(column);
    };

    const handleConfirmDeleteClicked = () => {
        props.onDelete(confirmDelete);
        setConfirmDelete(null);
    };
    const handleSearchChange = (value) => {
        props.onAdd(value);
    };

    const style = {
        deleteBtn: {
            margin: '0',
            padding: '7px',
            height: '30px',
            width: '30px',
        },
        search: {
            padding: '0 25px 10px 25px',
            width: '100%',
        },
        variableList: {
            margin: '0 25px 10px 25px',
            backgroundColor: 'rgba(255,255,255,0.5)',
        },
    };

    return (
        <Fragment>
            <SideMenu backTo={props.backUrl} title="Datos Variables">

                <div style={style.search}>
                    <ColumnSearch
                        onChange={handleSearchChange}
                        options={props.values}
                        filterOptions={props.columns}
                    />
                </div>

                {Array.isArray(props.columns) && props.columns.length > 0 &&
                <Paper variant="outlined" style={style.variableList}>
                    <List component="div" disablePadding dense>
                        {props.columns.map((column, index) => (
                            <Fragment key={index}>
                                {index > 0 && <Divider/>}
                                <ListItem>
                                    <ListItemText primary={column.description ? column.description : column.id}/>
                                    <IconButton
                                        onClick={(e) => handleShowConfirmDialog(e, column)}
                                        style={style.deleteBtn}
                                    >
                                        <Tooltip title="Eliminar" placement="right" arrow>
                                            <ClearIcon fontSize="small"/>
                                        </Tooltip>
                                    </IconButton>
                                </ListItem>
                            </Fragment>
                        ))}
                    </List>
                </Paper>}
            </SideMenu>

            <ConfirmDialog
                open={!!confirmDelete}
                title="¿Está Seguro?"
                message={`Se eliminará la columna "${confirmDelete ? confirmDelete.description : ''}"`}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleConfirmDeleteClicked}
            />
        </Fragment>

    );
};

MultipleContractsSideMenu.propTypes = {
    onDelete: PropTypes.func,
    onAdd: PropTypes.func,
    columns: PropTypes.array,
    values: PropTypes.array,
    backUrl: PropTypes.string,
};

export default MultipleContractsSideMenu;
