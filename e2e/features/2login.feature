Feature: Testing Cross-domain Login
      Testing Login Credentials for user

      Scenario: Enter user credentials and going to server page
            Given Going sandbox login page
            When Enter User Information
            And Click on Enter
            Then Server Page Appears

      Scenario: Enter server information and going to dev dashboard
            Given User is on server information page
            When User Enter server information
            And User clicks on http checkbox
            And User clicks on go button
            Then Dev dashboard appears
