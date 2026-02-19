/// <reference types="cypress" />

// Ignora erros internos da aplicação
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild') || err.message.includes('parentNode')) {
        return false;
    }
});

// ==================== DADOS ====================
const LOGIN_URL = 'https://www.hml.lector.live/lector_suporte/subscribe/login';
const TRAIL_NAME = 'Trilha automação 19/02 caio';
const TRAIL_DESCRIPTION = 'aqui temos uma descrição da automação';
const TRAINING_NAME = 'AVALIACAO COM CORREÇÃO';
const EVALUATION_NAME = '16.12.24 Avaliação teste';
const DOCUMENT_NAME = '/06.4 - Módulo Facebook e Instagram Ads';
const MIN_GRADE = '75';
const FUNCTION_NAME = 'Função 2';
const COVER_IMAGE = 'cypress/fixtures/Capa.jpg';

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
    cy.wait(5000);

    cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input')
        .should('be.visible')
        .type(admin.email);
    cy.wait(2000);

    cy.get('#login_password')
        .should('be.visible')
        .type(admin.senha);
    cy.wait(2000);

    cy.get('#btn-entrar')
        .should('be.enabled')
        .click();
    cy.wait(8000);

    cy.url().should('not.include', '/subscribe/login');
    cy.log('✅ Login realizado com sucesso!');
}

/**
 * Upload de imagem de capa com cropper
 */
function uploadCapa(aspect, imageFile) {
    cy.get(`label.thumb-placeholder[aspect="${aspect}"] input[type="file"]`)
        .selectFile(imageFile, { force: true });
    cy.wait(6000); // Aguarda o cropper carregar
    cy.get('button[ng-click="cropper.save()"]', { timeout: 15000 })
        .should('be.visible')
        .click();
    cy.wait(3000);
    cy.log(`✅ Capa "${aspect}" enviada com sucesso!`);
}

/**
 * Navega para Trilhas, pesquisa a trilha pelo nome e abre para edição
 */
function navegarParaTrilha() {
    // Navegar para Trilhas
    cy.get('[title="Trilhas"] > .sideitem', { timeout: 15000 })
        .should('be.visible')
        .click();
    cy.wait(3000);

    // Pesquisar a trilha pelo nome
    cy.get('input[ng-model="searchQuery"]', { timeout: 15000 })
        .should('be.visible')
        .clear()
        .type(TRAIL_NAME);
    cy.wait(3000);

    // Clicar no botão de editar da trilha encontrada
    cy.contains('.list-group-item, tr, .card', TRAIL_NAME, { timeout: 15000 })
        .should('be.visible')
        .find('.icon-edit')
        .first()
        .parents('button, span, a, div')
        .first()
        .click({ force: true });
    cy.wait(5000);

    cy.log('✅ Trilha encontrada e aberta para edição!');
}

/**
 * Cria uma turma com as configurações especificadas
 */
function criarTurma(nome, { gratuita = false, aprovacaoGestor = false, preco = null } = {}) {
    // Botão nova turma
    cy.get('[ng-click="editClass()"]', { timeout: 15000 })
        .should('be.visible')
        .click();
    cy.wait(5000);

    // Nome da turma
    cy.get('#className', { timeout: 15000 })
        .should('be.visible')
        .clear()
        .type(nome, { delay: 30 });
    cy.wait(1000);

    // Turma gratuita - o checkbox começa desmarcado (pago por padrão)
    // Se for gratuita, clicamos para marcar
    if (gratuita) {
        cy.get('.class-price > :nth-child(1) > .icon-checkbox').click();
        cy.wait(1000);
    }

    // Se tiver preço (turma paga), preencher o valor
    if (preco && !gratuita) {
        cy.get('#currentClassPrice', { timeout: 10000 })
            .should('be.visible')
            .clear()
            .type(preco);
        cy.wait(1000);
    }

    // Aprovação do gestor - por padrão vem desmarcada
    // Se quiser ativar, clicamos
    if (aprovacaoGestor) {
        cy.get('.column > :nth-child(1) > .icon-checkbox').click();
        cy.wait(1000);
    }

    // Salvar turma
    cy.get('.editing-class > :nth-child(1) > .content-box-footer > .btn-swipe-accent')
        .should('be.visible')
        .click();
    cy.wait(5000);

    cy.log(`✅ Turma "${nome}" criada com sucesso!`);
}


// ==================== TESTES ====================

describe("Teste - Criar Trilha Sem Versionamento", () => {

    // ============================================================
    // PARTE 1: Login
    // ============================================================
    context("Parte 1 - Login na plataforma", () => {

        it("Faz login como administrador", () => {
            fazerLogin();
        });
    });


    // ============================================================
    // PARTE 2: Criar trilha - aba Geral (nome, idioma, aproveitamento, funções, descrição)
    // ============================================================
    context("Parte 2 - Configurar dados gerais da trilha", () => {

        it("Cria nova trilha e preenche informações gerais", () => {
            fazerLogin();

            // Navegar para Trilhas
            cy.get('[title="Trilhas"] > .sideitem', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // Botão criar trilha
            cy.get('.title-bar > .btn-icon', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // ---- Selecionar idioma (Português) ----
            cy.get('button[ng-click="popup = !popup"]', { timeout: 15000 })
                .first()
                .click({ force: true });
            cy.wait(1000);

            // Clicar no botão com a bandeira pt_BR
            cy.get('button[ng-click="selectLanguage(language);"]')
                .find('img[ng-src="/img/pt_BR.gif"]')
                .first()
                .parent()
                .parent()
                .click({ force: true });
            cy.wait(2000);

            cy.log('✅ Idioma Português selecionado!');

            // ---- Nome da trilha ----
            cy.get('input[ng-model="object.model[language.key]"][placeholder="Informe o nome"]', { timeout: 60000 })
                .filter(':visible')
                .first()
                .should('not.be.disabled')
                .scrollIntoView()
                .focus()
                .clear({ force: true })
                .type(TRAIL_NAME, { delay: 30, force: true })
                .should('have.value', TRAIL_NAME);
            cy.wait(2000);

            cy.log('✅ Nome da trilha preenchido!');

            // ---- Aproveitamento mínimo (75%) ----
            cy.get('input[type="number"][ng-model="currentTrail.minimumGradeToApprove"]', { timeout: 15000 })
                .scrollIntoView()
                .clear()
                .type(MIN_GRADE);
            cy.wait(1000);

            cy.log('✅ Aproveitamento mínimo definido para 75%!');

            // ---- Funções de treinamento ----
            cy.get('input.ui-select-search[placeholder="Escolha uma função de treinamento"]', { timeout: 15000 })
                .scrollIntoView()
                .should('be.visible')
                .click()
                .type(FUNCTION_NAME);
            cy.wait(3000);

            // Selecionar a função no dropdown
            cy.contains('.ui-select-choices-row', FUNCTION_NAME, { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(2000);

            cy.log('✅ Função de treinamento adicionada!');

            // ---- Descrição (CKEditor) ----
            // O CKEditor usa um iframe, precisamos acessar o body dentro dele
            cy.get('.cke_wysiwyg_frame', { timeout: 15000 })
                .filter(':visible')
                .first()
                .its('0.contentDocument.body')
                .should('not.be.empty')
                .then(body => {
                    cy.wrap(body)
                        .clear()
                        .type(TRAIL_DESCRIPTION);
                });
            cy.wait(2000);

            cy.log('✅ Descrição da trilha preenchida!');

            // ---- Salvar trilha ----
            cy.contains('button', 'Salvar', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // Modal de versionamento - salvar sem versionamento
            cy.get('[ng-show="modal.useVersioning"] > .modal', { timeout: 15000 })
                .should('be.visible')
                .within(() => {
                    cy.get(':nth-child(3) > .checkbox > .icon-checkbox')
                        .click();
                    cy.wait(1000);
                    cy.get('.end > .ml-10')
                        .click();
                });
            cy.wait(8000);

            cy.log('✅ Trilha salva com sucesso!');
        });
    });


    // ============================================================
    // PARTE 3: Upload de capas
    // ============================================================
    context("Parte 3 - Upload de capas (Tradicional, Capa, Banner)", () => {

        it("Faz upload das 3 capas usando a mesma imagem", () => {
            fazerLogin();
            navegarParaTrilha();

            // Tradicional (square)
            uploadCapa('square', COVER_IMAGE);

            // Capa (cover)
            uploadCapa('cover', COVER_IMAGE);

            // Banner
            uploadCapa('banner', COVER_IMAGE);

            cy.log('✅ Todas as capas foram enviadas!');
        });
    });


    // ============================================================
    // PARTE 4: Criar etapa e adicionar 3 conteúdos
    // ============================================================
    context("Parte 4 - Criar etapa e adicionar conteúdos (Treinamento, Avaliação, Documento)", () => {

        it("Acessa aba Etapas, cria nova etapa e adiciona 3 conteúdos", () => {
            fazerLogin();
            navegarParaTrilha();

            // Clicar na aba Etapas
            cy.get('[ui-sref="accessLink.content.trails.edit.id.version.stages"]', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // Botão "Nova etapa"
            cy.get('button[ng-click="createStage()"]', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            cy.log('✅ Nova etapa criada!');

            // ========== CONTEÚDO 1: TREINAMENTO ==========
            // Botão "Novo conteúdo" dentro da etapa
            cy.get('[colspan="5"] > .btn-swipe-accent', { timeout: 15000 })
                .filter(':visible')
                .first()
                .click();
            cy.wait(3000);

            // Selecionar tipo "Treinamento" no dropdown (1º item)
            cy.get('.pv-5 > .w-100', { timeout: 15000 })
                .filter(':visible')
                .first()
                .click();
            cy.wait(1000);
            cy.get('.open > .ui-select-choices > :nth-child(1)', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // Buscar o treinamento pelo nome
            cy.get('[model="currentContent.course"] > .multiselect > .border > .ui-select-match > .btn-default', { timeout: 15000 })
                .should('be.visible')
                .type(TRAINING_NAME);
            cy.wait(5000);

            // Selecionar o treinamento no dropdown de resultados
            cy.contains('.ui-select-choices-row', TRAINING_NAME, { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // Salvar conteúdo
            cy.get('.start > .btn-swipe-accent', { timeout: 15000 })
                .filter(':visible')
                .first()
                .click();
            cy.wait(5000);

            cy.log('✅ Conteúdo 1: Treinamento "AVALIACAO COM CORREÇÃO" adicionado!');

            // ========== CONTEÚDO 2: AVALIAÇÃO ==========
            // Botão "Novo conteúdo"
            cy.get('[colspan="5"] > .btn-swipe-accent', { timeout: 15000 })
                .filter(':visible')
                .first()
                .click();
            cy.wait(3000);

            // Selecionar tipo "Avaliação" no dropdown (2º item)
            cy.get('.pv-5 > .w-100', { timeout: 15000 })
                .filter(':visible')
                .first()
                .click();
            cy.wait(1000);
            cy.get('.open > .ui-select-choices > :nth-child(2)', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // Buscar a avaliação pelo nome
            cy.get('[model="currentContent.evaluation"] > .multiselect > .border > .ui-select-match > .btn-default', { timeout: 15000 })
                .should('be.visible')
                .type(EVALUATION_NAME);
            cy.wait(5000);

            // Selecionar a avaliação no dropdown de resultados
            cy.contains('.ui-select-choices-row', EVALUATION_NAME, { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // Salvar conteúdo
            cy.get('.start > .btn-swipe-accent', { timeout: 15000 })
                .filter(':visible')
                .first()
                .click();
            cy.wait(5000);

            cy.log('✅ Conteúdo 2: Avaliação "16.12.24 Avaliação teste" adicionado!');

            // ========== CONTEÚDO 3: DOCUMENTO ==========
            // Botão "Novo conteúdo"
            cy.get('[colspan="5"] > .btn-swipe-accent', { timeout: 15000 })
                .filter(':visible')
                .first()
                .click();
            cy.wait(3000);

            // Selecionar tipo "Documento" no dropdown (3º item)
            cy.get('.pv-5 > .w-100', { timeout: 15000 })
                .filter(':visible')
                .first()
                .click();
            cy.wait(1000);
            cy.get('.open > .ui-select-choices > :nth-child(3)', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // Buscar o documento pelo nome
            cy.get('[model="currentContent.document"] > .multiselect > .border > .ui-select-search', { timeout: 15000 })
                .should('be.visible')
                .type(DOCUMENT_NAME);
            cy.wait(5000);

            // Selecionar o documento no dropdown de resultados
            cy.contains('.ui-select-choices-row', DOCUMENT_NAME, { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // Salvar conteúdo
            cy.get('.start > .btn-swipe-accent', { timeout: 15000 })
                .filter(':visible')
                .first()
                .click();
            cy.wait(5000);

            cy.log('✅ Conteúdo 3: Documento "/06.4 - Módulo Facebook e Instagram Ads" adicionado!');
            cy.log('✅ Todos os 3 conteúdos adicionados com sucesso!');
        });
    });


    // ============================================================
    // PARTE 5: Criar turmas
    // ============================================================
    context("Parte 5 - Criar 3 turmas", () => {

        it("Cria turma Gratuita, turma Paga e turma Gratuita com Aprovação", () => {
            fazerLogin();
            navegarParaTrilha();

            // Clicar na aba Turmas
            cy.get('[ui-sref="accessLink.content.trails.edit.id.classes"]', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // ---- TURMA 1: Gratuita ----
            criarTurma('Gratuita', { gratuita: true });

            // ---- TURMA 2: Paga ----
            criarTurma('Paga', { gratuita: false, preco: '100' });

            // ---- TURMA 3: Gratuita com Aprovação ----
            criarTurma('Gratuita com aprovação', { gratuita: true, aprovacaoGestor: true });

            cy.log('✅ Todas as 3 turmas criadas com sucesso!');
        });
    });


    // ============================================================
    // PARTE 6: Salvar trilha (sem versionamento)
    // ============================================================
    context("Parte 6 - Salvar trilha sem versionamento", () => {

        it("Salva a trilha e confirma sem versionamento", () => {
            fazerLogin();
            navegarParaTrilha();

            // Clicar botão Salvar
            cy.contains('button', 'Salvar', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // Modal de versionamento - clicar SEM selecionar versão
            // Marcar checkbox "Sem versionamento" e confirmar
            cy.get('[ng-show="modal.useVersioning"] > .modal', { timeout: 15000 })
                .should('be.visible')
                .within(() => {
                    // Clicar no checkbox de sem versionamento
                    cy.get(':nth-child(3) > .checkbox > .icon-checkbox')
                        .click();
                    cy.wait(1000);

                    // Clicar no botão de salvar/confirmar
                    cy.get('.end > .ml-10')
                        .click();
                });
            cy.wait(8000);

            cy.log('✅ Trilha salva com sucesso! (Sem versionamento)');
        });
    });

});
