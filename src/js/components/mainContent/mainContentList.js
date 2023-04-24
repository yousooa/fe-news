import { CATEGORY_ORDER } from '../../constants/index.js';
import { domUtils, validatorUtils } from '../../utils/index.js';
import { tabStore, subscriptionListStore, listPageStore } from '../../store/index.js';

const { $ } = domUtils;
const { hasValue, isActiveTab } = validatorUtils;

export default class MainContentList {
  #imgSrc = {
    beforeBtn: 'src/images/before_btn.svg',
    nextBtn: 'src/images/next_btn.svg'
  };

  constructor($parent, props) {
    this.$parent = $parent;
    this.$mainEle = document.createElement('section');

    this.props = props;
    const { pressTabType } = this.props;

    this.$mainEle.classList.add('main-content__list', `${pressTabType}-list__section`);

    this.$parent.insertAdjacentElement('beforeend', this.$mainEle);

    tabStore.register(this.displayElement.bind(this));
    listPageStore.register(this.renderListWrapper.bind(this));
    listPageStore.register(this.renderSubscribeToggleBtn.bind(this));
  }

  render() {
    this.$mainEle.innerHTML = this.template();

    this.displayElement();
    this.renderListWrapper();
    this.renderSubscribeToggleBtn();
    this.setEvent();
  }

  getListItemData() {
    const { pressTabType, allPressData } = this.props;

    if (!(pressTabType === 'all' || pressTabType === 'subscribed')) return;

    if (pressTabType === 'all') {
      const { currentCategory, currentItemIdx } = listPageStore.getState()[pressTabType];

      return allPressData[currentCategory][currentItemIdx];
    }
  }

  displayElement() {
    const { pressTabType } = this.props;
    const { activePressTab, activeShowTab } = tabStore.getState();

    if (
      !isActiveTab({
        pressTabType,
        showTabType: 'list',
        activePressTab,
        activeShowTab
      })
    )
      this.$mainEle.classList.add('display-none');
    else this.$mainEle.classList.remove('display-none');
  }

  template() {
    const { beforeBtn, nextBtn } = this.#imgSrc;

    return `
      <div class="main-content__list-before-btn">
        <img id="list-before-btn" src="${beforeBtn}" alt="before list page" />
      </div>
      <div class="main-content__list-next-btn">
        <img id="list-next-btn" src="${nextBtn}" alt="next list page" />
      </div>
      <div class="main-content__list-wrapper">
      </div>
    `;
  }

  listWrapperTemplate(listItemData) {
    const { pressTabType } = this.props;

    return /* html */ `
      ${pressTabType === 'all' ? this.allCategoriesTemplate() : ''}
      ${this.listItemContentTemplate(listItemData)}
    `;
  }

  renderListWrapper() {
    const listItemData = this.getListItemData();
    const $listWrapper = $({ selector: '.main-content__list-wrapper', parent: this.$mainEle });
    $listWrapper.innerHTML = this.listWrapperTemplate(listItemData);
  }

  allCategoriesTemplate() {
    const { pressTabType, dataCountByCategory } = this.props;
    if (pressTabType !== 'all') return;

    const { currentCategory, currentItemIdx } = listPageStore.getState()[pressTabType];

    const allCategoriesTemplate = CATEGORY_ORDER.map((category, idx) => {
      if (currentCategory === category) {
        return `
          <li class="current-category" data-news-category-idx="${idx}">
            <span>${category}</span>
            <div class="current-category__count">
              <span class="current-category__present">${currentItemIdx + 1}</span>
              <span class="current-category__entire">/${dataCountByCategory[currentCategory]}</span>
            </div>
          </li>
        `;
      }
      return `<li data-news-category-idx="${idx}">${category}</li>`;
    }).join('');

    return /* html */ `
      <ul class="press-list__category">
        ${allCategoriesTemplate}
      </ul>    
    `;
  }

  listItemContentTemplate(listItemData) {
    return /* html */ `
      <div class="press-list__content">
        ${this.infoTemplate(listItemData)}
        ${this.newsTemplate(listItemData)}
      </div>
    `;
  }

  subscribeToggleBtnTemplate(pressName) {
    const subscriptionList = subscriptionListStore.getState();
    const isSubscribed = hasValue(subscriptionList, pressName);

    return /* html */ `<button class="subscribe-toggle-btn ${
      isSubscribed ? 'unsubscribe-btn' : 'subscribe-btn'
    }">+ ${isSubscribed ? '해지하기' : '구독하기'}</button>`;
  }

  renderSubscribeToggleBtn() {
    const { pressName } = this.getListItemData();
    const $subscribeToggleBtnContainer = $({
      selector: '.subscribe-toggle-btn-container',
      parent: this.$mainEle
    });
    $subscribeToggleBtnContainer.innerHTML = this.subscribeToggleBtnTemplate(pressName);
  }

  infoTemplate({ pressName, pressLogo, pressHref, updateTime }) {
    return /* html */ `
      <header class="press-list__info">
        <a href="${pressHref}"><img class="press-logo" src="${pressLogo}" alt="go to ${pressName} site"/></a>
        <span class="update-time">${updateTime}</span>
        <div class="subscribe-toggle-btn-container">
        </div>
      </header>
    `;
  }

  mainNewsTemplate({ img, href, content }) {
    return /* html */ `
      <div class="press-list__main-news">
        <a class="main-news__thumbnail" href="${href}"><img class="main-news__img" src="${img}" alt="main news"/></a>
        <a class="main-news__content" href="${href}">${content}</a>
      </div>
    `;
  }

  subNewsTemplate({ pressName, subNews }) {
    return /* html */ `
      <ul class="press-list__sub-news">
        ${subNews.map(({ content, href }) => `<li><a href="${href}">${content}</a></li>`).join('')}
        <span class="sub-news__press-edit-info">${pressName} 언론사에서 직접 편집한 뉴스입니다.</span>
      </ul>
    `;
  }

  newsTemplate({ pressName, mainNews, subNews }) {
    return /* html */ `
      <div class="press-list__news">
        ${this.mainNewsTemplate(mainNews)}
        ${this.subNewsTemplate({ pressName, subNews })}
      </div>
    `;
  }

  setEvent() {
    this.$mainEle.addEventListener('click', ({ target }) => {
      const { pressTabType } = this.props;

      if (pressTabType === 'all' && target.id === 'list-next-btn') {
        const { dataCountByCategory } = this.props;
        listPageStore.dispatch({ type: 'nextPage', payload: { pressTabType, dataCountByCategory } });
      }
      if (pressTabType === 'all' && target.id === 'list-before-btn') {
        const { dataCountByCategory } = this.props;
        listPageStore.dispatch({ type: 'beforePage', payload: { pressTabType, dataCountByCategory } });
      }
      if (target.tagName === 'LI') {
        const targetCategoryIdx = target.dataset.newsCategoryIdx;
        listPageStore.dispatch({ type: 'changeCategory', payload: { pressTabType, targetCategoryIdx } });
      }
    });
  }
}
