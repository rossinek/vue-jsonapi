/// <reference types="Cypress" />

describe('included', () => {
  it('writing to cache updates view', () => {
    cy.visit('/modifications')
    cy.get('[data-spec="project"]:contains(First project)').should('have.length', 1)
    cy.get('[data-spec="project"]:contains(Updated first project)').should('have.length', 0)

    cy.get('[data-spec="project-name-input"]').clear().type('Updated first project')
    cy.get('[data-spec="patch-project-button"]').click()

    cy.get('[data-spec="project"]:contains(First project)').should('have.length', 0)
    cy.get('[data-spec="project"]:contains(Updated first project)').should('have.length', 1)

    cy.get('[data-spec="project"]:contains(Third project) [data-spec="tag"]').should('have.length', 0)

    cy.get('[data-spec="tag-checkbox"]').first().click()
    cy.get('[data-spec="tag-checkbox"]').last().click()
    cy.get('[data-spec="project"]:contains(Third project) [data-spec="tag"]').should('have.length', 2)

    cy.get('[data-spec="refetch-button"]').click()

    cy.get('[data-spec="project"]:contains(First project)').should('have.length', 1)
    cy.get('[data-spec="project"]:contains(Third project) [data-spec="tag"]').should('have.length', 0)
  })
})
