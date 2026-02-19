/// <reference types="cypress" />

// Ignora erros internos da aplicação
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild') || err.message.includes('parentNode')) {
        return false;
    }
});

// ==================== DADOS ====================
const TRAIL_URL = 'https://www.hml.lector.live/lector_suporte/showcase/2294/m/trails/8359/stages';
const TRAIL_ADMIN_URL = 'https://www.hml.lector.live/lector_suporte/trails/8359/general';
const LOGIN_URL = 'https://www.hml.lector.live/lector_suporte/subscribe/login';

const alunos = [
    { email: 'caiohml@lectortec.com', senha: '123', nome: 'caiohml' },
    { email: 'caiohml3@teste.com', senha: '123', nome: 'caiohml3' },
    { email: 'teste1911@sharklasers.com', senha: '123', nome: 'teste1911' },
    { email: 'caioveo1@sharklasers.com', senha: '123', nome: 'caioveo1' },
    { email: 'caio222222@sharklasers.com', senha: '123', nome: 'caio222222' },
];

const administrador = {
    email: 'suporte2@lectortec.com.br',
    senha: '#C4iocl4r413',
    perfil: 'Administrador - Todos'
};

// ==================== FUNÇÕES AUXILIARES ====================

/**
 * Realiza login na plataforma Lector
 */
function fazerLogin(email, senha) {
    cy.visit(LOGIN_URL);
    cy.wait(5000);

    // Campo de e-mail
    cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input')
        .should('be.visible')
        .type(email);
    cy.wait(2000);

    // Campo de senha
    cy.get('#login_password')
        .should('be.visible')
        .type(senha);
    cy.wait(2000);

    // Botão entrar
    cy.get('#btn-entrar')
        .should('be.enabled')
        .click();
    cy.wait(8000);

    // Validar que saiu da página de login
    cy.url().should('not.include', '/subscribe/login');
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
                cy.wait(3000);

                cy.contains('div', 'Selecionar perfil', { timeout: 15000 })
                    .should('be.visible')
                    .click();
                cy.wait(3000);

                cy.contains('#user-options .option.item', perfilDesejado, { timeout: 15000 })
                    .click({ force: true });
                cy.wait(8000);

                cy.log(`✅ Perfil trocado para "${perfilDesejado}"`);
            } else {
                cy.log(`⏭️ Perfil "${perfilDesejado}" já está ativo`);
            }
        });
}

/**
 * Garante que o perfil ativo é "Aluno"
 */
function garantirPerfilAluno() {
    cy.get('body').then(($body) => {
        if ($body.find('.current-profile').length > 0) {
            cy.get('.current-profile').invoke('text').then((perfil) => {
                if (!perfil.trim().includes('Aluno')) {
                    cy.get('.profile-select', { timeout: 15000 }).click();
                    cy.wait(3000);
                    cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
                    cy.wait(3000);
                    cy.contains('#user-options .option.item', 'Aluno - Todos', { timeout: 15000 })
                        .click({ force: true });
                    cy.wait(8000);
                }
            });
        } else if ($body.find('#user-options-btn').length > 0) {
            cy.get('#user-options-btn', { timeout: 15000 }).click();
            cy.wait(3000);
            cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
            cy.wait(3000);
            cy.contains('#user-options .option.item', 'Aluno - Todos', { timeout: 15000 })
                .click({ force: true });
            cy.wait(8000);
        }
    });
}

/**
 * Aluno acessa a trilha e clica em "Fazer inscrição"
 */
function alunoSolicitaInscricao(aluno) {
    // Login
    fazerLogin(aluno.email, aluno.senha);

    // Garantir perfil Aluno
    garantirPerfilAluno();

    // Acessar a trilha
    cy.visit(TRAIL_URL);
    cy.wait(8000);

    // Verificar estado e clicar em "Fazer inscrição"
    cy.get('body').then(($body) => {
        const temFazerInscricao = $body.find('span:contains("Fazer inscrição")').length > 0;
        const temAguardando = $body.find(':contains("Aguardando")').filter('button, span').length > 0;
        const temFinalizar = $body.find('span:contains("Finalizar")').length > 0;

        if (temFazerInscricao) {
            cy.contains('span', 'Fazer inscrição', { timeout: 15000 })
                .should('be.visible')
                .click();
            cy.wait(8000);

            // Validação: botão deve mudar para "Aguardando Aprovação"
            cy.contains('Aguardando', { timeout: 15000 })
                .should('be.visible');

            cy.log(`✅ Aluno ${aluno.email} - Inscrição solicitada! Status: Aguardando Aprovação`);
        } else if (temAguardando) {
            cy.log(`⏭️ Aluno ${aluno.email} - Já está aguardando aprovação`);
        } else if (temFinalizar) {
            cy.log(`⏭️ Aluno ${aluno.email} - Já está aprovado (Finalizar Trilha visível)`);
        }
    });
}

/**
 * Administrador faz login, troca perfil, acessa a trilha via Gerenciar e toma ação (Aprovar/Recusar)
 */
function adminProcessaSolicitacoes(acao) {
    // Login do Administrador
    fazerLogin(administrador.email, administrador.senha);

    // Trocar para perfil Administrador
    trocarPerfil(administrador.perfil);
    cy.wait(5000);

    // Acessar a página da trilha como admin
    cy.visit(TRAIL_ADMIN_URL);
    cy.wait(8000);

    // Clicar no botão "Gerenciar"
    cy.contains('span', 'Gerenciar', { timeout: 15000 })
        .should('be.visible')
        .click();
    cy.wait(5000);

    // Clicar na aba "Solicitações de matrícula" dentro do modal
    cy.get('a[ng-click="selectManageSubscriptionsTab(\'subscriptionRequests\');"]', { timeout: 15000 })
        .should('be.visible')
        .click();
    cy.wait(5000);

    // Para cada aluno, buscar e selecionar na tabela dentro do modal
    alunos.forEach((aluno) => {
        cy.wait(3000);

        cy.get('body').then(($body) => {
            const alunoNaTabela = $body.find(`td:contains("${aluno.email}")`).length > 0;

            if (alunoNaTabela) {
                cy.contains('td', aluno.email)
                    .parent('tr')
                    .find('td.select-checkbox')
                    .click();
                cy.wait(2000);

                cy.log(`☑️ Aluno ${aluno.email} selecionado para ${acao} (Admin)`);
            } else {
                cy.log(`⚠️ Aluno ${aluno.email} não encontrado na tabela (Admin)`);
            }
        });
    });

    // Clicar no botão de ação (Aprovar ou Recusar) dentro do modal de gerenciamento
    if (acao === 'Aprovar') {
        cy.get('button[ng-click="modal.approveBatchSubscriptions = true"]', { timeout: 15000 })
            .should('be.visible')
            .click();
    } else {
        cy.get('button[ng-click="modal.declineBatchSubscriptions = true"]', { timeout: 15000 })
            .should('be.visible')
            .click();
    }
    cy.wait(5000);

    // Confirmar ação no modal de confirmação
    // O modal do Admin usa batchProcessSubscriptionsRequests(true) para Aprovar e (false) para Recusar
    const ngClickConfirm = acao === 'Aprovar'
        ? 'batchProcessSubscriptionsRequests(true)'
        : 'batchProcessSubscriptionsRequests(false)';
    cy.get(`button[ng-click="${ngClickConfirm}"]`, { timeout: 15000 })
        .filter(':visible')
        .first()
        .click({ force: true });
    cy.wait(8000);

    cy.log(`✅ Administrador executou ação "${acao}" para todos os alunos!`);
}

/**
 * Aluno valida que a aprovação foi realizada (botão "Finalizar Trilha")
 */
function alunoValidaAprovacao(aluno) {
    // Login do aluno
    fazerLogin(aluno.email, aluno.senha);

    // Garantir perfil Aluno
    garantirPerfilAluno();

    // Acessar a trilha
    cy.visit(TRAIL_URL);
    cy.wait(8000);

    // Validação: botão "Finalizar Trilha" deve estar visível
    cy.contains('Finalizar', { timeout: 20000 })
        .should('be.visible');

    cy.log(`✅ Aluno ${aluno.email} - Aprovação confirmada! Botão "Finalizar Trilha" visível.`);

    // Clicar em "Finalizar trilha" para liberar o aluno para próximas rodadas
    cy.contains('span', 'Finalizar trilha', { timeout: 15000 })
        .filter(':visible')
        .first()
        .click({ force: true });
    cy.wait(5000);

    // Confirmar no modal: "Você tem certeza que deseja finalizar a trilha?"
    cy.contains('button[type="submit"]', 'Finalizar trilha', { timeout: 15000 })
        .filter(':visible')
        .first()
        .click({ force: true });
    cy.wait(8000);

    cy.log(`✅ Aluno ${aluno.email} - Trilha finalizada com sucesso!`);
}


// ==================== TESTES ====================

describe("Teste - Solicitação de Matrícula com Aprovação do Administrador", () => {

    // ============================================================
    // PARTE 1: Alunos solicitam inscrição (1ª vez)
    // ============================================================
    context("1ª Rodada - Alunos solicitam inscrição na trilha", () => {

        alunos.forEach((aluno, index) => {
            it(`Aluno ${index + 1} (${aluno.email}) solicita inscrição na trilha`, () => {
                alunoSolicitaInscricao(aluno);
            });
        });
    });


    // ============================================================
    // PARTE 2: Administrador RECUSA todas as solicitações
    // ============================================================
    context("1ª Rodada - Administrador RECUSA as solicitações", () => {

        it("Administrador faz login, troca perfil e RECUSA todos os alunos", () => {
            adminProcessaSolicitacoes('Recusar');
        });
    });


    // ============================================================
    // PARTE 3: Alunos solicitam inscrição novamente (2ª vez)
    // ============================================================
    context("2ª Rodada - Alunos solicitam inscrição novamente", () => {

        alunos.forEach((aluno, index) => {
            it(`Aluno ${index + 1} (${aluno.email}) solicita inscrição novamente`, () => {
                alunoSolicitaInscricao(aluno);
            });
        });
    });


    // ============================================================
    // PARTE 4: Administrador APROVA todas as solicitações
    // ============================================================
    context("2ª Rodada - Administrador APROVA as solicitações", () => {

        it("Administrador faz login, troca perfil e APROVA todos os alunos", () => {
            adminProcessaSolicitacoes('Aprovar');
        });
    });


    // ============================================================
    // PARTE 5: Alunos validam acesso final (Finalizar Trilha)
    // ============================================================
    context("Validação Final - Alunos verificam aprovação do Administrador", () => {

        alunos.forEach((aluno, index) => {
            it(`Aluno ${index + 1} (${aluno.email}) valida aprovação do Administrador`, () => {
                alunoValidaAprovacao(aluno);
            });
        });
    });

});
