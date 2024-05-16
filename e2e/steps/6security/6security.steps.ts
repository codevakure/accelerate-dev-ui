var { Given, When, And, Then, Before } = require("cucumber");
import { AppPage } from "../app.po";
import { browser, by, element, protractor, until } from "protractor";

let app: AppPage;

Before(() => (app = new AppPage()));



Given("User clicks on security in the left side nav", { timeout: 2 * 30000 }, async () => {
    await app.s(2000);
    await app.click_id("Security");
    await app.s(2000);
});

When("User sees security page", { timeout: 2 * 20000 }, async () => {
await app.s(2000);
});

Then("User enters information", { timeout: 2 * 20000 }, async () => {
    await app.click_css("label[for='securityConsiderationsNo']");
    await app.s(3000);
});

