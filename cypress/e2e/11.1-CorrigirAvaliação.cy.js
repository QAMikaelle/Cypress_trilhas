/// <reference types="cypress" />

// Ignora erros internos da aplicação
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild') || err.message.includes('parentNode') || err.message.includes('remove') || err.message.includes('then')) {
        return false;
    }
});

describe("Teste - Corrigir Avaliação (Administrador)", () => {

    it("Login, acessar trilha, gerenciar turma Gratuita e corrigir avaliação do aluno", () => {

        // ========== LOGIN ==========
        cy.visit("https://www.hml.lector.live/lector_suporte/subscribe/login");
        cy.wait(3000);

        cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input')
            .should('be.visible')
            .type("suporte2@lectortec.com.br");
        cy.wait(2000);
        cy.get('#login_password').should('be.visible').type("#C4iocl4r413");
        cy.wait(1000);
        cy.get('#btn-entrar').should('be.enabled').click();
        cy.wait(5000);

        cy.url().should('not.include', '/subscribe/login');

        // ========== VERIFICAR PERFIL E TROCAR PARA ADMINISTRADOR SE NECESSÁRIO ==========
        cy.get('.current-profile, #user-options-btn', { timeout: 15000 })
            .should('exist');
        cy.wait(2000);

        cy.get('body').then(($body) => {
            if ($body.find('.current-profile').length > 0) {
                cy.get('.current-profile').invoke('text').then((perfil) => {
                    if (!perfil.trim().includes('Administrador')) {
                        cy.get('.profile-select', { timeout: 15000 }).click();
                        cy.wait(2000);
                        cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
                        cy.wait(2000);
                        cy.contains('#user-options .option.item', 'Administrador', { timeout: 15000 })
                            .click({ force: true });
                        cy.wait(5000);
                    }
                });
            } else {
                cy.get('#user-options-btn', { timeout: 15000 }).click();
                cy.wait(2000);
                cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
                cy.wait(2000);
                cy.contains('#user-options .option.item', 'Administrador', { timeout: 15000 })
                    .click({ force: true });
                cy.wait(5000);
            }
        });

        // ========== ACESSAR URL DA TRILHA ==========
        cy.visit("https://www.hml.lector.live/lector_suporte/trails/8371/stages");
        cy.wait(5000);

        // ========== CLICAR EM GERENCIAR NA TURMA "GRATUITA" ==========
        // Localiza o container da turma "Gratuita" pelo nome e clica no botão Gerenciar dentro dele
        cy.contains('b.ng-binding', 'Gratuita', { timeout: 15000 })
            .closest('div[ng-repeat="class in trail.classes track by class.id"]')
            .find('button.btn-swipe-accent')
            .contains('Gerenciar')
            .click({ force: true });
        cy.wait(5000);

        // ========== ACESSAR ABA AVALIAÇÕES ==========
        cy.contains('a', 'Avaliação', { timeout: 15000 })
            .click({ force: true });
        cy.wait(5000);

        // ========== PROCURAR ALUNO "Caio gomes" E CLICAR EM CORRIGIR ==========
        cy.contains('td', 'Caio gomes', { timeout: 15000 })
            .parent('tr')
            .find('button.icon-edit')
            .click({ force: true });
        cy.wait(5000);

        // ========== DIGITAR NOTA 10 ==========
        cy.get('input[ng-model="questionAnswer.grade"]', { timeout: 15000 })
            .should('be.visible')
            .clear()
            .type('10');
        cy.wait(1000);

        // ========== DIGITAR OBSERVAÇÃO ==========
        cy.get('textarea[ng-model="questionAnswer.observations"]', { timeout: 15000 })
            .should('be.visible')
            .clear()
            .type('Avaliação corrigida via automação Cypress');
        cy.wait(1000);

        // ========== CLICAR EM ENVIAR CORREÇÃO ==========
        cy.contains('button[type="submit"]', 'Enviar correção', { timeout: 15000 })
            .should('be.visible')
            .click({ force: true });
        cy.wait(5000);

        cy.log('✅ Avaliação do aluno "Caio gomes" corrigida com sucesso!');
    });
});
