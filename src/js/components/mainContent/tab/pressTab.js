import { tabStore } from '../../../store/index.js';

export default class PressTab {
  constructor($parent) {
    this.$parent = $parent;
    this.$mainEle = document.createElement('div');
    this.$mainEle.className = 'press-tab';

    this.$parent.insertAdjacentElement('beforeend', this.$mainEle);

    tabStore.register(this.render.bind(this));
  }

  render() {
    this.$mainEle.innerHTML = this.template();
    this.setEvent();
  }

  template() {
    const { activePressTab } = tabStore.getState();

    return /* html */ `
    <span class="press-tab-btn press-tab__all ${activePressTab === 'all' ? 'active' : ''}">전체 언론사</span>
    <span class="press-tab-btn press-tab__subscribed ${
      activePressTab === 'subscribed' ? 'active' : ''
    }">내가 구독한 언론사</span>
    `;
  }

  setEvent() {
    this.$mainEle.addEventListener('click', ({ target }) => {
      const targetClassList = target.classList;
      const { activePressTab } = tabStore.getState();

      if (targetClassList.contains('press-tab__all') && activePressTab === 'subscribed')
        tabStore.dispatch({ type: 'togglePressTab', payload: 'all' });
      if (targetClassList.contains('press-tab__subscribed') && activePressTab === 'all')
        tabStore.dispatch({ type: 'togglePressTab', payload: 'subscribed' });
    });
  }
}