/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild') || err.message.includes('parentNode') || err.message.includes('remove') || err.message.includes('then') || err.message.includes('getColor') || err.message.includes("reading '0'")) {
        return false;
    }
});

// ==================== DADOS ====================
const RANDOM_ID = Math.floor(1000 + Math.random() * 9000);
const LOGIN_URL = 'https://www.hml.lector.live/lector_suporte/subscribe/login';
const TRAIL_NAME = `Trilha Paga com Aprovação ${RANDOM_ID}`;
const CATEGORY_NAME = 'checklsit trilhas 1703';
const COVER_IMAGES = [
    'cypress/fixtures/Capa.jpg',
    'cypress/fixtures/capa 2.jpg',
    'cypress/fixtures/capa 3.png',
    'cypress/fixtures/capa 4.jpg'
];

const admin = { email: 'suporte2@lectortec.com.br', senha: '#C4iocl4r413' };
const perfilAdmin = 'Administrador - Todos';
const perfilAluno = 'Aluno - Todos';

// ==================== HELPERS ====================

function fazerLogin(email, senha) {
    cy.visit(LOGIN_URL);
    cy.wait(5000);
    cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input')
        .should('be.visible').clear().type(email);
    cy.wait(2000);
    cy.get('#login_password').should('be.visible').clear().type(senha);
    cy.wait(2000);
    cy.get('#btn-entrar').should('be.enabled').click();
    cy.wait(8000);
    cy.url().should('not.include', '/subscribe/login');
}

function trocarPerfil(perfilDesejado) {
    const nomeBase = perfilDesejado.split(' - ')[0];
    cy.get('body').then(($body) => {
        if ($body.find('.current-profile').length > 0) {
            cy.get('.current-profile').invoke('text').then((texto) => {
                if (!texto.trim().includes(nomeBase)) {
                    cy.get('.profile-select', { timeout: 15000 }).should('be.visible').click();
                    cy.wait(3000);
                    cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).should('be.visible').click();
                    cy.wait(3000);
                    cy.contains('#user-options .option.item', perfilDesejado, { timeout: 15000 }).click({ force: true });
                    cy.wait(8000);
                }
            });
        } else if ($body.find('#user-options-btn').length > 0) {
            cy.get('#user-options-btn', { timeout: 15000 }).click();
            cy.wait(3000);
            cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
            cy.wait(3000);
            cy.contains('#user-options .option.item', perfilDesejado, { timeout: 15000 }).click({ force: true });
            cy.wait(8000);
        }
    });
}

function uploadCapa(aspect, imageFile) {
    cy.get(`label.thumb-placeholder[aspect="${aspect}"] input[type="file"]`)
        .selectFile(imageFile, { force: true });
    cy.wait(4000);
    cy.get('button[ng-click="cropper.save()"]', { timeout: 15000 })
        .should('be.visible')
        .click();
    cy.wait(2000);
    cy.log(`✅ Capa "${aspect}" enviada!`);
}

function salvarTrilha() {
    cy.get('.content-box-footer > .flex > .btn-swipe-accent').click({ force: true });
    cy.wait(2000);
    cy.get('[ng-show="modal.saveTrailVersion"] > .modal > :nth-child(3) > .checkbox > .icon-checkbox').click({ force: true });
    cy.get('[ng-show="modal.saveTrailVersion"] > .modal > .end > .ml-10').click({ force: true });
    cy.wait(5000);
}

function navegarParaTrilha() {
    cy.get('[title="Trilhas"] > .sideitem', { timeout: 15000 }).click({ force: true });
    cy.wait(2000);
    cy.get('input[placeholder="Pesquisar trilhas"]', { timeout: 15000 })
        .should('be.visible').clear().type(TRAIL_NAME);
    cy.get('button[ng-click="filterText()"]').click();
    cy.wait(5000);
    cy.contains('.card-title', new RegExp(TRAIL_NAME, 'i'), { timeout: 15000 })
        .should('be.visible').click();
    cy.wait(3000);
    cy.get('button[ng-click="editTrail(trail)"]', { timeout: 15000 })
        .should('be.visible').click();
    cy.wait(5000);
    cy.log(`✅ Trilha "${TRAIL_NAME}" aberta para edição!`);
}

// ==================== TESTES ====================

describe(`Trilha Paga COM aprovação do gestor (${TRAIL_NAME})`, () => {

    beforeEach(() => {
        fazerLogin(admin.email, admin.senha);
        trocarPerfil(perfilAdmin);
    });

    it("Criar trilha paga com turma, capas e aprovação de gestor", () => {
        // ========== CRIAR TRILHA ==========
        cy.get('[title="Trilhas"] > .sideitem').click();
        cy.wait(3000);
        cy.get('.title-bar > .btn-icon').click();
        cy.wait(3000);

        cy.get('input[placeholder="Informe o nome"]', { timeout: 20000 })
            .filter(':visible').first()
            .should('not.be.disabled').scrollIntoView().focus()
            .clear({ force: true })
            .type(TRAIL_NAME, { delay: 30, force: true })
            .should('have.value', TRAIL_NAME);

        // ========== CAPAS ==========
        uploadCapa('square', COVER_IMAGES[Math.floor(Math.random() * COVER_IMAGES.length)]);
        uploadCapa('cover',  COVER_IMAGES[Math.floor(Math.random() * COVER_IMAGES.length)]);
        uploadCapa('banner', COVER_IMAGES[Math.floor(Math.random() * COVER_IMAGES.length)]);

        // ========== ETAPA + CONTEÚDO ==========
        cy.get('[ui-sref="accessLink.content.trails.edit.id.version.stages"]').click();
        cy.wait(3000);
        cy.get('button[ng-click="createStage()"]').filter(':visible').first().click();
        cy.wait(2000);
        cy.contains('button', 'Novo conteúdo').filter(':visible').first().click({ force: true });
        cy.wait(2000);

        cy.log('⏸️ PAUSA: Selecione o conteúdo/treinamento desejado para a trilha. (15s)');
        cy.wait(15000);

        cy.get('.start > .btn-swipe-accent').click();
        cy.wait(2000);

        // ========== ABA TURMAS - TURMA PAGA COM APROVAÇÃO ==========
        cy.get('[trails=""] > .tabs > .ng-scope').click();
        cy.wait(3000);
        cy.get('.gap > .btn-swipe-accent').click();
        cy.wait(3000);

        cy.get('input[placeholder="Informe um nome para a turma"]', { timeout: 20000 })
            .filter(':visible').first()
            .scrollIntoView().click({ force: true }).focus()
            .clear({ force: true })
            .type(`Turma Paga - ${RANDOM_ID}`, { delay: 50, force: true });

        cy.get('#currentClassPrice', { timeout: 60000 })
            .should('be.visible').and('not.be.disabled')
            .scrollIntoView().click({ force: true }).focus()
            .clear({ force: true })
            .type('99.90', { delay: 50, force: true })
            .blur();

        // Aprovação do gestor via ng-model
        cy.get('input[ng-model="currentClass.requireApproval"]', { timeout: 15000 })
            .parent('label.checkbox')
            .find('.icon-checkbox')
            .scrollIntoView()
            .click({ force: true });
        cy.wait(1000);

        cy.get('.editing-class > :nth-child(1) > .content-box-footer > .btn-swipe-accent').click();
        cy.wait(3000);

        // ========== CLONAR TURMA COM OUTRO VALOR ==========
        cy.get('button[ng-click="cloneClass(cl)"]', { timeout: 15000 }).first().click();
        cy.wait(3000);

        cy.get('input[placeholder="Informe um nome para a turma"]', { timeout: 20000 })
            .filter(':visible').first()
            .scrollIntoView().click({ force: true }).focus()
            .clear({ force: true })
            .type(`Turma Paga Clonada - ${RANDOM_ID}`, { delay: 50, force: true });

        cy.get('#currentClassPrice', { timeout: 60000 })
            .should('be.visible').scrollIntoView().click({ force: true }).focus()
            .clear({ force: true })
            .type('149.90', { delay: 50, force: true })
            .blur();

        cy.get('.editing-class > :nth-child(1) > .content-box-footer > .btn-swipe-accent').click();
        cy.wait(3000);

        cy.log(`✅ Turmas criadas: "${TRAIL_NAME}"`);
        salvarTrilha();

        // ========== EDITAR TRILHA E ADICIONAR CATEGORIA ==========
        navegarParaTrilha();

        cy.get('body').then(($body) => {
            if ($body.find('input[placeholder="Escolha uma categoria"]').length > 0) {
                cy.get('input[placeholder="Escolha uma categoria"]')
                    .filter(':visible').focus().click({ force: true }).type(CATEGORY_NAME);
                cy.wait(2000);
                cy.contains('.ui-select-choices-row', CATEGORY_NAME, { timeout: 15000 })
                    .should('be.visible').click({ force: true });
            } else if ($body.find('.tree-container').length > 0) {
                cy.contains('.tree-item', CATEGORY_NAME, { timeout: 15000 })
                    .find('.icon-checkbox').scrollIntoView().click({ force: true });
            }
        });
        cy.wait(1000);
        cy.log(`✅ Categoria "${CATEGORY_NAME}" vinculada!`);
        salvarTrilha();
    });

    it("Aprovação do gestor e verificação do botão de pagamento para o aluno", () => {
        trocarPerfil(perfilAluno);

        cy.log('⏸️ PAUSA: Acesse a trilha criada e solicite inscrição como Aluno. (15s)');
        cy.wait(15000);

        trocarPerfil(perfilAdmin);
        cy.log('⏸️ PAUSA: Aprove a solicitação do aluno em Gerenciar → Solicitações de matrícula. (15s)');
        cy.wait(15000);

        trocarPerfil(perfilAluno);
        cy.log('⏸️ PAUSA: Verifique se o botão "Efetuar pagamento" aparece e se leva para "Continuar compra". (15s)');
        cy.wait(15000);

        cy.log('⏸️ PAUSA: Verifique se é possível comprar e acessar a trilha após conclusão. (15s)');
        cy.wait(15000);
    });
});
