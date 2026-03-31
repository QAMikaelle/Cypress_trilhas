/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild') || err.message.includes('parentNode')) {
        return false;
    }
});

// ==================== DADOS ====================
const LOGIN_URL = 'https://www.hml.lector.live/esmp/subscribe/login';

// URLs das trilhas (as mesmas das notas originais)
const TRILHA_GRATUITA_SEM_APROVACAO = 'https://www.hml.lector.live/esmp/showcase/2279/m/trails/8211/stages';
const TRILHA_GRATUITA_COM_GESTOR = 'https://www.hml.lector.live/esmp/showcase/2279/m/trails/8212/stages';
const TRILHA_GRATUITA_COM_GESTOR_GENERAL = 'https://www.hml.lector.live/esmp/trails/8212/general';
const TRILHA_COM_CAMPOS = 'https://www.hml.lector.live/esmp/showcase/2279/m/trails/8221/stages';
const TRILHA_COM_CAMPOS_E_GESTOR = 'https://www.hml.lector.live/esmp/showcase/2279/m/trails/8224/stages';
const TRILHA_COM_CAMPOS_E_GESTOR_GENERAL = 'https://www.hml.lector.live/esmp/trails/8224/general';

const aluno = { email: 'suporte2@lectortec.com.br', senha: '#C4iocl4r413' };
const perfilAluno = 'Aluno - Todos';
const perfilAdmin = 'Administrador - Todos';

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

/**
 * Garante que o aluno pode se inscrever:
 * - Se estiver "Finalizar", finaliza a trilha primeiro para liberar o botão de inscrição
 * - Depois clica em "Fazer inscrição"
 */
function clicaFazerInscricao(urlTrilha) {
    cy.visit(urlTrilha);
    cy.wait(8000);
    cy.get('body').then(($body) => {
        if ($body.find('span:contains("Finalizar")').length > 0) {
            cy.log('Trilha já concluída. Finalizando para liberar inscrição...');
            cy.contains('span', 'Finalizar trilha', { timeout: 15000 }).first().click({ force: true });
            cy.wait(5000);
            cy.contains('button[type="submit"]', 'Finalizar trilha', { timeout: 15000 }).first().click({ force: true });
            cy.wait(8000);
            cy.reload();
            cy.wait(8000);
        }
        cy.get('body').then(($b2) => {
            if ($b2.find('span:contains("Fazer inscrição")').length > 0) {
                cy.contains('span', 'Fazer inscrição', { timeout: 15000 }).first().click({ force: true });
                cy.wait(5000);
            }
        });
    });
}

/**
 * Admin abre o modal Gerenciar da trilha e aprova/recusa a solicitação do aluno
 */
function gerenciarSolicitacao(generalUrl, alunoEmail, acao) {
    cy.visit(generalUrl);
    cy.wait(8000);
    cy.contains('span', 'Gerenciar', { timeout: 15000 }).should('be.visible').click();
    cy.wait(5000);
    cy.get('a[ng-click="selectManageSubscriptionsTab(\'subscriptionRequests\');"]', { timeout: 15000 }).should('be.visible').click();
    cy.wait(5000);

    cy.get('body').then(($body) => {
        if ($body.find(`td:contains("${alunoEmail}")`).length > 0) {
            cy.contains('td', alunoEmail).parent('tr').find('td.select-checkbox').click();
            cy.wait(2000);
            if (acao === 'aprovar') {
                cy.get('button[ng-click="modal.approveBatchSubscriptions = true"]', { timeout: 15000 }).should('be.visible').click();
                cy.wait(2000);
                cy.get('button[ng-click="batchProcessSubscriptionsRequests(true)"]', { timeout: 15000 }).filter(':visible').first().click({ force: true });
            } else {
                cy.get('button[ng-click="modal.declineBatchSubscriptions = true"]', { timeout: 15000 }).should('be.visible').click();
                cy.wait(2000);
                cy.get('button[ng-click="batchProcessSubscriptionsRequests(false)"]', { timeout: 15000 }).filter(':visible').first().click({ force: true });
            }
            cy.wait(8000);
        } else {
            cy.log(`⚠️ Aluno ${alunoEmail} não encontrado na tabela de solicitações.`);
        }
    });
}

// ==================== TESTES ====================

describe("Teste de Fluxos de Emails - Trilhas Gratuitas", () => {

    beforeEach(() => {
        fazerLogin(aluno.email, aluno.senha);
    });

    // ----------------------------------------------------------------
    // CENÁRIO 1: Trilha gratuita SEM aprovação
    // ----------------------------------------------------------------
    it("Cenário 1: Trilha gratuita sem aprovação (8211)", () => {
        trocarPerfil(perfilAluno);
        clicaFazerInscricao(TRILHA_GRATUITA_SEM_APROVACAO);

        // A inscrição é direta - valida que não ficou "Aguardando"
        cy.get('body').then(($body) => {
            const temAguardando = $body.find(':contains("Aguardando")').filter('button, span').length > 0;
            expect(temAguardando, 'Não deve haver botão de Aguardando em trilha sem aprovação').to.be.false;
        });

        cy.log('✅ Verifique na caixa de email: 1 email de matrícula efetivada. Confira remetente, assunto, links e tags. Ir em Relatório de Envio e validar que o email aparece.');
        cy.wait(15000);
    });

    // ----------------------------------------------------------------
    // CENÁRIO 2: Trilha gratuita COM aprovação de gestor - APROVA
    // ----------------------------------------------------------------
    it("Cenário 2: Trilha gratuita com gestor – APROVAÇÃO (8212)", () => {
        // -- ALUNO: Faz inscrição --
        trocarPerfil(perfilAluno);
        clicaFazerInscricao(TRILHA_GRATUITA_COM_GESTOR);

        // Valida status "Aguardando"
        cy.contains('Aguardando', { timeout: 15000 }).should('be.visible');
        cy.log('✅ Verifique email de solicitação enviado para o gestor. (15s)');
        cy.wait(15000);

        // -- ADMIN: Aprova --
        trocarPerfil(perfilAdmin);
        gerenciarSolicitacao(TRILHA_GRATUITA_COM_GESTOR_GENERAL, aluno.email, 'aprovar');

        cy.log('✅ Verifique na caixa de email: e-mail de aprovação + matrícula efetivada (ALUNO = 3 e GESTOR = 1). Ir em Relatório de Envio e validar.');
        cy.wait(15000);

        // -- ALUNO: Valida acesso liberado --
        trocarPerfil(perfilAluno);
        cy.visit(TRILHA_GRATUITA_COM_GESTOR);
        cy.wait(5000);
        cy.get('body').then(($body) => {
            const temAguardando = $body.find(':contains("Aguardando")').filter('button, span').length > 0;
            expect(temAguardando, 'Acesso deve estar liberado após aprovação').to.be.false;
        });
    });

    // ----------------------------------------------------------------
    // CENÁRIO 3: Trilha gratuita COM aprovação de gestor – RECUSA 2x, APROVA na 3ª
    // ----------------------------------------------------------------
    it.only("Cenário 3: Trilha gratuita com gestor – RECUSA 2x + APROVA (8212)", () => {
        for (let rodada = 1; rodada <= 3; rodada++) {
            // -- ALUNO solicita --
            trocarPerfil(perfilAluno);
            clicaFazerInscricao(TRILHA_GRATUITA_COM_GESTOR);
            cy.contains('Aguardando', { timeout: 15000 }).should('be.visible');

            cy.log(`Rodada ${rodada}: Aguardando aprovação. Verifique email pro gestor. (15s)`);
            cy.wait(15000);

            trocarPerfil(perfilAdmin);

            if (rodada < 3) {
                // RECUSA
                gerenciarSolicitacao(TRILHA_GRATUITA_COM_GESTOR_GENERAL, aluno.email, 'recusar');
                cy.log(`Rodada ${rodada}: RECUSADO. Verifique email de recusa e motivo no email do aluno. (15s)`);
                cy.wait(15000);

                // Valida que botão voltou a ficar disponível (aluno consegue se inscrever de novo)
                trocarPerfil(perfilAluno);
                cy.visit(TRILHA_GRATUITA_COM_GESTOR);
                cy.wait(5000);
                cy.contains('Fazer inscrição', { timeout: 10000 }).should('be.visible');
            } else {
                // APROVA na última rodada
                gerenciarSolicitacao(TRILHA_GRATUITA_COM_GESTOR_GENERAL, aluno.email, 'aprovar');
                cy.log('Rodada 3: APROVADO. Verifique email de aprovação + matrícula efetivada. (15s)');
                cy.wait(15000);

                trocarPerfil(perfilAluno);
                cy.visit(TRILHA_GRATUITA_COM_GESTOR);
                cy.wait(5000);
                cy.get('body').then(($body) => {
                    const temAguardando = $body.find(':contains("Aguardando")').filter('button, span').length > 0;
                    expect(temAguardando).to.be.false;
                });
            }
        }
    });

    // ----------------------------------------------------------------
    // CENÁRIO 4: Trilha gratuita COM campos personalizados – APROVA
    // ----------------------------------------------------------------
    it("Cenário 4: Trilha com campos personalizados – APROVAÇÃO (8221)", () => {
        // -- ALUNO: Faz inscrição (modal de campos aparece) --
        trocarPerfil(perfilAluno);
        clicaFazerInscricao(TRILHA_COM_CAMPOS);

        cy.log('⏸️ PAUSA: Preencha os campos personalizados no modal de inscrição. (15s)');
        cy.wait(15000);

        cy.log('✅ Verifique email de análise de cadastro enviado para o aluno. (15s)');
        cy.wait(15000);

        // -- ADMIN: Aprova os campos --
        trocarPerfil(perfilAdmin);
        cy.log('⏸️ PAUSA: Analise e APROVE os campos personalizados como Administrador. (15s)');
        cy.wait(15000);

        cy.log('✅ Verifique email de aprovação + matrícula efetivada na caixa do aluno. Cheque Relatório de Envio. (15s)');
        cy.wait(15000);

        // -- ALUNO: Acessa treinamento pelo link recebido --
        trocarPerfil(perfilAluno);
        cy.visit(TRILHA_COM_CAMPOS);
        cy.wait(5000);
        cy.get('body').then(($body) => {
            const temAguardando = $body.find(':contains("Aguardando")').filter('button, span').length > 0;
            expect(temAguardando, 'Acesso deve estar liberado').to.be.false;
        });
    });

    // ----------------------------------------------------------------
    // CENÁRIO 5: Trilha gratuita COM campos personalizados – RECUSA 2x, APROVA na 3ª
    // ----------------------------------------------------------------
    it("Cenário 5: Trilha com campos personalizados – RECUSA 2x + APROVA (8221)", () => {
        for (let rodada = 1; rodada <= 3; rodada++) {
            trocarPerfil(perfilAluno);
            clicaFazerInscricao(TRILHA_COM_CAMPOS);

            cy.log(`Rodada ${rodada}: ⏸️ Preencha os campos no modal. (15s)`);
            cy.wait(15000);

            cy.log(`Rodada ${rodada}: ✅ Verifique email de análise pendente. (15s)`);
            cy.wait(15000);

            trocarPerfil(perfilAdmin);
            if (rodada < 3) {
                cy.log(`Rodada ${rodada}: ⏸️ REPROVE os campos como Administrador. (15s)`);
                cy.wait(15000);
                cy.log(`Rodada ${rodada}: ✅ Verifique email de reprovação enviado ao aluno. (15s)`);
                cy.wait(15000);
            } else {
                cy.log(`Rodada 3 (ÚLTIMA): ⏸️ APROVE os campos como Administrador. (15s)`);
                cy.wait(15000);
                cy.log('Rodada 3: ✅ Verifique email de matrícula efetivada e acesso ao treinamento. (15s)');
                cy.wait(15000);

                trocarPerfil(perfilAluno);
                cy.visit(TRILHA_COM_CAMPOS);
                cy.wait(5000);
                cy.get('body').then(($body) => {
                    const temAguardando = $body.find(':contains("Aguardando")').filter('button, span').length > 0;
                    expect(temAguardando).to.be.false;
                });
            }
        }
    });

    // ----------------------------------------------------------------
    // CENÁRIO 6: Trilha gratuita com Gestor + Campos – APROVA campos E APROVA gestor
    // ----------------------------------------------------------------
    it("Cenário 6: Trilha com gestor + campos – APROVAÇÃO em ambos (8224)", () => {
        // -- ALUNO --
        trocarPerfil(perfilAluno);
        clicaFazerInscricao(TRILHA_COM_CAMPOS_E_GESTOR);

        cy.log('⏸️ PAUSA: Preencha os campos personalizados no modal. (15s)');
        cy.wait(15000);

        cy.log('✅ Verifique email de análise de cadastro. (15s)');
        cy.wait(15000);

        // -- ADMIN: Aprova campos e a solicitação de matrícula --
        trocarPerfil(perfilAdmin);
        cy.log('⏸️ PAUSA: APROVE os campos personalizados. (15s)');
        cy.wait(15000);

        cy.log('✅ Verifique email de aprovação de campos enviado ao aluno. (15s)');
        cy.wait(15000);

        // Agora verifica e aprova a solicitação de matrícula que ficou pendente para o gestor
        gerenciarSolicitacao(TRILHA_COM_CAMPOS_E_GESTOR_GENERAL, aluno.email, 'aprovar');

        cy.log('✅ Verifique emails de aprovação do gestor + matrícula efetivada (ALUNO = 5, GESTOR = 1). Valide Relatório. (15s)');
        cy.wait(15000);

        // -- ALUNO: Valida acesso --
        trocarPerfil(perfilAluno);
        cy.visit(TRILHA_COM_CAMPOS_E_GESTOR);
        cy.wait(5000);
        cy.get('body').then(($body) => {
            const temAguardando = $body.find(':contains("Aguardando")').filter('button, span').length > 0;
            expect(temAguardando, 'Acesso deve estar liberado').to.be.false;
        });
    });

    // ----------------------------------------------------------------
    // CENÁRIO 7: Trilha com Gestor + Campos – RECUSA campos 2x, depois GESTOR RECUSA 2x, APROVA na última
    // ----------------------------------------------------------------
    it("Cenário 7: Trilha com gestor + campos – RECUSA 2x + APROVA (8224)", () => {
        // --- Parte A: Recusar campos 2x e aprovar na 3ª ---
        for (let rodada = 1; rodada <= 3; rodada++) {
            trocarPerfil(perfilAluno);
            clicaFazerInscricao(TRILHA_COM_CAMPOS_E_GESTOR);

            cy.log(`Rodada ${rodada}: ⏸️ Preencha os campos personalizados. (15s)`);
            cy.wait(15000);

            cy.log(`Rodada ${rodada}: ✅ Verifique email de análise pendente. (15s)`);
            cy.wait(15000);

            trocarPerfil(perfilAdmin);

            if (rodada < 3) {
                cy.log(`Rodada ${rodada}: ⏸️ RECUSE os campos como Administrador. (15s)`);
                cy.wait(15000);
                cy.log(`Rodada ${rodada}: ✅ Verifique email de recusa enviado ao aluno. (15s)`);
                cy.wait(15000);
            } else {
                cy.log('Rodada 3: ⏸️ APROVE os campos como Administrador. (15s)');
                cy.wait(15000);
                cy.log('Rodada 3: ✅ Verifique email de aprovação de campos. (15s)');
                cy.wait(15000);
            }
        }

        // --- Parte B: Gestor Recusa e depois Aprova ---
        for (let rodadaGestor = 1; rodadaGestor <= 2; rodadaGestor++) {
            trocarPerfil(perfilAdmin);
            gerenciarSolicitacao(TRILHA_COM_CAMPOS_E_GESTOR_GENERAL, aluno.email, 'recusar');

            cy.log(`Gestor Rodada ${rodadaGestor}: ✅ Verifique email de recusa do gestor ao aluno. (15s)`);
            cy.wait(15000);

            // Aluno re-envia
            trocarPerfil(perfilAluno);
            cy.visit(TRILHA_COM_CAMPOS_E_GESTOR);
            cy.wait(5000);
            cy.log(`Gestor Rodada ${rodadaGestor}: ⏸️ Aluno re-submete a inscrição. (15s)`);
            cy.wait(15000);
        }

        // Gestor aprova na última
        trocarPerfil(perfilAdmin);
        gerenciarSolicitacao(TRILHA_COM_CAMPOS_E_GESTOR_GENERAL, aluno.email, 'aprovar');

        cy.log('✅ Verifique emails de aprovação + matrícula efetivada. Valide Relatório de Envio. (15s)');
        cy.wait(15000);

        trocarPerfil(perfilAluno);
        cy.visit(TRILHA_COM_CAMPOS_E_GESTOR);
        cy.wait(5000);
        cy.get('body').then(($body) => {
            const temAguardando = $body.find(':contains("Aguardando")').filter('button, span').length > 0;
            expect(temAguardando, 'Acesso deve estar liberado').to.be.false;
        });
    });

});
