/// <reference types="Cypress" />

describe('included', () => {
  it('shows list of projects, tags and tasks', () => {
    cy.visit('/included')
    cy.get('[data-spec="project"]').should('have.length', 3)
    cy.get('[data-spec="tag"]').should('have.length', 4)
    cy.get('[data-spec="task"]').should('have.length', 4)
  })

  it('loads next page of projects', () => {
    cy.visit('/included')
    cy.get('[data-spec="project"]').should('have.length', 3)
    cy.get('[data-spec="tag"]').should('have.length', 4)
    cy.get('[data-spec="fetch-more-button"]').click()
    cy.get('[data-spec="project"]').should('have.length', 4)
    cy.get('[data-spec="tag"]').should('have.length', 5)
  })

  it('updates included relations', () => {
    cy.visit('/included')
    cy.get('[data-spec="tag"]:contains(programming)').should('have.length', 2)
    cy.get('[data-spec="tag"]:contains(completely new tag)').should('have.length', 0)

    cy.get('[data-spec="tag-name-input"]').type('completely new tag')
    cy.get('[data-spec="patch-tag-button"]').click()

    cy.get('[data-spec="tag"]:contains(programming)').should('have.length', 0)
    cy.get('[data-spec="tag"]:contains(completely new tag)').should('have.length', 2)
  })
})
