var { Given, When, And, Then, Before } = require("cucumber");
import { AppPage } from "../app.po";
import { browser, by, element, protractor, until } from "protractor";

let app: AppPage;

Before(() => (app = new AppPage()));

Given("User is on Project General Page", { timeout: 2 * 20000 }, async () => {
  await app.s(2000);
});

When("User clicks on the “Other Considerations” option on the left nav", { timeout: 2 * 20000 }, async () => {
    await app.click_id("Other");
    await app.s(2000);
});

When("User should see a drop-down menu under “Contract Administration” option which is a mandatory field", { timeout: 2 * 20000 }, async () => {
    await app.s(2000);
});

Then("User should select one from the drop down according to their requirement", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_id("proposedCOR", "Joeliyn");
    await app.s(1000);
    await app.selectDropdown();
    await app.s(1000);
});