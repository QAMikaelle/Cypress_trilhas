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
            cy.get('#sidenavPin > .icon-push-pin').click();
            cy.get('[data-nodeid="28"] > .glyphicon').click();

            cy.get('#sidenavPin')
                .should('be.visible')
                .click();

            cy.get('[data-nodeid="28"]')
                .first()
                .scrollIntoView()
                .should('be.visible')
                .parents('li') // sobe até o nó da árvore
                .click();


      
});
});
  }); 