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

    context("Assistir Trilha com todos os conteúdos", () => {

    it("Assistir Trilha", () => {

    //Abrir trilha
    cy.get(':nth-child(2) > .carousel-container > .CARD_THEME3 > .showcase-card-carousel-track-container > [data-page-idx="0"] > :nth-child(1) > .card-container > [ng-init="trail = content.entity"] > a.ng-scope > .showcase-card-container').click();
    cy.wait(15000);  

    //Me inscrevo na trilha
    cy.get('.default-gap > div.ng-scope > .btn-swipe-accent').click();
    cy.wait(2000);

    //Se inscrever no treinamento e acessar o treinamento
    cy.get(':nth-child(2) > .overflow-x > .stage-content-list > tbody > :nth-child(1) > :nth-child(6) > .pv-5 > .btn-swipe-accent').click();
    cy.wait(5000);

    //Confirmar inscrição no treinamento pois já atingiu a nota maxima
    cy.get('[switch="modal.approvedCourseNotice"] > .modal > :nth-child(2) > .modal-form > .end > .btn-swipe-accent > ng-transclude > .ng-binding').click(); //Acessar o treinamento
    cy.wait(5000);
    cy.get(':nth-child(2) > .overflow-x > .stage-content-list > tbody > :nth-child(1) > :nth-child(6) > .pv-5').click(); //Acessar o treinamento
    cy.wait(10000);


    //Realizar avaliação do treinamento
    cy.get('.live-event-resource-message > .default-gap > .btn-swipe-accent').click(); //Iniciar avaliação do treinamento
    cy.get('.alternatives-grid-box > :nth-child(2) > :nth-child(1) > .checkbox > .icon-checkbox').click(); //Responder pergunta 1
    cy.get('#nextResourceArrow').click(); //Próxima pergunta
    cy.get('[switch="service.modalSendAnswers"] > .modal > :nth-child(2) > .modal-form > .end > .btn-swipe-accent').click(); //Finalizar avaliação do treinamento
    cy.get('.resource-button-preview').click(); //Próximo recurso
    cy.get('[switch="modal.courseFinished"] > .modal > :nth-child(2) > .end > .flex > .btn-swipe-accent').click(); //Finalizar avaliação do treinamento
    cy.wait(10000);

    //Validar certificado do treinamento
    cy.get('.top-bar > .btn-swipe-accent').click(); //Abrir certificado

    //Realizar a avaliação da trilha
    cy.get(':nth-child(2) > .overflow-x > .stage-content-list > tbody > :nth-child(2) > :nth-child(6) > .pv-5 > .btn-swipe-accent').click(); //Acessar avaliação da trilha
    
    //Iniciar avaliação da trilha
    cy.get('.alternatives-grid-box:visible', { timeout: 20000 }).should('be.visible');

    cy.get('.alternatives-grid-box:visible')
    .find('.checkbox .icon-checkbox, .checkbox .icon-radio')
    .filter(':visible')
    .first()
    .scrollIntoView()
    .click({ force: true });

    cy.get('[ng-click="evaluationViewerService.nextQuestion()"]').click(); //Próxima pergunta

    //Responder segunda pergunta da avaliação da trilha
    cy.get('.alternatives-grid-box:visible', { timeout: 20000 }).should('be.visible');

    cy.get('.alternatives-grid-box:visible')
    .find('.checkbox .icon-checkbox, .checkbox .icon-radio')
    .filter(':visible')
    .first()
    .scrollIntoView()
    .click({ force: true });

    cy.get('[ng-click="evaluationViewerService.nextQuestion()"]').click(); //Próxima pergunta

    // Terceira pergunta da avaliação da trilha
    cy.get('.alternatives-grid-box:visible', { timeout: 20000 }).should('be.visible');

    cy.get('.alternatives-grid-box:visible')
    .find('.checkbox .icon-checkbox, .checkbox .icon-radio')
    .filter(':visible')
    .first()
    .scrollIntoView()
    .click({ force: true });

    cy.get('.evaluation-actions > .end > .btn-swipe-accent').click(); //Finalizar avaliação da trilha
    cy.get('[switch="service.modalSendAnswers"] > .modal > :nth-child(2) > .modal-form > .end > .btn-swipe-accent').click(); //Confirmar finalização da avaliação da trilha
    cy.wait(5000);
    cy.get('.evaluation-actions > .flex > .btn-swipe-accent').click(); //Fechar avaliação da trilha

    //Visualizar documento da trilha
    cy.get(':nth-child(3) > .overflow-x > .stage-content-list > tbody > :nth-child(1) > :nth-child(6) > .pv-5 > .btn-swipe-accent').click(); //Acessar documento da trilha
    cy.wait(5000);
    cy.get('.hide-resource').click(); //Fechar documento da trilha

    //Visualizar scorm da trilha
    cy.get(':nth-child(3) > .overflow-x > .stage-content-list > tbody > :nth-child(2) > :nth-child(6) > .pv-5 > .btn-swipe-accent').click(); //Acessar vídeo da trilha
    cy.get('.hide-resource').click(); //Fechar scorm da trilha

    //Finalizar trilha
    cy.get('.default-gap > .btn-swipe-accent > .ng-binding').click(); //Finalizar trilha


    });
  }); 
});
