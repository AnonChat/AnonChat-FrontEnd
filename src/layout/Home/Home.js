import React from "react";
import './Home.css';

import Chat from "../../components/Chat/Chat";

function Home() {

    return (
        <div className="home-container">
            <div className="main-container">
                <div className="left-panel">
                </div>
                <Chat />
            </div>
        </div>
    );
}

export default Home;