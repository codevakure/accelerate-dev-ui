var { Given, When, And, Then, Before } = require("cucumber");
import { AppPage } from "../app.po";
import { browser, by, element, protractor, until } from "protractor";

let app: AppPage;

Before(() => (app = new AppPage()));

Given("User is on project general page", { timeout: 2 * 20000 }, async () => {
  await app.s(2000);
});

When(
  "User clicks on point of contact in the left side navigation",
  { timeout: 2 * 20000 },
  async () => {
    await app.click_id("poc");
    await app.s(1000);
  }
);

When("User sees the point of contact page",
  { timeout: 2 * 20000 },
  async () => {
    await app.s(1000);
  }
);

When("User should be able to select one of the contracting officers from the drop-down",
  { timeout: 2 * 20000 },
  async () => {
    await app.enterInput_id("coPointsofContact", "Ashley Spence");
    await app.s(1000);
   // await app.selectDropdown();
    await app.click_id('updatePOC1');
    await app.s(1000);
  }
);

When("User should see information populated in “Contact Information”, “Email” and “Phone Number” fields upon selecting contracting officers’ name in “Contracting officer” field",
  { timeout: 2 * 20000 },
  async () => {
    await app.s(1000);
  }
);

Then(
  "Acquistion will be shared with selected CO",
  { timeout: 2 * 20000 },
  async () => {
    await app.s(2000);
  }
);

Given("User is on POC page", { timeout: 2 * 20000 }, async () => {
  await app.s(2000);
});

When("User clicks on the “Trash” symbol beside the “Contracting officer” field", { timeout: 2 * 20000 }, async () => {
  await app.click_id('disableIcon');
});

When("User should see all the pre-filled information deleted from the fields", { timeout: 2 * 20000 }, async () => {
  await app.s(2000);
});

Then("User adds POC", { timeout: 2 * 20000 }, async () => {
  await app.enterInput_id("coPointsofContact", "Ashley Spence");
  await app.s(1000);
 // await app.selectDropdown();
  await app.click_id('updatePOC1');
  await app.s(2000);
  await app.click_id('applogout');
    await app.s(5000);
});

