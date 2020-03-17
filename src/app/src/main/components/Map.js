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
    userSelect: "none",
    zIndex: -1
  },
  tilesCnt: {
    width: config.mapSize.x,
    height: config.mapSize.z,
    //transition: window.innerWidth > 800 ? "margin 1s" : "none"
  },
  grid: {
    zindex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    //transition: window.innerWidth > 800 ? "margin 1s" : "none",
    display: "flex"
  }
};

const Map = ({ margins, dimensions, zoom }) => (
  <div style={styles.container}>
    <div
      style={{
        ...styles.tilesCnt,
        marginLeft: margins.x,
        marginTop: margins.z
      }}
      onWheel={zoom}
    >
      <img
        style={{ ...styles.mapImage, ...dimensions }}
        src={config.api + "/lekelner/asset/map.jpg"}
      />
      <div
        style={{
          ...styles.grid,
          ...dimensions,
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
  margins: state.root.mapMargins,
  dimensions: {
    width: config.mapSize.x * state.root.settings.zoom,
    height: config.mapSize.z * state.root.settings.zoom
  }
});

const mapDispatchToProps = dispatch => ({
  zoom: e =>
    //dispatch({ type: "MOVE_POSITION", pos: { x: e.clientX, z: e.clientY } }) &&
    dispatch({ type: "ZOOM", modifier: e.deltaY < 0 })
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
