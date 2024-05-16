var { Given, When, And, Then, Before } = require("cucumber");
import { AppPage } from "../app.po";
import { browser, by, element, protractor, until } from "protractor";

let app: AppPage;

Before(() => (app = new AppPage()));


// Scenario 1

Given("Navigate to outer-api-svc.dev.com", { timeout: 2 * 20000 }, async () => {
  await app.navigateToCertPage();
  await browser.sleep(1000);
});

When("Click on advanced feature", { timeout: 2 * 20000 }, async () => {
  await app.click_id("details-button");
  await app.s(1000);
});

When("Click on proceed", { timeout: 2 * 20000 }, async () => {

 await app.click_id("proceed-link");
 await app.s(1000);
});

Then(
  "Unauthorized message screen appears",
  { timeout: 2 * 20000 },
  async () => {
 //   await alert(window.location.pathname);
    await browser.sleep(1000);
  }
);
