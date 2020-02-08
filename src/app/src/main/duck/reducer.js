import regions from "../../regions.json";

const initialState = {
  selectedTile: null,
  selectedCity: null,
  selectedBattle: false,
  mapMargins: { x: 0, z: 0 },
  posZoom: { x: 0, z: 0 },
  regionInfo: null,
  war: null,
  pvp: [],
  menuOpened: false,
  settings: { nations: true, cities: true, battle: true },
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
        pvp: action.res.pvp,
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
        selectedBattle: false
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
    case "TOGGLE_PVP":
      return { ...state, modal: { type: "pvp" } };
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
      console.log(
        Object.keys(state.regionInfo)
          .filter(
            reg =>
              state.regionInfo[reg].nation &&
              state.regionInfo[reg].nation.id === action.res.id
          )
          .map(reg =>
            regions.reduce(
              (total, row) => total + row.filter(tile => tile === reg).length,
              0
            )
          )
          .reduce((total, cur) => total + cur, 0)
      );
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
