import React from "react";
import { connect } from "react-redux";

import config from "../../../config.json";
import { geoToImage } from "../utils/geo";

const styles = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    backgroundColor: "#222222",
    zIndex: 2,
    transition: "height 0.2s",
  },
  searchUi: {
    display: "flex",
    flex: 1,
    height: 50,
  },
  input: {
    display: "flex",
    flex: 1,
    width: 0,
    minWidth: 0,
    fontFamily: "Enchanted Land",
    fontSize: 40,
    backgroundColor: "black",
    color: "white",
  },
  searchButton: {
    display: "flex",
    width: window.innerWidth >= 800 ? 200 : 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Enchanted Land",
    fontSize: 40,
    cursor: "pointer",
  },
  closeButton: {
    display: "flex",
    width: 60,
    backgroundColor: "darkred",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Enchanted Land",
    fontSize: 40,
    cursor: "pointer",
  },
  toggleType: {
    display: "flex",
    width: window.innerWidth >= 800 ? 100 : 50,
    padding: 5,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "black",
    border: "solid 2px",
    borderColor: "white",
    margin: 10,
    borderRadius: 10,
    cursor: "pointer",
  },
  toggleButton: {
    display: "flex",
    flex: 1,
    maxWidth: window.innerWidth >= 800 ? 45 : 20,
    backgroundColor: "orange",
    borderRadius: 5,
    transition: "margin-left 0.2s",
  },
};

const Search = ({
  open,
  textMode,
  onToggleText,
  onClose,
  text1,
  text2,
  onTyping,
  searchable,
  onSearch,
}) => {
  const onChangeField1 = (e) => onTyping(e.target.value, text2);
  const onChangeField2 = (e) => onTyping(text1, e.target.value);
  const onEnter = (e) => searchable && e.key === "Enter" && onSearch();
  return (
    <div
      style={{
        ...styles.container,
        height: open ? 50 : 0, // 100%
        overflow: open ? "hidden" : "hidden",
      }}
    >
      <div style={styles.searchUi}>
        {false && (
          <div style={styles.toggleType} onClick={onToggleText}>
            <div
              style={{ ...styles.toggleButton, marginLeft: textMode ? 55 : 0 }}
            />
          </div>
        )}
        <input
          onKeyPress={onEnter}
          onClick={(e) => e.target.select()}
          placeholder={textMode ? "Nation, édifice, ..." : "X"}
          type={textMode ? "text" : "number"}
          style={styles.input}
          value={text1}
          onChange={onChangeField1}
        />
        <input
          onKeyPress={onEnter}
          onClick={(e) => e.target.select()}
          placeholder="Z"
          type="number"
          style={{ ...styles.input, display: textMode ? "none" : "flex" }}
          value={text2}
          onChange={onChangeField2}
        />
        <div
          style={{
            ...styles.searchButton,
            backgroundColor: searchable ? "orange" : "darkgrey",
          }}
          onClick={onSearch}
        >
          {textMode
            ? window.innerWidth >= 800
              ? "Chercher 🔍"
              : "🔍"
            : window.innerWidth >= 800
            ? "Montrer 📌"
            : "📌"}
        </div>
        <div onClick={onClose} style={styles.closeButton}>
          ❌
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  let searchable =
    (state.root.search.textMode && state.root.search.text.length) ||
    (!state.root.search.textMode &&
      state.root.search.coor[0].length &&
      state.root.search.coor[1].length &&
      !isNaN(state.root.search.coor[0]) &&
      !isNaN(state.root.search.coor[1]));
  if (!state.root.search.textMode) {
    searchable = geoToImage(
      1,
      parseInt(state.root.search.coor[0]),
      parseInt(state.root.search.coor[1])
    );
    searchable = { x: Math.round(searchable.x), z: Math.round(searchable.z) };
    searchable =
      searchable.x > 0 &&
      searchable.x < config.mapSize.x &&
      searchable.z > 0 &&
      searchable.z < config.mapSize.z;
  }

  return {
    open: state.root.search.open,
    textMode: state.root.search.textMode,
    text1: state.root.search.textMode
      ? state.root.search.text
      : state.root.search.coor[0],
    text2: state.root.search.coor[1],
    searchable,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onToggleText: () => dispatch({ type: "SEARCH_TOGGLE_TEXT" }),
  onClose: () => dispatch({ type: "TOGGLE_SEARCH" }),
  onTyping: (field1, field2) =>
    dispatch({ type: "SEARCH_TYPING_TEXT", fields: [field1, field2] }),
  onSearch: () => dispatch({ type: "SEARCH_ENTERED" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
