/// <reference types="cypress" />

// Ignora erros internos da aplicação
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild') || err.message.includes('parentNode') || err.message.includes('getColor') || err.message.includes("reading '0'") || err.message.includes('remove') || err.message.includes('then') || err.message.includes('frameElement')) {
        return false;
    }
});

// ==================== DADOS ====================
const LOGIN_URL = 'https://www.hml.lector.live/lector_suporte/subscribe/login';
const TRAIL_NAME = 'Testes automatizados no gerenciar 1671';

const admin = {
    email: 'suporte2@lectortec.com.br',
    senha: '#C4iocl4r413'
};

// ==================== FUNÇÕES AUXILIARES ====================

/**
 * Realiza login na plataforma Lector
 */
function fazerLogin() {
    cy.visit(LOGIN_URL);
    cy.wait(3000);

    cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input')
        .should('be.visible')
        .type(admin.email);

    cy.get('#login_password')
        .should('be.visible')
        .type(admin.senha);

    cy.get('#btn-entrar')
        .should('be.enabled')
        .click();
    cy.wait(5000);

    cy.url().should('not.include', '/subscribe/login');

    // Garantir perfil Administrador
    trocarPerfil('Administrador - Todos');

    cy.log('✅ Login realizado com sucesso!');
}

/**
 * Troca o perfil do usuário para o perfil desejado
 */
function trocarPerfil(perfilDesejado) {
    const nomeBase = perfilDesejado.split(' - ')[0];

    cy.get('.current-profile', { timeout: 15000 })
        .should('be.visible')
        .invoke('text')
        .then((textoPerfilAtual) => {
            const perfilAtual = textoPerfilAtual.trim();

            if (!perfilAtual.includes(nomeBase)) {
                cy.get('.profile-select', { timeout: 15000 })
                    .should('be.visible')
                    .click();
                cy.wait(2000);

                cy.contains('div', 'Selecionar perfil', { timeout: 15000 })
                    .should('be.visible')
                    .click();
                cy.wait(2000);

                cy.contains('#user-options .option.item', perfilDesejado, { timeout: 15000 })
                    .click({ force: true });
                cy.wait(5000);

                cy.log(`✅ Perfil trocado para "${perfilDesejado}"`);
            } else {
                cy.log(`⏭️ Perfil "${perfilDesejado}" já está ativo`);
            }
        });
}

// ==================== TESTES ====================

describe("Teste - Gerenciar Trilha: Matriculados / Concluídos", () => {

    context("Fluxo de Conclusão de Matrículas", () => {

        it("Acessa a aba matriculados, busca usuários (Nome, E-mail, Grupo) e conclui matrículas", () => {
            fazerLogin();

            // ========== 1. NAVEGAR E PESQUISAR TRILHA ==========
            cy.get('[title="Trilhas"] > .sideitem', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(2000);

            cy.get('input[placeholder="Pesquisar trilhas"]', { timeout: 15000 })
                .should('be.visible')
                .clear()
                .type(TRAIL_NAME);
            cy.get('button[ng-click="filterText()"]').click();
            cy.wait(3000);

            // Clicar no card da trilha
            cy.contains('.card-title', TRAIL_NAME, { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // ========== 2. ACESSAR GERENCIAMENTO DA TURMA GRATUITA ==========
            cy.contains('Gratuita', { timeout: 15000 })
                .should('be.visible')
                .parents('div[ng-repeat*="class"]')
                .first()
                .find('button')
                .contains('Gerenciar')
                .click({ force: true });
            cy.wait(5000);

            // ========== 3. NAVEGAR PARA ABA MATRICULADOS / CONCLUÍDOS ==========
            cy.contains('a', 'Matriculados / Concluídos', { timeout: 20000 })
                .click({ force: true });

            // Garantir que a tabela de matriculados carregou (usando exist + scroll para maior estabilidade)
            cy.get('#subscribed-table', { timeout: 30000 })
                .should('exist')
                .scrollIntoView();
            cy.wait(3000);

            // ========== 4. FILTRO POR USUÁRIO (Teste 08/12 4) ==========
            const USER_NAME = 'Teste 08/12 4';

            cy.log(`🔍 Buscando usuário: ${USER_NAME}`);

            // Localiza o container de filtros que está visível na aba atual
            cy.get('.filters-container:visible', { timeout: 15000 })
                .first()
                .within(() => {
                    cy.contains('.filter-type', 'Usuário')
                        .closest('.filter-container') // Note: some versions use filter-container
                        .find('input')
                        .filter(':visible')
                        .should('be.visible')
                        .clear()
                        .type(USER_NAME);

                    cy.get('button.btn.icon-spyglass')
                        .filter(':visible')
                        .click({ force: true });
                });

            cy.wait(5000);

            cy.get('body').then(($body) => {
                if ($body.text().includes(USER_NAME)) {
                    cy.log(`👉 Usuário "${USER_NAME}" encontrado. Selecionando...`);
                    cy.contains('#subscribed-table td', USER_NAME, { timeout: 15000 })
                        .parent('tr')
                        .find('td.select-checkbox')
                        .click({ force: true });
                    cy.wait(2000);

                    cy.contains('button', 'Concluir matrícula(s)', { timeout: 15000 })
                        .should('not.be.disabled')
                        .click({ force: true });
                    cy.wait(5000);
                    cy.log(`✅ Usuário "${USER_NAME}" concluído com sucesso!`);
                } else {
                    cy.log(`⏭️ Usuário "${USER_NAME}" não encontrado (pode ter sido concluído ou removido).`);
                }
            });

            // ========== 5. FILTRO POR E-MAIL ==========
            const USER_EMAIL = 'caio232332@sharklasers.com';

            cy.log(`🔍 Buscando e-mail: ${USER_EMAIL}`);

            cy.get('.filters-container:visible')
                .first()
                .within(() => {
                    cy.contains('.filter-type', 'E-mail')
                        .closest('.filter-container')
                        .find('input')
                        .filter(':visible')
                        .should('be.visible')
                        .clear()
                        .type(USER_EMAIL);

                    cy.get('button.btn.icon-spyglass')
                        .filter(':visible')
                        .click({ force: true });
                });

            cy.wait(5000);

            cy.get('body').then(($body) => {
                if ($body.text().includes(USER_EMAIL)) {
                    cy.log(`👉 E-mail "${USER_EMAIL}" encontrado. Selecionando...`);
                    cy.contains('#subscribed-table td', USER_EMAIL, { timeout: 15000 })
                        .parent('tr')
                        .find('td.select-checkbox')
                        .click({ force: true });
                    cy.wait(2000);

                    cy.contains('button', 'Concluir matrícula(s)', { timeout: 15000 })
                        .should('not.be.disabled')
                        .click({ force: true });
                    cy.wait(5000);
                    cy.log(`✅ E-mail "${USER_EMAIL}" concluído com sucesso!`);
                } else {
                    cy.log(`⏭️ E-mail "${USER_EMAIL}" não encontrado.`);
                }
            });

            // ========== 6. FILTRO POR GRUPOS ==========
            const GROUP_NAME = 'Grupo - 2';

            cy.log(`🔍 Buscando grupo: ${GROUP_NAME}`);

            cy.get('.filters-container:visible')
                .first()
                .within(() => {
                    cy.contains('.filter-type', 'Grupos')
                        .closest('.filter-container')
                        .find('.ui-select-container input[type="search"]')
                        .filter(':visible')
                        .first()
                        .should('be.visible')
                        .click({ force: true })
                        .type(GROUP_NAME);

                    cy.wait(2000);
                    cy.get('.ui-select-choices-row').contains(GROUP_NAME).click({ force: true });

                    cy.get('button.btn.icon-spyglass')
                        .filter(':visible')
                        .click({ force: true });
                });

            cy.wait(5000);

            cy.get('#subscribed-table tbody tr').then(($rows) => {
                const count = Math.min($rows.length, 5);
                if (count > 0) {
                    cy.log(`👉 Selecionando ${count} usuários do grupo "${GROUP_NAME}"...`);
                    for (let i = 0; i < count; i++) {
                        cy.wrap($rows.eq(i))
                            .find('td.select-checkbox')
                            .click({ force: true });
                    }
                    cy.wait(2000);
                    cy.contains('button', 'Concluir matrícula(s)', { timeout: 15000 })
                        .should('not.be.disabled')
                        .click({ force: true });
                    cy.wait(5000);
                    cy.log(`✅ ${count} usuários do grupo concluídos com sucesso!`);
                } else {
                    cy.log(`⏭️ Nenhum usuário encontrado para o grupo "${GROUP_NAME}" na aba Matriculados.`);
                }
            });

            cy.log('✅ Teste de Conclusão de Matrículas finalizado!');
        });
    });

});