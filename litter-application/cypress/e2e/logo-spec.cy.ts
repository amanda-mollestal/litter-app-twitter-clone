describe('litter logo text test', () => {
  it('passes', () => {
    cy.visit(Cypress.env('staging_url'))
    
    cy.get('.flex > .text-center').contains('litter')
  })
})