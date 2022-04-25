import React, { useEffect } from "react";
import styles from "./MainPage.module.css";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAsyncGetProfile, selectProfile } from "../features/authSlice";
import Segment from "./Segment";
import Brand from "./Brand";
import Vehicle from "./Vehicle";

const MainPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);

  const Logout = () => {
    localStorage.removeItem("token");
    history.push("/");
  };

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetProfile());
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <div className={styles.mainPage__root}>
      <Grid container>
        <Grid item xs>
          {profile.username}
        </Grid>
        <Grid item xs>
          <span data-testid="span-title" className={styles.mainPage__title}>
            Vehicle register system
          </span>
        </Grid>
        <Grid item xs>
          <button data-testid="btn-logout" onClick={Logout}>
            Logout
          </button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={3}>
          <Segment />
        </Grid>
        <Grid item xs={3}>
          <Brand />
        </Grid>
        <Grid item xs={6}>
          <Vehicle />
        </Grid>
      </Grid>
    </div>
  );
};

export default MainPage;
