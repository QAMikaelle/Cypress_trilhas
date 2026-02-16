/// <reference types="cypress" />

// Ignora erros internos da aplicação
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild')) {
        return false;
    }
});

describe("Teste - Duplicar Turma", () => {

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

    context("Duplicar Turma 5 vezes", () => {

        // Loop: cria 5 testes, um para cada duplicação
        // Cada teste faz o fluxo completo: trilhas → pesquisar → editar → duplicar → salvar
        for (let i = 1; i <= 5; i++) {

            it(`Duplicação ${i} - editada caio ${i}`, () => {

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

                // ========== DUPLICAR A PRIMEIRA TURMA ==========
                cy.get('button[ng-click="cloneClass(cl)"]', { timeout: 15000 })
                    .first() //sempre pega a primeira turma
                    .click();
                cy.wait(3000);

                // ========== EDITAR NOME DA TURMA ==========
                cy.get('input[placeholder="Informe um nome para a turma"]', { timeout: 15000 })
                    .filter(':visible')
                    .first()
                    .should('be.enabled')
                    .scrollIntoView()
                    .click({ force: true })
                    .clear({ force: true })
                    .type(`editada caio ${i}`, { delay: 50, force: true });

                // ========== DEFINIR COMO GRATUITA ==========
                cy.contains('Gratuito', { timeout: 10000 }).should('be.visible').click();

                // ========== SALVAR TURMA ==========
                cy.get('.editing-class > :nth-child(1) > .content-box-footer > .btn-swipe-accent').click();
                cy.wait(2000);

                // ========== SALVAR TRILHA ==========
                cy.contains('button', 'Salvar', { timeout: 15000 }).should('be.visible').click();
                cy.wait(3000);
            });
        }
    });
});
