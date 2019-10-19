const initialState = {
  selectedTile: { x: 0, z: 0 },
  mapMargins: { x: 0, z: 0 },
  posZoom: { x: 0, z: 0 }
};

const root = (state = initialState, action) => {
  switch (action.type) {
    case "SELECT_TILE":
      return { ...state, selectedTile: action.pos };
    case "CLICK_TILE":
      return {
        ...state,
        mapMargins: {
          x: state.mapMargins.x - action.pos.x + window.innerWidth / 2,
          z: state.mapMargins.z - action.pos.z + (window.innerHeight - 200) / 2
        },
        selectedTile: action.tile
      };
    case "POS_ZOOM":
      return {
        ...state,
        posZoom: action.pos
      };
    default:
      return state;
  }
};

export default root;
