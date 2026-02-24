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

describe("Teste - Gerenciar Trilha: Filtros de Usuário e E-mail", () => {

    context("Fluxo de Gerenciamento", () => {

        it("Pesquisa trilha, gerencia turma e aplica filtros (Usuário e E-mail)", () => {
            fazerLogin();

            // ========== 1. NAVEGAR E PESQUISAR TRILHA ==========
            cy.get('[title="Trilhas"] > .sideitem', { timeout: 15000, log: false })
                .should('be.visible')
                .click({ log: false });
            cy.wait(2000, { log: false });

            cy.get('input[placeholder="Pesquisar trilhas"]', { timeout: 15000, log: false })
                .should('be.visible')
                .clear({ log: false })
                .type(TRAIL_NAME, { log: false });
            cy.get('button[ng-click="filterText()"]', { log: false }).click({ log: false });
            cy.wait(3000, { log: false });

            // Clicar no card da trilha
            cy.contains('.card-title', TRAIL_NAME, { timeout: 15000, log: false })
                .should('be.visible')
                .click({ log: false });
            cy.wait(3000, { log: false });

            // ========== 2. ACESSAR GERENCIAMENTO DA TURMA GRATUITA ==========
            cy.contains('Gratuita', { timeout: 15000, log: false })
                .should('be.visible')
                .parents('div[ng-repeat*="class"]', { log: false })
                .first({ log: false })
                .find('button', { log: false })
                .contains('Gerenciar', { log: false })
                .click({ force: true, log: false });
            cy.wait(5000, { log: false });

            cy.log('✅ Acesso ao gerenciamento da turma Gratuita concluído!');

            // ========== 3. FILTRO POR USUÁRIO ==========
            const USER_NAME = 'caio teste teste';

            cy.contains('.filter-type', 'Usuário', { timeout: 15000, log: false })
                .closest('.filters-container', { log: false })
                .find('input[ng-model="filter.text"]', { log: false })
                .should('be.visible')
                .clear({ log: false })
                .type(USER_NAME, { log: false });

            cy.contains('.filter-type', 'Usuário', { timeout: 15000, log: false })
                .closest('.filters-container', { log: false })
                .find('button.btn.icon-spyglass', { log: false })
                .filter(':visible', { log: false })
                .first({ log: false })
                .click({ force: true, log: false });
            cy.wait(5000, { log: false });

            // Condicional: Associar se estiver em "Não matriculados", senão apenas verificar
            cy.get('body', { log: false }).then(($body) => {
                if ($body.text().includes(USER_NAME)) {
                    cy.log(`👉 Usuário "${USER_NAME}" encontrado em Não matriculados. Associando...`);

                    cy.contains('td', USER_NAME, { timeout: 15000, log: false })
                        .parent('tr', { log: false })
                        .find('td.select-checkbox', { log: false })
                        .click({ force: true, log: false });
                    cy.wait(2000, { log: false });

                    cy.contains('button', 'Associar usuário(s)', { timeout: 15000, log: false })
                        .should('not.be.disabled')
                        .click({ force: true, log: false });
                    cy.wait(5000, { log: false });
                } else {
                    cy.log(`⏭️ Usuário "${USER_NAME}" já está matriculado.`);
                }
            });

            // Verificar na aba Matriculados/Concluídos
            cy.contains('a', 'Matriculados / Concluídos', { timeout: 15000, log: false })
                .click({ force: true, log: false });
            cy.wait(5000, { log: false });

            cy.get('#subscribed-table', { timeout: 15000, log: false }).should('exist');
            cy.contains('#subscribed-table td', USER_NAME, { timeout: 15000, log: false })
                .should('be.visible');

            cy.log(`✅ VERIFICAÇÃO 1: Usuário "${USER_NAME}" confirmado em Matriculados/Concluídos!`);

            // ========== 4. FILTRO POR E-MAIL ==========
            const USER_EMAIL = 'caio232332@sharklasers.com';

            cy.contains('a', 'Não matriculados', { timeout: 15000, log: false })
                .click({ force: true, log: false });
            cy.wait(5000, { log: false });

            cy.contains('.filter-type', 'E-mail', { timeout: 15000, log: false })
                .closest('.filters-container', { log: false })
                .find('input[ng-model="filter.text"]', { log: false })
                .should('be.visible')
                .clear({ log: false })
                .type(USER_EMAIL, { log: false });

            cy.contains('.filter-type', 'E-mail', { timeout: 15000, log: false })
                .closest('.filters-container', { log: false })
                .find('button.btn.icon-spyglass', { log: false })
                .filter(':visible', { log: false })
                .first({ log: false })
                .click({ force: true, log: false });
            cy.wait(5000, { log: false });

            // Condicional: Associar se estiver em "Não matriculados", senão apenas verificar
            cy.get('body', { log: false }).then(($body) => {
                if ($body.text().includes(USER_EMAIL)) {
                    cy.log(`👉 E-mail "${USER_EMAIL}" encontrado em Não matriculados. Associando...`);

                    cy.contains('#not-subscribed-table td', USER_EMAIL, { timeout: 15000, log: false })
                        .parent('tr', { log: false })
                        .find('td.select-checkbox', { log: false })
                        .click({ force: true, log: false });
                    cy.wait(2000, { log: false });

                    cy.contains('button', 'Associar usuário(s)', { timeout: 15000, log: false })
                        .should('not.be.disabled')
                        .click({ force: true, log: false });
                    cy.wait(5000, { log: false });
                } else {
                    cy.log(`⏭️ E-mail "${USER_EMAIL}" já está matriculado.`);
                }
            });

            // Verificar na aba Matriculados/Concluídos
            cy.contains('a', 'Matriculados / Concluídos', { timeout: 15000, log: false })
                .click({ force: true, log: false });
            cy.wait(5000, { log: false });

            cy.get('#subscribed-table', { timeout: 15000, log: false }).should('exist');
            cy.contains('#subscribed-table td', USER_EMAIL, { timeout: 15000, log: false })
                .should('be.visible');

            cy.log(`✅ VERIFICAÇÃO 2: E-mail "${USER_EMAIL}" confirmado em Matriculados/Concluídos!`);

            // ========== 5. FILTRO POR GRUPOS ==========
            const GROUP_NAME = 'Grupo - 2';
            const userNames = [];

            // Voltar para a aba "Não matriculados"
            cy.contains('a', 'Não matriculados', { timeout: 15000, log: false })
                .click({ force: true, log: false });
            cy.wait(5000, { log: false });

            // Clicar no campo de busca de Grupos para abrir o dropdown
            cy.contains('.filter-type', 'Grupos', { timeout: 15000, log: false })
                .closest('.filters-container', { log: false })
                .find('.ui-select-container input[type="search"]', { log: false })
                .filter(':visible', { log: false })
                .first({ log: false })
                .should('be.visible')
                .click({ force: true, log: false })
                .type(GROUP_NAME, { log: false });

            cy.wait(2000, { log: false });

            // Selecionar "Grupo - 2" na lista de sugestões (overlay)
            cy.get('.ui-select-choices-row', { timeout: 15000, log: false })
                .contains(GROUP_NAME, { log: false })
                .click({ force: true, log: false });

            // Clicar na lupinha para aplicar o filtro
            cy.contains('.filter-type', 'Grupos', { timeout: 15000, log: false })
                .closest('.filters-container', { log: false })
                .find('button.btn.icon-spyglass', { log: false })
                .filter(':visible', { log: false })
                .first({ log: false })
                .click({ force: true, log: false });

            cy.wait(5000, { log: false });

            // Selecionar os 5 primeiros usuários da tabela
            cy.get('#not-subscribed-table tbody tr', { log: false }).then(($rows) => {
                const count = Math.min($rows.length, 5);
                for (let i = 0; i < count; i++) {
                    // Pegar o nome do usuário para verificar depois
                    const name = $rows.eq(i).find('td.userNameColumn', { log: false }).text().trim();
                    userNames.push(name);

                    // Clicar no checkbox
                    cy.wrap($rows.eq(i), { log: false })
                        .find('td.select-checkbox', { log: false })
                        .click({ force: true, log: false });
                }
            });

            // Associar os usuários selecionados
            cy.contains('button', 'Associar usuário(s)', { timeout: 15000, log: false })
                .should('not.be.disabled')
                .click({ force: true, log: false });

            cy.wait(5000, { log: false });

            // ========== VERIFICAÇÃO FINAL: MATRICULADOS/CONCLUÍDOS ==========
            cy.contains('a', 'Matriculados / Concluídos', { timeout: 15000, log: false })
                .click({ force: true, log: false });
            cy.wait(5000, { log: false });

            // Verificar se os 5 usuários estão na tabela de matriculados
            userNames.forEach((name) => {
                cy.contains('#subscribed-table td', name, { timeout: 15000, log: false })
                    .should('be.visible');
                cy.log(`✅ Usuário "${name}" (do Grupo - 2) confirmado em Matriculados/Concluídos!`);
            });

            cy.log('✅ Teste de filtro por Grupos e associação múltipla concluído!');
            cy.log('✅ Teste concluído com sucesso!');
        });
    });

});
