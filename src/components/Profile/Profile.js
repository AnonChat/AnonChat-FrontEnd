import React, { useEffect, useState, useRef} from "react";
import './Profile.css';

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { useHistory } from "react-router-dom";
import profileApi from "./ApiUtil";
import authHeader from "../../Authentication/services/auth-header";
import authService from "../../Authentication/services/auth.service";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div> 
        );
    }
};
function Profile(props) {

    const form = useRef();
    const checkBtn = useRef();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [profilePicture, setprofilePicture] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    let history = useHistory();

    useEffect(() => {
        profileApi.getUserProfile().then(
            (response) => {
                setUsername(response.data.username);
                setEmail(response.data.email);
                console.log(response.data.profilePicture);
                setprofilePicture(response.data.profilePicture);
            })
    }, []);

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangeprofilePicture = (e) => {
        const profilePicture = e.target.value;
        setprofilePicture(profilePicture);
    };

    const handleProfile =(e) => {
        e.preventDefault();
    
        setMessage("");
        setLoading(true);
    
        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            profileApi.changeProfile(username, email, profilePicture).then(
                () => {
                    const user = authService.getCurrentUser()
                    user.email=email;
                    user.profilePicture=profilePicture;
                    localStorage.setItem("user", JSON.stringify(user));
                    changeSide();
                },
                (error) => {
                const resMessage =
                    (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString();

                setLoading(false);
                setMessage(resMessage);
                }
            );
        } else {
            setLoading(false);
        }

    };

    const changeSide = () => {
        history.push("/chat");
        window.location.reload();
    }

    return (
        <div className="profile">
            <div className="frame">
                <div className="image-cropper">
                    <img className="image-to-cropp" src={profilePicture}></img>
                </div>
                <h1>{username}</h1>
                <header>Update your data</header>
            <Form onSubmit={handleProfile} ref={form}>
                <div className="formGroup">
                    <label className="formLabel">Email</label>
                    <div className="formInput">
                        <Input
                            type="text"
                            className="form-control"
                            name="email"
                            value={email}
                            onChange={onChangeEmail}
                            validations={[required]}
                        />
                    </div>
                </div>
                <div className="formGroup">
                    <label className="formLabel">Image URL</label>
                        <div className="formInput">
                            <Input
                                type="text"
                                className="form-control"
                                name="profilePicture"
                                value={profilePicture}
                                onChange={onChangeprofilePicture}
                                // validations={[required]}
                            />
                        </div>
                    </div>
                <button className="btnELO" disabled={loading}>
                    {loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Save</span>
                </button>

                {message && (
                    <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                            {message}
                        </div>
                    </div>
                )}
                <CheckButton style={{ display: "none" }} ref={checkBtn} />
            </Form>
            <button className="buttonBack" 
                onClick={() => {history.push("/chat")}}>
                Back to chat
            </button>
            </div>
        </div>
    );
}

export default Profile;