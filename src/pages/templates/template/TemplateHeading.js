import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

const TemplateHeading = (props) => {
    const style = {
        button: {
            marginRight: '10px',
        },
        buttonContainer: {
            margin: '15px 10px 0 0',
        },
        download: {
            marginRight: '10px',
            border: '1px solid #d4d4d4',
            padding: '10px',
        },

    };

    return (
        <div style={{padding: '0px 0px 20px 40px'}}>
            <Grid container spacing={3}>
                <Grid container direction="row" justify="flex-end" alignItems="flex-end" style={style.buttonContainer}>

                    <Grid item>
                        <button onClick={props.download}
                            style={style.download}
                            disabled={props.disable}
                            className="ui icon left labeled button">
                            <i className="white icon download"/>
                            Descargar
                        </button>
                    </Grid>


                    <Grid item >
                        <button onClick={props.save}
                            style={style.button}
                            disabled={props.disable}
                            className="ui green icon left labeled button">
                            <i className="white icon save"/>
                            Guardar
                        </button>
                    </Grid>

                </Grid>
            </Grid>
        </div>
    );
};

TemplateHeading.propTypes = {
    download: PropTypes.func,
    save: PropTypes.func,
    disable: PropTypes.bool,
};

export default TemplateHeading;
