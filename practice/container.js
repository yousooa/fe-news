import Grid from './grid.js';

export default class Container {
  constructor($parent, props) {
    this.$parent = $parent;
    this.$mainEle = document.createElement('div');
    this.$mainEle.className = 'main-content__container';

    this.props = props;

    this.allGrid;
    this.$parent.insertAdjacentElement('beforeend', this.$mainEle);
  }

  render() {
    const { pressData, activePressTab, activeShowTab } = this.props;

    if (activePressTab === 'all' && activeShowTab === 'grid') {
      this.allGrid = new Grid(this.$mainEle, {
        pressData,
        activePressTab,
        activeShowTab
      });
      this.allGrid.render();
    }
  }

  remove() {
    this.$mainEle.remove();
    if (!this.allGrid) return;
    this.allGrid.remove();
  }
}
