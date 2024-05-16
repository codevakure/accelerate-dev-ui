var { Given, When, And, Then, Before } = require("cucumber");
import { AppPage } from "../app.po";
import { browser, by, element, protractor, until } from "protractor";

let app: AppPage;

Before(() => (app = new AppPage()));

Given("User is on Acquisition", { timeout: 2 * 20000 }, async () => {
  await app.s(2000);
});

When("User clicks on statement of work in the left side nav", { timeout: 2 * 30000 }, async () => {
    await app.click_id("SOW");
    await app.s(2000);
});

When("User sees statement of work page", { timeout: 2 * 20000 }, async () => {
await app.s(2000);
});

Then("User starts entering information for Product or Service Descriptions and Capability or Performance", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_css("#content > app-sow > div.col-sm-12.col-md-12.cl-lg-11.col-xl-11 > form > div:nth-child(4) > div > quill-editor > div.ql-container.ql-snow > div.ql-editor.ql-blank", "Deeksha Automation Test 2 "+ new Date())
    await app.s(3000);
});

