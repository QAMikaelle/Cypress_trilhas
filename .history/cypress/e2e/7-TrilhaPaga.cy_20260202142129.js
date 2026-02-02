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
            cy.visit("https://www.hml.lector.live/lector_suporte/showcase/2257");
            cy.contains("button", "Entrar").click();
    
        //Faz login
            cy.get('[style="z-index: 26;"] > :nth-child(1) > :nth-child(1) > .popup > :nth-child(1) > .ng-pristine').type("qualidade@lectortec.com.br");
            cy.get("#login_password_navbar").type("c8d593QGXOkjRjC");
            cy.get(".popup").contains("button", "Entrar").click();
        });

    context("Trilha > trilha paga ", () => {

    it.only("Trilha paga", () => {

        //Seleciona a trilha paga
            cy.get(':nth-child(3) > .carousel-container > .CARD_THEME3 > .showcase-card-carousel-track-container > [data-page-idx="0"] > :nth-child(1) > .card-container > [ng-init="course = content.entity"] > a.ng-scope > .showcase-card-container').click()
    });

     it("Trilha paga  - recorrente", () => {

    
    });
    
    });
  }); 