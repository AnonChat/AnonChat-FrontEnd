import React, { useState, useEffect, useRef } from "react";
import './AuthStyle.css';

function SingIn() {

    const ChangeSide = () => {
        document.getElementById("thecard").style.
            transform='rotateY(180deg)';
    };

    return (
        <div className="SingIn">
            <header>Sing in to AnonChat</header>
            <button className="btn2" onClick={ChangeSide}>Don't have an account? Sing up </button>
        </div>
    );
}
  
export default SingIn;