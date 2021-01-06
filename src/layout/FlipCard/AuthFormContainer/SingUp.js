import React, { useState, useEffect } from "react";
import './AuthStyle.css';

function SingUp() {

    const ChangeSide = () => {
        document.getElementById("thecard").style.
          transform='rotateY(180deg)';
    }

    return (
        <div className="SingUp">
            <header>Sing up to AnonChat</header>
            <button className="btn2" onClick={ChangeSide}>Already have an account ? Sing in</button>
        </div>
    );
}
  
export default SingUp;