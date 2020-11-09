import React, {Fragment} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import ListItemText from '@material-ui/core/ListItemText';
import SideMenu from '../../../components/SideMenu';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import ConfirmDialog from '../../../components/ConfirmDialog';
import Tooltip from '@material-ui/core/Tooltip';
import withStyles from '@material-ui/core/styles/withStyles';
import green from '@material-ui/core/colors/green';

const style = {
    error: {
        color: '#f10000',
    },
    success: {
        color: '#5cc000',
    },
    deleteBtn: {
        margin: '0',
        padding: '7px',
        height: '25px',
        width: '25px',
    },
};

const ContractSideMenu = ({loading, ...props}) => {
    const [open, setOpen] = React.useState(null);

    const collapse = (item) => {
        if (open !== item.id) setOpen(item.id);
        else setOpen(null);
    };

    const itemClicked = (item) => {
        if (isListItem(item)) collapse(item);
        else props.onClick(item);
    };

    const isListItem = (item) => {
        return item.type === 'list';
    };


    const isValid = (item) => {
        return Array.isArray(item._validations) && item._validations.length > 0 && !item._validations.includes(false);
    };

    return (
        <Fragment>
            <SideMenu backTo="/contracts" title="Catálogo de Datos">
                <List>
                    {props.items && props.items.map((item) => (
                        <Fragment key={item.id}>
                            <ListItem button onClick={() => itemClicked(item)}>
                                <ListItemIcon style={{marginLeft: '40px', marginRight: '-20px'}}>
                                    {isValid(item) ? <CheckCircleOutlinedIcon style={style.success}/> :
                                        <ReportProblemOutlinedIcon style={style.error}/>}
                                </ListItemIcon>
                                <ListItemText primary={item.description} style={{wordWrap: 'break-word'}}/>
                                {isListItem(item) && (open === item.id ? <ExpandLess/> : <ExpandMore/>)}
                            </ListItem>
                            <CollapseSectionList item={item} open={open} {...props}/>
                        </Fragment>
                    ))}
                </List>
            </SideMenu>
        </Fragment>
    );
};


const CollapseSectionList = ({item, open, ...props}) => {
    const hiddenConfirmDelete = {
        show: false,
        description: '',
        item: null,
        index: null,
    };

    const [confirmDelete, setConfirmDelete] = React.useState(hiddenConfirmDelete);
    const UNNAMED = 'Sin Nombre';

    const StyledTooltip = withStyles({
        tooltipPlacementRight: {
            marginLeft: '-5px',
        },
    })(Tooltip);


    const handleConfirmDeleteClicked = (item, index) => {
        props.deleteListItemClicked(item, index);
        setConfirmDelete(hiddenConfirmDelete);
    };

    const handleShowConfirmDialog = (e, content, item, index) => {
        e.stopPropagation();

        setConfirmDelete({
            show: true,
            description: content.id ? content.id : UNNAMED,
            item: item,
            index: index,
        });
    };

    const handleNewItem = (item) => {
        props.onClick(item, Array.isArray(item.content) ? item.content.length : 0);
    };

    return (
        <Fragment>
            <Collapse in={open === item.id} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense={true}>
                    {item.content && item.content.map((content, index) => (
                        <Fragment key={index}>
                            <ListItem button onClick={() => props.onClick(item, index)}>
                                <ListItemIcon style={{marginLeft: '60px', marginRight: '-20px'}}>
                                    {item._validations[index] ?
                                        <CheckCircleOutlinedIcon fontSize="small" style={style.success}/> :
                                        <ReportProblemOutlinedIcon fontSize="small" style={style.error}/>}
                                </ListItemIcon>
                                <ListItemText
                                    primary={content.id ? content.id : undefined}
                                    secondary={content.id ? undefined : UNNAMED}
                                />
                                <IconButton
                                    disabled={props.loading}
                                    onClick={(e) => handleShowConfirmDialog(e, content, item, index)}
                                    style={style.deleteBtn}
                                >
                                    <Tooltip title="Eliminar" placement="right" arrow>
                                        <DeleteOutlinedIcon style={{padding: '1px', marginRight: '-2px'}}/>
                                    </Tooltip>
                                </IconButton>
                            </ListItem>
                        </Fragment>
                    ))}
                    <StyledTooltip title="Agregar" placement="right" arrow>
                        <ListItem button onClick={() => handleNewItem(item)}>
                            <ListItemText primary=" . . . " style={{marginLeft: '97px'}}/>
                            <AddIcon style={{color: green[500], fontSize: '20pt', marginRight: '-2px'}}/>
                        </ListItem>
                    </StyledTooltip>
                </List>
            </Collapse>
            <ConfirmDialog
                open={confirmDelete.show}
                title="¿Está Seguro?"
                message={`Si elimina "${confirmDelete.description}" se perderán todos los campos ingresados`}
                onClose={() => setConfirmDelete(hiddenConfirmDelete)}
                onConfirm={() => handleConfirmDeleteClicked(confirmDelete.item, confirmDelete.index)}
            />
        </Fragment>
    );
};

const Item = PropTypes.shape({
    id: PropTypes.string,
    description: PropTypes.string,
    isValid: PropTypes.array,
    content: PropTypes.array,
    _validations: PropTypes.array,
});

ContractSideMenu.propTypes = {
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    items: PropTypes.arrayOf(Item),
};


CollapseSectionList.propTypes = {
    loading: PropTypes.bool,
    open: PropTypes.string,
    deleteListItemClicked: PropTypes.func,
    onClick: PropTypes.func,
    item: Item,
};

export default ContractSideMenu;
