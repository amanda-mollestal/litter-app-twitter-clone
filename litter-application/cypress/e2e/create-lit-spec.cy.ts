describe('create lit spec', () => {
  it('passes', () => {
    cy.login()

    cy.wait(1500)

    cy.get('[data-cy=lit-textarea]').type('Created by the test suite')

    cy.get('div.mt-1 > .inline-flex').click({ force: true })

    cy.wait(1500)

    cy.get('.flex-col.items-center > :nth-child(1)').contains('Created by the test suite')
  })
})
