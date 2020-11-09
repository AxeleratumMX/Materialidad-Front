import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';

const ConfirmDialog = ({
    open,
    message,
    title, onConfirm,
    onClose,
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    ...props
}) => {
    return (
        <Dialog open={open} onClose={onClose} {...props}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {cancelText}
                </Button>
                <Button onClick={onConfirm} color="secondary" autoFocus>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ConfirmDialog.propTypes = {
    open: PropTypes.bool,
    message: PropTypes.string,
    title: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    onConfirm: PropTypes.func,
    onClose: PropTypes.func,
};

export default ConfirmDialog;
