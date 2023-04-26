import MyMainContentGrid from './myMainContentGrid.js';

export default class MyMainContentContainer {
  constructor($parent, props) {
    this.$parent = $parent;
    this.$mainEle = document.createElement('div');
    this.$mainEle.className = 'main-content__container';

    this.props = props;

    this.$parent.insertAdjacentElement('beforeend', this.$mainEle);
  }

  render() {
    const { pressData, activePressTab, activeShowTab } = this.props;

    if (activeShowTab === 'grid')
      new MyMainContentGrid(this.$mainEle, {
        pressData,
        activePressTab
      }).render();
  }
}
