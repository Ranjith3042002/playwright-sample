const { chromium } = require('playwright');
const { expect } = require("expect");
const cp = require('child_process');
const playwrightClientVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

(async () => {
  const capabilities = {
    'browserName': 'Chrome', // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
    'browserVersion': 'latest',
    'LT:Options': {
      'platform': 'Windows 10',
      'build': 'Playwright Single Build',
      'name': 'Playwright Sample Test',
      'user': 'ranjithkesavan0',
      'accessKey': 'uGI1ZXy8c0REiRAhhNcVocxmbshhBcQfGSZSVhWvRMwhzUiJw1',
      'network': true,
      'video': true,
      'console': true,
      'tunnel': false, // Add tunnel configuration if testing locally hosted webpage
      'tunnelName': '', // Optional
      'geoLocation': '', // country code can be fetched from https://www.lambdatest.com/capabilities-generator/
      'playwrightClientVersion': playwrightClientVersion
    }
  };

  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
  });

  const page = await browser.newPage();

  // Step 1: Open Lambda Test's Selenium Playground
  await page.goto('https://www.lambdatest.com/selenium-playground/');

  // Step 2: Click "Simple Form Demo"
  await page.getByRole('link', { name: 'Simple Form Demo' }).click();

  // Step 3: Click the input field with placeholder 'Please enter your Message'
  await page.getByPlaceholder('Please enter your Message').click();

  // Step 4: Fill the message 'Welcome to LambdaTest'
  await page.getByPlaceholder('Please enter your Message').fill('Welcome to LambdaTest');

  // Step 5: Click the 'Get Checked Value' button
  await page.getByRole('button', { name: 'Get Checked Value' }).click();

  // Step 6: Close the page after the wait
  await teardown(page, browser);

})();

async function teardown(page, browser) {
  await page.close();
  await browser.close();
}
