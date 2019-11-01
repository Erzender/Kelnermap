import React from "react";
import { connect } from "react-redux";

import config from "../../config.json";

const styles = {
  container: {
    margin: 10,
    height: 180,
    width: 180,
    overflow: "hidden",
    cursor: "crosshair"
  }
};

const Zoom = ({ mapStyle, clickZoom }) => (
  <div id="zoom" onClick={clickZoom} style={styles.container}>
    <img style={mapStyle} src={config.api + "/lekelner/asset/map.jpg"} />
  </div>
);

const mapStateToProps = state => ({
  mapStyle: {
    transition: "margin 1s",
    width: Math.abs(config.mapCorners.start.X - config.mapCorners.end.X) * 180,
    marginLeft: state.root.selectedTile ? state.root.selectedTile.x * -176 : 0,
    marginTop: state.root.selectedTile ? state.root.selectedTile.z * -180 : 0
  }
});

const mapDispatchToProps = dispatch => ({
  clickZoom: e =>
    dispatch({
      type: "POS_ZOOM",
      pos: {
        x: parseInt(
          ((e.pageX - document.getElementById("zoom").offsetLeft) *
            config.cali.x) /
            180
        ),
        z: parseInt(
          ((e.pageY - document.getElementById("zoom").offsetTop) *
            config.cali.z) /
            180
        )
      }
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Zoom);
