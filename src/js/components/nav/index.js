import NavBar from './navBar.js';
import { getData } from '../../utils/getData.js';

export default class Nav {
  #url = 'src/mock/navBarData.json';

  constructor($parent) {
    this.$parent = $parent;
    this.$ele = document.createElement('nav');
    this.$ele.id = 'nav';

    this.state = {};
    this.leftBar;
    this.rightBar;
  }

  async mount() {
    const { left, right } = await getData(this.#url);

    this.leftBar = new NavBar(this.$ele, left);
    this.rightBar = new NavBar(this.$ele, right);

    this.leftBar.mount();
    this.rightBar.mount();
    this.$parent.insertAdjacentElement('beforeend', this.$ele);
  }
}
