import React, { useState, useEffect } from "react";
import SignIn from './AuthFormContainer/SignIn';
import SignUp from './AuthFormContainer/SignUp';
import AuthService from "../../Authentication/services/auth.service";
import './FlipCard.css';
  
function FlipCard() {
    return (
        <div className="FlipCard">
            <div className="maincontainer">
                <div id="thecard">
                    <SignIn />
                    <SignUp />
                </div>
            </div>
        </div>
    );
};
  
export default FlipCard;