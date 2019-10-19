import React from "react";
import { connect } from "react-redux";

import config from "../../config.json";
import regions from "../../regions.json";
import regionInfo from "../../regionInfo.json";
import Zoom from "./Zoom";

const styles = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  upperView: {
    flex: 1
  },
  bottomView: {
    zIndex: 1,
    maxHeight: 200,
    flex: 1,
    width: 800,
    maxWidth: "100%",
    backgroundColor: "#222222",
    color: "white",
    flexDirection: "row",
    display: "flex"
  },
  infoBox: {
    padding: 10
  },
  title: {
    fontFamily: "Enchanted Land",
    fontSize: 40,
    height: 40
  }
};

const Overlay = ({ tileInfo, coor }) => (
  <div style={styles.container}>
    <div style={styles.upperView}></div>
    <div style={styles.bottomView}>
      {window.innerWidth >= 800 && <Zoom />}
      <div style={styles.infoBox}>
        <div style={styles.title}>{tileInfo.name}</div>
        <div>{coor}</div>
      </div>
    </div>
  </div>
);

const mapStateToProps = state => {
  let region = state.root.selectedTile
    ? regions[state.root.selectedTile.z][state.root.selectedTile.x]
    : null;
  return {
    tileInfo: {
      num: region ? region : "",
      name: region && regionInfo[region] ? regionInfo[region].n : ""
    },
    coor:
      config.cali.x * (config.mapCorners.start.X + state.root.selectedTile.x) +
      state.root.posZoom.x +
      config.cali.xOf +
      ", " +
      parseInt(
        config.cali.z *
          (config.mapCorners.start.Z + state.root.selectedTile.z) +
          state.root.posZoom.z +
          config.cali.zOf
      )
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overlay);
