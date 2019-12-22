/// <reference types="Cypress" />

describe('statuses', () => {
  it('shows `pending` status and loading info before the server responds', () => {
    cy.server()
    cy.route({ url: 'http://localhost:3000/**', delay: 10000, response: {} })
    cy.visit('/statuses')

    cy.get('[data-spec="idle"]').find('[data-spec="status"]').should('have.text', 'idle')
    cy.get('[data-spec="idle"]').find('[data-spec="loading"]').should('not.be.visible')

    cy.get('[data-spec="unsuccessful"]').find('[data-spec="status"]').should('have.text', 'pending')
    cy.get('[data-spec="unsuccessful"]').find('[data-spec="loading"]').should('be.visible')

    cy.get('[data-spec="unsuccessfulWithHandler"]').find('[data-spec="status"]').should('have.text', 'pending')
    cy.get('[data-spec="unsuccessfulWithHandler"]').find('[data-spec="loading"]').should('be.visible')

    cy.get('[data-spec="successful"]').find('[data-spec="status"]').should('have.text', 'pending')
    cy.get('[data-spec="successful"]').find('[data-spec="loading"]').should('be.visible')

    cy.get('[data-spec="global-loading"]').should('be.visible')
  })

  it('eventually shows appropriate status', () => {
    cy.visit('/statuses')
    cy.get('[data-spec="idle"]').find('[data-spec="status"]').should('have.text', 'idle')
    cy.get('[data-spec="idle"]').find('[data-spec="loading"]').should('not.be.visible')

    cy.get('[data-spec="unsuccessful"]').find('[data-spec="status"]').should('have.text', 'error')
    cy.get('[data-spec="unsuccessful"]').find('[data-spec="loading"]').should('not.be.visible')

    cy.get('[data-spec="unsuccessfulWithHandler"]').find('[data-spec="status"]').should('have.text', 'error')
    cy.get('[data-spec="unsuccessfulWithHandler"]').find('[data-spec="loading"]').should('not.be.visible')

    cy.get('[data-spec="successful"]').find('[data-spec="status"]').should('have.text', 'success')
    cy.get('[data-spec="successful"]').find('[data-spec="loading"]').should('not.be.visible')

    cy.get('[data-spec="global-loading"]').should('not.be.visible')
  })

  it('shows global loading info if at least one request is pending', () => {
    cy.server()
    cy.route({ url: 'http://localhost:3000/tasks/1**', delay: 10000, response: {} })
    cy.visit('/statuses')

    cy.get('[data-spec="idle"]').find('[data-spec="status"]').should('have.text', 'idle')
    cy.get('[data-spec="idle"]').find('[data-spec="loading"]').should('not.be.visible')

    cy.get('[data-spec="unsuccessful"]').find('[data-spec="status"]').should('have.text', 'error')
    cy.get('[data-spec="unsuccessful"]').find('[data-spec="loading"]').should('not.be.visible')

    cy.get('[data-spec="unsuccessfulWithHandler"]').find('[data-spec="status"]').should('have.text', 'error')
    cy.get('[data-spec="unsuccessfulWithHandler"]').find('[data-spec="loading"]').should('not.be.visible')

    cy.get('[data-spec="successful"]').find('[data-spec="status"]').should('have.text', 'pending')
    cy.get('[data-spec="successful"]').find('[data-spec="loading"]').should('be.visible')

    cy.get('[data-spec="global-loading"]').should('be.visible')
  })

})
