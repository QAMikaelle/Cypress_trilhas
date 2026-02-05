/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable')) {
    return false;
    }
    });

describe.only("Teste - Login", () => {
    beforeEach(() => {
        //Entra na página de login
            cy.visit("https://www.hml.lector.live/esmp/showcase/2279");
    
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

    context("Fluxo análise financeira ", () => {

    //Testa cupom para admin
        it("Teste cupom para admin", () => {
            cy.wait(5000);
            cy.get('.user-menu-xs').click();
            cy.get('.dropdown-menu > :nth-child(3) > a').click();
            cy.get('.nav > :nth-child(3) > a').click();
            cy.get('.coupon-code-input').type("CUPOMADMIN10");
            cy.get('.apply-coupon-button').click();
            cy.get('.coupon-success-message').should('contain.text', 'Cupom aplicado com sucesso');
    
    });
  }); 