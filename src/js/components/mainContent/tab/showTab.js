import { tabStore } from '../../../store/index.js';

export default class ShowTab {
  #imgSrc = {
    listBlue: 'src/images/list_blue.svg',
    listGray: 'src/images/list_gray.svg',
    gridBlue: 'src/images/grid_blue.svg',
    gridGray: 'src/images/grid_gray.svg'
  };

  constructor($parent, props) {
    this.$parent = $parent;
    this.$mainEle = document.createElement('div');
    this.$mainEle.className = 'show-tab';

    this.props = props;

    this.$parent.insertAdjacentElement('beforeend', this.$mainEle);
  }

  render() {
    const { activeShowTab } = this.props;

    this.$mainEle.innerHTML = this.template(activeShowTab);
    this.setEvent(activeShowTab);
  }

  template(activeShowTab) {
    const { listBlue, listGray, gridBlue, gridGray } = this.#imgSrc;

    return /* html */ `
      <img class="show-tab-btn show-tab__list" src="${
        activeShowTab === 'list' ? listBlue : listGray
      }">
      <img class="show-tab-btn show-tab__grid" src="${
        activeShowTab === 'grid' ? gridBlue : gridGray
      }">
    `;
  }

  setEvent(activeShowTab) {
    this.$mainEle.addEventListener('click', ({ target }) => {
      const targetClassList = target.classList;

      if (
        targetClassList.contains('show-tab__grid') &&
        activeShowTab === 'list'
      )
        tabStore.dispatch({ type: 'toggleShowTab', payload: 'grid' });
      if (
        targetClassList.contains('show-tab__list') &&
        activeShowTab === 'grid'
      )
        tabStore.dispatch({ type: 'toggleShowTab', payload: 'list' });
    });
  }
}
