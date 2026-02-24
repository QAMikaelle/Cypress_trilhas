/// <reference types="cypress" />

// Ignora erros internos da aplicação
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild') || err.message.includes('parentNode') || err.message.includes('getColor') || err.message.includes("reading '0'") || err.message.includes('remove') || err.message.includes('then') || err.message.includes('frameElement')) {
        return false;
    }
});

// ==================== DADOS ====================
const RANDOM_ID = Math.floor(1000 + Math.random() * 9000); // 4 dígitos aleatórios
const LOGIN_URL = 'https://www.hml.lector.live/lector_suporte/subscribe/login';
const TRAIL_NAME = `Trilha automação caio ${RANDOM_ID}`;
const CATEGORY_NAME = 'Cypress Caio';
const TRAIL_DESCRIPTION = 'aqui temos uma descrição da automação';
const TRAINING_NAME = 'AVALIACAO COM CORREÇÃO';
const EVALUATION_NAME = '16.12.24 Avaliação teste';
const DOCUMENT_NAME = '06.4 - Módulo Facebook e Instagram Ads';
const MIN_GRADE = '75';
const FUNCTION_NAME = 'Função 2';
const COVER_IMAGES = [
    'cypress/fixtures/Capa.jpg',
    'cypress/fixtures/capa 2.jpg',
    'cypress/fixtures/capa 3.png',
    'cypress/fixtures/capa 4.jpg'

];
const IMPORT_TRAIL_NAME = 'trilha com video';
const CERTIFICATE_NAME = 'Certificado em duas páginas - Trilha #CODIGO_VALIDACAO#';

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

/**
 * Upload de imagem de capa com cropper
 */
function uploadCapa(aspect, imageFile) {
    cy.get(`label.thumb-placeholder[aspect="${aspect}"] input[type="file"]`)
        .selectFile(imageFile, { force: true });
    cy.wait(4000); // Aguarda o cropper carregar
    cy.get('button[ng-click="cropper.save()"]', { timeout: 15000 })
        .should('be.visible')
        .click();
    cy.wait(2000);
    cy.log(`✅ Capa "${aspect}" enviada com sucesso!`);
}

/**
 * Navega para Trilhas, pesquisa a trilha pelo nome e abre para edição
 */
function navegarParaTrilha() {
    // Navegar para Trilhas
    cy.get('[title="Trilhas"] > .sideitem', { timeout: 15000 })
        .click({ force: true });
    cy.wait(2000);

    // Pesquisar a trilha pelo nome
    cy.get('input[placeholder="Pesquisar trilhas"]', { timeout: 15000 })
        .should('be.visible')
        .clear()
        .type(TRAIL_NAME);
    cy.get('button[ng-click="filterText()"]').click();
    cy.wait(3000);

    // Clicar no card da trilha encontrada using robust regex
    cy.contains('.card-title', new RegExp(TRAIL_NAME, 'i'), { timeout: 15000 })
        .should('be.visible')
        .click();
    cy.wait(3000);

    // Clicar no botão de editar da trilha
    cy.get('button[ng-click="editTrail(trail)"]', { timeout: 15000 })
        .should('be.visible')
        .click();
    cy.wait(5000); // Aumentado para garantir carregamento total do editor

    cy.log('✅ Trilha encontrada e aberta para edição!');
}

/**
 * Cria uma turma com as configurações especificadas
 */
function criarTurma(nome, { gratuita = false, aprovacaoGestor = false, preco = null } = {}) {
    // Botão nova turma
    cy.get('[ng-click="editClass()"]', { timeout: 15000 })
        .scrollIntoView()
        .click({ force: true });
    cy.wait(3000);

    // Nome da turma
    cy.get('input[placeholder="Informe um nome para a turma"]', { timeout: 15000 })
        .first()
        .scrollIntoView()
        .clear({ force: true })
        .type(nome, { delay: 30, force: true });

    // Turma gratuita
    if (gratuita) {
        cy.get('input[ng-model="currentClass.free"]', { timeout: 10000 })
            .parent('label.checkbox')
            .find('.icon-checkbox')
            .click();
    }

    // Se tiver preço (turma paga), preencher o valor
    if (preco && !gratuita) {
        cy.get('#currentClassPrice', { timeout: 10000 })
            .scrollIntoView()
            .clear({ force: true })
            .type(preco, { force: true });
    }

    // Aprovação do gestor
    if (aprovacaoGestor) {
        cy.get('input[ng-model="currentClass.requireApproval"]', { timeout: 10000 })
            .parent('label.checkbox')
            .find('.icon-checkbox')
            .click();
    }

    // Salvar turma
    cy.get('button[ng-click="saveClass()"]', { timeout: 15000 })
        .scrollIntoView()
        .click({ force: true });
    cy.wait(3000);

    cy.log(`✅ Turma "${nome}" criada com sucesso!`);
}


// ==================== TESTES ====================

describe("Teste - Criar Trilha Sem Versionamento", () => {

    // ============================================================
    // PARTE 1: Criar trilha + Info gerais + Importar etapa + Salvar
    // ============================================================
    context("Parte 1 - Criar trilha, informações gerais e importar etapa", () => {

        it("Cria nova trilha, preenche dados gerais, importa etapa e salva", () => {
            fazerLogin();

            // Navegar para Trilhas
            cy.get('[title="Trilhas"] > .sideitem', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(2000);

            // Botão criar trilha
            cy.get('.title-bar > .btn-icon', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // ---- Nome da trilha ----
            cy.get('input[ng-model="object.model[language.key]"][placeholder="Informe o nome"]', { timeout: 60000 })
                .first()
                .scrollIntoView()
                .clear({ force: true })
                .type(TRAIL_NAME, { delay: 30, force: true })
                .should('have.value', TRAIL_NAME);

            cy.log('✅ Nome da trilha preenchido!');

            // ---- Aproveitamento mínimo (75%) ----
            cy.get('input[type="number"][ng-model="currentTrail.minimumGradeToApprove"]', { timeout: 15000 })
                .scrollIntoView()
                .clear()
                .type(MIN_GRADE);

            cy.log('✅ Aproveitamento mínimo definido para 75%!');

            // ---- Funções de treinamento ----
            cy.get('input.ui-select-search[placeholder="Escolha uma função de treinamento"]', { timeout: 15000 })
                .scrollIntoView()
                .should('be.visible')
                .click()
                .type(FUNCTION_NAME);
            cy.wait(2000);

            cy.contains('.ui-select-choices-row', FUNCTION_NAME, { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(1000);

            cy.log('✅ Função de treinamento adicionada!');

            // ---- Descrição (CKEditor) ----
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

            cy.log('✅ Descrição da trilha preenchida!');

            // ---- Ir para aba Etapas e importar etapa ----
            cy.get('[ui-sref="accessLink.content.trails.edit.id.version.stages"]', { timeout: 15000 })
                .scrollIntoView()
                .click({ force: true });
            cy.wait(2000);

            // Clicar em "Importar etapa"
            cy.get('.pt-20 > .flex > .btn-swipe-main', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(2000);

            // Buscar a trilha para importar
            cy.get('.modal-body > .ng-isolate-scope > .multiselect > .border > .ui-select-match > .btn-default', { timeout: 15000 })
                .should('be.visible')
                .type(IMPORT_TRAIL_NAME);
            cy.wait(3000);

            // Selecionar a trilha no dropdown
            cy.contains('.ui-select-choices-row', IMPORT_TRAIL_NAME, { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(1000);

            // Confirmar importação
            cy.get('ui-view.ng-scope > .modal-overlay > .modal > .end > .btn-swipe-accent', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            cy.log('✅ Etapa importada com sucesso!');

            // ---- Salvar trilha ----
            cy.get('button[ng-click="setKeepEditingAfterSave(false)"]', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            // Modal de versionamento - marcar "Entendi" e clicar "Não usar versionamento"
            cy.get('input[ng-model="useVersionConfirm"]', { timeout: 15000 })
                .parent('.checkbox')
                .find('.icon-checkbox')
                .click();
            cy.wait(1000);

            cy.get('button[ng-click="saveTrail(false)"]', { timeout: 15000 })
                .should('not.be.disabled')
                .click();
            cy.wait(5000);

            cy.log('✅ Trilha criada e salva com sucesso! (Sem versionamento)');
        });
    });


    // ============================================================
    // PARTE 2: Edições da trilha (capas, conteúdos, certificado, turmas)
    // Login uma vez só e alterna entre navegar → editar → salvar
    // ============================================================
    context("Parte 2 - Editar trilha (capas, conteúdos, certificado, turmas)", () => {

        it("Faz login, adiciona capas, conteúdos, certificado e turmas", () => {
            fazerLogin();

            // ==========================================
            // 2.1 - Upload de capas
            // ==========================================
            navegarParaTrilha();

            // Tradicional (square)
            uploadCapa('square', COVER_IMAGES[Math.floor(Math.random() * COVER_IMAGES.length)]);

            // Capa (cover)
            uploadCapa('cover', COVER_IMAGES[Math.floor(Math.random() * COVER_IMAGES.length)]);

            // Banner
            uploadCapa('banner', COVER_IMAGES[Math.floor(Math.random() * COVER_IMAGES.length)]);

            cy.log('✅ Todas as capas foram enviadas!');

            // Salvar trilha
            cy.get('button[ng-click="setKeepEditingAfterSave(false)"]', { timeout: 15000 })
                .scrollIntoView()
                .click({ force: true });
            cy.wait(3000);

            cy.log('✅ Capas salvas!');

            // ==========================================
            // 2.2 - Adicionar conteúdos à etapa
            // ==========================================
            navegarParaTrilha();

            // Clicar na aba Etapas
            cy.get('[ui-sref="accessLink.content.trails.edit.id.version.stages"]', { timeout: 15000 })
                .scrollIntoView()
                .click({ force: true });
            cy.wait(2000);

            // ========== CONTEÚDO 1: TREINAMENTO ==========
            cy.get('[colspan="5"] > .btn-swipe-accent', { timeout: 15000 })
                .filter(':visible')
                .first()
                .click();
            cy.wait(2000);

            // Selecionar tipo "Treinamento" (1º item)
            cy.get('.pv-5 > .w-100', { timeout: 15000 })
                .filter(':visible')
                .first()
                .click();
            cy.wait(1000);
            cy.get('.open > .ui-select-choices > :nth-child(1)', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(2000);

            // Buscar o treinamento pelo nome
            cy.get('[model="currentContent.course"] > .multiselect > .border > .ui-select-match > .btn-default', { timeout: 15000 })
                .should('be.visible')
                .type(TRAINING_NAME);
            cy.wait(3000);

            // Selecionar o treinamento no dropdown
            cy.contains('.ui-select-choices-row', TRAINING_NAME, { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(2000);

            // Adicionar conteúdo
            cy.get('button[ng-click="saveContent(currentContent)"]', { timeout: 15000 })
                .scrollIntoView()
                .should('be.visible')
                .click();
            cy.wait(3000);

            cy.log('✅ Conteúdo 1: Treinamento adicionado!');

            // ========== CONTEÚDO 2: AVALIAÇÃO ==========
            cy.get('[colspan="5"] > .btn-swipe-accent', { timeout: 15000 })
                .filter(':visible')
                .first()
                .click();
            cy.wait(2000);

            // Selecionar tipo "Avaliação" (2º item)
            cy.get('.pv-5 > .w-100', { timeout: 15000 })
                .filter(':visible')
                .first()
                .click();
            cy.wait(1000);
            cy.get('.open > .ui-select-choices > :nth-child(2)', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(2000);

            // Buscar a avaliação pelo nome
            cy.get('[model="currentContent.evaluation"] > .multiselect > .border > .ui-select-match > .btn-default', { timeout: 15000 })
                .should('be.visible')
                .type(EVALUATION_NAME);
            cy.wait(3000);

            // Selecionar a avaliação no dropdown
            cy.contains('.ui-select-choices-row', EVALUATION_NAME, { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(2000);

            // Adicionar conteúdo
            cy.get('button[ng-click="saveContent(currentContent)"]', { timeout: 15000 })
                .scrollIntoView()
                .should('be.visible')
                .click();
            cy.wait(3000);

            cy.log('✅ Conteúdo 2: Avaliação adicionada!');

            // ========== CONTEÚDO 3: DOCUMENTO ==========
            cy.get('[colspan="5"] > .btn-swipe-accent', { timeout: 17000 })
                .filter(':visible')
                .first()
                .click();
            cy.wait(2000);

            // Selecionar tipo "Documento" (3º item)
            cy.get('.pv-5 > .w-100', { timeout: 15000 })
                .filter(':visible')
                .first()
                .click();
            cy.wait(1000);
            cy.get('.open > .ui-select-choices > :nth-child(3)', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(2000);

            // Buscar o documento pelo nome
            cy.get('[model="currentContent.document"] > .multiselect > .border > .ui-select-match > .btn-default', { timeout: 15000 })
                .should('be.visible')
                .type(DOCUMENT_NAME);
            cy.wait(3000);

            // Selecionar o documento no dropdown
            cy.contains('.ui-select-choices-row', DOCUMENT_NAME, { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(2000);

            // Adicionar conteúdo
            cy.get('button[ng-click="saveContent(currentContent)"]', { timeout: 15000 })
                .scrollIntoView()
                .should('be.visible')
                .click();
            cy.wait(3000);

            cy.log('✅ Conteúdo 3: Documento adicionado!');
            cy.log('✅ Todos os 3 conteúdos adicionados!');

            // Salvar trilha
            cy.get('button[ng-click="setKeepEditingAfterSave(false)"]', { timeout: 15000 })
                .scrollIntoView()
                .click({ force: true });
            cy.wait(3000);

            cy.log('✅ Conteúdos salvos!');

            // ==========================================
            // 2.3 - Adicionar certificado
            // ==========================================
            navegarParaTrilha();

            // Clicar na aba Certificado
            cy.get('[ui-sref="accessLink.content.trails.edit.id.version.certificate"]', { timeout: 15000 })
                .scrollIntoView()
                .click({ force: true });
            cy.wait(2000);

            // Clicar em "Escolher certificado"
            cy.get('button[ng-click="editTrailCertificate()"]', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(2000);

            // Abrir o dropdown de certificados
            cy.get('[name="TrailCertificateSelect"] .ui-select-toggle', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(1000);

            // Buscar o certificado pelo nome
            cy.get('[name="TrailCertificateSelect"] input[placeholder="Escolha um certificado"]', { timeout: 15000 })
                .should('be.visible')
                .type(CERTIFICATE_NAME);
            cy.wait(5000);

            // Selecionar o certificado no dropdown
            cy.get('.ui-select-highlight', { timeout: 15000 })
                .first()
                .should('be.visible')
                .click();
            cy.wait(2000);

            // Salvar a trilha
            cy.get('button[ng-click="setKeepEditingAfterSave(false)"]', { timeout: 15000 })
                .scrollIntoView()
                .click({ force: true });
            cy.wait(3000);

            cy.log('✅ Certificado adicionado e salvo!');

            // ==========================================
            // 2.4 - Criar turma Gratuita
            // ==========================================
            navegarParaTrilha();

            // Clicar na aba Turmas
            cy.get('[ui-sref="accessLink.content.trails.edit.id.version.classes"]', { timeout: 15000 })
                .scrollIntoView()
                .click({ force: true });
            cy.wait(3000);

            criarTurma('Gratuita', { gratuita: true });

            // Salvar trilha
            cy.get('button[ng-click="setKeepEditingAfterSave(false)"]', { timeout: 15000 })
                .scrollIntoView()
                .click({ force: true });
            cy.wait(3000);

            cy.log('✅ Turma Gratuita criada e salva!');

            // ==========================================
            // 2.5 - Criar turma Paga
            // ==========================================
            navegarParaTrilha();

            // Clicar na aba Turmas
            cy.get('[ui-sref="accessLink.content.trails.edit.id.version.classes"]', { timeout: 15000 })
                .scrollIntoView()
                .click({ force: true });
            cy.wait(3000);

            criarTurma('Paga', { gratuita: false, preco: '10' });

            // Salvar trilha
            cy.get('button[ng-click="setKeepEditingAfterSave(false)"]', { timeout: 15000 })
                .scrollIntoView()
                .click({ force: true });
            cy.wait(3000);

            cy.log('✅ Turma Paga criada e salva!');

            // ==========================================
            // 2.6 - Criar turma Gratuita com Aprovação
            // ==========================================
            navegarParaTrilha();

            // Clicar na aba Turmas
            cy.get('[ui-sref="accessLink.content.trails.edit.id.version.classes"]', { timeout: 15000 })
                .scrollIntoView()
                .click({ force: true });
            cy.wait(3000);

            criarTurma('Gratuita com aprovação', { gratuita: true, aprovacaoGestor: true });


            // Salvar trilha
            cy.get('button[ng-click="setKeepEditingAfterSave(false)"]', { timeout: 15000 })
                .scrollIntoView()
                .click({ force: true });
            cy.wait(3000);

            // 2.7 - Vincular Categoria
            navegarParaTrilha();

            cy.log(`🔍 Procurando categoria: ${CATEGORY_NAME}`);

            cy.get('body').then(($body) => {
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
                else if ($body.find('.tree-container').length > 0) {
                    cy.contains('.tree-item', CATEGORY_NAME, { timeout: 15000 })
                        .find('.icon-checkbox')
                        .scrollIntoView()
                        .click({ force: true });
                }
                else {
                    cy.contains('label', /Categoria/i).parent().within(() => {
                        cy.get('input, .ui-select-container').click({ force: true });
                        cy.wait(1000);
                        cy.contains('.ui-select-choices-row', CATEGORY_NAME).click({ force: true });
                    });
                }
            });
            cy.wait(2000);

            // Salvar após vincular categoria
            cy.get('button[ng-click="setKeepEditingAfterSave(false)"]', { timeout: 15000 })
                .contains('Salvar')
                .click({ force: true });

            // Se aparecer modal de versionamento
            cy.get('body').then(($body) => {
                if ($body.find('[switch="modal.versioning"]').length > 0) {
                    cy.get('input[ng-model="useVersionConfirm"]').click({ force: true });
                    cy.get('button[ng-click="saveTrail(false)"]').click();
                }
            });

            cy.wait(5000);
            cy.log('✅ Categoria vinculada com sucesso!');

            cy.log('✅ Turma Gratuita com Aprovação criada e salva!');

            // ==========================================
            // 2.7 - Verificação final: buscar e abrir a trilha
            // ==========================================
            cy.get('[title="Trilhas"] > .sideitem', { timeout: 15000 })
                .click({ force: true });
            cy.wait(3000);

            cy.get('input[placeholder="Pesquisar trilhas"]', { timeout: 15000 })
                .should('be.visible')
                .clear()
                .type(TRAIL_NAME);
            cy.get('button[ng-click="filterText()"]').click();
            cy.wait(5000);

            cy.contains(TRAIL_NAME, { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(3000);

            cy.log('✅ Trilha finalizada com sucesso! Teste completo!');
        });
    });

});
