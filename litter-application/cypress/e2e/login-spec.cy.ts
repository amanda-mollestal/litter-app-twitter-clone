describe('litter auth test', () => {
  it('passes', () => {
    cy.login()

    cy.get('div.mt-1 > .inline-flex').contains('Post')
    cy.get('.h-16 > :nth-child(2) > .inline-flex').contains('Logout')
  })
})
