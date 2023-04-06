const getDateContent = (data) => {
  const year = data.getFullYear();
  const month = String(data.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 1을 더하고 문자열 형태로 변환
  const day = String(data.getDate()).padStart(2, '0');
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][data.getDay()]; // 0부터 시작하므로 1을 더하고 문자열 형태로 변환
  return `${year}.${month}.${day} ${weekday}요일`;
};

export default class Header {
  constructor($parent) {
    this.$parent = $parent;
    this.state = {
      today: new Date()
    };
  }

  initRender() {
    this.$parent.insertAdjacentHTML('afterbegin', this.template());
  }

  template() {
    const { today } = this.state;

    return String.raw`
      <header id="header">
        <div class="header__logo">
          <img src="../../src/images/logo.svg"></img>
          <span>뉴스스탠드</span>
        </div>
        <div class="header__today">${getDateContent(today)}</div>
      </header>
    `;
  }
}
