import React from "react";
import { connect } from "react-redux";

import config from "../../../config.json";
import Map from "./Map";

const styles = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex"
  }
};

const Router = ({}) => (
  <div style={styles.container}>
    <Map />
  </div>
);

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Router);
