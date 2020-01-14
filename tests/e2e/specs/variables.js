/// <reference types="Cypress" />

describe('variables', () => {
  it('fetches project according to variables', () => {
    cy.visit('/variables')

    cy.get('[data-spec="content"]').should('contain.text', 'Select page')

    cy.get('[data-spec="tab-page-1"]').click()
    cy.get('[data-spec="content"]').should('contain.text', 'First project')

    cy.get('[data-spec="tab-page-2"]').click()
    cy.get('[data-spec="content"]').should('contain.text', 'Next project')
  })

  it('ignores previous inadequate responses', () => {
    const page1 = { data: [{ id: '1', type: 'project', attributes: { name: 'First project' } }] }
    const page2 = { data: [{ id: '2', type: 'project', attributes: { name: 'Next project' } }] }

    cy.server()
    cy.route({ url: 'http://localhost:3000/projects?page=1', delay: 100, response: page1 }).as('page1')
    cy.route({ url: 'http://localhost:3000/projects?page=2', delay: 0, response: page2 }).as('page2')

    cy.visit('/variables')

    cy.get('[data-spec="content"]').should('contain.text', 'Select page')

    cy.get('[data-spec="tab-page-1"]').click()
    cy.get('[data-spec="tab-page-2"]').click()

    cy.wait('@page1')

    cy.get('[data-spec="content"]').should('contain.text', 'Next project')
  })
})
