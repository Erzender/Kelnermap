import regions from "../../regions.json";

const initialState = {
  selectedTile: null,
  selectedCity: null,
  selectedBattle: false,
  mapMargins: { x: 0, z: 0 },
  posZoom: { x: 0, z: 0 },
  regionInfo: null,
  war: null,
  menuOpened: false,
  settings: { nations: true },
  nationColorMap: null,
  modal: null
};

const root = (state = initialState, action) => {
  switch (action.type) {
    case "MAP_INFO_SUCCESS":
      let regionInfo = action.res.regionInfo;
      action.res.nations.forEach(nation =>
        nation.regions
          .split("")
          .forEach(letter => (regionInfo[letter].nation = nation))
      );
      let colorMap = regions.map(line =>
        line.map(tile => {
          return regionInfo[tile] && regionInfo[tile].nation
            ? regionInfo[tile].nation.color
            : "rgba(0, 0, 0, 0)";
        })
      );
      return {
        ...state,
        war: action.res.war,
        regionInfo,
        nationColorMap: colorMap
      };
    case "CLICK_TILE":
      return {
        ...state,
        menuOpened: false,
        mapMargins: {
          x: state.mapMargins.x - action.pos.x + window.innerWidth / 2,
          z: state.mapMargins.z - action.pos.z + (window.innerHeight - 200) / 2
        },
        selectedTile: action.tile,
        selectedCity: null,
        selectedBattle: null
      };
    case "MOVE_POSITION":
      return {
        ...state,
        mapMargins: {
          x: state.mapMargins.x - action.pos.x + window.innerWidth / 2,
          z: state.mapMargins.z - action.pos.z + (window.innerHeight - 200) / 2
        }
      };
    case "CLICK_CITY":
      return {
        ...state,
        menuOpened: false,
        selectedTile: null,
        selectedCity: action.city
      };
    case "CLICK_BATTLE":
      return {
        ...state,
        menuOpened: false,
        selectedTile: null,
        selectedCity: null,
        selectedBattle: true
      };
    case "POS_ZOOM":
      return {
        ...state,
        posZoom: action.pos
      };
    case "TOGGLE_MENU":
      return {
        ...state,
        menuOpened: !state.menuOpened
      };
    case "TOGGLE_SETTING":
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.which]: !state.settings[action.which]
        }
      };
    case "MODAL_LOADING":
      return {
        ...state,
        modal: { type: "loading" }
      };
    case "NATION_INFO_SUCCESS":
      return {
        ...state,
        modal: { type: "nation", info: action.res }
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        modal: null
      };
    default:
      return state;
  }
};

export default root;
