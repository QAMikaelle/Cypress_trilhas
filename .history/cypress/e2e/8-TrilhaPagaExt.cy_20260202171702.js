/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable')) {
    return false;
    }
    });

describe("Teste - Login", () => {
    beforeEach(() => {
        //Entra na página de login
            cy.visit("https://www.hml.lector.live/ext/showcase/1757");
    
        //Faz login
            cy.get('button.login-xs')
            .should('contain.text', 'Entrar')
            .click();

            cy.get('[style="z-index: 26;"] > :nth-child(1) > :nth-child(1) > .popup > :nth-child(1) > .ng-pristine').type("qualidade@lectortec.com.br");
            cy.get('[name="login_password_navbar"]').type("c8d593QGXOkjRjC");
            cy.get('#btn-entrar').click();
        });

    context("Trilha > trilha paga ", () => {

    it.only("Trilha paga", () => {

        
    });

    it("Trilha paga com cupom", () => {

    
    });

    
    });
  }); 