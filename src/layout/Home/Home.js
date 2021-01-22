import React, { useEffect, useState} from "react";
import './Home.css';

import Chat from "../../components/Chat/Chat";
import { useHistory } from "react-router-dom";
import authService from "../../Authentication/services/auth.service";

function Home(props) {
    const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
    let history = useHistory();

    useEffect(() => {
        if(!currentUser){
            history.push("/login");
        }
    }, []);

    return currentUser ? (<Chat />
    ) : null
}

export default Home;