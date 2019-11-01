import React from "react";
import { connect } from "react-redux";

import config from "../../config.json";
import regions from "../../regions.json";
import cities from "../../cities.json";
import Zoom from "./Zoom";
import Menu from "./Menu";
import { getNationInfo } from "../duck/thunks";

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
    flex: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column"
  },
  bottomView: {
    zIndex: 2,
    maxHeight: 200,
    flex: 1,
    width: 800,
    maxWidth: "100%",
    backgroundColor: "#222222",
    color: "white",
    flexDirection: "row",
    display: "flex",
    boxShadow: "0px -2px 4px grey",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  infoBox: {
    padding: 10
  },
  title: {
    fontFamily: "Enchanted Land",
    fontSize: 40,
    height: 40
  },
  cityImage: {
    height: 180,
    width: 180,
    margin: 10
  },
  desc: {
    fontSize: 20,
    display: "flex",
    flexDirection: "row"
  },
  nationColor: {
    height: 20,
    width: 20,
    borderStyle: "solid",
    borderWidth: 3,
    borderColor: "white",
    marginRight: 5
  },
  menuButton: {
    borderRadius: 30,
    fontSize: 20,
    backgroundColor: "#222222",
    color: "white",
    height: 40,
    width: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 1px 2px grey",
    zIndex: 2,
    transition: "margin 0.5s",
    cursor: "pointer"
  }
};

const Overlay = ({
  tileInfo,
  coor,
  isZoom,
  isCity,
  menuClick,
  menu,
  clickNation
}) => {
  const onClickNation = () => clickNation(tileInfo.nationId);
  return (
    <div style={styles.container}>
      <div style={styles.upperView}>
        <Menu />
        <div
          style={{ ...styles.menuButton, marginTop: menu ? -300 : 10 }}
          onClick={menuClick}
        >
          ▼
        </div>
      </div>
      <div style={styles.bottomView}>
        {isZoom && <Zoom />}
        {isCity && (
          <img
            style={styles.cityImage}
            src={config.api + "/lekelner/asset/city.png"}
          />
        )}
        <div style={styles.infoBox}>
          <div>{coor}</div>
          {tileInfo && <div style={styles.title}>{tileInfo.name}</div>}
          {tileInfo && tileInfo.nationName && (
            <div style={styles.desc}>
              <div
                style={{
                  ...styles.nationColor,
                  backgroundColor: tileInfo.nationColor
                }}
              />
              Domination :
              <div
                onClick={onClickNation}
                style={{ fontWeight: "bold", marginLeft: 5, cursor: "pointer" }}
              >
                {tileInfo.nationName}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  let region = state.root.selectedTile
    ? regions[state.root.selectedTile.z][state.root.selectedTile.x]
    : null;
  let info =
    region && state.root.regionInfo && state.root.regionInfo[region]
      ? state.root.regionInfo[region]
      : state.root.selectedCity &&
        state.root.regionInfo[state.root.selectedCity]
      ? state.root.regionInfo[state.root.selectedCity]
      : null;
  return {
    menu: state.root.menuOpened,
    isZoom: window.innerWidth >= 800 && state.root.selectedTile,
    isCity: window.innerWidth >= 800 && state.root.selectedCity,
    tileInfo: info && {
      name: info.n,
      nationId: info.nation && info.nation.id,
      nationName: info.nation && info.nation.name,
      nationColor: info.nation && info.nation.color
    },
    coor: state.root.selectedTile
      ? parseInt(
          config.cali.x *
            (config.mapCorners.start.X + state.root.selectedTile.x) +
            state.root.posZoom.x +
            config.cali.xOf
        ) +
        ", " +
        parseInt(
          config.cali.z *
            (config.mapCorners.start.Z + state.root.selectedTile.z) +
            state.root.posZoom.z +
            config.cali.zOf
        )
      : state.root.selectedCity
      ? cities[state.root.selectedCity].x +
        ", " +
        cities[state.root.selectedCity].z
      : ""
  };
};

const mapDispatchToProps = dispatch => ({
  menuClick: () => dispatch({ type: "TOGGLE_MENU" }),
  clickNation: id => dispatch(getNationInfo(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overlay);
