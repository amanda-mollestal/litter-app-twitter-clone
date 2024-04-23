describe('following feed spec', () => {
  it('passes', () => {
    cy.login()

    cy.get('.items-center > :nth-child(1)').contains('test')

    cy.get('[data-cy=following-feed]').click().wait(500)
    cy.get('.items-center > :nth-child(1)').contains('ek223ur')
  })
})
