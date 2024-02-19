describe('My First Test', () => {
  it('should login, redirect, open manage tickets', () => {
    cy.visit('/user/login');

    cy.get('.username').click({ force: true }).type('admin');

    cy.get('.password').click({ force: true }).type('admin123');

    cy.get('button[type=submit]').click();

    cy.url().should('eq', 'http://localhost:4200/');

    cy.visit('/ticket/managetickets');

    cy.url().should('eq', 'http://localhost:4200/ticket/managetickets');
  });
});
