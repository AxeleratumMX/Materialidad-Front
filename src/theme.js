import {createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#d32f2f',
        },
        secondary: {
            main: '#1976d2',
        },
    },
    overrides: {
        MuiTooltip: {
            tooltip: {
                fontSize: '8pt',
            },
        },
    },

});

export default theme;
