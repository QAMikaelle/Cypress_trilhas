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

    context("Trilha > trilha paga ", () => {

    it("Testar cupom na trilha paga", () => {

        //Seleciona a trilha paga
            cy.get('[data-page-idx="1"] > :nth-child(1) > .card-container > [ng-init="trail = content.entity"] > a.ng-scope > .showcase-card-container').click();
            cy.wait(4000)

        //Comprar a trilha
            cy.get(':nth-child(2) > .classes-actions > :nth-child(1) > .btn-swipe-accent').click();
            cy.wait(4000)

        //Adicionar cupom
            cy.get('.modal > .modal-body > table > tbody > :nth-child(2) > :nth-child(2) > .button-input > .ng-valid').type('Teste2');

        //Aplicar cupom
            cy.get('.modal > .modal-body > table > tbody > :nth-child(2) > :nth-child(2) > .button-input > .btn-swipe-accent').click();

        //Finalizar compra
            cy.get('[ng-show="modal.checkout"] > .modal > .content-box-footer > .btn-swipe-accent').click();
            cy.get('[ng-if="getPurchaseStatus(class) == 3"] > .btn-swipe-accent').click();

    });

    it("Trilha paga", () => {

    
    });

    it("Trilha paga  - recorrente", () => {

    
    });
    
    });
  }); 