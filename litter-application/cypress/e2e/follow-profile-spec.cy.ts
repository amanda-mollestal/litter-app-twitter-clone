describe('follow spec', () => {
  it('passes', () => {
    cy.login()

    cy.wait(2500)

    cy.visit(Cypress.env('staging_url') + '/profile/ek223ur')

    cy.wait(2500)

    let initialFollowers: number = 0
    cy.get('.text-center > :nth-child(1) > .flex > :nth-child(2)')
      .invoke('text')
      .then((text: any) => {
        const match = text.match(/(\d+) followers/)
        if (match) {
          initialFollowers = parseInt(match[1], 10)

          cy.get('.flex-grow > .inline-flex').then((button: any) => {
            if (button.text().includes('Unfollow')) {
              button.click()
              cy.wait(2500)
              cy.get('.text-center > :nth-child(1) > .flex > :nth-child(2)').contains(
                `${initialFollowers - 1} followers`
              )
              cy.get('.flex-grow > .inline-flex').contains('Follow')
            }
          })

          cy.get('.flex-grow > .inline-flex').then((button: any) => {
            if (button.text().includes('Unfollow')) {
              button.click()
              cy.wait(2500)
              cy.get('.text-center > :nth-child(1) > .flex > :nth-child(2)').contains(
                `${initialFollowers - 1} followers`
              )
              cy.get('.flex-grow > .inline-flex').contains('Follow')
            }
          })

          cy.get('.flex-grow > .inline-flex').contains('Follow').click()

          cy.wait(2500)

          cy.get('.flex-grow > .inline-flex').contains('Unfollow')

          cy.get('.text-center > :nth-child(1) > .flex > :nth-child(2)').contains(
            `${initialFollowers} followers`
          )
        }
      })
  })
})
