import React from "react";
import { connect } from "react-redux";
import Paragraphs from "@render-props/paragraphs";

import config from "../../config.json";

const styles = {
  container: { width: "100%" },
  image: {
    width: 150
  },
  imageContainer: {
    borderStyle: "solid",
    borderWidth: 0,
    borderLeftWidth: 5,
    borderRadius: 5,
    width: 150,
    height: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  }
};

const Nation = ({ nationInfo }) => (
  <div style={styles.container}>
    <div style={{ ...styles.imageContainer, borderColor: nationInfo.color }}>
      <img style={styles.images} src={nationInfo.pic} />
    </div>
    <h1>{nationInfo.name}</h1>
    <i>{"Nombre de citoyens : " + nationInfo.citizens}</i>
    <br />
    <hr />
    <br />
    <Paragraphs children={({ text }) => text} text={nationInfo.desc} />
  </div>
);

const mapStateToProps = state => ({
  nationInfo: {
    ...state.root.modal.info,
    pic: state.root.modal.info.pic || config.api + "/lekelner/asset/nation.png",
    desc: state.root.modal.info.desc || ""
  }
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Nation);
