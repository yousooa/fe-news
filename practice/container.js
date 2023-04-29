import Grid from './grid.js';

export default class Container {
  constructor($parent, props) {
    this.$parent = $parent;
    this.$mainEle = document.createElement('div');
    this.$mainEle.className = 'main-content__container';

    this.props = props;

    this.children = new Set();
    this.$parent.insertAdjacentElement('beforeend', this.$mainEle);
  }

  render() {
    this.removeChildren();
    this.renderChildren();
  }

  renderChildren() {
    const { pressData, activePressTab, activeShowTab } = this.props;

    if (activeShowTab === 'grid') {
      this.children.add(
        new Grid(this.$mainEle, {
          pressData,
          activePressTab,
          activeShowTab
        })
      );
    }

    this.children.forEach((child) => child.render());
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
