/// <reference types="cypress" />

// Isso aqui serve para ignorar erros internos da aplicação que não são do nosso teste
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild')) {
        return false;
    }
});

// "describe" é como uma pasta que agrupa todos os testes relacionados
describe("Teste - Trilha com Importação", () => {

    // "before" roda UMA VEZ antes de todos os testes — aqui fazemos o login
    before(() => {
        //Entra na página de login
        cy.visit("https://www.hml.lector.live/lector_suporte/subscribe/login");
        cy.wait(3000); //espera a página carregar

        //Faz login
        cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input').should('be.visible').type("suporte2@lectortec.com.br");
        cy.wait(2000);
        cy.get('#login_password').should('be.visible').type("#C4iocl4r413");
        cy.wait(1000);
        cy.get('#btn-entrar').should('be.enabled').click();
        cy.wait(5000); //espera a página carregar após o login

        //ve se logou
        cy.url().should('not.include', '/subscribe/login');
    });

    // "context" é como uma subpasta dentro do describe
    context("Criar Trilha com Importação", () => {

        // "it" é o teste em si — tudo que o Cypress vai fazer fica AQUI DENTRO
        it("Criando trilha com etapas importadas", () => {

            //Criar trilha
            cy.get('[title="Trilhas"] > .sideitem').click();
            cy.wait(3000); //espera a página de trilhas carregar

            //botão de criar trilha
            cy.get(".title-bar > .btn-icon").click();
            cy.wait(500);

            //Escrever nome da trilha
            cy.get('input[placeholder="Informe o nome"]', { timeout: 60000 })
                .filter(':visible')
                .first()
                .should('not.be.disabled')
                .scrollIntoView()
                .focus()
                .clear({ force: true })
                .type('Trilha importação automação caio', { delay: 30, force: true })
                .should('have.value', 'Trilha importação automação caio');

            //Etapas
            cy.get('[ui-sref="accessLink.content.trails.edit.id.version.stages"]').click(); // sessão etapas

            // ========== IMPORTAÇÃO 1: Trilha 26/01 correção avaliação ==========
            cy.get('.pt-20 > .flex > .btn-swipe-main').click(); //importar etapa
            cy.get('.modal-body > .ng-isolate-scope > .multiselect > .border > .ui-select-match > .btn-default').type("Trilha 26/01 correção avaliação"); //digitar nome da trilha
            cy.wait(5000); //espera os resultados aparecerem
            cy.contains('.ui-select-choices-row', 'Trilha 26/01 correção avaliação', { timeout: 15000 }).should('be.visible').click(); //selecionar trilha
            cy.get('ui-view.ng-scope > .modal-overlay > .modal > .end > .btn-swipe-accent').click(); //importar etapa
            cy.wait(5000); //espera a importação processar

            // ========== IMPORTAÇÃO 2: teste youtube 06/02 ==========
            cy.get('.pt-20 > .flex > .btn-swipe-main').click(); //importar etapa
            cy.get('.modal-body > .ng-isolate-scope > .multiselect > .border > .ui-select-match > .btn-default').type("teste youtube 06/02"); //digitar nome da trilha
            cy.wait(5000); //espera os resultados aparecerem
            cy.contains('.ui-select-choices-row', 'teste youtube 06/02', { timeout: 15000 }).should('be.visible').click(); //selecionar trilha
            cy.get('ui-view.ng-scope > .modal-overlay > .modal > .end > .btn-swipe-accent').click(); //importar etapa
            cy.wait(5000); //espera a importação processar

            // ========== IMPORTAÇÃO 3: teste scorm antigo ==========
            cy.get('.pt-20 > .flex > .btn-swipe-main').click(); //importar etapa
            cy.get('.modal-body > .ng-isolate-scope > .multiselect > .border > .ui-select-match > .btn-default').type("teste scorm antigo"); //digitar nome da trilha
            cy.wait(5000); //espera os resultados aparecerem
            cy.contains('.ui-select-choices-row', 'teste scorm antigo', { timeout: 15000 }).should('be.visible').click(); //selecionar trilha
            cy.get('ui-view.ng-scope > .modal-overlay > .modal > .end > .btn-swipe-accent').click(); //importar etapa
            cy.wait(5000); //espera a importação processar

            //Criar turma
            cy.get('[trails=""] > .tabs > .ng-scope').click(); //selecionar turma
            cy.get(".gap > .btn-swipe-accent").click(); //botão de criar turma
            cy.wait(10000); //espera para carregar a tela de criar turma

            //Nome da turma
            cy.get('input[placeholder="Informe um nome para a turma"]', { timeout: 20000 })
                .filter(':visible')
                .first()
                .should('be.enabled')
                .scrollIntoView()
                .click({ force: true })
                .focus()
                .clear({ force: true })
                .type('teste caio automação', { delay: 50, force: true });

            //Turma gratuita e sem aprovação do gestor
            cy.get(".class-price > :nth-child(1) > .icon-checkbox").click(); //selecionar turma gratuita
            cy.get(".column > :nth-child(1) > .icon-checkbox").click(); //desativar aprovação do gestor

            //Salvar turma
            cy.get('.editing-class > :nth-child(1) > .content-box-footer > .btn-swipe-accent').click();

            //Salvar trilha
            cy.contains('button', 'Salvar', { timeout: 15000 }).should('be.visible').click();
            cy.get('[ng-show="modal.saveTrailVersion"] > .modal > :nth-child(3) > .checkbox > .icon-checkbox').click(); //selecionar a opção de salvar versão
            cy.get('[ng-show="modal.saveTrailVersion"] > .modal > .end > .ml-10').click(); //clicar no botão de salvar
        });
    });
});