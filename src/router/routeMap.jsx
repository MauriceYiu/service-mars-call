/* eslint-disable */

import React, { Component } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";

import Index from "../containers/index";
import SetEmp from "./../containers/setEmp/setEmp";

class RouteMap extends Component {

    render() {
        return (
            <Switch>
                <Route path="/" exact component={Index} />
                <Route path="/setEmp" exact component={SetEmp} />
                <Route path='*' exact render={() => <Redirect to="/" />} />
            </Switch>
        );
    }
}

export default RouteMap;