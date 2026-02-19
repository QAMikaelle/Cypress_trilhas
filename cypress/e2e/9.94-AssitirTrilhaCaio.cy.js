/// <reference types="cypress" />

// Ignora erros internos da aplicação
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild') || err.message.includes('parentNode')) {
        return false;
    }
});

describe("Teste - Assistir Trilha (Aluno)", () => {

    it("Acessar trilha, fazer inscrição e realizar avaliação", () => {

        // ========== LOGIN ==========
        cy.visit("https://www.hml.lector.live/lector_suporte/subscribe/login");
        cy.wait(3000);

        cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input').should('be.visible').type("suporte2@lectortec.com.br");
        cy.wait(2000);
        cy.get('#login_password').should('be.visible').type("#C4iocl4r413");
        cy.wait(1000);
        cy.get('#btn-entrar').should('be.enabled').click();
        cy.wait(5000);

        cy.url().should('not.include', '/subscribe/login');

        // ========== VERIFICAR PERFIL E TROCAR PARA ALUNO SE NECESSÁRIO ==========
        cy.get('.current-profile, #user-options-btn', { timeout: 15000 })
            .should('exist');
        cy.wait(2000);

        // Tenta ler o perfil atual - na visão de aluno com showcase theme, pode não ter .current-profile
        cy.get('body').then(($body) => {
            // Se existe .current-profile (layout legado), verifica o texto
            if ($body.find('.current-profile').length > 0) {
                cy.get('.current-profile').invoke('text').then((perfil) => {
                    if (!perfil.trim().includes('Aluno')) {
                        // Precisa trocar para Aluno
                        cy.get('.profile-select', { timeout: 15000 }).click();
                        cy.wait(2000);
                        cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
                        cy.wait(2000);
                        cy.contains('#user-options .option.item', 'Aluno - Todos', { timeout: 15000 })
                            .click({ force: true });
                        cy.wait(5000);
                    }
                });
            } else {
                // Layout showcase - tenta trocar perfil pelo botão de user options
                cy.get('#user-options-btn', { timeout: 15000 }).click();
                cy.wait(2000);
                cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
                cy.wait(2000);
                cy.contains('#user-options .option.item', 'Aluno - Todos', { timeout: 15000 })
                    .click({ force: true });
                cy.wait(5000);
            }
        });

        // ========== ACESSAR A VITRINE ==========
        cy.visit("https://www.hml.lector.live/lector_suporte/showcase/2281");
        cy.wait(5000);

        // ========== CLICAR NO CARD DA TRILHA ==========
        cy.contains('.showcase-card-title', 'Trilha importação automação caio', { timeout: 15000 })
            .should('be.visible')
            .click();
        cy.wait(5000);

        // ========== CLICAR EM FAZER INSCRIÇÃO ==========
        cy.contains('span', 'Fazer inscrição', { timeout: 15000 })
            .should('be.visible')
            .click();
        cy.wait(5000);

        // ========== CLICAR EM ACESSAR O TREINAMENTO ==========
        cy.contains('button', 'Acessar', { timeout: 15000 })
            .filter(':visible')
            .first()
            .click();
        cy.wait(5000);

        // ========== CLICAR EM INICIAR AVALIAÇÃO OU ACESSAR ==========
        // O botão pode aparecer como "Iniciar avaliação" ou "Acessar" dependendo do estado
        cy.contains('button', /Iniciar avaliação|Acessar/, { timeout: 15000 })
            .filter(':visible')
            .first()
            .click();
        cy.wait(3000);

        // ========== RESPONDER QUESTÃO 1 ==========
        cy.get('textarea.discursive', { timeout: 15000 })
            .should('be.visible')
            .clear()
            .type('minha reposta é brasil 2026');
        cy.wait(2000);

        // ========== CLICAR EM PRÓXIMA QUESTÃO ==========
        cy.contains('.resource-preview-next-prev', 'Próxima questão', { timeout: 15000 })
            .should('be.visible')
            .click();
        cy.wait(3000);

        // ========== RESPONDER QUESTÃO 2 ==========
        cy.get('textarea.discursive', { timeout: 15000 })
            .should('be.visible')
            .clear()
            .type('minha resposta 2');
        cy.wait(2000);

        // ========== CLICAR EM ENVIAR RESPOSTAS ==========
        cy.get('#nextResourceArrow', { timeout: 15000 })
            .should('be.visible')
            .click();
        cy.wait(3000);

        // ========== CONFIRMAR ENVIO (MODAL) ==========
        cy.contains('button', 'Enviar', { timeout: 15000 })
            .filter(':visible')
            .first()
            .click();
        cy.wait(5000);

        cy.log('✅ Trilha acessada, inscrição feita e avaliação realizada com sucesso!');
    });
});
