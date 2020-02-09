import React from "react";
import { connect } from "react-redux";

import config from "../../config.json";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#222222",
    zIndex: 2,
    height: 200,
    overflow: "hidden",
    transition: "margin 0.5s",
    boxShadow: "0px 1px 4px grey",
    color: "white"
  },
  closeWindow: {
    position: "absolute",
    transition: "top 0.5s",
    right: 5,
    fontSize: 20,
    cursor: "pointer",
    userSelect: "none"
  },
  settings: { margin: 5, cursor: "pointer" },
  foxIcon: {
    width: 20,
    height: 20,
    marginRight: 5
  },
  settingList: { display: "flex", flexDirection: "row", userSelect: "none", marginBottom: 20 },
  firefouf: {
    display: "flex",
    margin: 5,
    fontSize: 12,
    alignItems: "center",
    color: "#DDDDDD"
  }
};

const Menu = ({
  open,
  clickClose,
  settings,
  checkNations,
  checkCities,
  checkBattle
}) => (
  <div style={{ ...styles.container, marginTop: open ? 0 : -210 }}>
    <div style={styles.settingList}>
      <div onClick={checkNations} style={styles.settings}>
        Nations
        <input onChange={() => {}} type="checkbox" checked={settings.nations} />
      </div>
      <div onClick={checkCities} style={styles.settings}>
        Villes
        <input onChange={() => {}} type="checkbox" checked={settings.cities} />
      </div>
      <div onClick={checkBattle} style={styles.settings}>
        Bataille
        <input onChange={() => {}} type="checkbox" checked={settings.battle} />
      </div>
    </div>
    <a target="blank" href="https://www.mozilla.org/fr/firefox/new/" style={styles.firefouf}>
      <img
        style={styles.foxIcon}
        src={config.api + "/lekelner/asset/fox.png"}
      />
      Application testée sur Firefox
    </a><a target="blank" href="https://github.com/Erzender/Kelnermap" style={styles.firefouf}>
      <img
        style={styles.foxIcon}
        src={config.api + "/lekelner/asset/github.png"}
      />
      Code source
    </a>
    <div
      style={{ ...styles.closeWindow, top: open ? 5 : -205 }}
      onClick={clickClose}
    >
      ❌
    </div>
  </div>
);

const mapStateToProps = state => ({
  open: state.root.menuOpened,
  settings: state.root.settings
});

const mapDispatchToProps = dispatch => ({
  clickClose: () => dispatch({ type: "TOGGLE_MENU" }),
  checkNations: () => dispatch({ type: "TOGGLE_SETTING", which: "nations" }),
  checkCities: () => dispatch({ type: "TOGGLE_SETTING", which: "cities" }),
  checkBattle: () => dispatch({ type: "TOGGLE_SETTING", which: "battle" })
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
