/// <reference types="cypress" />

// ============================================================
// SISTEMA DE LOGS E RELATÓRIO DE ERROS
// ============================================================
const testReport = {
    steps: [],
    errors: [],
    startTime: null,
    endTime: null,
};

function logStep(stepName, details = '') {
    const timestamp = new Date().toISOString();
    const msg = `[${timestamp}] ✅ PASSO: ${stepName}${details ? ' | ' + details : ''}`;
    cy.log(`**${msg}**`);
    cy.task('log', msg);
    testReport.steps.push({ step: stepName, details, timestamp, status: 'OK' });
}

function logInfo(info) {
    const timestamp = new Date().toISOString();
    const msg = `[${timestamp}] ℹ️ INFO: ${info}`;
    cy.log(msg);
    cy.task('log', msg);
}

function logWarning(warning) {
    const timestamp = new Date().toISOString();
    const msg = `[${timestamp}] ⚠️ AVISO: ${warning}`;
    cy.log(msg);
    cy.task('log', msg);
}

function logError(stepName, error) {
    const timestamp = new Date().toISOString();
    const msg = `[${timestamp}] ❌ ERRO no passo "${stepName}": ${error}`;
    cy.task('log', msg);
    testReport.errors.push({ step: stepName, error: String(error), timestamp });
    testReport.steps.push({ step: stepName, details: String(error), timestamp, status: 'ERRO' });
}

// Ignora erros internos da aplicação
Cypress.on('uncaught:exception', (err) => {
    const msg = `[UNCAUGHT EXCEPTION] ${err.message}`;
    cy.task('log', msg).then(() => { });
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild') || err.message.includes('parentNode')) {
        return false;
    }
});

describe("Teste - Assistir Trilha (Aluno) [COM LOGS]", () => {

    before(() => {
        testReport.startTime = new Date().toISOString();
        cy.task('log', '');
        cy.task('log', '══════════════════════════════════════════════════');
        cy.task('log', '  INÍCIO DO TESTE: Assistir Trilha Caio');
        cy.task('log', `  Data/Hora: ${testReport.startTime}`);
        cy.task('log', '══════════════════════════════════════════════════');
    });

    afterEach(function () {
        testReport.endTime = new Date().toISOString();

        // ========== RELATÓRIO FINAL ==========
        cy.task('log', '');
        cy.task('log', '══════════════════════════════════════════════════');
        cy.task('log', '  📋 RELATÓRIO FINAL DO TESTE');
        cy.task('log', '══════════════════════════════════════════════════');
        cy.task('log', `  Início: ${testReport.startTime}`);
        cy.task('log', `  Fim:    ${testReport.endTime}`);
        cy.task('log', '');

        // Status do teste
        if (this.currentTest.state === 'failed') {
            cy.task('log', `  🔴 STATUS: FALHOU`);
            cy.task('log', `  Erro: ${this.currentTest.err?.message || 'Erro desconhecido'}`);
            cy.task('log', `  Stack: ${this.currentTest.err?.stack || 'N/A'}`);
        } else {
            cy.task('log', `  🟢 STATUS: PASSOU`);
        }

        cy.task('log', '');
        cy.task('log', '── Passos Executados ──────────────────────────');

        testReport.steps.forEach((s, i) => {
            const icon = s.status === 'OK' ? '✅' : '❌';
            cy.task('log', `  ${i + 1}. ${icon} ${s.step} ${s.details ? '(' + s.details + ')' : ''}`);
        });

        cy.task('log', '');

        if (testReport.errors.length > 0) {
            cy.task('log', '── Erros Encontrados ─────────────────────────');
            testReport.errors.forEach((e, i) => {
                cy.task('log', `  ${i + 1}. ❌ Passo: "${e.step}"`);
                cy.task('log', `     Erro: ${e.error}`);
                cy.task('log', `     Hora: ${e.timestamp}`);
            });
        } else {
            cy.task('log', '  ✅ Nenhum erro encontrado durante a execução.');
        }

        cy.task('log', '');
        cy.task('log', `  Total de passos: ${testReport.steps.length}`);
        cy.task('log', `  Total de erros:  ${testReport.errors.length}`);
        cy.task('log', '══════════════════════════════════════════════════');
    });

    it("Acessar trilha, fazer inscrição e realizar avaliação", () => {

        // ========== PASSO 1: LOGIN ==========
        logStep('LOGIN', 'Acessando página de login');
        cy.visit("https://www.hml.lector.live/lector_suporte/subscribe/login");
        cy.wait(3000);

        logInfo('Preenchendo email');
        cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input')
            .should('be.visible')
            .then(($el) => {
                logInfo(`Campo de email encontrado: tag=${$el.prop('tagName')}, type=${$el.attr('type')}`);
            });
        cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input')
            .type("suporte2@lectortec.com.br");
        cy.wait(2000);

        logInfo('Preenchendo senha');
        cy.get('#login_password').should('be.visible').type("#C4iocl4r413");
        cy.wait(1000);

        logInfo('Clicando no botão Entrar');
        cy.get('#btn-entrar').should('be.enabled').click();
        cy.wait(5000);

        cy.url().then((url) => {
            logStep('LOGIN COMPLETO', `URL atual: ${url}`);
        });
        cy.url().should('not.include', '/subscribe/login');

        // ========== PASSO 2: VERIFICAR PERFIL ==========
        logStep('VERIFICAR PERFIL', 'Verificando perfil e trocando para Aluno se necessário');
        cy.get('.current-profile, #user-options-btn', { timeout: 15000 })
            .should('exist');
        cy.wait(2000);

        cy.get('body').then(($body) => {
            if ($body.find('.current-profile').length > 0) {
                cy.get('.current-profile').invoke('text').then((perfil) => {
                    logInfo(`Perfil atual detectado: "${perfil.trim()}"`);
                    if (!perfil.trim().includes('Aluno')) {
                        logInfo('Perfil não é Aluno, trocando...');
                        cy.get('.profile-select', { timeout: 15000 }).click();
                        cy.wait(2000);
                        cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
                        cy.wait(2000);
                        cy.contains('#user-options .option.item', 'Aluno - Todos', { timeout: 15000 })
                            .click({ force: true });
                        cy.wait(5000);
                        logStep('TROCA DE PERFIL', 'Perfil trocado para Aluno - Todos');
                    } else {
                        logInfo('Já está no perfil Aluno');
                    }
                });
            } else {
                logInfo('Layout showcase detectado - tentando trocar perfil via #user-options-btn');
                cy.get('#user-options-btn', { timeout: 15000 }).click();
                cy.wait(2000);
                cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
                cy.wait(2000);
                cy.contains('#user-options .option.item', 'Aluno - Todos', { timeout: 15000 })
                    .click({ force: true });
                cy.wait(5000);
                logStep('TROCA DE PERFIL', 'Perfil trocado para Aluno - Todos (via showcase)');
            }
        });

        // ========== PASSO 3: ACESSAR A VITRINE ==========
        logStep('ACESSAR VITRINE', 'Navegando para showcase 2281');
        cy.visit("https://www.hml.lector.live/lector_suporte/showcase/2281");
        cy.wait(5000);

        cy.url().then((url) => {
            logInfo(`Vitrine carregada. URL: ${url}`);
        });

        // ========== PASSO 4: CLICAR NO CARD DA TRILHA ==========
        logStep('CLICAR CARD TRILHA', 'Procurando card "Trilha importação automação caio"');
        cy.contains('.showcase-card-title', 'Trilha importação automação caio', { timeout: 15000 })
            .should('be.visible')
            .then(($card) => {
                logInfo(`Card encontrado: texto="${$card.text().trim()}"`);
            });
        cy.contains('.showcase-card-title', 'Trilha importação automação caio', { timeout: 15000 })
            .click();
        cy.wait(5000);

        cy.url().then((url) => {
            logInfo(`Após clicar no card. URL: ${url}`);
        });

        // ========== PASSO 5: FAZER INSCRIÇÃO ==========
        logStep('FAZER INSCRIÇÃO', 'Clicando em "Fazer inscrição"');
        cy.contains('span', 'Fazer inscrição', { timeout: 15000 })
            .should('be.visible')
            .then(($btn) => {
                logInfo(`Botão "Fazer inscrição" encontrado: visível=${$btn.is(':visible')}`);
            });
        cy.contains('span', 'Fazer inscrição', { timeout: 15000 })
            .click();
        cy.wait(5000);
        logInfo('Inscrição realizada');

        // ========== PASSO 6: ACESSAR O TREINAMENTO ==========
        logStep('ACESSAR TREINAMENTO', 'Clicando no botão "Acessar"');
        cy.contains('button', 'Acessar', { timeout: 15000 })
            .filter(':visible')
            .first()
            .then(($btn) => {
                logInfo(`Botão "Acessar" encontrado: texto="${$btn.text().trim()}"`);
            });
        cy.contains('button', 'Acessar', { timeout: 15000 })
            .filter(':visible')
            .first()
            .click();
        cy.wait(5000);

        cy.url().then((url) => {
            logInfo(`Após acessar treinamento. URL: ${url}`);
        });

        // ========== PASSO 7: INICIAR AVALIAÇÃO ==========
        logStep('INICIAR AVALIAÇÃO', 'Procurando botão "Iniciar avaliação" ou "Acessar"');
        cy.contains('button', /Iniciar avaliação|Acessar/, { timeout: 15000 })
            .filter(':visible')
            .first()
            .then(($btn) => {
                logInfo(`Botão encontrado para avaliação: texto="${$btn.text().trim()}"`);
            });
        cy.contains('button', /Iniciar avaliação|Acessar/, { timeout: 15000 })
            .filter(':visible')
            .first()
            .click();
        cy.wait(3000);

        // ========== PASSO 8: RESPONDER QUESTÃO 1 ==========
        logStep('RESPONDER QUESTÃO 1', 'Preenchendo textarea discursiva');
        cy.get('textarea.discursive', { timeout: 15000 })
            .should('be.visible')
            .then(($ta) => {
                logInfo(`Textarea encontrada: id="${$ta.attr('id') || 'N/A'}", placeholder="${$ta.attr('placeholder') || 'N/A'}"`);
            });
        cy.get('textarea.discursive', { timeout: 15000 })
            .clear()
            .type('minha reposta é brasil 2026');
        cy.wait(2000);
        logInfo('Questão 1 respondida');

        // ========== PASSO 9: PRÓXIMA QUESTÃO ==========
        logStep('PRÓXIMA QUESTÃO', 'Clicando em "Próxima questão"');
        cy.contains('.resource-preview-next-prev', 'Próxima questão', { timeout: 15000 })
            .should('be.visible')
            .click();
        cy.wait(3000);
        logInfo('Navegou para próxima questão');

        // ========== PASSO 10: RESPONDER QUESTÃO 2 ==========
        logStep('RESPONDER QUESTÃO 2', 'Preenchendo textarea discursiva');
        cy.get('textarea.discursive', { timeout: 15000 })
            .should('be.visible')
            .clear()
            .type('minha resposta 2');
        cy.wait(2000);
        logInfo('Questão 2 respondida');

        // ========== PASSO 11: ENVIAR RESPOSTAS ==========
        logStep('ENVIAR RESPOSTAS', 'Clicando no botão de envio (#nextResourceArrow)');
        cy.get('#nextResourceArrow', { timeout: 15000 })
            .should('be.visible')
            .then(($btn) => {
                logInfo(`Botão #nextResourceArrow encontrado: texto="${$btn.text().trim()}", classes="${$btn.attr('class')}"`);
            });
        cy.get('#nextResourceArrow', { timeout: 15000 })
            .click();
        cy.wait(3000);

        // ========== PASSO 12: CONFIRMAR ENVIO (MODAL) ==========
        logStep('CONFIRMAR ENVIO', 'Confirmando envio no modal');
        cy.contains('button', 'Enviar', { timeout: 15000 })
            .filter(':visible')
            .first()
            .then(($btn) => {
                logInfo(`Botão "Enviar" do modal encontrado: texto="${$btn.text().trim()}"`);
            });
        cy.contains('button', 'Enviar', { timeout: 15000 })
            .filter(':visible')
            .first()
            .click();
        cy.wait(5000);

        logStep('TESTE FINALIZADO', '🎉 Trilha acessada, inscrição feita e avaliação realizada com sucesso!');
    });
});
