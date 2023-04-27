function createStore({ initState = {}, reducer }) {
  let state = initState;
  const listeners = [];

  const getState = () => state;

  const getListeners = () => listeners;

  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
    return action;
  }

  function register(listener) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  return {
    getState,
    getListeners,
    dispatch,
    register
  };
}

export const TAB_ACTION_TYPES = {
  TOGGLE_PRESS_TAB: 'TOGGLE_PRESS_TAB',
  TOGGLE_SHOW_TAB: 'TOGGLE_SHOW_TAB'
};

export const tabReducer = (state, action) => {
  switch (action.type) {
    case TAB_ACTION_TYPES.TOGGLE_PRESS_TAB: {
      return { ...state, activePressTab: action.payload };
    }
    case TAB_ACTION_TYPES.TOGGLE_SHOW_TAB: {
      return { ...state, activeShowTab: action.payload };
    }
    default:
      return state;
  }
};

const INIT_TAB_STATE = {
  activePressTab: 'all',
  activeShowTab: 'grid'
};

export const tabStore = createStore({
  initState: INIT_TAB_STATE,
  reducer: tabReducer
});

export const GRID_ACTION_TYPES = {
  INIT_STATE: 'INIT_STATE',
  NEXT_PAGE: 'NEXT_PAGE',
  BEFORE_PAGE: 'BEFORE_PAGE'
};

const gridReducer = (state, action) => {
  const { INIT_STATE, NEXT_PAGE, BEFORE_PAGE } = GRID_ACTION_TYPES;

  switch (action.type) {
    case INIT_STATE: {
      const { pressTabType, totalPages } = action.payload;
      return { ...state, pressTabType, currentPage: 0, totalPages };
    }
    case NEXT_PAGE: {
      const { currentPage, totalPages } = state;
      const newPage = currentPage + 1 === totalPages ? currentPage : currentPage + 1;
      return { ...state, currentPage: newPage };
    }
    case BEFORE_PAGE: {
      const { currentPage } = state;
      const newPage = currentPage === 0 ? 0 : currentPage - 1;
      return { ...state, currentPage: newPage };
    }
    default:
      return state;
  }
};

const INIT_GRID_STATE = {
  pressTabType: 'all',
  currentPage: 0,
  totalPages: 4
};

export const gridStore = createStore({
  initState: INIT_GRID_STATE,
  reducer: gridReducer
});
