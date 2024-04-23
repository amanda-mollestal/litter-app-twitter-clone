describe('lit spec', () => {
  it('passes', () => {
    cy.visit(Cypress.env('staging_url') + '/lit/' + Cypress.env('lit_id'))

    cy.wait(1500)

    cy.get('.pr-2 > .flex-col').contains('cats')

    cy.get('.ml-5.flex-row').contains('@ek223ur')
  })
})
