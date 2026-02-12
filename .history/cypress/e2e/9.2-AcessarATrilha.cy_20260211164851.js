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

        //inscrever na trilha
        cy.get('.default-gap > div.ng-scope > .btn-swipe-accent > ng-transclude').click();
        cy.contains('Finalizar trilha').should('be.visible');

        //Cancelar inscrição
        cy.get("[ng-class=\"{active: $state.current.name.includes('accessLink.content.showcase.id.modal.home')}\"] > .ng-binding").click();
        cy.get(`[ng-class="{active: isAtState('home.trails')}"]`).click();
        cy.get('.actionsColumn > .middle > .btn-swipe-accent').click();
        cy.get('[switch="modal.confirmCancelSubscription"] > .modal > :nth-child(2) > .modal-body > ng-transclude > .ng-pristine').type("motivo do cancelamento teste");
        cy.get('[switch="modal.confirmCancelSubscription"] > .modal > :nth-child(2) > .end > .flex > .btn-swipe-accent').click();

        //verificar o status de cancelamento
        cy.get('.training-card')
        .should('contain.text', 'Trilha automação')
        .and('contain.text', 'cancelado');
        });

        it.only("Aprovar cancelamento", () => {
        //aprovar cancelamento
        cy.wait(2000);
        cy.get('.avatar').click();
        cy.get(':nth-child(4) > .menu-option > ng-transclude > .icon-pointer-right').click();
        cy.get(':nth-child(4) > .user-options-items > :nth-child(2) > ng-transclude > .ng-binding').click();

        cy.get(':nth-child(2) > .approval-box > .column > .approval-buttons > .btn-swipe-accent > ng-transclude > .ng-binding').click();

        });


    
});
});