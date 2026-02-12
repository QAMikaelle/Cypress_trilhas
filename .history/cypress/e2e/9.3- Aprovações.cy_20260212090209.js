    /* This is a Cypress test script written in JavaScript. Let me explain the key parts of the script: */
/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable')) {
    return false;
    }
    });

describe("Teste - Login", () => {
    beforeEach(() => {
        //Entra na página de login
            cy.visit("https://www.hml.lector.live/esmp/subscribe/login");
    
        //Faz login
            cy.get('[name="login_username"]').type("qualidade@lectortec.com.br");
            cy.get('[name="login_password"]').type("c8d593QGXOkjRjC");
            cy.get('#btn-entrar').click();
        });

    context("Trilha - Acessar a trilha", () => {

    it("Criando uma trilha paga com aprovação", () => {

        
        
    });

    it("Criando uma trilha paga sem aprovação", () => {

        
        
    });

    it("Criando uma trilha gratuita com aprovação", () => {

        
        
    });

    it("Criando uma trilha gratuita sem aprovação", () => {


    });

    
});
});