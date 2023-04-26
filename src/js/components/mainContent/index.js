import { tabStore } from '../../store/index.js';

import MainContentHeader from './mainContentHeader.js';
import MyMainContentContainer from './myMainContentContainer.js';

export default class MainContent {
  constructor($parent, props) {
    this.$parent = $parent;
    this.$mainEle = document.createElement('main');
    this.$mainEle.id = 'main-content';

    this.props = props;

    tabStore.register(this.render.bind(this));
    this.$parent.insertAdjacentElement('beforeend', this.$mainEle);
  }

  render() {
    const { activePressTab, activeShowTab } = tabStore.getState();
    const { pressData } = this.props;

    this.removeChildren();

    new MainContentHeader(this.$mainEle, {
      activePressTab,
      activeShowTab
    }).render();

    new MyMainContentContainer(this.$mainEle, {
      pressData,
      activePressTab,
      activeShowTab
    }).render();
  }

  removeChildren() {
    while (this.$mainEle.firstChild) {
      this.$mainEle.removeChild(this.$mainEle.firstChild);
    }
  }
}
