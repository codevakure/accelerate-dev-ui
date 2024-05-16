var { Given, When, And, Then, Before } = require("cucumber");
import { AppPage } from "../app.po";
import { browser, by, element, protractor, until } from "protractor";

let app: AppPage;

Before(() => (app = new AppPage()));

//S1: Contracting officer logs in to the account and checks the acquisition
Given("User is on sandbox login page", { timeout: 2 * 20000 }, async () => {
  await app.s(2000);
  await app.navigateToSandboxLogout();
});

When(
  "User enters CO credentials and logs in",
  { timeout: 2 * 20000 },
  async () => {
    await app.elementClickable_css(
      "body > div.container > div > div.modal-content.background-customizable.modal-content-mobile.visible-md.visible-lg > div.modal-body > div:nth-child(2) > div:nth-child(2) > div > div > form > div:nth-child(3)"
    );
    await app.activeElement_send_keys("ashley.spence@aurotechcorp.com");
    await app.s(500);
    await app.elementClickable_css(
      "body > div.container > div > div.modal-content.background-customizable.modal-content-mobile.visible-md.visible-lg > div.modal-body > div:nth-child(2) > div:nth-child(2) > div > div > form > div:nth-child(5)"
    );
    await app.activeElement_send_keys("@Ashley123");
    await app.s(1000);
    app.clickEnter();
    await app.s(2000);
    await app.click_tagname("button");
    await app.s(1000);
  }
);

Then("User sees the CO dashboard", { timeout: 2 * 20000 }, async () => {
  await app.s(1000);
});

//S2: Contracting officer checks the shared solicitation

Given("User is on dashboard", { timeout: 2 * 20000 }, async () => {
  await app.s(2000);
});

When(
  "User sees the shared acquisition and clicks on review button",
  { timeout: 2 * 20000 },
  async () => {
    await app.s(500);
    await app.click_css(
      "#btn_dropdown0 > button.btn.btn-primary.btn-sm.action"
    );
  }
);

Then(
  "User sees the general page of the acquisition",
  { timeout: 2 * 20000 },
  async () => {
    await app.s(1000);
  }
);

//S3: Contracting officer selects streamlined or UCF
   
Given("User is on general page", { timeout: 2 * 20000 }, async () => {
  await app.s(2000);
});

When("User selects Streamlined from the below radio buttons in Commercial Purchase section in the General page of acquisition", { timeout: 2 * 20000 }, async () => {
  await app.click_css("label[for='sorceYes']");
  await app.s(1000);
  await app.click_css("label[for='fullSolicitation']");
  await app.s(1000);
});

When("User clicks on the “Draft Solicitation” button on the top right in the Acquisition page which he is reviewing after the acquisition is successfully accepted",
  { timeout: 2 * 20000 },
  async () => {
    await app.click_id("acceptAp");
    await app.s(3000);
    await app.click_id("initiateAp");
    await app.s(4000);
  }
);

When("User should see a notification saying on the top right saying “Initiated successfully” “AI has built the form successfully” on the next window",
  { timeout: 2 * 20000 },
  async () => {
    await app.s(4000);
  }
);

Then("User should see a “Streamlined” version of acquisition in the next window",
  { timeout: 2 * 20000 },
  async () => {
    await app.s(4000);
  }
);
