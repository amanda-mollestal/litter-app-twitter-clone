describe('logout test', () => {
  it('passes', () => {
    cy.login()
    cy.wait(1500)
    cy.get('.h-16 > :nth-child(2) > .inline-flex').contains('Logout').click()
    cy.wait(1500)

    cy.get('.h-16 > :nth-child(2) > .inline-flex').contains('Login')
  })
})
