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

    context("Trilha > trilha paga ", () => {

    it("Trilha paga", () => {

        //Seleciona a trilha paga
            cy.get('[data-page-idx="0"] > :nth-child(1) > .card-container > [ng-init="course = content.entity"] > a.ng-scope > .showcase-card-container').click();
            cy.wait(4000)

        //Comprar a trilha
            cy.get(`[ng-if="getPurchaseStatus(class) == 'SUBSCRIBE_CLASS'"]`).click();
            cy.wait(4000)

        //Finalizar compra
            cy.get('[ng-show="modal.checkout"] > .modal > .content-box-footer > .btn-swipe-accent').click();

        //Fechar boleto 
            cy.get('modal-header > div > .btn')

    });


    it.only("Trilha paga  - recorrente", () => {

        //Selecionar trilha paga recorrente
        cy.get(':nth-child(1) > .carousel-container > .CARD_THEME3 > .showcase-card-carousel-controls > .showcase-card-carousel-arrow-right').click();
        cy.get('[data-page-idx="1"] > :nth-child(2) > .card-container > [ng-init="course = content.entity"] > a.ng-scope > .showcase-card-container').click();
        cy.wait(4000)

        //Comprar a trilha
            cy.get('.classes-actions > :nth-child(1) > .btn-swipe-accent > ng-transclude > :nth-child(1)').click();
            cy.wait(4000)

        //Finalizar compra
            cy.get('[ng-show="modal.checkout"] > .modal > .content-box-footer > .btn-swipe-accent').click();
    
        //Fechar boleto 
            cy.get('modal-header > div > .btn').click();

    });
    
    });
  }); 