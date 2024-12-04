const { chromium } = require('playwright');
const { expect } = require("expect");

(async () => {
  const capabilities = {
    'browserName': 'Chrome', // Browsers allowed: Chrome, MicrosoftEdge, pw-chromium, pw-firefox, pw-webkit
    'browserVersion': 'latest',
    'LT:Options': {
      'platform': 'Windows 10',
      'build': 'Playwright Single Build',
      'name': 'Playwright Sample Test 2',
      'user': 'ranjithkesavan0',
      'accessKey': 'uGI1ZXy8c0REiRAhhNcVocxmbshhBcQfGSZSVhWvRMwhzUiJw1',
      'network': true,
      'video': true,
      'console': true,
      'tunnel': false, // Add tunnel configuration if testing locally hosted webpage
      'geoLocation': '', // country code can be fetched from https://www.lambdatest.com/capabilities-generator/
    }
  };

  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
  });

  const page = await browser.newPage();

  // Step 1: Open Lambda Test's Selenium Playground
  await page.goto('https://www.lambdatest.com/selenium-playground');

  // Step 2: Click "Drag & Drop Sliders" using text locator
  await page.locator('text="Drag & Drop Sliders"').click();

  // Step 3: Wait for the text 'Default value 15' and get the corresponding slider
  await page.waitForSelector('text=Default value 15');  // Wait for the default value text
  const slider = await page.locator('//div[contains(text(), "Default value 15")]/following-sibling::div[@role="slider"]');  // Locate the slider next to the text

  let targetAmount = "95"; // Target amount we want to achieve
  let isCompleted = false;

  if (slider) {
    const steps = 80; // Number of steps to divide the movement into
    let increment = 0;

    // Get the slider's bounding box (position and size)
    const srcBound = await slider.boundingBox();
    if (srcBound) {
      // Calculate target position based on the target value (95% of the width)
      const sliderWidth = srcBound.width;
      const targetPosition = (95 / 100) * sliderWidth; // Target position for 95

      // Calculate the increment to move the slider in 80 small steps
      increment = targetPosition / steps;

      // Step 4: Move the slider in 80 small steps
      for (let i = 0; i < steps; i++) {
        // Calculate the position for this step
        const currentPosition = srcBound.x + increment * (i + 1); // Incremental position

        // Move the mouse to the current position on the slider and simulate dragging
        await page.mouse.move(currentPosition, srcBound.y + srcBound.height / 2);
        if (i === 0) await page.mouse.down(); // Press down on the first step
      }

      // Release the mouse after the last step to complete the drag
      await page.mouse.up(); // Release the mouse after completing all steps

      // Step 5: Get the updated value in the slider
      let text = await page.locator('span[id="range-value"]').textContent(); // Get the updated slider value
      console.log('Current text: ' + text);

      // Check if the value has reached the target
      if (text === targetAmount) {
        isCompleted = true;
        console.log(`Target value of ${targetAmount} achieved!`);
      }
    }
  }

  // Step 6: Validate the slider value
  const sliderValue = await page.locator('span[id="range-value"]').textContent();
  try {
    expect(sliderValue).toBe(targetAmount); // Assert that the slider's value is 95
    console.log("Slider value successfully set to 95!");

    // Mark the test as passed in LambdaTest
    await page.evaluate(() => {
      window.lambdatest_action = JSON.stringify({
        action: 'setTestStatus',
        arguments: {
          status: 'passed',
          remark: 'Slider moved to 95 and value verified'
        }
      });
    });
  } catch (e) {
    // If the validation fails, mark the test as failed
    await page.evaluate(() => {
      window.lambdatest_action = JSON.stringify({
        action: 'setTestStatus',
        arguments: {
          status: 'failed',
          remark: e.stack
        }
      });
    });
    console.log("Test failed: ", e);
    throw e;
  }

  // Step 7: Cleanup and close the browser after the test
  await teardown(page, browser);
})();

async function teardown(page, browser) {
  await page.close();
  await browser.close();
}
