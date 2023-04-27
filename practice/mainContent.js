import Container from './container.js';
import Header from './header.js';
import { tabStore } from './store.js';

export default class MainContent {
  constructor($parent, props) {
    this.$parent = $parent;
    this.$mainEle = document.createElement('main');
    this.$mainEle.id = 'main-content';

    this.props = props;

    this.header;
    this.container;

    tabStore.register(() => this.render());
    this.$parent.insertAdjacentElement('beforeend', this.$mainEle);
  }

  render() {
    const { pressData } = this.props;
    const { activePressTab, activeShowTab } = tabStore.getState();

    this.removeChildren();
    this.header = new Header(this.$mainEle);
    this.container = new Container(this.$mainEle, { activePressTab, activeShowTab, pressData });

    this.header.render();
    this.container.render();
  }

  removeChildren() {
    if (!this.header || !this.container) return;

    this.header.remove();
    this.container.remove();
  }
}
