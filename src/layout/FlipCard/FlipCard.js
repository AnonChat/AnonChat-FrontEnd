// import React from "react";
import SingIn from './AuthFormContainer/SingIn';
import SingUp from './AuthFormContainer/SingUp';
import './FlipCard.css';
  
function FlipCard() {
    return (
        <div className="FlipCard">
            <div className="maincontainer">
                <div id="thecard">
                    <SingIn></SingIn>
                    <SingUp></SingUp>
                </div>
            </div>
        </div>
    );
}
  
export default FlipCard;