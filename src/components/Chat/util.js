import authHeader from "../../Authentication/services/auth-header";
import authService from "../../Authentication/services/auth.service";

const AUTH_SERVICE = "http://localhost:8080";
const CHAT_SERVICE = "http://localhost:8080";

const user = authService.getCurrentUser();

const request = (options) => {
  const headers = new Headers();

  if (options.setContentType !== false) {
    headers.append("Content-Type", "application/json");
  }

  if (user && user.token) {
    headers.append(
      "Authorization",
      "Bearer " + user.token
    );
  }

  const defaults = {headers: headers};
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export function getCurrentUser() {
  if (user && !user.token) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: AUTH_SERVICE + "/users/me",
    method: "GET",
  });
}

export function getUsers() {
  if (user && !user.token) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: AUTH_SERVICE + "/users/summaries",
    method: "GET",
  });
}

export function countNewMessages(senderId, recipientId) {
  if (user && !user.token) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: CHAT_SERVICE + "/messages/" + senderId + "/" + recipientId + "/count",
    method: "GET",
  });
}

export function findChatMessages(senderId, recipientId) {
  if (user && !user.token) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: CHAT_SERVICE + "/messages/" + senderId + "/" + recipientId,
    method: "GET",
  });
}

export function findChatMessage(id) {
  if (user && !user.token) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: CHAT_SERVICE + "/messages/" + id,
    method: "GET",
  });
}