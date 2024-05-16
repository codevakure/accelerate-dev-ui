Feature: Drafting Solicitation
        Contracting Officer Logs in to the account and checks the acquistion that was shared and fills the required information and then accepts and draft the solicitation

  Scenario: Contracting officer logs in to the account and checks the acquisition
            Given User is on sandbox login page
            When User enters CO credentials and logs in
            Then User sees the CO dashboard

  Scenario: Contracting officer reviews the shared acquisition
            Given User is on dashboard
            When User sees the shared acquisition and clicks on review button
            Then User sees the general page of the acquisition

  Scenario: “Draft Solicitation” in Acquisition page for the “Streamlined” version of acquisition 
            Given User is on general page
            When User selects Streamlined from the below radio buttons in Commercial Purchase section in the General page of acquisition
            And User clicks on the “Draft Solicitation” button on the top right in the Acquisition page which he is reviewing after the acquisition is successfully accepted
            And User should see a notification saying on the top right saying “Initiated successfully” “AI has built the form successfully” on the next window
            Then User should see a “Streamlined” version of acquisition in the next window 

