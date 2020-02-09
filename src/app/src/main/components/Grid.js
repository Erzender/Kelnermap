import React from "react";
import { connect } from "react-redux";

import config from "../../config.json";
import regions from "../../regions.json";

let tab = [];
for (let i = config.mapCorners.start.Z; i <= config.mapCorners.end.Z; i++) {
  let line = [];
  for (let j = config.mapCorners.start.X; j <= config.mapCorners.end.X; j++) {
    line.push(i + "," + j);
  }
  tab.push(line);
}

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    cursor: "url(" + config.api + "/lekelner/asset/sword.png), auto"
  },
  tile: {
    overflow: "hidden",
    flex: 1,
    zIndex: 1,
    transition: "background-color 0.5s"
  }
};

const Grid = ({ clickTile, selectedTile, selectedRegion, regionColors }) => (
  <div style={styles.container}>
    {tab.map((line, i) => (
      <div key={i} style={{ display: "flex", flex: 1 }}>
        {line.map((tile, j) => (
          <div
            onClick={e => {
              clickTile(e, j, i);
            }}
            key={tile}
            style={{
              ...styles.tile,
              outline:
                selectedTile.z === i && selectedTile.x === j
                  ? "thick solid #330000"
                  : "none",
              opacity: regions[i][j] === selectedRegion ? 1 : 0.5,
              backgroundColor:
                regions[i][j] === selectedRegion
                  ? "rgba(100, 50, 0, 0.5)"
                  : regionColors
                  ? regionColors[i][j]
                  : "rgba(0, 0, 0, 0)"
            }}
          />
        ))}
      </div>
    ))}
  </div>
);

const mapStateToProps = state => ({
  selectedTile: state.root.selectedTile
    ? state.root.selectedTile
    : { x: null, z: null },
  selectedRegion:
    (state.root.selectedTile &&
      regions[state.root.selectedTile.z][state.root.selectedTile.x] !== "0" &&
      regions[state.root.selectedTile.z][state.root.selectedTile.x]) ||
    null,
  regionColors: state.root.settings.nations && state.root.nationColorMap
});

const mapDispatchToProps = dispatch => ({
  clickTile: (e, x, z) =>
    dispatch({
      type: "CLICK_TILE",
      pos: { x: e.clientX, z: e.clientY },
      tile: { x, z }
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);
