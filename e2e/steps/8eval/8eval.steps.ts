var { Given, When, And, Then, Before } = require("cucumber");
import { AppPage } from "../app.po";
import { browser, by, element, protractor, until } from "protractor";

let app: AppPage;


Before(() => (app = new AppPage()));

Given("User clicks on evaluation in the left side nav", { timeout: 2 * 20000 }, async () => {
  await app.s(3000);
  await app.click_id('Evaluations');
});

When("User sees evaluation page", { timeout: 2 * 20000 }, async () => {
  await app.s(3000);
  await app.click_id('headingOne');
  await app.s(2000);
  await app.enterInput_css("#sourceSelectionPlan > div.ql-container.ql-snow > div.ql-editor.ql-blank","Deeksha Automation Test");
  await app.s(1000);
  await app.click_id('headingFour');
  await app.enterInput_css("#collapseFour > div > quill-editor > div.ql-container.ql-snow > div.ql-editor.ql-blank","Deeksha Automation Test");
  await app.s(2000);
  await app.click_id('headingThree');
  await app.s(1000);
  await app.click_css("#createVolume");
  await app.s(1000);
  await app.enterInput_id("volumeName", "Deeksha Volume 1");
  await app.s(1000);
  await element(by.cssContainingText('option', 'Pricing')).click();
  await app.s(2000);
  await app.click_css("#active00 > div > div:nth-child(3) > div > div.custom-control.custom-radio > label");
  await app.s(1000);
  await app.click_css("#active00 > div > div:nth-child(3) > div > div.ml-3.mt-3.mb-2 > div:nth-child(1) > label");
});

Then("User completes all the information in evaluation page", { timeout: 2 * 20000 }, async () => {

    await app.s(2000);
});
