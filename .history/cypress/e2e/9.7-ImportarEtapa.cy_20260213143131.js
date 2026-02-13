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
            cy.visit("https://www.hml.lector.live/ext/subscribe/login");
    
        //Faz login
            cy.get('form.ng-pristine > [required=""]').type("qualidade@lectortec.com.br");
            cy.get('[name="login_password"]').type("c8d593QGXOkjRjC");
            cy.get('#btn-entrar').click();
        });

    context("Importar etapa de outra trilha", () => {

    it("Importar etapa de outra trilha", () => {

        //clica no menu Trilhas
            cy.get('[title="Trilhas"] > .sideitem').click(); 

        //criar trilha
            cy.get('.title-bar > .btn-icon').click();
            


    });


});
});