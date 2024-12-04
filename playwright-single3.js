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
      'name': 'Playwright Sample Test 3 simple form',
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

  // Step 2: Click "Input Form Submit"
  await page.getByRole('link', { name: 'Input Form Submit' }).click();

  // Step 3: Click "Submit" button (to focus on the form)
  await page.getByRole('button', { name: 'Submit' }).click();

  // Step 4: Fill out the form fields
  await page.getByPlaceholder('Name', { exact: true }).fill('ranjith');
  await page.getByPlaceholder('Email', { exact: true }).click();
  await page.getByPlaceholder('Email', { exact: true }).fill('as@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('ranji123');
  await page.getByPlaceholder('Company').click();
  await page.getByPlaceholder('Company').press('CapsLock');
  await page.getByPlaceholder('Company').fill('TCS');
  await page.getByPlaceholder('Website').click();
  await page.getByPlaceholder('Website').fill('GOOGLE');
  
  // Select the country from the dropdown (combobox)
  await page.getByRole('combobox').selectOption('US');

  // Fill the remaining fields
  await page.getByPlaceholder('City').click();
  await page.getByPlaceholder('City').fill('BANGALORE');
  await page.getByPlaceholder('Address 1').click();
  await page.getByPlaceholder('Address 1').fill('QAQQ');
  await page.getByPlaceholder('Address 2').click();
  await page.getByPlaceholder('Address 2').fill('QASW');
  await page.getByPlaceholder('State').click();
  await page.getByPlaceholder('State').fill('KARNATAKA');
  await page.getByPlaceholder('Zip code').click();
  await page.getByPlaceholder('Zip code').fill('653654');

  // Step 5: Click "Submit" button (This will redirect to the success message page)
  await page.getByRole('button', { name: 'Submit' }).click();

  // Step 6: Wait for the success message "Thanks for contacting us..."
  await page.waitForSelector('text="Thanks for contacting us, we will get back to you shortly."'); // Wait for the success message

  // Optional: Log the success message (for verification purposes)
  const successMessage = await page.locator('text="Thanks for contacting us, we will get back to you shortly."').textContent();
  console.log(successMessage); // Log the success message

  // Step 7: Close the page and browser
  await teardown(page, browser);
})();

async function teardown(page, browser) {
  await page.close();
  await browser.close();
}
