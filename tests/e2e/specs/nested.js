/// <reference types="Cypress" />

describe('nested', () => {
  it('shows list of projects', () => {
    cy.visit('/nested')
    cy.get('[data-spec="project"]').should('have.length', 3)
  })

  it('shows list of tags and tasks placeholders before the server responds', () => {
    cy.server()
    cy.route({ url: '**/tags', delay: 10000, response: {} })
    cy.route({ url: '**/tasks', delay: 10000, response: {} })
    cy.visit('/nested')
    cy.get('[data-spec="tag-placeholder"]').should('have.length', 3)
    cy.get('[data-spec="task-placeholder"]').should('have.length', 4)
  })

  it('eventually shows list of tags and tasks', () => {
    cy.visit('/nested')
    cy.get('[data-spec="tag"]').should('have.length', 3)
    cy.get('[data-spec="task"]').should('have.length', 4)
  })

  it('updates task automatically in all places after updated task is fetched', () => {
    cy.visit('/nested')
    cy.get('[data-spec="task"]').contains('#1').should('have.text', 'task #1')
    cy.get('[data-spec="get-updated-task-button"]').click()
    cy.get('[data-spec="task"]').contains('#1').should('have.text', 'task #1 – UPDATED')
  })
})
