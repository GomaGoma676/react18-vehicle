import React from "react";
import styles from "./App.module.css";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Auth from "./components/Auth";
import MainPage from "./components/MainPage";

const App = () => {
  return (
    <div className={styles.app__root}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Auth} />
          <Route exact path="/vehicle" component={MainPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
