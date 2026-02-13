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

    context("Criar Trilha", () => {

    it("Criando uma trilha", () => {

    //Criar trilha
    cy.get('[title="Trilhas"] > .sideitem').click();

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
    .type('Trilha 05/01', { delay: 30, force: true })
    .should('have.value', 'Trilha 05/01');

    /*
  //adicionado já pronto o teste de capa

     //Tradicional
      cy.get('label.thumb-placeholder[aspect="square"] input[type="file"]').selectFile('cypress/fixtures/images6.png', { force: true });
      cy.log('AJUSTE A IMAGEM MANUALMENTE')
      cy.wait(6000);                                                     // Aguarda alguns segudos para ajustar a imagem
      cy.get('button[ng-click="cropper.save()"]').click();               // Confirma em confirmar para salvar a imagem
cy.wait(2000)
      //Capa
      cy.get('label.thumb-placeholder[aspect="cover"] input[type="file"]').selectFile('cypress/fixtures/Capa.jpg', { force: true });
      cy.log('AJUSTE A IMAGEM MANUALMENTE')
      cy.wait(6000);                                                     // Aguarda alguns segudos para ajustar a imagem
      cy.get('button[ng-click="cropper.save()"]').click();               // Confirma em confirmar para salvar a imagem
cy.wait(2000)

      //Banner
      cy.get('label.thumb-placeholder[aspect="banner"] input[type="file"]').selectFile('cypress/fixtures/Benner.jpg', { force: true });
      cy.log('AJUSTE A IMAGEM MANUALMENTE')
      cy.wait(6000);                                                     // Aguarda alguns segudos para ajustar a imagem
      cy.get('button[ng-click="cropper.save()"]').click();               // Confirma em confirmar para salvar a imagem
cy.wait(2000)

    
    cy.get('[min-grade=""] > .input-number > div > .icon-pointer-up').click(); 
*/

    //Etapas
    cy.get('[ui-sref="accessLink.content.trails.edit.id.version.stages"]').click(); // sessão etapas
    cy.get(".pt-20 > .flex > .btn-swipe-accent").click(); //nova etapa

    //Importar etapa de outra trilha
    cy.get('.pt-20 > .flex > .btn-swipe-main').click(); //importar etapa
    cy.get('.modal-body > .ng-isolate-scope > .multiselect > .border > .ui-select-match > .btn-default').type("mobile teste"); //digitar nome da trilha
    cy.get('.ui-select-highlight').click(); //selecionar trilha
    cy.get('ui-view.ng-scope > .modal-overlay > .modal > .end > .btn-swipe-accent').click(); //importar etapa

    //Adicionar treinamento
    cy.get(':nth-child(2) > [colspan="5"] > .btn-swipe-accent').click(); //novo treinamento
    //TEM QUE CLICAR PRA ELE ESCREVER O NOME
    cy.get(':nth-child(3) > :nth-child(2) > .content-info-container > [model="currentContent.course"] > .multiselect > .border > .ui-select-match > .btn-default').type("teste"); //digitar nome do treinamento
    cy.wait(10000); //espera para carregar o documento
    cy.get('#ui-select-choices-row-39-0').click(); //selecionar treinamento
    cy.get(':nth-child(3) > :nth-child(7) > .start > .btn-swipe-accent > ng-transclude > .ng-binding').click(); //adicionar documento

    //Adicionar avalição
     cy.get('[colspan="5"] > .btn-swipe-accent').click(); //novo conteúdo
     cy.get('.pv-5 > .w-100').click(); //selecionar conteúdo
     cy.get('.open > .ui-select-choices > :nth-child(2)').click(); //escolher conteúdo
    //TEM QUE CLICAR PRA ELE ESCREVER O NOME
    cy.get('[model="currentContent.evaluation"] > .multiselect > .border > .ui-select-match > .btn-default').type("teste"); //digitar nome da avaliação
    cy.wait(10000); //espera para carregar o documento
    cy.get(".start > .btn-swipe-accent").click(); //adicionar documento

    //Adicionar documento
     cy.get('[colspan="5"] > .btn-swipe-accent').click(); //novo conteúdo
     cy.get('.pv-5 > .w-100').click(); //selecionar conteúdo
     cy.get('.open > .ui-select-choices > :nth-child(3)').click(); //escolher conteúdo
    //TEM QUE CLICAR PRA ELE ESCREVER O NOME
    cy.get('[model="currentContent.document"] > .multiselect > .border > .ui-select-search').type("teste"); //digitar nome do documento
    cy.wait(10000); //espera para carregar o documento
    cy.get(".start > .btn-swipe-accent").click(); //adicionar documento

    //Adicionar scorm
     cy.get('[colspan="5"] > .btn-swipe-accent').click(); //novo conteúdo
     cy.get('.pv-5 > .w-100').click(); //selecionar conteúdo
     cy.get('.open > .ui-select-choices > :nth-child(4)').click(); //escolher conteúdo
    //TEM QUE CLICAR PRA ELE ESCREVER O NOME
    cy.get('[ng-if="currentContent.type == \'SCORM\'"] > .ng-isolate-scope > .multiselect > .border > .ui-select-match > .btn-default').type("teste"); //digitar nome do scorm
    cy.wait(10000); //espera para carregar o documento
    cy.get(".start > .btn-swipe-accent").click(); //adicionar documento

    //Criar turma
    cy.get('[trails=""] > .tabs > .ng-scope').click(); //selecionar turma
    cy.get(".gap > .btn-swipe-accent").click(); //botão de criar turma
    cy.wait(10000); //espera para carregar a tela de criar turma
    //ESCREVER O NOME DA TURMA
        cy.get(".class-price > :nth-child(1) > .icon-checkbox").click(); //selecionar turma gratuita
        cy.get(".column > :nth-child(1) > .icon-checkbox").click(); //aprovação do gestor
        cy.get('#currentClassPrice').type("1"); //valor da turma
        cy.get('.editing-class > :nth-child(1) > .content-box-footer > .btn-swipe-accent').click(); //salvar turma
        cy.get('.center > .icon-copy').click(); //copiar turma
        cy.get('.class-price > :nth-child(1) > .icon-checkbox').click(); //selecionar turma gratuita
        cy.get('.editing-class > :nth-child(1) > .content-box-footer > .btn-swipe-accent').click(); //salvar turma

        cy.get('.editing-class > :nth-child(1) > .content-box-footer > .btn-swipe-accent').click(); //salvar trilha
        cy.get('[ng-show="modal.saveTrailVersion"] > .modal > :nth-child(3) > .checkbox > .icon-checkbox').click(); //selecionar a opção de salvar versão
        cy.get('[ng-show="modal.saveTrailVersion"] > .modal > .end > .ml-10').click(); //clicar no botão de salvar
        });
    });
});
