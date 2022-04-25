import React, { useState } from "react";
import styles from "./Auth.module.css";
import FlipCameraAndroidIcon from "@material-ui/icons/FlipCameraAndroid";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchAsyncLogin, fetchAsyncRegister } from "../features/authSlice";

const Auth = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  const login = async () => {
    const result = await dispatch(
      fetchAsyncLogin({ username: username, password: password })
    );
    if (fetchAsyncLogin.fulfilled.match(result)) {
      setSuccessMsg("Successfully logged in!");
      history.push("/vehicle");
    } else {
      setSuccessMsg("Login error!");
    }
  };
  const authUser = async (e) => {
    e.preventDefault();
    if (isLogin) {
      login();
    } else {
      const result = await dispatch(
        fetchAsyncRegister({ username: username, password: password })
      );
      if (fetchAsyncRegister.fulfilled.match(result)) {
        login();
      } else {
        setSuccessMsg("Registration error!");
      }
    }
  };

  return (
    <div className={styles.auth__root}>
      <span className={styles.auth__status}>{successMsg}</span>
      <form onSubmit={authUser}>
        <div className={styles.auth__input}>
          <label data-testid="label-username">Username: </label>
          <input
            data-testid="input-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.auth__input}>
          <label data-testid="label-password">Password: </label>
          <input
            data-testid="input-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
        <div>
          <FlipCameraAndroidIcon
            data-testid="toggle-icon"
            className={styles.auth__toggle}
            onClick={() => setIsLogin(!isLogin)}
          />
        </div>
      </form>
    </div>
  );
};

export default Auth;
