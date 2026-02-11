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
    cy.wait(1000);
    //clica em compras
    cy.get('[data-nodeid="28"]').click();
    cy.wait(1000);

    //clica em filtro data
    cy.get('.date-range-result').should('be.visible').click();
    cy.get('.date-range-popup > .btn-swipe-lgray').should('be.visible').click();

    //Pesquisar usuario
    cy.get(':nth-child(1) > div.ng-scope > .text-filter > .multiselect > .ng-pristine').type('mikaelle');
    cy.get('.advanced-filters > .end > .btn-swipe-accent').should('be.visible').click();

    //analise financeira
    cy.get(':nth-child(1) > .actionsColumn > .btn-swipe-accent').should('be.visible').click();

    //alterar cupom
    cy.get('.ph-5 > .middle > .btn-swipe-accent').should('be.visible').click();
    cy.get('.modal-body > .ng-isolate-scope > .multiselect > .border > .ui-select-match > .btn-default').type('CUPOM10');
    cy.wait(1000);
    cy.get('.ui-select-highlight').should('be.visible').click();
    cy.get('[ng-if="financialAnalysis.purchaseCouponModal"] > .modal > .content-box-footer > .btn-swipe-accent').should('be.visible').click();

    //alterar emissão
    cy.get(':nth-child(8) > .btn-swipe-accent').should('be.visible').click();
    cy.get('.table-condensed > tbody > :nth-child(3) > :nth-child(5)').should('be.visible').click();
    cy.get('.datetimepicker-hours > .table-condensed > tbody > tr > td > :nth-child(9)').should('be.visible').click();
    cy.get('.datetimepicker-minutes > .table-condensed > tbody > tr > td > :nth-child(1)').should('be.visible').click();
    cy.get('[ng-if="financialAnalysis.updateInvoiceFieldModal"] > .modal > .content-box-footer > .btn-swipe-accent').should('be.visible').click();





      
});
});
  }); 