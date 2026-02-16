/// <reference types="cypress" />

// Ignora erros internos da aplicação
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild')) {
        return false;
    }
});

describe("Teste - Apagar Turmas", () => {

    // Login - roda antes de cada teste
    beforeEach(() => {
        cy.visit("https://www.hml.lector.live/lector_suporte/subscribe/login");
        cy.wait(3000);

        cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input').should('be.visible').type("suporte2@lectortec.com.br");
        cy.wait(2000);
        cy.get('#login_password').should('be.visible').type("#C4iocl4r413");
        cy.wait(1000);
        cy.get('#btn-entrar').should('be.enabled').click();
        cy.wait(5000);

        cy.url().should('not.include', '/subscribe/login');
    });

    context("Apagar todas as turmas", () => {

        // Mude o número 10 para quantas turmas precisar apagar
        for (let i = 1; i <= 10; i++) {

            it(`Apagando turma ${i}`, () => {

                // ========== ACESSAR TRILHAS ==========
                cy.get('[title="Trilhas"] > .sideitem').click();
                cy.wait(3000);

                // ========== PESQUISAR A TRILHA ==========
                cy.get('input[placeholder="Pesquisar trilhas"]', { timeout: 15000 })
                    .should('be.visible')
                    .clear()
                    .type('Trilha importação automação caio');
                cy.get('button[ng-click="filterText()"]').click(); //clica na lupa
                cy.wait(5000);

                // ========== CLICAR NO CARD DA TRILHA ==========
                cy.contains('Trilha importação automação caio', { timeout: 15000 })
                    .should('be.visible')
                    .click();
                cy.wait(5000);

                // ========== CLICAR NO BOTÃO DE EDIÇÃO ==========
                cy.get('button[ng-click="editTrail(trail)"]', { timeout: 15000 })
                    .should('be.visible')
                    .click();
                cy.wait(3000);

                // ========== ACESSAR ABA TURMAS ==========
                cy.get('[trails=""] > .tabs > .ng-scope', { timeout: 15000 })
                    .should('be.visible')
                    .click();
                cy.wait(3000);

                // ========== APAGAR A PRIMEIRA TURMA ==========
                cy.get('button[ng-click="removeClass($index)"]', { timeout: 15000 })
                    .first() //sempre pega a primeira turma da lista
                    .click();
                cy.wait(2000);

                // ========== SALVAR TRILHA ==========
                cy.contains('button', 'Salvar', { timeout: 15000 })
                    .should('be.visible')
                    .click();
                cy.wait(3000);
            });
        }
    });
});
