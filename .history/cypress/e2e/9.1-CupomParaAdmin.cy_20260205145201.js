/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable')) {
    return false;
    }
    });

describe.only("Teste - Login", () => {
    beforeEach(() => {
        //Entra na página de login
            cy.visit("https://www.hml.lector.live/esmp/subscribe/login");
    
        //Faz login
            cy.get('[name="login_username"]').type("qualidade@lectortec.com.br");
            cy.get('[name="login_password"]').type("c8d593QGXOkjRjC");
            cy.get('#btn-entrar').click();
        });

    context("Fluxo análise financeira ", () => {

    //Testa cupom para admin
        it("Teste cupom para admin", () => {
            cy.get('[title="Relatórios"] > .sideitem').click();
            cy.get('.icon-left-expand').click();
            cy.get('#sidenavPin > .icon-push-pin')
                .filter(':visible')
                .click();

            // rola o menu para baixo e tenta achar o node
  const NODE = '[data-nodeid="28"]';
const MENU_SCROLL = '#sidenav'; // ajuste para o container real do menu

function scrollAteAparecer(selector, tentativas = 12) {
  cy.get('body').then($body => {
    const achou = $body.find(selector).filter(':visible').length > 0;

    if (achou) {
      cy.get(selector).filter(':visible').first().scrollIntoView({ block: 'center' });
      return;
    }

    if (tentativas <= 0) {
      throw new Error(`Não encontrei o elemento: ${selector}`);
    }

    cy.get(MENU_SCROLL).scrollTo('bottom', { duration: 250 });
    scrollAteAparecer(selector, tentativas - 1);
  });
}

it("Teste cupom para admin", () => {
  cy.get('[title="Relatórios"] > .sideitem')
    .should('be.visible')
    .click();

  cy.get('#sidenavPin')
    .should('be.visible')
    .click();

  cy.get('[data-nodeid="28"]')
    .first()
      .scrollIntoView()
      .should('be.visible')
      .parents('li') // sobe até o nó da árvore
      .click();


      
});
});
  }); 
});