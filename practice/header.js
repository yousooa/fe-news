import { tabStore, TAB_ACTION_TYPES } from './store.js';

export default class Header {
  #imgSrc = {
    listBlue: '../src/images/list_blue.svg',
    listGray: '../src/images/list_gray.svg',
    gridBlue: '../src/images/grid_blue.svg',
    gridGray: '../src/images/grid_gray.svg'
  };

  constructor($parent) {
    this.$parent = $parent;
    this.$mainEle = document.createElement('header');
    this.$mainEle.className = 'main-content__header';

    this.$parent.insertAdjacentElement('afterbegin', this.$mainEle);
  }

  render() {
    this.$mainEle.innerHTML = this.template();
    this.setEvent();
  }

  template() {
    const { activePressTab, activeShowTab } = tabStore.getState();

    const { listBlue, listGray, gridBlue, gridGray } = this.#imgSrc;
    return `
    <div class="press-tab">
    <span class="press-tab-btn press-tab__all ${activePressTab === 'all' ? 'active' : ''}">전체 언론사</span>
    <span class="press-tab-btn press-tab__subscribed ${
      activePressTab === 'subscribed' ? 'active' : ''
    }">내가 구독한 언론사</span>
    <img class="show-tab-btn show-tab__list" src="${activeShowTab === 'list' ? listBlue : listGray}">
    <img class="show-tab-btn show-tab__grid" src="${activeShowTab === 'grid' ? gridBlue : gridGray}">
    </div>
    `;
  }

  setEvent() {
    const { activePressTab, activeShowTab } = tabStore.getState();

    this.$mainEle.addEventListener('click', ({ target }) => {
      const targetClassList = target.classList;

      if (targetClassList.contains('press-tab__all') && activePressTab === 'subscribed')
        tabStore.dispatch({ type: TAB_ACTION_TYPES.TOGGLE_PRESS_TAB, payload: 'all' });
      if (targetClassList.contains('press-tab__subscribed') && activePressTab === 'all')
        tabStore.dispatch({ type: TAB_ACTION_TYPES.TOGGLE_PRESS_TAB, payload: 'subscribed' });
      if (targetClassList.contains('show-tab__grid') && activeShowTab === 'list')
        tabStore.dispatch({ type: TAB_ACTION_TYPES.TOGGLE_SHOW_TAB, payload: 'grid' });
      if (targetClassList.contains('show-tab__list') && activeShowTab === 'grid')
        tabStore.dispatch({ type: TAB_ACTION_TYPES.TOGGLE_SHOW_TAB, payload: 'list' });
    });
  }

  remove() {
    this.$mainEle.remove();
  }
}
