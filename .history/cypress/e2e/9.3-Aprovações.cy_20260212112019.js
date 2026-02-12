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

        //Clica no menu Trilhas
        cy.get('[title="Trilhas"] > .sideitem').click(); 

        //Clica no botão de adicionar nova trilha
        cy.get('.title-bar > .btn-icon').click(); 
        
        //preenche o campo de nome da trilha
        cy.get('input[placeholder="Informe o nome"]')
            .filter(':visible')
            .first()
            .should('be.enabled')
            .focus()
            .clear({ force: true })
            .type('Trilha Automação - paga com aprovação', { delay: 50 })
            .should('have.value', 'Trilha Automação - paga com aprovação')

        //seleciona o código
        cy.get('input[ng-model="currentTrail.externalId"]')
            .filter(':visible')
            .first()
            .should('be.enabled')
            .focus()
            .clear({ force: true })
            .type('202501', { delay: 30 })
            .should('have.value', '202501')

        //seleciona etapas
        cy.get('[ui-sref="accessLink.content.trails.edit.id.version.stages"]').click();
        
        //clica no botão de adicionar nova etapa
        cy.get('button[ng-click="createStage()"]')
            .filter(':visible')
            .first()
            .should('be.enabled')
            .scrollIntoView()
            .click();

        //adicionar novo conteúdo
        cy.get('[colspan="6"] > .btn-swipe-accent').click();

        //seleciona o treinamento
        cy.get('[model="currentContent.course"] > .multiselect > .border > .ui-select-match > .btn-default').type('teste');
        cy.get('#ui-select-choices-row-39-0').click();

        //adcicionar turma
        cy.get('[trails=""] > .tabs > .ng-scope').click();
        cy.get('.gap > .btn-swipe-accent').click();
        
        //adcionar nome turma
        cy.get('input[ng-model="object.model[language.key]"][placeholder="Informe um nome para a turma"]')
  .filter(':visible')
  .first()
  .clear({ force: true })
  .type('Turma teste', { delay: 50 })
  .should('have.value', 'Turma teste');


        //adicionar preço
        cy.get('#currentClassPrice', { timeout: 60000 })
            .should('be.visible')
            .clear()
            .type('3.91')

        //adicionar vencimento
        cy.get(':nth-child(2) > div.mt-20 > .middle > .checkbox > .icon-checkbox').click();

        //salvar turma
        cy.get('.gap > .btn-swipe-accent').click();

        
    });

   /* it("Criando uma trilha paga sem aprovação", () => {


        
    });

    it("Criando uma trilha gratuita com aprovação", () => {

        
        
    });

    it("Criando uma trilha gratuita sem aprovação", () => {


    }); */

    
});
});