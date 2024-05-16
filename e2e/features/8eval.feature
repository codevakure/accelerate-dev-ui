Feature: Complete evaluation page after creating acquisition
        Complete evaluation page after creating acquisition

  Scenario: New Acquisition is created and user needs to complete information in the evaluation page
            Given User clicks on evaluation in the left side nav
            When User sees evaluation page
            Then User completes all the information in evaluation page
