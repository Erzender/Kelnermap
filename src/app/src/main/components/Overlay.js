import React from "react";
import { connect } from "react-redux";

import config from "../../../config.json";
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
    alignItems: "center",
  },
  upperView: {
    flex: 1,
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "column",
  },
  bottomView: {
    zIndex: 2,
    maxHeight: 200,
    flex: 1,
    width: 800,
    maxWidth: "100%",
    background: 'repeat url("' + config.api + '/lekelner/asset/wood.jpg")',
    color: "white",
    flexDirection: "row",
    display: "flex",
    boxShadow: "0px 0px 30px black",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoBox: {
    padding: 10,
  },
  title: {
    fontFamily: "Enchanted Land",
    fontSize: 40,
    height: 40,
  },
  cityImage: {
    height: 180,
    width: 180,
    margin: 10,
  },
  desc: {
    fontSize: 20,
    display: "flex",
    flexDirection: "row",
  },
  nationColor: {
    height: 20,
    width: 20,
    borderStyle: "solid",
    borderWidth: 3,
    borderColor: "white",
    marginRight: 5,
  },
  menuButton: {
    userSelect: "none",
    overflow: "hidden",
    marginRight: 30,
    borderRadius: 30,
    fontSize: 30,
    background: 'repeat url("' + config.api + '/lekelner/asset/wood.jpg")',
    color: "white",
    height: 40,
    width: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 0px 4px black",
    zIndex: 2,
    transition: "margin 0.5s",
    cursor: "pointer",
  },
  activity: {
    display: "flex",
    flexDirection: "row",
  },
  edifices: {
    backgroundColor: "cadetblue",
    borderRadius: 20,
    display: "flex",
    width: 50,
    fontSize: 16,
    justifyContent: "center",
    margin: 5,
    fontWeight: "bold",
  },
};

const Overlay = ({
  tileInfo,
  coor,
  image,
  menuClick,
  menu,
  clickNation,
  clickRegion,
  pvpClick,
}) => {
  const onClickNation = () => clickNation(tileInfo.nationId);
  const onClickRegion = () => clickRegion(tileInfo.region);
  return (
    <div style={styles.container}>
      <div style={styles.upperView}>
        <Menu />
        <div
          style={{ ...styles.menuButton, marginTop: menu ? -300 : 30 }}
          onClick={pvpClick}
        >
          ⚔️
        </div>
        <div
          style={{ ...styles.menuButton, marginTop: menu ? -300 : 30 }}
          onClick={menuClick}
        >
          ⚙
        </div>
      </div>
      <div style={styles.bottomView}>
        {image && <img style={styles.cityImage} src={image} />}
        <div style={styles.infoBox}>
          <div>{coor}</div>
          {tileInfo && (
            <div
              style={{
                ...styles.title,
                cursor: tileInfo && tileInfo.region ? "pointer" : "none",
              }}
              onClick={onClickRegion}
            >
              {tileInfo.name}
            </div>
          )}
          <div style={styles.activity}>
            {tileInfo && tileInfo.edifices !== undefined && (
              <div style={styles.edifices}>🏠{tileInfo.edifices}</div>
            )}
          </div>
          {tileInfo && tileInfo.nationName && (
            <div style={styles.desc}>
              <div
                style={{
                  ...styles.nationColor,
                  backgroundColor: tileInfo.nationColor,
                }}
              />
              Domination :
              <div style={{ fontWeight: "bold", marginLeft: 5 }}>
                {tileInfo.nationName}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  let region = state.root.selectedTile
    ? state.root.regions[state.root.selectedTile.z][state.root.selectedTile.x]
    : state.root.selectedCity
    ? state.root.selectedCity
    : null;
  let info =
    region && state.root.regionInfo && state.root.regionInfo[region]
      ? state.root.regionInfo[region]
      : state.root.selectedCity &&
        state.root.regionInfo[state.root.selectedCity]
      ? state.root.regionInfo[state.root.selectedCity]
      : state.root.selectedBattle
      ? { n: "Bataille le " + state.root.war.date }
      : null;
  return {
    menu: state.root.menuOpened,
    image:
      window.innerWidth >= 800 && state.root.selectedCity
        ? config.api + "/lekelner/asset/city.png"
        : window.innerWidth >= 800 && state.root.selectedBattle
        ? config.api + "/lekelner/asset/battle.png"
        : window.innerWidth >= 800 && state.root.selectedTile
        ? config.api + "/lekelner/asset/parchment.png"
        : null,
    tileInfo: info && {
      name: info.n,
      region,
      edifices: info.edifices,
      nationId: info.nation && info.nation.id,
      nationName: info.nation && info.nation.name,
      nationColor: info.nation && info.nation.color,
    },
    coor: state.root.selectedTile
      ? parseInt(
          (config.cali.x * state.root.selectedPos.x) / config.mapSize.x +
            config.cali.xOf
        ) +
        ", " +
        parseInt(
          (config.cali.z * state.root.selectedPos.z) / config.mapSize.z +
            config.cali.zOf
        )
      : state.root.selectedCity
      ? state.root.regionInfo[state.root.selectedCity].city.coor.toString()
      : state.root.selectedBattle
      ? state.root.war.stronghold.x + ", " + state.root.war.stronghold.z
      : "",
  };
};

const mapDispatchToProps = (dispatch) => ({
  menuClick: () => dispatch({ type: "TOGGLE_MENU" }),
  clickNation: (id) => id && dispatch({ type: "SHOW_NATION", id }),
  clickRegion: (id) => id && dispatch({ type: "SHOW_REGION", id }),
  pvpClick: () => dispatch({ type: "TOGGLE_PVP" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Overlay);
