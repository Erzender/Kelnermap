import config from "../../config.json";

export const fetchMapInfo = () => {
  return fetch(config.api + "/lekelner/mapInfo")
    .then(res => res.json().then(json => json))
    .catch(err => ({ error: true, err }));
};

export const fetchNationInfo = id => {
  return fetch(config.api + "/lekelner/nation/" + id)
    .then(res => res.json().then(json => json))
    .catch(err => ({ error: true, err }));
};
