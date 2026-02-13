/* This JavaScript script is a test script written using Cypress for end-to-end testing. Here's a
breakdown of what the script is doing: */
/* This is a test script written in JavaScript using Cypress for end-to-end testing. Here's a breakdown
of what the script is doing: */
/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('unselectable')) {
    return false;
  }
});

describe("Teste - Login", () => {
  before(() => {
        //Entra na página de login
        cy.visit("https://www.hml.lector.live/lector_suporte/showcase/2257");
        cy.contains("button", "Entrar").click();
    
    //Faz login
        cy.get('[style="z-index: 26;"] > :nth-child(1) > :nth-child(1) > .popup > :nth-child(1) > .ng-pristine').type("qualidade@lectortec.com.br");
        cy.get("#login_password_navbar").type("c8d593QGXOkjRjC");
        cy.get(".popup").contains("button", "Entrar").click();
  });

  context("Teste Categoria", () => {

    it("Nova categoria", () => {

      //Abrir menu de trilhas
      cy.get('[title="Trilhas"] > .sideitem').click();

      // Clicar em adicionar categoria
      cy.get('.node-selected > .tree-icons > .icon-add').click();

      // Preencher nome da categoria
      cy.get('input[placeholder="Nova categoria"]', { timeout: 60000 })
        .filter(':visible')
        .first()
        .should('not.be.disabled')
        .focus()
        .clear({ force: true })
        .type('Nova Categoria 05/01/26', { delay: 30, force: true })
        .should('have.value', 'Nova Categoria 05/01/26');

      // Salvar categoria
      cy.get('[switch="modal.createCategory"] > .modal > :nth-child(2) > .modal-form > .end > .btn-swipe-accent').click();
      cy.wait(5000); //espera para salvar a categoria

});

it("Nova Subcategoria", () => {

    //Abrir menu de trilhas
      cy.get('[title="Trilhas"] > .sideitem').click();

    //Selecionar categoria criada
    cy.contains('Nova Categoria 05/01/26', { timeout: 60000 })
      .filter(':visible')
      .first()
      .scrollIntoView()
      .should('be.visible')
      .parents('li') // sobe até o nó da árvore
      .click();

    // Clicar em adicionar subcategoria
    cy.get('.node-selected > .tree-icons > .icon-add').click();

    // Preencher nome da subcategoria
    cy.get('input[placeholder="Nova categoria"]', { timeout: 60000 })
      .filter(':visible')
      .first()
      .should('not.be.disabled')
      .focus()
      .clear({ force: true })
      .type('Subcategoria 22/01', { delay: 30, force: true })
      .should('have.value', 'Subcategoria 22/01');

    // Salvar subcategoria
    cy.get('[switch="modal.createCategory"] > .modal > :nth-child(2) > .modal-form > .end > .btn-swipe-accent').click();
    cy.wait(5000); //espera para salvar a subcategoria
    
    // Validar criação da subcategoria
    cy.contains('Subcategoria 22/01').should('be.visible');
    });
  });
});
