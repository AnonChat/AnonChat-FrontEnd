import React, { useState, useEffect } from "react";
import './style/App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import Login from "./layout/Login";

function App() {
  return (
    <Router>
      <div className="container">
        <Route exact path="/login" component={Login} />
      </div>
    </Router>
  );
}

export default App;