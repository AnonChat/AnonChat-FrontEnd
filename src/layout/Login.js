import React, { useState, useEffect } from "react";
import SingIn from './SingIn';
import SingUp from './SingUp';
  
function Login() {
    return (
        <div className="Login">
            <div className="maincontainer">
                <div className="thecard">
                    <SingIn></SingIn>
                </div>
            </div>
        </div>
    );
}
  
export default Login;