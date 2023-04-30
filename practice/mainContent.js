import Container from './container.js';
import Header from './header.js';
import { tabStore } from './store.js';

export default class MainContent {
  constructor($parent, { store, ...props }) {
    this.$parent = $parent;
    this.$mainEle = document.createElement('main');
    this.$mainEle.id = 'main-content';

    this.props = props;

    this.children = new Set();
    this.$parent.insertAdjacentElement('beforeend', this.$mainEle);

    this.unregister = tabStore.register(() => this.render());
  }

  render() {
    this.removeChildren();
    this.renderChildren();
  }

  renderChildren() {
    const { pressData } = this.props;
    const { activePressTab, activeShowTab } = tabStore.getState();

    this.children.add(new Header(this.$mainEle));
    this.children.add(new Container(this.$mainEle, { activePressTab, activeShowTab, pressData }));

    this.children.forEach((child) => child.render());
  }

  removeChildren() {
    if (this.children.size === 0) return;

    this.children.forEach((child) => child.remove());
    this.children.clear();
  }
}