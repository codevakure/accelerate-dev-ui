var { Given, When, And, Then, Before } = require("cucumber");
import { AppPage } from "../app.po";
import { browser, by, element, protractor, until } from "protractor";

let app: AppPage;

Before(() => (app = new AppPage()));

Given("User is back on SF-30", { timeout: 2 * 20000 }, async () => {
  await app.s(2000);
});

When("User clicks on deadlines in form SF-30", { timeout: 2 * 20000 }, async () => {
 await app.click_css("#_1 > input");
 await app.s(1000);
});

When("User enters effective date", { timeout: 2 * 20000 }, async () => {
await app.enterInput_id("ammendeffectivedate","11/04/2021");
await app.s(1000);

});
When("User enters extension due date", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_id("extensiondate","12/04/2023");
    await app.s(1000);
});
When("User clicks on amendment description", { timeout: 2 * 20000 }, async () => {
await app.click_css("#_2 > input");
await app.s(1000);
});
When("User enters amendment description", { timeout: 2 * 20000 }, async () => {
await app.enterInput_css("#_2 > div.dropdownbody > quill-editor > div.ql-container.ql-snow > div.ql-editor.ql-blank","Deeksha Automation Test"+ new Date())
});

Then("form sf-30 is done", { timeout: 2 * 20000 }, async () => {
    await app.s(2000);
});
