/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable')) {
    return false;
    }
    });

describe.only("Teste - Login", () => {
    beforeEach(() => {
        //Entra na página de login
            cy.visit("https://www.hml.lector.live/esmp/subscribe/login");
    
        //Faz login
            cy.get('[name="login_username"]').type("qualidade@lectortec.com.br");
            cy.get('[name="login_password"]').type("c8d593QGXOkjRjC");
            cy.get('#btn-entrar').click();
        });

    context("Fluxo análise financeira ", () => {

    //Testa cupom para admin
        it("Teste cupom para admin", () => {
            cy.get('[title="Relatórios"] > .sideitem').click();
            cy.get('#sidenavPin').filter(':visible').first().click();
            cy.wait(1000);
            cy.get('[data-nodeid="28"] > .glyphicon').click();

            //Fixar o menu lateral
            cy.get('#sidenavPin')
                .should('be.visible')
                .click();

            cy.wait(2000);

            //Selecionar filtro de data
            cy.get('.date-range-result').click();
            cy.get('.date-range-popup > .btn-swipe-lgray').click();
            cy.get(':nth-child(1) > div.ng-scope > .text-filter > .multiselect > .ng-pristine').type(mikaelle);
            cy.get('.advanced-filters > .end > .btn-swipe-accent').click();


      
});
});
  }); 