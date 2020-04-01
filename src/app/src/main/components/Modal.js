import React from "react";
import { connect } from "react-redux";

import config from "../../config.json";
import Nation from "./ModalNation";
import ModalPVP from "./ModalPVP";

const styles = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    background: 'repeat url("' + config.api + '/lekelner/asset/wood.jpg")',
    zIndex: 2,
    transition: "height 0.3s",
    color: "white",
    flexDirection: "column"
  },
  loading: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loadingImage: {
    width: 100,
    height: 100,
    animationName: "loadingSword",
    animationDuration: "0.8s",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear"
  },
  closeWindow: {
    position: "absolute",
    transition: "top 2s",
    right: 5,
    fontSize: 20,
    cursor: "pointer",
    userSelect: "none"
  },
  content: {
    display: "flex",
    flex: 1,
    transition: "opacity 1s"
  }
};

const Modal = ({
  open,
  loading,
  clickClose,
  isNation,
  isPVP,
  isFrame,
  frameLink
}) => (
  <div
    style={{
      ...styles.container,
      height: open ? "100%" : 0,
      overflow: open ? "auto" : "hidden"
    }}
  >
    <div
      style={{
        ...styles.content,
        maxHeight: !open || loading ? 0 : "none",
        opacity: !open || loading ? 0 : 1
      }}
    >
      {isFrame && (
        <iframe
          style={{ width: "100%", borderStyle: "none", marginTop: 40 }}
          src={frameLink}
        ></iframe>
      )}
      {isNation && <Nation />}
      {isPVP && <ModalPVP />}
    </div>
    {loading && (
      <div style={styles.loading}>
        <img
          style={styles.loadingImage}
          src={config.api + "/lekelner/asset/sword.png"}
        />
      </div>
    )}
    <div
      style={{ ...styles.closeWindow, top: open ? 5 : -50 }}
      onClick={clickClose}
    >
      ❌
    </div>
  </div>
);

const mapStateToProps = state => ({
  open: state.root.modal !== null,
  loading: state.root.modal && state.root.modal.type === "loading",
  isNation: state.root.modal && state.root.modal.type === "nation",
  isPVP: state.root.modal && state.root.modal.type === "pvp",
  isFrame: state.root.modal && state.root.modal.type === "frame",
  frameLink: state.root.modal && state.root.modal.frameLink
});

const mapDispatchToProps = dispatch => ({
  clickClose: () => dispatch({ type: "CLOSE_MODAL" })
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
