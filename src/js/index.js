import { domUtils } from './utils/index.js';
import Header from './components/header/index.js';
import Nav from './components/nav/index.js';
import MainContent from './components/mainContent/index.js';

const app = async ($targetEle) => {
  const navBarUrl = 'http://localhost:3001/navBarData';
  const pressUrl = 'http://localhost:3001/mainContentData';

  const responses = await Promise.all([navBarUrl, pressUrl].map((url) => fetch(url)));
  const [navBarData, pressData] = await Promise.all(responses.map((res) => res.json()));

  const { leftNavBarHeadLines, rightNavBarHeadLines } = navBarData;

  const header = new Header($targetEle);
  const nav = new Nav($targetEle, {
    leftNavBarHeadLines,
    rightNavBarHeadLines
  });
  const mainContent = new MainContent($targetEle, { pressData });

  header.render();
  nav.render();
  mainContent.render();
};

const { $ } = domUtils;

app($({ selector: '#app' }));
