const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

function getChromeOptions() {
  const options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  options.addArguments('--window-size=1920,1080');
  return options;
}

async function createDriver() {
  // Selenium Manager vai baixar o driver automaticamente
  return await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(getChromeOptions())
    .build();
}

const BASE_URL = 'http://localhost:3000';

module.exports = {
  createDriver,
  BASE_URL
};
