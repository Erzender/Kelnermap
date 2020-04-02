import regions from "../../regions.json";
import config from "../../config.json";

const initialState = {
  selectedTile: null,
  selectedCity: null,
  selectedBattle: false,
  selectedPos: { x: 200, z: 200 },
  regionInfo: null,
  war: null,
  pvp: [],
  menuOpened: false,
  settings: {
    nations: true,
    cities: true,
    battle: true,
    autoplay: true,
    zoom: 3
  },
  nationColorMap: null,
  modal: null
};

initialState.mapMargins = {
  x:
    window.innerWidth / 2 -
    initialState.selectedPos.x * initialState.settings.zoom,
  z:
    (window.innerHeight - 200) / 2 -
    initialState.selectedPos.z * initialState.settings.zoom
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
        pvp: action.res.pvp,
        regionInfo,
        nationColorMap: colorMap
      };
    case "CLICK_TILE":
      return {
        ...state,
        menuOpened: false,
        selectedPos: {
          x: (action.pos.x - state.mapMargins.x) / state.settings.zoom,
          z: (action.pos.z - state.mapMargins.z) / state.settings.zoom
        },
        mapMargins: {
          x: state.mapMargins.x - action.pos.x + window.innerWidth / 2,
          z: state.mapMargins.z - action.pos.z + (window.innerHeight - 200) / 2
        },
        selectedTile: action.tile,
        selectedCity: null,
        selectedBattle: false
      };
    case "MOVE_POSITION":
      return {
        ...state,
        selectedPos: {
          x: (action.pos.x - state.mapMargins.x) / state.settings.zoom,
          z: (action.pos.z - state.mapMargins.z) / state.settings.zoom
        },
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
        selectedCity: action.city,
        selectedBattle: false
      };
    case "CLICK_BATTLE":
      return {
        ...state,
        menuOpened: false,
        selectedTile: null,
        selectedCity: null,
        selectedBattle: true
      };
    case "TOGGLE_MENU":
      return {
        ...state,
        menuOpened: !state.menuOpened
      };
    case "TOGGLE_PVP":
      return { ...state, modal: { type: "pvp" } };
    case "TOGGLE_SETTING":
      let storage = localStorage.getItem("settingAutoplay");
      if (action.which === "autoplay") {
        localStorage.setItem(
          "settingAutoplay",
          storage === "false" ? true : false
        );
      }
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.which]: !state.settings[action.which]
        }
      };
    case "ZOOM":
      let zoom = action.modifier
        ? state.settings.zoom * 1.1
        : state.settings.zoom * 0.9;
      return {
        ...state,
        settings: {
          ...state.settings,
          zoom
        },
        mapMargins: {
          x: window.innerWidth / 2 - state.selectedPos.x * zoom,
          z: (window.innerHeight - 200) / 2 - state.selectedPos.z * zoom
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
    case "SHOW_REGION":
      return {
        ...state,
        modal: {
          type: "frame",
          frameLink: config.api + "/lekelner/explorer/regions/" + action.id
        }
      };
    case "SHOW_PLAYER":
      return {
        ...state,
        modal: {
          type: "frame",
          frameLink: config.api + "/lekelner/explorer/joueurs/" + action.id
        }
      };
    default:
      return state;
  }
};

export default root;
