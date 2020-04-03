import React from "react";
import { connect } from "react-redux";

import config from "../../../config.json";

const styles = {
  container: {
    marginTop: 50,
    marginLeft: "auto",
    marginRight: "auto",
    width: 1000,
    maxWidth: "100%"
  },
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
  },
  profilePic: {
    cursor: "pointer",
    borderRadius: 100,
    width: 50,
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    margin: 5,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat"
  },
  citizens: {
    display: "flex",
    flexDirection: "row"
  }
};

const Nation = ({ nationInfo, territory, autoplay, onPlayerClick }) => (
  <div style={styles.container}>
    {nationInfo.hymne && (
      <audio controls autoPlay={autoplay} src={nationInfo.hymne}></audio>
    )}
    <div style={{ ...styles.imageContainer, borderColor: nationInfo.color }}>
      <img style={styles.images} src={nationInfo.pic} />
    </div>
    <h1>{nationInfo.name}</h1>
    <i>{"Superficie : " + territory}</i>
    <br />
    <i>{"Nombre de citoyens : " + nationInfo.citizens.length}</i>
    <div style={styles.citizens}>
      {nationInfo.citizens.map(citizen => (
        <span
          key={citizen.id}
          onClick={() => onPlayerClick(citizen.id)}
          style={{
            ...styles.profilePic,
            backgroundImage: "url(" + citizen.pic + ")"
          }}
        ></span>
      ))}
    </div>
    <hr />
    <br />
    {nationInfo.desc.map((desc, i) => (
      <p key={"p" + i}>{desc}</p>
    ))}
  </div>
);

const mapStateToProps = state => ({
  nationInfo: {
    ...state.root.modal.info,
    pic: state.root.modal.info.pic || config.api + "/lekelner/asset/nation.png",
    desc: state.root.modal.info.desc.split("\n") || []
  },
  autoplay: localStorage.getItem("settingAutoplay") === "true",
  territory:
    Math.round(
      0.23 *
        Object.keys(state.root.regionInfo)
          .filter(
            reg =>
              state.root.regionInfo[reg].nation &&
              state.root.regionInfo[reg].nation.id === state.root.modal.info.id
          )
          .map(reg =>
            state.root.regions.reduce(
              (total, row) => total + row.filter(tile => tile === reg).length,
              0
            )
          )
          .reduce((total, cur) => total + cur, 0) *
        10
    ) /
      10 +
    " km²"
});

const mapDispatchToProps = dispatch => ({
  onPlayerClick: id => dispatch({ type: "SHOW_PLAYER", id })
});

export default connect(mapStateToProps, mapDispatchToProps)(Nation);
