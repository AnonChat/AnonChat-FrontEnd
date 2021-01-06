import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import FlipCard from "./FlipCard/FlipCard";

function App() {
  return (
    <Router>
        <Route path="/login" component={FlipCard} />
    </Router>
  );
}

export default App;