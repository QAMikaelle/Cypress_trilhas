/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable')) {
    return false;
    }
    });

describe("Teste - Login", () => {
  beforeEach(() => {
    cy.visit("https://www.hml.lector.live/esmp/subscribe/login");

    cy.get('[name="login_username"]').should('be.visible').type("qualidade@lectortec.com.br");
    cy.get('[name="login_password"]').should('be.visible').type("c8d593QGXOkjRjC");
    cy.get('#btn-entrar').should('be.enabled').click();

    cy.url().should('include', '/esmp/');               // ou a rota que realmente abre
    cy.get('body').should('not.contain', 'login_username'); // sinal simples de que saiu do login

    // garante que logou
    cy.url().should('not.include', '/subscribe/login');
  });

  context("Fluxo análise financeira", () => {
    it("Teste cupom para admin", () => {
      // clica em Relatórios
      cy.get('[title="Relatórios"] > .sideitem').should('be.visible').click();


      
});
});
  }); 