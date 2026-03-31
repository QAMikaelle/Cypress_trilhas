/// <reference types="cypress" />

//funcionalidade
describe("login", () => {
      
      //cenarios
      it("E-mail inválido", () => {
        cy.visit('https://www.hml.lector.live/universolector/showcase/340');
        cy.contains('button', 'Entrar').click();
        cy.get('[style="z-index: 26;"] > :nth-child(1) > :nth-child(1) > .popup > :nth-child(1) > .ng-pristine').type('qualidade@lector');
        cy.get('#login_password_navbar').type('123');
        cy.get('.popup').contains('button', 'Entrar').click();
        cy.get('.message').should('have.text', 'Usuário ou senha inválidos'); 
    });

      //cenarios
    it("Senha inválida", () => {
        cy.visit('https://www.hml.lector.live/universolector/showcase/340');
        cy.contains('button', 'Entrar').click();
        cy.get('[style="z-index: 26;"] > :nth-child(1) > :nth-child(1) > .popup > :nth-child(1) > .ng-pristine').type('qualidade@lectortec.com.br');
        cy.get('#login_password_navbar').type('000');
        cy.get('.popup').contains('button', 'Entrar').click(); //filtrei pelo botão entrar que tinha no popup
        cy.get('.message').should('have.text', 'Usuário ou senha inválidos'); 

    });

      //cenarios
    it("login com sucesso", () => {
      //DADO
      // abrir a aplicação
        cy.visit("https://www.hml.lector.live/universolector/showcase/340");
        cy.contains('button', 'Entrar').click();
        cy.get('[style="z-index: 26;"] > :nth-child(1) > :nth-child(1) > .popup > :nth-child(1) > .ng-pristine').type("qualidade@lectortec.com.br");
        cy.get('#login_password_navbar').type("c8d593QGXOkjRjC");
        cy.get('.popup').contains('button', 'Entrar').click();
    });

});
