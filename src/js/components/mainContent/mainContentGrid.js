import { gridStore, GRID_ACTION_TYPES, subscriptionStore } from '../../store/index.js';

const isFirstPage = (currentPage) => currentPage === 0;
const isLastPage = (currentPage, totalPages) => currentPage === totalPages - 1;
const getDataSlices = ({ arr, count = 1 }) => {
  const dataSlices = [];

  for (let i = 0; i < arr.length; i += count) {
    dataSlices.push(arr.slice(i, i + count));
  }

  return dataSlices;
};

export default class MainContentGrid {
  #itemCount = 24;

  #imgSrc = {
    beforeBtn: 'src/images/before_btn.svg',
    nextBtn: 'src/images/next_btn.svg'
  };

  #dataSlices;

  constructor($parent, props) {
    this.$parent = $parent;
    this.$mainEle = document.createElement('section');
    this.$mainEle.className = 'main-content__grid';

    this.props = props;

    this.children = new Set();
    this.$parent.insertAdjacentElement('beforeend', this.$mainEle);

    const { pressData, activePressTab } = this.props;
    this.initGrid(pressData, activePressTab);

    this.unregisterGrid = gridStore.register(() => {
      this.displayBtn();
    });
  }

  initGrid(pressData, activePressTab) {
    this.setDataSlices(pressData, activePressTab);
    const totalPages = this.getTotalPages();

    gridStore.dispatch({
      type: GRID_ACTION_TYPES.INIT_STATE,
      payload: { pressTab: activePressTab, totalPages }
    });
  }

  setDataSlices(pressData, activePressTab) {
    const { subscriptionList } = subscriptionStore.getState();
    const selectedPressData = activePressTab === 'all' ? pressData : subscriptionList;

    this.#dataSlices = getDataSlices({ arr: selectedPressData, count: this.#itemCount });
  }

  getTotalPages() {
    return this.#dataSlices.length === 0 ? 1 : this.#dataSlices.length;
  }

  render() {
    this.removeChildren();

    this.$mainEle.innerHTML = this.template();
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
    this.removeChildren();
  }

  removeChildren() {
    if (this.children.size === 0) return;

    this.children.forEach((child) => child.remove());
    this.children.clear();
  }
}
