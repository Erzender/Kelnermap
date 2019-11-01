import { fetchMapInfo, fetchNationInfo } from "./service";

export const getInfo = () => dispatch => {
  fetchMapInfo().then(res => {
    if (!res.error) {
      dispatch({ type: "MAP_INFO_SUCCESS", res });
    }
  });
};

export const getNationInfo = id => dispatch => {
  dispatch({ type: "MODAL_LOADING" });
  fetchNationInfo(id).then(res => {
    if (!res.error) {
      setTimeout(() => dispatch({ type: "NATION_INFO_SUCCESS", res }), 200);
    }
  });
};
