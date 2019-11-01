import React from "react";
import { connect } from "react-redux";
import config from "../../config.json";

import Grid from "./Grid";
import Overlay from "./Overlay";
import Cities from "./Cities";
import Modal from "./Modal.js";

const styles = {
  container: {
    position: "relative",
    overflow: "hidden",
    flex: 1,
    backgroundColor: "black"
  },
  mapImage: {
    width: config.mapSize.x,
    height: config.mapSize.z,
    userSelect: "none",
    zIndex: -1
  },
  tilesCnt: {
    width: config.mapSize.x,
    height: config.mapSize.z,
    transition: window.innerWidth > 800 ? "margin 1s" : "none"
  },
  grid: {
    zindex: 1,
    width: config.mapSize.x,
    height: config.mapSize.z,
    position: "absolute",
    top: 0,
    left: 0,
    transition: window.innerWidth > 800 ? "margin 1s" : "none",
    display: "flex"
  }
};

const Map = ({ margins }) => (
  <div style={styles.container}>
    <div
      style={{
        ...styles.tilesCnt,
        marginLeft: margins.x,
        marginTop: margins.z
      }}
    >
      <img
        style={styles.mapImage}
        src={config.api + "/lekelner/asset/map.jpg"}
      />
      <div
        style={{
          ...styles.grid,
          marginLeft: margins.x,
          marginTop: margins.z
        }}
      >
        <Grid />
        <Cities />
      </div>
    </div>
    <Overlay />
    <Modal />
  </div>
);

const mapStateToProps = state => ({
  margins: state.root.mapMargins
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
