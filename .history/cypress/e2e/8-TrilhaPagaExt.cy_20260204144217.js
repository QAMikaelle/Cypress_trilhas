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
        
        //Seleciona a trilha paga
        cy.get(':nth-child(1) > .card-container > [ng-init="trail = content.entity"] > a.ng-scope > .showcase-card-container').click();

        //Clica em comprar trilha
        cy.get('.default-gap > div.ng-scope > .btn-swipe-accent > ng-transclude > .ng-binding').click();

        //Finalizar compra
        cy.get('.column.ng-valid > .modal-header > .btn').click();
        

        
    });

    it("Trilha paga com cupom - pix", () => {
        
        //Seleciona a trilha paga
        cy.get(':nth-child(2) > .card-container > [ng-init="trail = content.entity"] > a.ng-scope > .showcase-card-container').click();

        //Clica em comprar trilha
        cy.get('.default-gap > div.ng-scope > .btn-swipe-accent > ng-transclude > .ng-binding').click();

        //Adicionar cupom
        cy.get('.w-50 > .button-input > .ng-pristine').type("LECTOR10");

        //Aplicar cupom
        cy.get('.w-50 > .button-input > .btn-swipe-accent > ng-transclude > .ng-binding').click();

        //Adicionar forma de pagamento pix
        cy.get('.mb-5 > .icon-radio').click();

        
    });

    /*it("Trilha paga com cupom - cartão", () => {
        
        //Seleciona a trilha paga
        cy.get(':nth-child(2) > .card-container > [ng-init="trail = content.entity"] > a.ng-scope > .showcase-card-container').click();

        //Clica em comprar trilha
        cy.get('.default-gap > div.ng-scope > .btn-swipe-accent > ng-transclude > .ng-binding').click();

        //Adicionar cupom
        cy.get('.w-50 > .button-input > .ng-pristine').type("LECTOR10");

        //Aplicar cupom
        cy.get('.w-50 > .button-input > .btn-swipe-accent > ng-transclude > .ng-binding').click();

        //Adicionar forma de pagamento pix
        cy.get('.mb-5 > .icon-radio').click();

        
    });*/

    
    });
  }); 