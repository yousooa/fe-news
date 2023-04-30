import { gridStore, GRID_ACTION_TYPES } from './store.js';
import PressGrid from './pressGrid.js';

const isFirstPage = (currentPage) => currentPage === 0;
const isLastPage = (currentPage, totalPages) => currentPage === totalPages - 1;
const getDataSlices = (arr, count = 1) => {
  const dataSlices = [];

  for (let i = 0; i < arr.length; i += count) {
    dataSlices.push(arr.slice(i, i + count));
  }

  return dataSlices;
};

export default class Grid {
  #itemCount = 24;

  #imgSrc = {
    beforeBtn: '../src/images/before_btn.svg',
    nextBtn: '../src/images/next_btn.svg'
  };

  constructor($parent, props) {
    this.$parent = $parent;
    this.$mainEle = document.createElement('section');
    this.$mainEle.className = 'main-content__grid';

    this.props = props;

    const { pressData: allPressData } = props;
    this.dataSlices = getDataSlices(allPressData, this.#itemCount);

    this.$parent.insertAdjacentElement('beforeend', this.$mainEle);

    this.children = new Set();
    this.unregister = gridStore.register(() => {
      this.displayBtn();
      this.removeChildren();
      this.renderChildren();
    });
  }

  render() {
    this.removeChildren();

    this.$mainEle.innerHTML = this.template();
    this.renderChildren();
    this.setEvent();
  }

  template() {
    const { beforeBtn, nextBtn } = this.#imgSrc;
    const { currentPage, totalPages } = gridStore.getState();

    return `
      <div class="main-content__grid-before-btn ${isFirstPage(currentPage) ? 'hidden' : ''}">
        <img id="grid-before-btn" src="${beforeBtn}" alt="before grid page" />
      </div>
      <div class="main-content__grid-next-btn ${isLastPage(currentPage, totalPages) ? 'hidden' : ''}">
        <img id="grid-next-btn" src="${nextBtn}" alt="next grid page" />
      </div>
      <div class="main-content__grid-wrapper">
      </div>
    `;
  }

  renderChildren() {
    const { currentPage } = gridStore.getState();
    const $gridWrapper = this.$mainEle.querySelector('.main-content__grid-wrapper');

    this.children.add(
      new PressGrid($gridWrapper, { itemsData: this.dataSlices[currentPage], itemCount: this.#itemCount })
    );

    this.children.forEach((child) => child.render());
  }

  setEvent() {
    const actionByTarget = {
      'grid-before-btn': GRID_ACTION_TYPES.BEFORE_PAGE,
      'grid-next-btn': GRID_ACTION_TYPES.NEXT_PAGE
    };

    this.$mainEle.addEventListener('click', ({ target }) => {
      const { id } = target;

      if (actionByTarget[id]) {
        gridStore.dispatch({ type: actionByTarget[id] });
      }
    });
  }

  displayBtn() {
    const { currentPage, totalPages } = gridStore.getState();

    const $beforeBtn = this.$mainEle.querySelector('.main-content__grid-before-btn');
    const $nextBtn = this.$mainEle.querySelector('.main-content__grid-next-btn');

    if (isFirstPage(currentPage)) $beforeBtn.classList.add('hidden');
    else $beforeBtn.classList.remove('hidden');

    if (isLastPage(currentPage, totalPages)) $nextBtn.classList.add('hidden');
    else $nextBtn.classList.remove('hidden');
  }

  remove() {
    this.$mainEle.remove();

    if (!this.unregister) return;
    this.unregister();
  }

  removeChildren() {
    if (this.children.size === 0) return;

    this.children.forEach((child) => child.remove());
    this.children.clear();
  }
}
