import React, { useState, useEffect } from "react";
import SignIn from './AuthFormContainer/SignIn';
import SignUp from './AuthFormContainer/SignUp';
import AuthService from "../../Authentication/services/auth.service";
import './FlipCard.css';
  
function FlipCard() {
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
            // setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
            // setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
        }
    }, []);

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