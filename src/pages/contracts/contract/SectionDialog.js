import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Close from '../../../assets/ico_close.svg';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DynamicForm from './DynamicForm';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import LinearLoading from '../../../components/LinearLoading';
import PropTypes from 'prop-types';

const SectionDialog = (props) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const handleSave = (values) => {
        props.save(values);
    };

    return (
        <Dialog fullScreen={fullScreen}
            maxWidth='lg'
            fullWidth
            open={props.open}
            PaperProps={{
                style: {
                    backgroundColor: 'whitesmoke',
                },
            }}>
            <LinearLoading show={props.loading}/>
            <div style={{textAlign: 'right'}}>
                <Button onClick={props.close} color="secondary">
                    <img style={{width: '20px', paddingTop: '10px', paddingBottom: '10px'}} src={Close} alt='X'/>
                </Button>
            </div>
            <DialogContent>
                <DynamicForm {...props} save={handleSave}/>
            </DialogContent>
            <DialogActions style={{marginTop: '30px', marginBottom: '30px'}}/>
        </Dialog>
    );
};

SectionDialog.propTypes = {
    save: PropTypes.func,
    close: PropTypes.func,
    loading: PropTypes.bool,
    open: PropTypes.bool,
};

export default SectionDialog;
