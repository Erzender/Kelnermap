import React from "react";
import { connect } from "react-redux";

import config from "../../../config.json";

const geoToImage = (mod, x, z) => ({
  x: config.mapSize.x * mod * ((x - config.cali.xOf) / config.cali.x),
  z: config.mapSize.z * mod * ((z - config.cali.zOf) / config.cali.z),
});

const coors = (mod, cities) =>
  cities.map((city) => {
    let geo = geoToImage(mod, city.coor[0], city.coor[1]);
    return { x: geo.x, z: geo.z, id: city.id };
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
    color: "white",
  },
  icon: {
    transition: "box-shadow 0.2s",
    borderRadius: 10,
    zIndex: 1,
    position: "absolute",
    width: 30,
    height: 30,
    cursor: "url(" + config.api + "/lekelner/asset/sword.png), auto",
  },
};

const Cities = ({
  clickCity,
  clickBattle,
  selected,
  battle,
  displayCities,
  battleSelected,
  zoomedCoors,
}) => (
  <div style={styles.container}>
    {displayCities &&
      zoomedCoors.map((coor) => (
        <img
          onClick={(e) => clickCity(coor.id, e)}
          key={coor.id}
          className="city"
          style={{
            ...styles.icon,
            top: coor.z - 35,
            left: coor.x - 10,
            background: coor.id === selected ? "#550000" : "none",
          }}
          src={config.api + "/lekelner/asset/city.png"}
        />
      ))}
    {battle && (
      <img
        onClick={(e) => clickBattle(e)}
        className="city"
        style={{
          ...styles.icon,
          top: battle.z - 35,
          left: battle.x - 10,
          background: battleSelected ? "#550000" : "none",
        }}
        src={config.api + "/lekelner/asset/battle.png"}
      />
    )}
  </div>
);

const mapStateToProps = (state) => ({
  selected: state.root.selectedCity,
  battle:
    state.root.settings.battle && state.root.war
      ? geoToImage(
          state.root.settings.zoom,
          state.root.war.stronghold.x,
          state.root.war.stronghold.z
        )
      : null,
  displayCities: state.root.settings.cities,
  battleSelected: !!state.root.selectedBattle,
  zoomedCoors: state.root.regionInfo
    ? coors(
        state.root.settings.zoom,
        Object.keys(state.root.regionInfo)
          .filter((key) => !!state.root.regionInfo[key].city)
          .map((reg) => ({
            id: reg,
            coor: state.root.regionInfo[reg].city.coor,
          }))
      )
    : [],
});

const mapDispatchToProps = (dispatch) => ({
  clickCity: (city, e) =>
    dispatch({ type: "CLICK_CITY", city }) &&
    dispatch({ type: "MOVE_POSITION", pos: { x: e.clientX, z: e.clientY } }),
  clickBattle: (e) =>
    dispatch({ type: "CLICK_BATTLE" }) &&
    dispatch({ type: "MOVE_POSITION", pos: { x: e.clientX, z: e.clientY } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cities);
