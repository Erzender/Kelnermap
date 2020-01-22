import React from "react";
import { connect } from "react-redux";

import config from "../../config.json";

const styles = {
  container: {
    display: "flex",
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
  settings: { margin: 20 }
};

const Menu = ({ open, clickClose, settings, checkNations }) => (
  <div style={{ ...styles.container, marginTop: open ? 0 : -210 }}>
    <div onClick={checkNations} style={styles.settings}>
      Nations{" "}
      <input onChange={() => {}} type="checkbox" checked={settings.nations} />
    </div>
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
  checkNations: () => dispatch({ type: "TOGGLE_SETTING", which: "nations" })
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
