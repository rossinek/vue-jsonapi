describe('test', () => {
  it('shows list of authors', () => {
    cy.visit('/nested')
    cy.get('[data-spec="author"]').should('have.length', 4)
  })
})
