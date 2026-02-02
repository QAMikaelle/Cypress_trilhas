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

    context("Trilha > Cupom ", () => {

    it("Cupom - Trilha", () => {

    //Editar cupom criado
    cy.get('[title="Cadastros"] > .sideitem').click(); //Clica em Cadastros
    cy.get(':nth-child(13) > a > .w-100').click(); //Clica em cupons
    cy.get('#\\32 47').click(); //Clica no cupom criado

    //Alterar quantidade do cupom
    cy.get('[model="coupon.quantity"] input[type="number"]')
    .filter(':visible')
    .first()
    .should('be.enabled')
    .scrollIntoView()
    .focus()
    .type('{selectall}{backspace}', { force: true })   // melhor que clear() em number/Angular
    .type('1', { delay: 10, force: true })
    .should('have.value', '1');   

    //Clica em salvar
    cy.get('[switch="modal.coupons"] > .modal > :nth-child(2) > .modal-form > .end > .btn-swipe-accent').click(); 
    });

    it("Filtros - Cupom", () => {

    //Cadastros > Cupons
    cy.get('[title="Cadastros"] > .sideitem').click(); //Clica em Cadastros
    cy.get(':nth-child(14) > a > .w-100').click(); //Clica em cupons
    cy.wait(2000)
    
    //Pesquisar cupom 
    cy.get('.title-bar > .multiselect > .ng-pristine').type("Teste1");

    //Exportar lista de cupons
    cy.get('.buttons-copy').click(); //Clica em copiar
    cy.get('.buttons-csv').click(); //Clica em CSV
    cy.get('.buttons-pdf').click(); //Clica em PDF
    cy.get('.icon-file-xls').click(); //Clica em Excel
    cy.get('.buttons-print').click(); //Clica em imprimir

    
    //Criar cupom
    cy.get('.title-bar > .btn-icon').click(); 

    cy.get('ng-transclude > .column > :nth-child(1)').type('CupomTeste3'); //Nome do cupom
    cy.get(':nth-child(2) > .number-with-unit > input.ng-pristine').type('2'); //Valor do cupom
    cy.get('.column > :nth-child(3) > .w-100').type('CupomTeste3'); //Código do cupom
    cy.get(':nth-child(7) > .number-with-unit > .ng-pristine').type('5'); //Compra mínima
    cy.get(':nth-child(8) > .ng-isolate-scope > .multiselect > .border > :nth-child(1) > .ui-select-search').type('Teste1'); //Selecionar treinamento
    cy.get('#ui-select-choices-row-36-0').click(); //Clica no treinamento selecionado
    cy.get(':nth-child(9) > .ng-isolate-scope > .multiselect > .border > :nth-child(1) > .ui-select-search').type('trilha'); //Selecionar trilha
    cy.get('#ui-select-choices-row-37-0 > .ui-select-choices-row-inner > .ng-binding').click(); //Clica na trilha selecionada
    cy.get('[switch="modal.coupons"] > .modal > :nth-child(2) > .modal-form > .end > .btn-swipe-accent').click(); //Clica em salvar cupom

    });

    
    });
  }); 