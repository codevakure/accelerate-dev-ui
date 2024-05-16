Feature: Complete Form SF1449 after drafting solicitation
        Complete Form SF1449 after drafting solicitation

  Scenario: Complete Form SF1449
            Given User is on Form SF1449
            When User clicks on Deadlines
            And User completes the Q&A Date and Time
            And User completes Solicitation Due Date & Time
            Then Form SF1449 is complete
