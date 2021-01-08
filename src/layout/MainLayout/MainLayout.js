import React from "react";
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import Home from "../Home/Home";

function MainLayout() {

    return (
        <Router>
            <Route exact path={["/", "/home"]} component={Home} />
        </Router>
    );
}

export default MainLayout;