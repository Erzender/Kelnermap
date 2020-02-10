import React from "react";
import { connect } from "react-redux";
import { getNationInfo } from "../duck/thunks";

import config from "../../config.json";

const styles = {
  container: { width: "100%" },
  row: {
    display: "flex",
    flexDirection: "row",
    minHeight: 80,
    maxHeight: 80,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomStyle: "solid"
  },
  number: {
    fontWeight: "bold",
    fontSize: 40,
    marginRight: 10
  },
  profilePic: {
    borderRadius: 100,
    width: 60,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat"
  },
  nationPic: {
    cursor: "pointer",
    boxShadow: "2px 5px 5px black",
    marginTop: 30,
    marginLeft: -40,
    borderRadius: 100,
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat"
  },
  reput: { width: 50 },
  desc: {
    flex: 1,
    maxHeight: 60,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    fontFamily: "Enchanted Land",
    fontSize: 30
  }
};

const ModalPVP = ({ pvp, clickNation }) => (
  <div style={styles.container}>
    <h1>Classement PVP</h1>
    {pvp.map((player, i) => (
      <div style={styles.row} key={i}>
        <div style={{ ...styles.number, fontSize: i === 0 ? 60 : 40 }}>
          {"#" + (i + 1)}
        </div>
        <span
          style={{
            ...styles.profilePic,
            backgroundImage: "url(" + player.picture + ")"
          }}
        >
          {player.nation && (
            <div
              onClick={() => clickNation(player.nationId)}
              style={{
                ...styles.nationPic,
                backgroundImage: "url(" + player.nation + ")"
              }}
            />
          )}
        </span>
        <div style={styles.reput}>{"⚔️" + player.reputation}</div>
        <div style={styles.desc}>{player.desc}</div>
      </div>
    ))}
  </div>
);

const mapStateToProps = state => ({ pvp: state.root.pvp });

const mapDispatchToProps = dispatch => ({
  clickNation: id => dispatch(getNationInfo(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalPVP);
