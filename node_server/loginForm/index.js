const NODE_SERVER_URL = "http://192.168.0.57:8000/";
const loginFormElement = document.querySelector("#form-login-credentials");
loginFormElement.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const username = ev.target.elements.username.value;
  const password = ev.target.elements.password.value;

  fetch(`${NODE_SERVER_URL}login`, {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
    // credentials: 'include',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      res.json().then((json) => {
        localStorage.setItem("Authorization", `Bearer ${json.token}`);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

const testAuthButton = document.querySelector("#test-auth");
testAuthButton.addEventListener("click", () => {
  fetch(`${NODE_SERVER_URL}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      authorization: localStorage.getItem("Authorization"),
    },
  }).then((res) => {
    res.json().then((json) => {
      console.log(json);
    });
  });
});
