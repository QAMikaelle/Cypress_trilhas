/// <reference types="cypress" />

// Ignora erros internos da aplicação
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild')) {
        return false;
    }
});

describe("Teste - Verificar Evento Agendado", () => {

    // Login
    before(() => {
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

    context("Verificar conteúdo agendável", () => {

        it("Adicionar treinamento presencial e configurar agendamento", () => {

            // ========== ACESSAR TRILHAS ==========
            cy.get('[title="Trilhas"] > .sideitem').click();
            cy.wait(3000);

            // ========== PESQUISAR A TRILHA ==========
            cy.get('input[placeholder="Pesquisar trilhas"]', { timeout: 15000 })
                .should('be.visible')
                .clear()
                .type('Trilha importação automação caio');
            cy.get('button[ng-click="filterText()"]').click();
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

            // ========== ACESSAR ABA ETAPAS ==========
            cy.get('[ui-sref="accessLink.content.trails.edit.id.version.stages"]').click();
            cy.wait(2000);

            // ========== PASSO 1: CRIAR NOVA ETAPA ==========
            cy.get('button[ng-click="createStage()"]', { timeout: 15000 })
                .filter(':visible')
                .first()
                .should('be.enabled')
                .scrollIntoView()
                .click();
            cy.wait(2000);

            // ========== PASSO 2: CLICAR EM NOVO CONTEÚDO ==========
            // Usa .last() porque já existem outras etapas anteriores — queremos a última (recém-criada)
            cy.get('button[ng-click="editContent(stage);"]', { timeout: 15000 })
                .filter(':visible')
                .last()
                .should('be.visible')
                .click();
            cy.wait(2000);

            // ========== PASSO 3 e 4: SELECIONAR TREINAMENTO ==========
            // Primeiro clica no span para abrir o dropdown
            cy.get('[model="currentContent.course"] > .multiselect > .border > .ui-select-match > .btn-default', { timeout: 15000 })
                .filter(':visible')
                .last()
                .scrollIntoView()
                .click({ force: true });
            cy.wait(1000);
            // Depois digita no input de busca que aparece
            cy.get('input[placeholder="Escolha um treinamento"]', { timeout: 15000 })
                .filter(':visible')
                .last()
                .should('be.visible')
                .type('Teste aula presencial 23/12');
            cy.wait(5000); //espera os resultados carregarem

            // ========== PASSO 5: SELECIONAR NO DROPDOWN ==========
            cy.get('.ui-select-highlight', { timeout: 15000 })
                .first()
                .should('be.visible')
                .click();
            cy.wait(2000);

            // ========== PASSO 6: CLICAR EM ADICIONAR ==========
            cy.get('button[ng-click="saveContent(currentContent)"]', { timeout: 15000 })
                .filter(':visible')
                .last()
                .scrollIntoView()
                .click({ force: true });
            cy.wait(3000);

            // ========== PASSO 7: CLICAR EM SALVAR A TRILHA ==========
            cy.get('button[ng-click="setKeepEditingAfterSave(false)"]', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(5000);

            // ========== PASSO 8: ERRO DE AGENDAMENTO ==========
            // O sistema vai mostrar popup "necessário agendar" e redirecionar
            // para a tela de agendamento automaticamente
            cy.wait(5000); //espera o popup aparecer e redirecionar

            // ========== PASSO 9: CLICAR NO LÁPIS DE EDIÇÃO DO AGENDAMENTO ==========
            cy.get('button[ng-click="editClassResource(content.course, resource);"]', { timeout: 15000 })
                .first()
                .should('be.visible')
                .click();
            cy.wait(3000); //espera o modal abrir

            // ========== PASSO 10 e 11: CLICAR EM NOVA DATA ==========
            cy.get('button[ng-click="addClassSchedule()"]', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(2000);

            // ========== PASSO 12: DEFINIR LIMITE DE VAGAS PRESENCIAIS ==========
            cy.get('[model="editingClassResource.vacancies"] input[type="number"]', { timeout: 15000 })
                .should('be.visible')
                .clear()
                .type('12');
            cy.wait(1000);

            // ========== PASSO 13: ADICIONAR INSTRUTOR ==========
            cy.get('input[placeholder="Escolha um usuário"]', { timeout: 15000 })
                .filter(':visible')
                .first()
                .scrollIntoView()
                .type('caio gomes');
            cy.wait(5000); //espera os resultados carregarem
            cy.get('.ui-select-highlight', { timeout: 15000 })
                .should('be.visible')
                .click(); //seleciona o instrutor
            cy.wait(2000);

            // ========== PASSO 14: CLICAR EM CONFIRMAR ==========
            cy.get('button[ng-click="confirmAction()"]', { timeout: 15000 })
                .filter(':visible')
                .first()
                .scrollIntoView()
                .click({ force: true });
            cy.wait(3000);

            // ========== PASSO 15: SALVAR TURMA ==========
            cy.get('button[ng-click="saveClass()"]', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // ========== PASSO 16: SALVAR TRILHA ==========
            cy.get('button[ng-click="setKeepEditingAfterSave(false)"]', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);
        });
    });
});
