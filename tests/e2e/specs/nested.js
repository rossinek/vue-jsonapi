describe('test', () => {
  it('shows list of projects', () => {
    cy.visit('/nested')
    cy.get('[data-spec="project"]').should('have.length', 3)
  })
})
