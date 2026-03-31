/// <reference types="cypress" />
describe("Teste - Login", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080); // Define a dimensão da tela para o teste.

    cy.visit("https://www.hml.lector.live/universolector/showcase/340");
    cy.contains("button", "Entrar").click();
    cy.get('[style="z-index: 26;"] > :nth-child(1) > :nth-child(1) > .popup > :nth-child(1) > .ng-pristine').type("qualidade@lectortec.com.br");
    cy.get("#login_password_navbar").type("123");
    cy.get(".popup").contains("button", "Entrar").click();
});

  context("Treinamento sem aprovação gestor na turma", () => {
    it("Adicionando um documento", () => {
      //Criar pasta   TESTE PARA TREINAMENTO INTEIRO
      cy.get('[title="Documentos"]').click(); // clicar na aba de documentos
      cy.get(".relative > .btn-icon").click(); //botão de criar documento
      cy.get('[ng-click="showCreateNewFolder();"]').click(); // Botão de criar nova pasta
      cy.get('.ng-pristine.ng-scope > .border').type("Pasta de Teste 10.07.2025"); // Digitar nome da pasta
      cy.get('[switch="modal.createFolder"] > .modal > :nth-child(2) > .end > .flex > .btn-swipe-accent').click(); // Salvar pasta

      //Teste pra adicionar documento na pasta criada
      cy.get('.multiselect.ng-pristine > .ng-pristine').type("Pasta de Teste 10.07.2025"); // Digitar nome da pasta
      cy.get('.multiselect.ng-dirty > .btn').click(); // Botão de pesquisar pasta
      cy.wait(10000); // Espera para o modal abrir
      cy.get(".relative > .btn-icon").click(); //botão de criar documento
      cy.get('[ng-click="modal.uploadFiles = true;"]').click(); //botão de upload
      cy.wait(10000); // Espera para o modal abrir
});

    it("Criando um treinamento", () => {
      //Criar treinamento sem aprovação do gestor na turma
      cy.get('[title="Treinamentos"]').click();
      cy.get(".title-bar > .btn-icon").click();

      //Editar dados
      cy.get("#courseName").click(); // Clica pra digitar
      cy.get("#courseName").type("Teste treinamento 10/07/2025 sem aprovação");
      cy.get('[timeload=""] > .checkbox > .icon-checkbox').click(); // marcar checkbox para calcular automaticamente carga horária dos conteúdos
      cy.get('[min-grade=""] > .input-number > div > .icon-pointer-up').dblclick(); // aumentar aproveitamento mínimo
      cy.get('[min-finish-progress=""] > .input-number > div > .icon-pointer-up').dblclick(); // aumentar progresso mínimo
      cy.get('.mb-20 > .checkbox > .icon-checkbox').click(); // Aciona gamificação

      //Adicionar conteúdos
      cy.get('[ui-sref="accessLink.content.courses.edit.id.contents"]').click(); // sessão conteúdos
      cy.get("ui-view.ng-scope > .flex > .btn-swipe-accent").click(); //novo conteúdo
      cy.get(".editing-resource > :nth-child(2) > .w-100").click(); //tipo
      cy.get(".open > .ui-select-choices > :nth-child(2)").click(); //selecionar documentos como tipo de conteúdo
      cy.wait(10000); //espera para digitar o nome do documento
      cy.get(".weight").type("1"); // selecionar peso
      cy.get(".open > .ui-select-choices > :nth-child(2)").click(); //selecionar peso 1
      cy.get(".editing-resource > .end > .btn-swipe-accent").click(); //adicionar documento

      //Adicionar turma
      cy.get('[ui-sref="accessLink.content.courses.edit.id.classes"]').click(); // sessão turma
      cy.get('[ng-click="editClass()"]').click(); //botão de adicionar turma
      cy.get("#className").type("Teste turma"); //nome da turma
      cy.get(".column > :nth-child(1) > .icon-checkbox").click(); // desativar checkbox
      cy.get(".add-content > .end > .btn-swipe-accent").click(); //botão de adicionar turma

      //Salvar treinamento
      cy.get('[ui-sref="accessLink.content.courses.edit.id.contents"]').click(); // sessão conteúdos
      cy.get(".content-box-footer > .flex > .btn-swipe-accent").click(); //botão de salvar
      cy.get('[ng-show="modal.useVersioning"] > .modal > :nth-child(3) > .checkbox > .icon-checkbox').click(); //selecionar versionamento
      cy.get('[ng-show="modal.useVersioning"] > .modal > .end > .ml-10').click(); //salvar versionamento
        });
    
  context("Treinamento com aprovação gestor na turma", () => {
    it("Adicionando um documento", () => {
      //Criar pasta   TESTE PARA TREINAMENTO INTEIRO
      cy.get('[title="Documentos"]').click(); // clicar na aba de documentos
      cy.get(".relative > .btn-icon").click(); //botão de criar documento
      cy.get('[ng-click="showCreateNewFolder();"]').click(); // Botão de criar nova pasta
      cy.get('.ng-pristine.ng-scope > .border').type("Pasta de Teste 10.07.2025"); // Digitar nome da pasta
      cy.get('[switch="modal.createFolder"] > .modal > :nth-child(2) > .end > .flex > .btn-swipe-accent').click(); // Salvar pasta

      //Teste pra adicionar documento na pasta criada
      cy.get('.multiselect.ng-pristine > .ng-pristine').type("Pasta de Teste 10.07.2025"); // Digitar nome da pasta
      cy.get('.multiselect.ng-dirty > .btn').click(); // Botão de pesquisar pasta
      cy.wait(10000); // Espera para o modal abrir
      cy.get(".relative > .btn-icon").click(); //botão de criar documento
      cy.get('[ng-click="modal.uploadFiles = true;"]').click(); //botão de upload
      cy.wait(10000); // Espera para o modal abrir
});

    it.only("Criando um treinamento", () => {
      //Criar treinamento sem aprovação do gestor na turma
      cy.wait(1000);
      cy.get('[title="Treinamentos"]').click();
      cy.get(".title-bar > .btn-icon").click();

      //Editar dados
      cy.get("#courseName").click(); // Clica pra digitar
      cy.get("#courseName").type("Teste treinamento 10/07/2025 4 com aprovação");

      cy.wait(20000); // Espera para o modal abrir
      
      cy.get('[timeload=""] > .checkbox > .icon-checkbox').click(); // marcar checkbox para calcular automaticamente carga horária dos conteúdos
      cy.get('[min-grade=""] > .input-number > div > .icon-pointer-up').dblclick(); // aumentar aproveitamento mínimo
      cy.get('[min-finish-progress=""] > .input-number > div > .icon-pointer-up').dblclick(); // aumentar progresso mínimo

      cy.get('[max-subscriptions=""] > .checkbox > .icon-checkbox').click(); // marcar checkbox para limitar número de matrículas
      cy.get('[min-finish-progress=""] > .input-number > div > .icon-pointer-up').dblclick(); // aumentar limite de matrículas

      cy.get('.mb-20 > .checkbox > .icon-checkbox').click(); // Aciona gamificação
      cy.get('[mail-interested=""] > .checkbox > .icon-checkbox').click(); // marcar checkbox para enviar e-mail de interesse
      cy.get('[accessibility=""] > .checkbox > .icon-checkbox').click(); // marcar checkbox para habilitar acessibilidade
      cy.get('[hide-res-perf=""] > .checkbox > .icon-checkbox').click(); // marcar checkbox para ocultar resultados de desempenho
      cy.get('[terms-of-use=""] > .checkbox > .icon-checkbox').click(); // habilitar termos de aceite
      cy.wait(3000); // DIGITAR MANUALMENTE O TERMO DE ACEITE

      //Autores
      cy.get('[ui-sref="accessLink.content.courses.edit.id.authors"]').click(); // sessão autores
      cy.get('[authors=""] > .ng-isolate-scope > .multiselect > .border > :nth-child(1) > .ui-select-search').type('mik'); // Digitar nome do autor
      cy.wait(3000); // Espera para o modal abrir

      //Adicionar conteúdos
      cy.get('[ui-sref="accessLink.content.courses.edit.id.contents"]').click(); // sessão conteúdos
      cy.get('ui-view.ng-scope > .flex > .btn-swipe-accent').click(); //novo conteúdo

      //adicionar documento
      cy.get(".editing-resource > :nth-child(2) > .w-100").click(); //tipo
      cy.get(".open > .ui-select-choices > :nth-child(2)").click(); //selecionar documentos como tipo de conteúdo
      cy.wait(10000); //espera para digitar o nome do documento
      cy.get(".weight").type("1"); // selecionar peso
      cy.get(".open > .ui-select-choices > :nth-child(2)").click(); //selecionar peso 1
      cy.get(".editing-resource > .end > .btn-swipe-accent").click(); //adicionar documento

      //adicionar gravação
      cy.get('ui-view.ng-scope > .flex > .btn-swipe-accent').click(); //novo conteúdo
      cy.get(".editing-resource > :nth-child(2) > .w-100").click(); //tipo
      cy.get('.open > .ui-select-choices > :nth-child(1)').click(); //selecionar gravação
      cy.wait(10000); //espera para digitar o nome da gravação
      cy.get(".weight").type("1"); // selecionar peso
      cy.get(".open > .ui-select-choices > :nth-child(2)").click(); //selecionar peso 1
      cy.get(".editing-resource > .end > .btn-swipe-accent").click(); //adicionar gravação

      //adicionar avaliação
      cy.get('ui-view.ng-scope > .flex > .btn-swipe-accent').click(); //novo conteúdo
      cy.get(".editing-resource > :nth-child(2) > .w-100").click(); //tipo
      cy.get('.open > .ui-select-choices > :nth-child(3)').click(); //selecionar avaliação
      cy.wait(10000); //espera para digitar o nome da gravação
      cy.get(".weight").type("1"); // selecionar peso
      cy.get(".open > .ui-select-choices > :nth-child(2)").click(); //selecionar peso 1
      cy.get(".editing-resource > .end > .btn-swipe-accent").click(); //adicionar avaliação

      //adicionar aula presencial
      cy.get('ui-view.ng-scope > .flex > .btn-swipe-accent').click(); //novo conteúdo
      cy.get(".editing-resource > :nth-child(2) > .w-100").click(); //tipo
      cy.get('.open > .ui-select-choices > :nth-child(4) > .ng-binding').click(); //selecionar aula presencial
      cy.wait(10000); //espera para digitar o nome da gravação
      cy.get(".weight").type("1"); // selecionar peso
      cy.get(".open > .ui-select-choices > :nth-child(2)").click(); //selecionar peso 1
      cy.get(".editing-resource > .end > .btn-swipe-accent").click(); //adicionar aula presencial

      //Adicionar turma
      cy.get('[ui-sref="accessLink.content.courses.edit.id.classes"]').click(); // sessão turma
      cy.get('[ng-click="editClass()"]').click(); //botão de adicionar turma
      cy.get("#className").type("Teste turma"); //nome da turma
      cy.get('.price-box-container > :nth-child(2) > .price-box > .checkbox').click(); // ativar checkbox de preço

      //Salvar treinamento
      cy.get(".content-box-footer > .flex > .btn-swipe-accent").click(); //botão de salvar
      cy.get('[ng-show="modal.useVersioning"] > .modal > :nth-child(3) > .checkbox > .icon-checkbox').click(); //selecionar versionamento
      cy.get('[ng-show="modal.useVersioning"] > .modal > .end > .ml-10').click(); //salvar versionamento


  context("Treinamento extra", () => {
  });




        });
      });
    });
  });