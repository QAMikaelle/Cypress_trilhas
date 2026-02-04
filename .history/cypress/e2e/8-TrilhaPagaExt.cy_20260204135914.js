/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable')) {
    return false;
    }
    });

describe("Teste - Login", () => {
    beforeEach(() => {
        //Entra na página de login
            cy.visit("https://www.hml.lector.live/ext/showcase/2289");
    
        //Faz login
            cy.get('button.login-xs')
            .should('contain.text', 'Entrar')
            .click();

            cy.get('[style="z-index: 26;"] > :nth-child(1) > :nth-child(1) > .popup > :nth-child(1) > .ng-pristine').type("qualidade@lectortec.com.br");
            cy.get('[name="login_password_navbar"]').type("c8d593QGXOkjRjC");
            cy.get('.popup:visible')
            .contains('button', 'Entrar')
            .should('be.visible')
            .and('be.enabled')
            .click();
        });

    context("Trilha > trilha paga ", () => {

    it("Trilha paga", () => {
        cy.get('.active > .ng-binding').click();
        cy.get(':nth-child(1) > .showcase-menu-name').click();

        
    });

    it("Trilha paga com cupom", () => {

    
    });

    
    });
  }); 