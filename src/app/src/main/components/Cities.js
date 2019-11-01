import React from "react";
import { connect } from "react-redux";

import config from "../../config.json";
import cities from "../../cities.json";

const coors = Object.keys(cities).map(city => ({
  x:
    (config.mapSize.x *
      (cities[city].x - config.mapCorners.start.X * config.cali.x)) /
    (Math.abs(config.mapCorners.end.X - config.mapCorners.start.X) *
      config.cali.x),
  z:
    (config.mapSize.z *
      (cities[city].z - config.mapCorners.start.Z * config.cali.z)) /
    (Math.abs(config.mapCorners.end.Z - config.mapCorners.start.Z) *
      config.cali.z),
  id: city
}));

const styles = {
  container: {
    userSelect: "none",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    color: "white"
  },
  icon: {
    transition: "box-shadow 0.2s",
    borderRadius: 10,
    zIndex: 1,
    position: "absolute",
    width: 20,
    height: 20,
    cursor: "url(" + config.api + "/lekelner/asset/sword.png), auto"
  }
};

const Cities = ({ clickCity, selected }) => (
  <div style={styles.container}>
    {coors.map(coor => (
      <img
        onClick={e => clickCity(coor.id, e)}
        key={coor.id}
        className="city"
        style={{
          ...styles.icon,
          top: coor.z - 35,
          left: coor.x - 10,
          background: coor.id === selected ? "#550000" : "none"
        }}
        src={config.api + "/lekelner/asset/city.png"}
      />
    ))}
  </div>
);

const mapStateToProps = state => ({
  selected: state.root.selectedCity
});

const mapDispatchToProps = dispatch => ({
  clickCity: (city, e) =>
    dispatch({ type: "CLICK_CITY", city, pos: { x: e.clientX, z: e.clientY } })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cities);
