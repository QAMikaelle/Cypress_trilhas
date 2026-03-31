/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild') || err.message.includes('parentNode') || err.message.includes('remove') || err.message.includes('then') || err.message.includes('getColor') || err.message.includes("reading '0'")) {
        return false;
    }
});

// ==================== DADOS ====================
const RANDOM_ID = Math.floor(1000 + Math.random() * 9000);
const LOGIN_URL = 'https://www.hml.lector.live/lector_suporte/subscribe/login';
const TRAIL_NAME = `Trilha Gratuita sem Aprovação ${RANDOM_ID}`;
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

function navegarCarrosselAteEncontrar(tentativa = 0) {
    const MAX_TENTATIVAS = 20;
    cy.get('body').then(($body) => {
        const cards = $body.find('.showcase-card-title');
        let encontrado = false;
        cards.each((i, el) => {
            if (el.textContent.trim().includes(TRAIL_NAME)) {
                encontrado = true;
            }
        });

        if (encontrado) {
            cy.contains('.showcase-card-title', TRAIL_NAME)
                .should('be.visible')
                .closest('a')
                .click({ force: true });
        } else if (tentativa < MAX_TENTATIVAS) {
            const btnNext = $body.find('.showcase-card-carousel-arrow-right:not([disabled])');
            if (btnNext.length > 0) {
                cy.get('.showcase-card-carousel-arrow-right:not([disabled])').first()
                    .click({ force: true });
                cy.wait(1500);
                navegarCarrosselAteEncontrar(tentativa + 1);
            } else {
                cy.log(`⚠️ Card "${TRAIL_NAME}" não encontrado no carrossel.`);
            }
        } else {
            cy.log(`⚠️ Limite de tentativas atingido ao procurar "${TRAIL_NAME}".`);
        }
    });
}

// ==================== TESTES ====================

describe(`Trilha Gratuita SEM aprovação do gestor (${TRAIL_NAME})`, () => {

    beforeEach(() => {
        fazerLogin(admin.email, admin.senha);
        trocarPerfil(perfilAdmin);
    });

    it("Criar trilha gratuita sem aprovação, clonar turma e adicionar capas", () => {
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
        uploadCapa('cover', COVER_IMAGES[Math.floor(Math.random() * COVER_IMAGES.length)]);
        uploadCapa('banner', COVER_IMAGES[Math.floor(Math.random() * COVER_IMAGES.length)]);

        // ========== ETAPA + CONTEÚDO ==========
        cy.get('[ui-sref="accessLink.content.trails.edit.id.version.stages"]').click();
        cy.wait(3000);
        cy.get('button[ng-click="createStage()"]').filter(':visible').first().click();
        cy.wait(2000);
        cy.contains('button', 'Novo conteúdo').filter(':visible').first().click({ force: true });
        cy.wait(2000);

        cy.log('⏸️ PAUSA: Selecione o conteúdo desejado para a trilha. (15s)');
        cy.wait(15000);

        cy.get('.start > .btn-swipe-accent').click();
        cy.wait(2000);

        // ========== TURMA GRATUITA SEM APROVAÇÃO ==========
        cy.get('[trails=""] > .tabs > .ng-scope').click();
        cy.wait(3000);
        cy.get('.gap > .btn-swipe-accent').click();
        cy.wait(3000);

        cy.get('input[placeholder="Informe um nome para a turma"]', { timeout: 20000 })
            .filter(':visible').first()
            .scrollIntoView().click({ force: true }).focus()
            .clear({ force: true })
            .type(`Turma Gratuita - ${RANDOM_ID}`, { delay: 50, force: true });

        // Marcar como gratuita via ng-model
        cy.get('input[ng-model="currentClass.free"]', { timeout: 15000 })
            .scrollIntoView()
            .check({ force: true });
        cy.wait(1000);

        cy.get('.editing-class > :nth-child(1) > .content-box-footer > .btn-swipe-accent').click();
        cy.wait(3000);

        // ========== CLONAR TURMA ==========
        cy.get('button[ng-click="cloneClass(cl)"]', { timeout: 15000 }).first().click();
        cy.wait(3000);

        cy.get('input[placeholder="Informe um nome para a turma"]', { timeout: 20000 })
            .filter(':visible').first()
            .scrollIntoView().click({ force: true }).focus()
            .clear({ force: true })
            .type(`Turma Gratuita Clonada - ${RANDOM_ID}`, { delay: 50, force: true });

        // Turma clonada também gratuita
        cy.get('input[ng-model="currentClass.free"]', { timeout: 15000 })
            .scrollIntoView()
            .check({ force: true });
        cy.wait(1000);

        cy.get('.editing-class > :nth-child(1) > .content-box-footer > .btn-swipe-accent').click();
        cy.wait(3000);

        // ========== VERIFICAR TURMAS VINCULADAS ==========
        cy.log('✅ Verificando turmas clonadas na trilha...');
        cy.get('body').then(($body) => {
            const turmas = $body.find('[ng-repeat*="class"]').length;
            cy.log(`Total de turmas encontradas: ${turmas}`);
            expect(turmas).to.be.at.least(2);
        });

        salvarTrilha();
        cy.log(`✅ Trilha "${TRAIL_NAME}" criada com sucesso!`);

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

    it("Aluno faz inscrição direta sem aprovação e acessa treinamento", () => {
        trocarPerfil(perfilAluno);

        // ========== ACESSAR SHOWCASE E LOCALIZAR TRILHA NA PÁGINA ==========
        cy.visit('https://www.hml.lector.live/lector_suporte/showcase/2337');
        cy.wait(5000);

        // Localizar o card da trilha navegando pelo carrossel
        navegarCarrosselAteEncontrar();
        cy.wait(3000);

        // ========== FAZER INSCRIÇÃO ==========
        cy.contains('button, a', /Fazer inscrição|Inscrever/i, { timeout: 15000 })
            .should('be.visible').click({ force: true });
        cy.wait(3000);

        // Verificar que o acesso é imediato (sem "Aguardando")
        cy.get('body').then(($body) => {
            const temAguardando = $body.find(':contains("Aguardando")').filter('button, span').length > 0;
            expect(temAguardando, 'Trilha sem aprovação não deve exibir "Aguardando"').to.be.false;
            cy.log('✅ Acesso imediato confirmado — sem "Aguardando aprovação"');
        });

        cy.log('⏸️ PAUSA: Conclua o treinamento e verifique se é possível acessar a trilha após conclusão completa. (15s)');
        cy.wait(15000);
    });
});
