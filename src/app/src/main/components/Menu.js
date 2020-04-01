import React from "react";
import { connect } from "react-redux";

import config from "../../config.json";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    background: 'repeat url("' + config.api + '/lekelner/asset/wood.jpg")',
    zIndex: 2,
    height: 200,
    overflow: "hidden",
    transition: "margin 0.5s",
    boxShadow: "0px 4px 10px black",
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
  settings: {
    WebkitUserSelect: "none",
    fontWeight: "bold",
    margin: 5,
    cursor: "pointer",
    padding: 5
  },
  foxIcon: {
    width: 15,
    height: 15,
    marginRight: 5
  },
  settingList: {
    userSelect: "none",
    flexWrap: "wrap",
    display: "flex",
    flex: 1,
    flexDirection: "row",
    userSelect: "none",
    marginBottom: 20,
    alignItems: "center",
    marginRight: 30
  },
  firefouf: {
    display: "flex",
    margin: 5,
    fontSize: 10,
    alignItems: "center",
    color: "#DDDDDD"
  },
  kelnerlogo: {
    marginLeft: 10,
    marginBottom: 10,
    width: 80,
    height: 80
  }
};

const Menu = ({
  open,
  clickClose,
  settings,
  checkNations,
  checkCities,
  checkBattle,
  checkAutoplay,
  zoomMore,
  zoomLess
}) => (
  <div style={{ ...styles.container, marginTop: open ? 0 : -210 }}>
    <div style={styles.settingList}>
      <div className="button" onClick={checkNations} style={styles.settings}>
        Nations
        <input onChange={() => {}} type="checkbox" checked={settings.nations} />
      </div>
      <div className="button" onClick={checkCities} style={styles.settings}>
        Villes
        <input onChange={() => {}} type="checkbox" checked={settings.cities} />
      </div>
      <div className="button" onClick={checkBattle} style={styles.settings}>
        Bataille
        <input onChange={() => {}} type="checkbox" checked={settings.battle} />
      </div>
      <div className="button" onClick={checkAutoplay} style={styles.settings}>
        Lecture Auto
        <input
          onChange={() => {}}
          type="checkbox"
          checked={settings.autoplay}
        />
      </div>
      <div className="button" style={styles.settings} onClick={zoomMore}>
        🔍+
      </div>
      <div className="button" style={styles.settings} onClick={zoomLess}>
        🔍-
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "row" }}>
      <img
        style={styles.kelnerlogo}
        src={config.api + "/lekelner/asset/lekelner.png"}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            ...styles.firefouf,
            color: "#AA2222",
            fontSize: 18,
            fontFamily: "Enchanted Land"
          }}
        >
          LE KELNER
        </div>
        <a
          target="blank"
          href="https://www.mozilla.org/fr/firefox/new/"
          style={styles.firefouf}
        >
          <img
            style={styles.foxIcon}
            src={config.api + "/lekelner/asset/fox.png"}
          />
          Site optimisé pour Firefox
        </a>
        <a
          target="blank"
          href="https://github.com/Erzender/Kelnermap"
          style={styles.firefouf}
        >
          <img
            style={styles.foxIcon}
            src={config.api + "/lekelner/asset/github.png"}
          />
          Code source
        </a>
      </div>
    </div>
    <div
      style={{ ...styles.closeWindow, top: open ? 5 : -205 }}
      onClick={clickClose}
    >
      ❌
    </div>
  </div>
);

const mapStateToProps = state => {
  let autoplay = localStorage.getItem("settingAutoplay");
  autoplay = autoplay === "true";
  return {
    open: state.root.menuOpened,
    settings: { ...state.root.settings, autoplay }
  };
};

const mapDispatchToProps = dispatch => ({
  clickClose: () => dispatch({ type: "TOGGLE_MENU" }),
  checkNations: () => dispatch({ type: "TOGGLE_SETTING", which: "nations" }),
  checkCities: () => dispatch({ type: "TOGGLE_SETTING", which: "cities" }),
  checkBattle: () => dispatch({ type: "TOGGLE_SETTING", which: "battle" }),
  checkAutoplay: () => dispatch({ type: "TOGGLE_SETTING", which: "autoplay" }),
  zoomMore: () => dispatch({ type: "ZOOM", modifier: true }),
  zoomLess: () => dispatch({ type: "ZOOM", modifier: false })
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
