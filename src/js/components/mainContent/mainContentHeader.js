import { tabStore } from '../../store/index.js';
import PressTab from './tab/pressTab.js';
import ShowTab from './tab/showTab.js';

export default class MainContentHeader {
  constructor($parent, props) {
    this.$parent = $parent;
    this.$mainEle = document.createElement('header');
    this.$mainEle.className = 'main-content__header';

    this.props = props;

    this.$parent.insertAdjacentElement('afterbegin', this.$mainEle);
  }

  render() {
    const { activePressTab, activeShowTab } = this.props;

    new PressTab(this.$mainEle, { activePressTab }).render();
    new ShowTab(this.$mainEle, { activeShowTab }).render();
  }
}
