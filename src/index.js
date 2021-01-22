import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from "recoil";
import recoilPersist from "recoil-persist";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from "./layout/Home/Home";
import BoardUser from "./components/Boards/BoardUser";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import FlipCard from './layout/FlipCard/FlipCard';
import * as serviceWorker from "./serviceWorker";
import Profile from './components/Profile/Profile';

const { RecoilPersist, updateState } = recoilPersist([], {
  key: "recoil-persist",
  storage: sessionStorage,
});

ReactDOM.render(
  <RecoilRoot initializeState={updateState}>
    <RecoilPersist />
    <Router>
          <Route exact path="/" component={App} />
          <Route path="/login" component={FlipCard} />
          <Route path="/chat" component={Home} />
          <Route path="/profile" component={Profile} />
          <Route path="/user" component={BoardUser} />
    </Router>
  </RecoilRoot>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorker.unregister();
