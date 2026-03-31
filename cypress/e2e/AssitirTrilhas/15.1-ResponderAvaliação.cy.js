/// <reference types="cypress" />

// Ignora erros internos da aplicação que não impactam o fluxo do teste
Cypress.on('uncaught:exception', (err) => {
    if (
        err.message.includes('unselectable') ||
        err.message.includes('firstElementChild') ||
        err.message.includes('parentNode') ||
        err.message.includes('getColor') ||
        err.message.includes("reading '0'") ||
        err.message.includes('remove') ||
        err.message.includes('then') ||
        err.message.includes('frameElement') ||
        err.message.includes('Cannot read')
    ) {
        return false;
    }
});


// ==================== DADOS ====================

const LOGIN_URL = 'https://www.hml.lector.live/lector_suporte/subscribe/login';
const TRAIL_STAGES_URL = 'https://www.hml.lector.live/lector_suporte/showcase/2309/m/trails/8449/stages';

const aluno = {
    email: 'suporte2@lectortec.com.br',
    senha: '#C4iocl4r413',
};


// ==================== FUNÇÕES ====================

/**
 * Realiza login na plataforma Lector como aluno
 */
function fazerLogin() {
    cy.visit(LOGIN_URL);
    cy.wait(3000);

    cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input')
        .should('be.visible')
        .type(aluno.email);

    cy.get('#login_password')
        .should('be.visible')
        .type(aluno.senha);

    cy.get('#btn-entrar')
        .should('be.enabled')
        .click();
    cy.wait(5000);

    cy.url().should('not.include', '/subscribe/login');
    cy.log('✅ Login realizado com sucesso!');
}

/**
 * Troca o perfil do usuário para Aluno
 * Suporta o layout padrão (backoffice) e o layout showcase
 */
function trocarParaAluno() {
    cy.log('🔄 Verificando e trocando para perfil Aluno...');

    cy.get('.current-profile, #user-options-btn', { timeout: 15000 }).should('exist');
    cy.wait(2000);

    cy.get('body').then(($body) => {
        if ($body.find('.current-profile').length > 0) {
            cy.get('.current-profile').invoke('text').then((perfil) => {
                if (!perfil.trim().includes('Aluno')) {
                    cy.get('.profile-select', { timeout: 15000 }).click();
                    cy.wait(2000);
                    cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
                    cy.wait(2000);
                    cy.contains('#user-options .option.item', 'Aluno', { timeout: 15000 })
                        .first()
                        .click({ force: true });
                    cy.wait(5000);
                    cy.log('✅ Perfil trocado para Aluno!');
                } else {
                    cy.log('⏭️ Perfil Aluno já está ativo');
                }
            });
        } else {
            cy.get('#user-options-btn', { timeout: 15000 }).click();
            cy.wait(2000);
            cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
            cy.wait(2000);
            cy.contains('#user-options .option.item', 'Aluno', { timeout: 15000 })
                .first()
                .click({ force: true });
            cy.wait(5000);
            cy.log('✅ Perfil Aluno selecionado via showcase!');
        }
    });
}

/**
 * Faz inscrição na trilha caso ainda não esteja inscrito
 * O botão só aparece no DOM quando trail.subscriptionStatus == 'NOT_SUBSCRIBED'
 */
function fazerInscricaoNaTrilha() {
    cy.log('📋 Verificando inscrição na trilha...');

    cy.get('body').then(($body) => {
        // O div com ng-if só aparece no DOM quando NOT_SUBSCRIBED
        const $btnInscricao = $body.find('[ng-if*="NOT_SUBSCRIBED"] button[ng-click="subscribeTrail(class)"]');

        if ($btnInscricao.length > 0) {
            cy.log('🖱️ Botão "Fazer inscrição" encontrado - clicando...');
            cy.get('[ng-if*="NOT_SUBSCRIBED"] button[ng-click="subscribeTrail(class)"]', { timeout: 15000 })
                .should('be.visible')
                .click({ force: true });
            cy.wait(5000);
            cy.log('✅ Inscrição na trilha realizada!');
        } else {
            cy.log('⏭️ Já inscrito na trilha - prosseguindo');
        }
    });
}


function responderTodasQuestoes() {
    cy.log('❓ Respondendo todas as questões dinamicamente...');

    cy.get('[id^="q_"]', { timeout: 15000 }).each(($questao, index) => {
        const numQuestao = index + 1;

        cy.wrap($questao).within(() => {

            // --- TrueFalseQuestion (Verdadeiro ou Falso) ---
            // Deve vir ANTES do radio genérico pois também usa input[type="radio"]
            if ($questao.find('tr.true-false-alternatives').length > 0) {
                cy.log(`❓ Questão ${numQuestao}: Verdadeiro/Falso - marcando "V" em cada alternativa...`);
                cy.get('tr.true-false-alternatives').each(($row) => {
                    // Primeiro radio de cada linha = coluna V (true)
                    cy.wrap($row).find('input[type="radio"]').first().click({ force: true });
                    cy.wait(200);
                });
                cy.log(`✅ Questão ${numQuestao} respondida (verdadeiro/falso)`);

                // --- Radio (SimpleChoice ou ScaleQuestion) ---
            } else if ($questao.find('input[type="radio"]').length > 0) {
                cy.log(`❓ Questão ${numQuestao}: Radio - selecionando última alternativa visível...`);
                cy.get('input[type="radio"]')
                    .last()
                    .click({ force: true });
                cy.log(`✅ Questão ${numQuestao} respondida (radio)`);

                // --- Checkbox (MultiChoiceQuestion) ---
            } else if ($questao.find('input[type="checkbox"]').length > 0) {
                cy.log(`❓ Questão ${numQuestao}: Checkbox - selecionando alternativas disponíveis...`);
                cy.get('input[type="checkbox"]').then(($checks) => {
                    // Seleciona a 1ª e a 2ª (ou só a 1ª se houver apenas uma)
                    cy.wrap($checks).eq(0).click({ force: true });
                    cy.wait(300);
                    if ($checks.length > 1) {
                        cy.wrap($checks).eq(1).click({ force: true });
                    }
                });
                cy.log(`✅ Questão ${numQuestao} respondida (checkbox)`);

                // --- Discursiva (textarea ou input[text]) ---
            } else if ($questao.find('textarea, input[type="text"]').length > 0) {
                cy.log(`❓ Questão ${numQuestao}: Discursiva - digitando resposta...`);
                cy.get('textarea, input[type="text"]')
                    .first()
                    .clear()
                    .type('Resposta automática gerada pelo Cypress.');
                cy.log(`✅ Questão ${numQuestao} respondida (discursiva)`);

                // --- Select / Dropdown ---
            } else if ($questao.find('select').length > 0) {
                cy.log(`❓ Questão ${numQuestao}: Select/Dropdown - selecionando última opção...`);
                cy.get('select').first().then(($select) => {
                    const options = $select.find('option').not('[value=""], [disabled]');
                    if (options.length > 0) {
                        const lastVal = options.last().val();
                        cy.get('select').first().select(lastVal, { force: true });
                    }
                });
                cy.log(`✅ Questão ${numQuestao} respondida (select)`);

                // --- Range / Slider ---
            } else if ($questao.find('input[type="range"]').length > 0) {
                cy.log(`❓ Questão ${numQuestao}: Range/Slider - definindo valor máximo...`);
                cy.get('input[type="range"]').first().then(($slider) => {
                    const max = $slider.attr('max') || '100';
                    cy.get('input[type="range"]').first().invoke('val', max).trigger('input').trigger('change');
                });
                cy.log(`✅ Questão ${numQuestao} respondida (range/slider)`);

                // --- Date / Datetime ---
            } else if ($questao.find('input[type="date"], input[type="datetime-local"]').length > 0) {
                cy.log(`❓ Questão ${numQuestao}: Date - preenchendo com data atual...`);
                const hoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
                cy.get('input[type="date"], input[type="datetime-local"]')
                    .first()
                    .invoke('val', hoje)
                    .trigger('input')
                    .trigger('change');
                cy.log(`✅ Questão ${numQuestao} respondida (date)`);

                // --- Tipo não reconhecido ---
            } else {
                cy.log(`⚠️ Questão ${numQuestao}: tipo não reconhecido - pulando`);
            }
        });

        cy.wait(500);
    });

    cy.log('✅ Todas as questões respondidas!');
}

/**
 * Envia as respostas da avaliação e confirma o modal.
 * Verifica primeiro o botão "Enviar respostas" dentro de div.end
 * (usado em avaliações sem seta de navegação).
 * Se não existir, usa o #nextResourceArrow como fallback.
 */
function enviarRespostas() {
    cy.log('📤 Enviando respostas da avaliação...');

    cy.get('body').then(($body) => {
        // Botão direto "Enviar respostas" dentro de div.end (prioridade)
        const $btnEnviar = $body.find('div.end button.btn-swipe-accent:contains("Enviar respostas"):visible');

        if ($btnEnviar.length > 0) {
            cy.log('🖱️ Botão "Enviar respostas" encontrado em div.end - clicando...');
            cy.get('div.end button.btn-swipe-accent', { timeout: 10000 })
                .contains('Enviar respostas')
                .click({ force: true });
            cy.wait(3000);
        } else {
            // Fallback: seta de navegação (nextResourceArrow)
            cy.log('⏩ Botão "Enviar respostas" não encontrado - usando seta de navegação...');
            cy.get('#nextResourceArrow', { timeout: 15000 })
                .should('be.visible')
                .click({ force: true });
            cy.wait(3000);
        }
    });

    // Confirmar modal de envio (pode aparecer em ambos os fluxos)
    // Nota: cy.contains não é Promise - não use .catch(). Usar body.find() como guarda.
    cy.get('body').then(($body) => {
        if ($body.find('[switch="service.modalSendAnswers"]:visible').length > 0) {
            cy.log('💬 Modal de confirmação detectado - clicando em "Enviar"...');
            cy.get('[switch="service.modalSendAnswers"]', { timeout: 10000 })
                .find('button[type="submit"].btn-swipe-accent')
                .filter(':visible')
                .first()
                .click({ force: true });
            cy.wait(5000);
        } else if ($body.find('button:visible').filter((_, el) => /Enviar/i.test(el.innerText)).length > 0) {
            cy.log('💬 Botão "Enviar" detectado - clicando...');
            cy.wrap(
                $body.find('button:visible').filter((_, el) => /Enviar/i.test(el.innerText)).first()
            ).click({ force: true });
            cy.wait(5000);
        } else {
            cy.log('ℹ️ Modal de confirmação não apareceu');
        }
    });

    cy.log('✅ Respostas enviadas!');
}

/**
 * Clica em "Voltar" para sair da tela de avaliação
 */
function voltarDaAvaliacao() {
    cy.log('↩️ Clicando em "Voltar" para sair da avaliação...');

    cy.get('button[ng-click="closeEvaluation()"]', { timeout: 15000 })
        .scrollIntoView()
        .click({ force: true });
    cy.wait(3000);

    cy.log('✅ Retornou da avaliação com sucesso!');
}

/**
 * Clica em "Finalizar trilha" e confirma o modal de finalização
 */
function finalizarTrilha() {
    cy.log('🏁 Clicando em "Finalizar trilha"...');

    cy.get('button[ng-click="modal.unsub = true"]', { timeout: 15000 })
        .should('be.visible')
        .click({ force: true });
    cy.wait(3000);

    // Confirmar modal de finalização
    cy.get('body').then(($body) => {
        if ($body.find('.modal:visible').length > 0) {
            cy.log('💬 Modal de finalização detectado - confirmando...');
            cy.get('.modal:visible').within(() => {
                cy.contains('button', /Finalizar|Confirmar|Ok/i, { timeout: 10000 })
                    .click({ force: true });
            });
            cy.wait(3000);
            cy.log('✅ Trilha finalizada com sucesso!');
        } else {
            cy.log('⏭️ Modal de finalização não apareceu - prosseguindo');
        }
    });
}



describe("Responder Avaliação - Trilha 8449", () => {

    context("Fluxo: login como aluno, acesso à trilha, responder avaliação e concluir", () => {

        it("Login, acessa a avaliação, responde as questões, envia e conclui", () => {

            // ========== LOGIN ==========
            fazerLogin();

            // ========== TROCAR PARA PERFIL ALUNO ==========
            trocarParaAluno();

            // ========== ACESSAR A TRILHA DIRETAMENTE ==========
            cy.log('🌐 Acessando a página de etapas da trilha...');
            cy.visit(TRAIL_STAGES_URL);
            cy.wait(8000);

            // ========== FAZER INSCRIÇÃO NA TRILHA ==========
            fazerInscricaoNaTrilha();

            // ========== CLICAR EM "RESPONDER AVALIAÇÃO" ==========
            cy.log('📝 Clicando em "Responder avaliação"...');
            cy.contains('button', /Responder avaliação/i, { timeout: 20000 })
                .scrollIntoView()
                .click({ force: true });
            cy.wait(5000);
            cy.log('✅ Página da avaliação carregada!');

            // ========== INICIAR AVALIAÇÃO (condicional) ==========
            cy.log('▶️ Verificando botão "Iniciar avaliação"...');
            cy.get('body').then(($body) => {
                if ($body.find('button:contains("Iniciar avaliação"):visible').length > 0) {
                    cy.contains('button', 'Iniciar avaliação', { timeout: 15000 })
                        .click({ force: true });
                    cy.wait(5000);
                    cy.log('✅ Avaliação iniciada!');
                } else {
                    cy.log('⏭️ Botão "Iniciar avaliação" não encontrado - avaliação já em andamento');
                }
            });

            // ========== RESPONDER QUESTÕES ==========
            responderTodasQuestoes();
            cy.wait(1000);

            // ========== ENVIAR RESPOSTAS ==========
            enviarRespostas();

            // ========== VOLTAR DA AVALIAÇÃO ==========
            voltarDaAvaliacao();

            // ========== FINALIZAR TRILHA ==========
            finalizarTrilha();
        });
    });
});
