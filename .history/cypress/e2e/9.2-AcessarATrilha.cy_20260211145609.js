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

    it("Validar informações", () => {

        cy.get('.active > .icon-next').click();
        cy.get(':nth-child(9) > .showcase-menu-name').click();
        cy.get(':nth-child(2) > .carousel-container > .CARD_THEME3 > .showcase-card-carousel-track-container > [data-page-idx="0"] > :nth-child(1) > .card-container > [ng-init="trail = content.entity"] > a.ng-scope > .showcase-card-container').click();


        //validar informações iniciais
        cy.get('[ui-sref="accessLink.content.trails.id.general"]').click();
        cy.contains('h1', 'Trilha automação').should('be.visible');
        cy.contains('Teste de descrição').should('be.visible');
        cy.contains('Fazer inscrição').should('be.visible');
        cy.pause();


   
    });

    
    });
  }); 