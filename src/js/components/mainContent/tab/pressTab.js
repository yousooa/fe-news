import { tabStore } from '../../../store/index.js';

export default class PressTab {
  constructor($parent, props) {
    this.$parent = $parent;
    this.$mainEle = document.createElement('div');
    this.$mainEle.className = 'press-tab';

    this.props = props;

    this.$parent.insertAdjacentElement('beforeend', this.$mainEle);
  }

  render() {
    const { activePressTab } = this.props;

    this.$mainEle.innerHTML = this.template(activePressTab);
    this.setEvent(activePressTab);
  }

  template(activePressTab) {
    return /* html */ `
    <span class="press-tab-btn press-tab__all ${
      activePressTab === 'all' ? 'active' : ''
    }">전체 언론사</span>
    <span class="press-tab-btn press-tab__subscribed ${
      activePressTab === 'subscribed' ? 'active' : ''
    }">내가 구독한 언론사</span>
    `;
  }

  setEvent(activePressTab) {
    this.$mainEle.addEventListener('click', ({ target }) => {
      const targetClassList = target.classList;

      if (
        targetClassList.contains('press-tab__all') &&
        activePressTab === 'subscribed'
      )
        tabStore.dispatch({ type: 'togglePressTab', payload: 'all' });
      if (
        targetClassList.contains('press-tab__subscribed') &&
        activePressTab === 'all'
      )
        tabStore.dispatch({ type: 'togglePressTab', payload: 'subscribed' });
    });
  }
}
