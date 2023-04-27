import { gridStore, GRID_ACTION_TYPES } from './store.js';

export default class Grid {
  #gridItemCount = 24;

  #imgSrc = {
    beforeBtn: '../src/images/before_btn.svg',
    nextBtn: '../src/images/next_btn.svg'
  };

  constructor($parent, props) {
    this.$parent = $parent;
    this.$mainEle = document.createElement('section');
    this.$mainEle.className = `main-content__grid`;

    this.props = props;

    this.$parent.insertAdjacentElement('beforeend', this.$mainEle);
    this.unregister = gridStore.register(() => this.displayBtn());
  }

  render() {
    this.$mainEle.innerHTML = this.template();
    this.setEvent();
  }

  template() {
    const { beforeBtn, nextBtn } = this.#imgSrc;
    const { currentPage, totalPages } = gridStore.getState();

    return `
      <div class="main-content__grid-before-btn ${currentPage === 0 ? 'hidden' : ''}">
        <img id="grid-before-btn" src="${beforeBtn}" alt="before grid page" />
      </div>
      <div class="main-content__grid-next-btn ${currentPage === totalPages - 1 ? 'hidden' : ''}">
        <img id="grid-next-btn" src="${nextBtn}" alt="next grid page" />
      </div>
      <div class="main-content__grid-wrapper">
        <div class="press-grid"></div>
      </div>
    `;
  }

  setEvent() {
    this.$mainEle.addEventListener('click', ({ target }) => {
      if (target.id === 'grid-before-btn')
        gridStore.dispatch({
          type: GRID_ACTION_TYPES.BEFORE_PAGE
        });

      if (target.id === 'grid-next-btn')
        gridStore.dispatch({
          type: GRID_ACTION_TYPES.NEXT_PAGE
        });
    });
  }

  displayBtn() {
    const { currentPage, totalPages } = gridStore.getState();

    const $beforeBtn = this.$mainEle.querySelector('.main-content__grid-before-btn');
    const $nextBtn = this.$mainEle.querySelector('.main-content__grid-next-btn');

    if (currentPage === 0) $beforeBtn.classList.add('hidden');
    else $beforeBtn.classList.remove('hidden');

    if (currentPage === totalPages - 1) $nextBtn.classList.add('hidden');
    else $nextBtn.classList.remove('hidden');

    console.log(gridStore.getListeners());
    // if (this.unregister) this.unregister();
  }

  remove() {
    if (this.unregister) this.unregister();
    this.unregister();
    this.$mainEle.remove();
  }
}
