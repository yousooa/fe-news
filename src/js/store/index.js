import Store from '../core/store.js';
import MyStore from '../core/myStore.js';
import { tabReducer, gridPageReducer, subscriptionListReducer, listPageReducer } from '../reducer/index.js';

const INIT_TAB_STATE = {
  activePressTab: 'all',
  activeShowTab: 'grid'
};

export const tabStore = new Store(INIT_TAB_STATE, tabReducer);

const INIT_GRID_PAGE_STATE = {
  pressTabType: 'all',
  currentPage: 0,
  totalPages: null
};

export const gridPageStore = new Store(INIT_GRID_PAGE_STATE, gridPageReducer);

const INIT_SUBSCRIPTION_LIST_STATE = new Set();

export const subscriptionListStore = new MyStore(INIT_SUBSCRIPTION_LIST_STATE, subscriptionListReducer);

export const INIT_LIST_PAGE_STATE = {
  all: { currentCategory: null, currentItemIdx: null }
};

export const listPageStore = new Store(INIT_LIST_PAGE_STATE, listPageReducer);
