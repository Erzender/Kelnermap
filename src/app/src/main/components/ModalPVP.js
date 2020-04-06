import React from "react";
import { connect } from "react-redux";
import { getNationInfo } from "../duck/thunks";

import config from "../../../config.json";

const styles = {
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    width: 1000,
    maxWidth: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    minHeight: 80,
    maxHeight: 80,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
  },
  number: {
    fontWeight: "bold",
    fontSize: 40,
    marginRight: 10,
  },
  profilePic: {
    cursor: "pointer",
    borderRadius: 100,
    width: 60,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
  },
  nationPic: {
    boxShadow: "2px -2px 5px black",
    marginTop: 50,
    marginLeft: -50,
    borderRadius: 100,
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
  },
  reput: { width: 50 },
  name: {
    maxHeight: 60,
    overflow: "hidden",
    fontFamily: "Enchanted Land",
    fontSize: 35,
  },
  desc: {
    flex: 1,
    height: 55,
    maxHeight: 55,
    overflow: "hidden",
    borderLeftStyle: "solid",
    borderLeftColor: "white",
    marginLeft: 10,
    paddingLeft: 10,
  },
};

const ModalPVP = ({ pvp, clickPlayer }) => (
  <div style={styles.container}>
    <h1>Classement PVP</h1>
    {pvp.map((player, i) => (
      <div style={styles.row} key={i}>
        <div style={{ ...styles.number, fontSize: i === 0 ? 60 : 40 }}>
          {i === 0 ? "🏆" : "#" + (i + 1)}
        </div>
        <span
          onClick={() => clickPlayer(player.id)}
          style={{
            ...styles.profilePic,
            backgroundImage: "url(" + player.picture + ")",
          }}
        >
          {player.nation && (
            <div
              style={{
                ...styles.nationPic,
                backgroundImage: "url(" + player.nation + ")",
              }}
            />
          )}
        </span>
        <div style={styles.reput}>{"⚔️" + player.reputation}</div>
        <div style={styles.name}>{player.name}</div>
        <div style={styles.desc}>
          {player.desc.split("\n").map((row, i) => (
            <div key={i}>
              {row} <br />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const mapStateToProps = (state) => ({ pvp: state.root.pvp });

const mapDispatchToProps = (dispatch) => ({
  clickPlayer: (id) => dispatch({ type: "SHOW_PLAYER", id }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalPVP);
