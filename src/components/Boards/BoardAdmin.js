import React, { useState, useEffect } from "react";

import UserService from "../../Authentication/services/user.service";
import AuthService from "../../Authentication/services/auth.service";

const BoardAdmin = () => {
  const [content, setContent] = useState("");
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    console.log(currentUser.username);
    UserService.getUserBoard().then(
      (response) => {
        setContent(response.data);
        console.log(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default BoardAdmin;