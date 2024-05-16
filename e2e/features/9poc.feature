Feature: Assigning Point of Contact
      Sharing acquisition with Contracting Officer

      Scenario: After Creating acquisition user navigates to point of contact page and shares with the Contracting Officer
            Given User is on project general page
            When User clicks on point of contact in the left side navigation
            And User sees the point of contact page
            And User should be able to select one of the contracting officers from the drop-down
            And User should see information populated in “Contact Information”, “Email” and “Phone Number” fields upon selecting contracting officers’ name in “Contracting officer” field
            Then Acquistion will be shared with selected CO

      Scenario: Deletion of “Contracting Officer” information from the “Points of Contact” page
            Given User is on POC page
            When User clicks on the “Trash” symbol beside the “Contracting officer” field
            And User should see all the pre-filled information deleted from the fields
            Then User adds POC


