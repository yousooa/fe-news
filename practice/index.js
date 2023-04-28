import MainContent from './mainContent.js';

const app = async ($targetEle) => {
  const pressUrl = 'http://localhost:3001/mainContentData';
  const pressData = await fetch(pressUrl).then((res) => res.json());

  new MainContent($targetEle, { pressData }).render();
};

app(document.getElementById('app'));
