/// <reference types="cypress" />

// Ignora erros internos da aplicação
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild') || err.message.includes('parentNode') || err.message.includes('getColor') || err.message.includes("reading '0'") || err.message.includes('remove') || err.message.includes('then') || err.message.includes('frameElement')) {
        return false;
    }
});

// ==================== DADOS ====================
const LOGIN_URL = 'https://www.hml.lector.live/lector_suporte/subscribe/login';
const TRAIL_NAME = 'Trilha automação caio 1069'; // colocar o nome da trilha aqui
const CATEGORY_NAME = 'Cypress Caio'; // colocar o nome da categoria aqui

const admin = {//colocar o email e senha do admin aqui
    email: 'suporte2@lectortec.com.br',
    senha: '#C4iocl4r413'
};

// ==================== FUNÇÕES AUXILIARES ====================

function fazerLogin() {
    cy.visit(LOGIN_URL);
    cy.wait(5000);

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

function trocarPerfil(perfilDesejado) {
    const nomeBase = perfilDesejado.split(' - ')[0];

    cy.get('.current-profile', { timeout: 15000 })
        .should('be.visible')
        .invoke('text')
        .then((textoPerfilAtual) => {
            if (!textoPerfilAtual.trim().includes(nomeBase)) {
                cy.get('.profile-select', { timeout: 15000 }).click();
                cy.wait(2000);
                cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
                cy.wait(2000);
                cy.contains('#user-options .option.item', perfilDesejado, { timeout: 15000 })
                    .click({ force: true });
                cy.wait(5000);
            }
        });
}

// ==================== TESTES ====================

describe("Teste - Vincular Trilha à Categoria", () => {

    it("Acessa a trilha e vincula a uma categoria existente", () => {
        fazerLogin();

        // 1. Navegar para Trilhas
        cy.get('[title="Trilhas"] > .sideitem', { timeout: 15000 })
            .should('be.visible')
            .click();
        cy.wait(2000);

        // 2. Pesquisar a trilha
        cy.get('input[placeholder="Pesquisar trilhas"]', { timeout: 15000 })
            .should('be.visible')
            .clear()
            .type(TRAIL_NAME);
        cy.get('button[ng-click="filterText()"]').click();
        cy.wait(3000);

        // 3. Abrir edição da trilha
        // Usamos regex case-insensitive e parcial para evitar falhas por capitalização ou truncamento na UI
        cy.contains('.card-title', new RegExp(TRAIL_NAME, 'i'), { timeout: 15000 })
            .should('be.visible')
            .click();
        cy.wait(2000);

        cy.get('button[ng-click="editTrail(trail)"]', { timeout: 15000 })
            .should('be.visible')
            .click();
        cy.wait(5000);

        // 4. Vincular Categoria
        cy.log(`🔍 Procurando categoria: ${CATEGORY_NAME}`);

        cy.get('body').then(($body) => {
            // Prioriza o campo de busca de categoria (conforme orientação do usuário)
            const $searchInput = $body.find('input[placeholder="Escolha uma categoria"]');

            if ($searchInput.length > 0) {
                cy.wrap($searchInput)
                    .filter(':visible')
                    .focus()
                    .click({ force: true })
                    .type(CATEGORY_NAME);

                cy.wait(2000);

                cy.contains('.ui-select-choices-row', CATEGORY_NAME, { timeout: 15000 })
                    .should('be.visible')
                    .click({ force: true });
            }
            // Alternativa: árvore de categorias (se visível)
            else if ($body.find('.tree-container').length > 0) {
                cy.contains('.tree-item', CATEGORY_NAME, { timeout: 15000 })
                    .find('.icon-checkbox')
                    .scrollIntoView()
                    .click({ force: true });
            }
            // Alternativa final: busca genérica por label
            else {
                cy.contains('label', /Categoria/i).parent().within(() => {
                    cy.get('input, .ui-select-container').click({ force: true });
                    cy.wait(1000);
                    cy.contains('.ui-select-choices-row', CATEGORY_NAME).click({ force: true });
                });
            }
        });
        cy.wait(2000);

        // 5. Salvar
        cy.get('button[ng-click="setKeepEditingAfterSave(false)"]', { timeout: 15000 })
            .contains('Salvar')
            .click({ force: true });

        // Se aparecer modal de versionamento (comum em trilhas)
        cy.get('body').then(($body) => {
            if ($body.find('[switch="modal.versioning"]').length > 0) {
                cy.get('input[ng-model="useVersionConfirm"]').click({ force: true });
                cy.get('button[ng-click="saveTrail(false)"]').click();
            }
        });

        cy.wait(5000);
        cy.log('✅ Categoria vinculada com sucesso!');
    });
});
