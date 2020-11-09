import React from 'react';
import Templates from './pages/templates/Templates';
import Template from './pages/templates/template/Template';
import Contracts from './pages/contracts/Contracts';
import Contract from './pages/contracts/contract/Contract';
import Validador from './pages/validador';
import CsvProcces from './pages/csvProcces';
import History from './views/history';
import Inbox from './views/inbox';
import User from './views/userManagement';
import UseRoles from './views/userRoles';
import Alarm from './views/alarm';
import Parameter from './views/parameter';
import Trace from './views/traceability';
import Login from './auth/Login';
import {Route, Switch} from 'react-router-dom';
import MultipleContracts from './pages/contracts/multipleContracts/MultipleContracts';

const AppRouter = () => {
    return (
        <Switch>
            <Route exact path="/" component={Inbox}/>
            <Route path="/templates" component={Templates}/>
            <Route exact path="/template/:id" component={Template}/>
            <Route exact path="/template" component={Template}/>
            <Route path="/Contracts" component={Contracts}/>
            <Route exact path="/Contract/:id" component={Contract}/>
            <Route exact path="/Contract" component={Contract}/>
            <Route exact path="/MultipleContracts" component={MultipleContracts}/>
            <Route exact path="/MultipleContracts/:id" component={MultipleContracts}/>
            <Route path="/validador" component={Validador}/>
            <Route path="/csvProcces" component={CsvProcces}/>
            <Route path="/history" component={History}/>
            <Route path="/inbox" component={Inbox}/>
            <Route path="/alarm" component={Alarm}/>
            <Route path="/parameter" component={Parameter}/>
            <Route path="/user" component={User}/>
            <Route path="/userRoles" component={UseRoles}/>
            <Route path="/traceability/:id" component={Trace}/>
            <Route path="/login" component={Login}/>
        </Switch>
    );
};

export default AppRouter;
