import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Link
// } from 'react-router-dom';

import FlipCard from "./FlipCard/FlipCard";
import AuthService from "../Authentication/services/auth.service";
import MainLayout from "./MainLayout/MainLayout";

function MyApplication() {
    // const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    // const [showAdminBoard, setShowAdminBoard] = useState(false);
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
        <div>
            {currentUser ? <MainLayout /> : <FlipCard />}
        </div>
    );
}

export default MyApplication;