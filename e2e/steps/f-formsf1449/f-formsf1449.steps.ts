var { Given, When, And, Then, Before } = require("cucumber");
import { AppPage } from "../app.po";
import { browser, by, element, protractor, until } from "protractor";

let app: AppPage;

Before(() => (app = new AppPage()));

Given("User is on Form SF1449", { timeout: 2 * 20000 }, async () => {
  await app.s(2000);
});

When("User clicks on Deadlines", { timeout: 2 * 20000 }, async () => {
    await app.click_id("headingThree")
    await app.s(2000);
});

When("User completes the Q&A Date and Time", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_css("#dl_dropdown > div:nth-child(2) > input", "10/30/2020");
    await app.s(2000);
});

When("User completes Solicitation Due Date & Time", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_css("#dl_dropdown > div:nth-child(4) > input", "11/01/2020");
    await app.s(2000);
});

Then("Form SF1449 is complete", { timeout: 2 * 20000 }, async () => {
    await app.s(2000);
});
