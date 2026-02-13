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

    context("Trilha Recorrência", () => {

    it("Pagamento - EXT", () => {


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
            .type('Trilha Automação - paga com recorrência 10x', { delay: 50 })
            .should('have.value', 'Trilha Automação - paga com recorrência 10x')

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
        cy.contains('button', 'Novo conteúdo')
            .filter(':visible')
            .first()
            .should('be.enabled')
            .click({ force: true });


        //seleciona o treinamento
        cy.get('[model="currentContent.course"] > .multiselect > .border > .ui-select-match > .btn-default').type('teste');
        
        cy.get('.ui-select-choices')
            .filter(':visible')
            .first()
            .within(() => {
                cy.contains('.ui-select-choices-row-inner', 'teste pix caio')
                .click({ force: true });
            });


        cy.get('.start > .btn-swipe-accent > ng-transclude > .ng-binding').click();

        //adcicionar turma
        cy.get('[trails=""] > .tabs > .ng-scope').click();
        cy.get('.gap > .btn-swipe-accent').click();
        
        // NOME DA TURMA (re-get após digitar para evitar re-render do Angular)
        cy.get('input[placeholder="Informe um nome para a turma"]', { timeout: 20000 })
            .filter(':visible')
            .first()
            .should('be.enabled')
            .scrollIntoView()
            .click({ force: true })
            .focus()
            .clear({ force: true })
            .type('Turma teste', { delay: 50, force: true })
            .blur();

        cy.get('input[placeholder="Informe um nome para a turma"]')
            .filter(':visible')
            .first()
            .should('have.value', 'Turma teste');


        // PREÇO (máscara monetária: 391 => 3,91)
        cy.get('#currentClassPrice', { timeout: 60000 })
            .should('be.visible')
            .and('not.be.disabled')
            .scrollIntoView()
            .click({ force: true })
            .focus()
            .clear({ force: true })
            .type('3.91', { delay: 50, force: true })
            .blur();

        //configurar recorrência
        // 1) Abre o select (clica no container)
cy.get('div.ui-select-container[ng-model="currentClass.purchaseInfo.creditCardMaxInstallments"]', { timeout: 20000 })
  .filter(':visible')
  .first()
  .scrollIntoView()
  .click({ force: true });

// 2) Agora procura a lista de opções VISÍVEL em qualquer lugar da página
cy.get('.ui-select-choices', { timeout: 20000 })
  .filter(':visible')
  .first()
  .within(() => {
    cy.contains('.ui-select-choices-row', /^10$/)   // clique exato no "10"
      .click({ force: true });
  });

// 3) Valida que selecionou
cy.get('div.ui-select-container[ng-model="currentClass.purchaseInfo.creditCardMaxInstallments"]')
  .filter(':visible')
  .first()
  .should('contain', '10');


        // SALVAR TURMA: clique + validação (ajuste o texto/resultado esperado)
        cy.get('.editing-class > :nth-child(1) > .content-box-footer > .btn-swipe-accent').click({ force: true });

        //salvar trilha
        cy.get('.content-box-footer > .flex > .btn-swipe-accent').click({ force: true });
        cy.get('[ng-show="modal.saveTrailVersion"] > .modal > :nth-child(3) > .checkbox > .icon-checkbox').click({ force: true });
        cy.get('[ng-show="modal.saveTrailVersion"] > .modal > .end > .ml-10').click({ force: true });//Clica no menu Trilhas
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
            .type('Trilha Automação - gratuita sem aprovação', { delay: 50 })
            .should('have.value', 'Trilha Automação - gratuita sem aprovação')

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
        cy.get('#ui-select-choices-row-38-0').click();
        cy.get('.start > .btn-swipe-accent > ng-transclude > .ng-binding').click();

        //adcicionar turma
        cy.get('[trails=""] > .tabs > .ng-scope').click();
        cy.get('.gap > .btn-swipe-accent').click();
        
        // NOME DA TURMA (re-get após digitar para evitar re-render do Angular)
        cy.get('input[placeholder="Informe um nome para a turma"]', { timeout: 20000 })
            .filter(':visible')
            .first()
            .should('be.enabled')
            .scrollIntoView()
            .click({ force: true })
            .focus()
            .clear({ force: true })
            .type('Turma teste', { delay: 50, force: true })
            .blur();

        cy.get('input[placeholder="Informe um nome para a turma"]')
            .filter(':visible')
            .first()
            .should('have.value', 'Turma teste');


        // PREÇO (máscara monetária: 391 => 3,91)
        cy.get('#currentClassPrice', { timeout: 60000 })
            .should('be.visible')
            .and('not.be.disabled')
            .scrollIntoView()
            .click({ force: true })
            .focus()
            .clear({ force: true })
            .type('3.91', { delay: 50, force: true })
            .blur();


        // SALVAR TURMA: clique + validação (ajuste o texto/resultado esperado)
        cy.get('.editing-class > :nth-child(1) > .content-box-footer > .btn-swipe-accent').click({ force: true });

        //salvar trilha
        cy.get('.content-box-footer > .flex > .btn-swipe-accent').click({ force: true });
        cy.get('[ng-show="modal.saveTrailVersion"] > .modal > :nth-child(3) > .checkbox > .icon-checkbox').click({ force: true });
        cy.get('[ng-show="modal.saveTrailVersion"] > .modal > .end > .ml-10').click({ force: true });

    });

});
});