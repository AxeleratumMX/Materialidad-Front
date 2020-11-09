import React from 'react';
import AppRouter from './AppRouter';
import {BrowserRouter as Router} from 'react-router-dom';
import theme from './theme';
import {MuiThemeProvider} from '@material-ui/core/styles';
import StatusBar from './components/statusBar/StatusBar';
import {createBrowserHistory} from 'history';
import AuthInterceptor from './auth/AuthInterceptor';

export default class App extends React.Component {
    componentDidMount() {

    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div className="app">
                    <Router history={createBrowserHistory()}>
                        <AuthInterceptor/>
                        <StatusBar className="app-header"/>
                        <AppRouter/>
                    </Router>
                </div>
            </MuiThemeProvider>
        );
    }
}
