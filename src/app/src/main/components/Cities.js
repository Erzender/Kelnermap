import React from "react";
import { connect } from "react-redux";

import config from "../../config.json";
import cities from "../../cities.json";

const geoToImage = (x, z) => ({
  x:
    (config.mapSize.x * (x - config.mapCorners.start.X * config.cali.x)) /
    (Math.abs(config.mapCorners.end.X - config.mapCorners.start.X) *
      config.cali.x),
  z:
    (config.mapSize.z * (z - config.mapCorners.start.Z * config.cali.z)) /
    (Math.abs(config.mapCorners.end.Z - config.mapCorners.start.Z) *
      config.cali.z)
});

const coors = Object.keys(cities).map(city => {
  let geo = geoToImage(cities[city].x, cities[city].z);
  return { x: geo.x, z: geo.z, id: city };
});

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
    width: 30,
    height: 30,
    cursor: "url(" + config.api + "/lekelner/asset/sword.png), auto"
  }
};

const Cities = ({ clickCity, clickBattle, selected, battle, cities }) => (
  <div style={styles.container}>
    {cities &&
      coors.map(coor => (
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
    {battle && (
      <img
        onClick={e => clickBattle(e)}
        className="city"
        style={{
          ...styles.icon,
          top: battle.z - 35,
          left: battle.x - 10
        }}
        src={config.api + "/lekelner/asset/battle.png"}
      />
    )}
  </div>
);

const mapStateToProps = state => ({
  selected: state.root.selectedCity,
  battle:
    state.root.settings.battle && state.root.war
      ? geoToImage(state.root.war.stronghold.x, state.root.war.stronghold.z)
      : null,
  cities: state.root.settings.cities
});

const mapDispatchToProps = dispatch => ({
  clickCity: (city, e) =>
    dispatch({ type: "CLICK_CITY", city }) &&
    dispatch({ type: "MOVE_POSITION", pos: { x: e.clientX, z: e.clientY } }),
  clickBattle: e =>
    dispatch({ type: "CLICK_BATTLE" }) &&
    dispatch({ type: "MOVE_POSITION", pos: { x: e.clientX, z: e.clientY } })
});

export default connect(mapStateToProps, mapDispatchToProps)(Cities);
