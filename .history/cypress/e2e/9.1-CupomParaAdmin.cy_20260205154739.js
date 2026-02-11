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
      // clica em Relatórios de forma estável
cy.contains('.sideitem, a, button, li', 'Relatórios')
  .filter(':visible')
  .first()
  .scrollIntoView({ block: 'center' })
  .should('be.visible')
  .click();

      // fixa o menu (clicar no BOTÃO, não no ícone)
      cy.get('#sidenavPin')
        .filter(':visible')
        .first()
        .click();

      // abre/clica no node do menu
      cy.get('[data-nodeid="28"]')
        .filter(':visible')
        .first()
        .scrollIntoView({ block: 'center' })
        .should('be.visible')
        .click();

      // Selecionar filtro de data
      cy.get('.date-range-result').should('be.visible').click();
      cy.get('.date-range-popup > .btn-swipe-lgray').should('be.visible').click();

      cy.get(':nth-child(1) > div.ng-scope > .text-filter > .multiselect > .ng-pristine')
        .should('be.visible')
        .focus()
        .clear({ force: true })
        .type('mikaelle', { delay: 20 });

      cy.get('.advanced-filters > .end > .btn-swipe-accent')
        .should('be.visible')
        .and('be.enabled')
        .click();


      
});
});
  }); 