import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Home from "./Home/Home";
import FlipCard from "./FlipCard/FlipCard";
import AuthService from "../Authentication/services/auth.service";
import Chat from "../components/Chat/Chat";

function MyApplication() {
    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
    
    return (
        <div>
            {currentUser !== null ? <Home /> : <FlipCard />}
        </div>
    );
}

export default MyApplication;