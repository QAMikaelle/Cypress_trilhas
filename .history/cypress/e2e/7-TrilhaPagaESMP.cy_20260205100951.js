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

    it.only("Trilha paga", () => {

        //Seleciona a trilha paga
            cy.get('[data-page-idx="1"] > :nth-child(1) > .card-container > [ng-init="trail = content.entity"] > a.ng-scope > .showcase-card-container').click();
            cy.wait(4000)

        //Comprar a trilha
            cy.get('.default-gap > div.ng-scope > .btn-swipe-accent > ng-transclude').click();
            cy.wait(4000)

        //Finalizar compra
            cy.get('[ng-show="modal.checkout"] > .modal > .content-box-footer > .btn-swipe-accent').click();

    });


    it("Trilha paga  - recorrente", () => {

    
    });
    
    });
  }); 