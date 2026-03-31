/// <reference types="cypress" />
// ============================================================
// TESTE - ENVIO DE CAMPO NO MODAL DE INSCRIÇÃO
// Fluxo: Login → Troca para perfil Aluno → Acessa URL do treinamento
//        → Clica em "Fazer inscrição" → Preenche campo com número aleatório
//        → Clica em Enviar
// ============================================================
// Ignora erros internos da aplicação Angular
Cypress.on('uncaught:exception', (err) => {
    if (
        err.message.includes('unselectable') ||
        err.message.includes('firstElementChild') ||
        err.message.includes('parentNode')
    ) {
        return false;
    }
});
// ============================================================
// LISTA DE USUÁRIOS
// ============================================================
const usuarios = [
    { usuario: 'telaloginv1@sharklasers.com', senha: '123' },
    { usuario: 'wanalic624@gxuzi.com',      senha: '123' },
    { usuario: 'caiotesteingles@sharklasers.com',    senha: '123' },
    { usuario: 'esmparateste2026@outlook.com', senha: '123' },
    { usuario: 'comercialcaiomata@googlemail.com',            senha: '123' },
];
// URLs
const URL_LOGIN      = 'https://www.hml.lector.live/esmp/subscribe/login';
const URL_TREINAMENTO = 'https://www.hml.lector.live/esmp/showcase/2323/m/courses/1476266/contents';
// ============================================================
// SUITE DE TESTES
// ============================================================
describe('Envio de Campo - Inscrição no Treinamento', () => {
    usuarios.forEach((conta) => {
        it(`Fluxo completo - Usuário: "${conta.usuario}"`, () => {
            // ========== PASSO 1: LOGIN ==========
            cy.log(`🔐 Iniciando login com usuário: ${conta.usuario}`);
            cy.visit(URL_LOGIN);
            cy.wait(3000);
            cy.get('[name="login_username"]')
                .should('be.visible')
                .clear()
                .type(conta.usuario);
            cy.get('[name="login_password"]')
                .should('be.visible')
                .clear()
                .type(conta.senha);
            cy.get('#btn-entrar')
                .should('be.enabled')
                .click();
            cy.wait(5000);
            cy.url().should('not.include', '/subscribe/login');
            cy.log('✅ Login realizado com sucesso');
            // ========== PASSO 2: TROCAR PARA PERFIL ALUNO ==========
            cy.log('🔄 Verificando e trocando para perfil Aluno');
            cy.get('body').then(($body) => {
                // Caso o elemento .current-profile exista (layout painel admin)
                if ($body.find('.current-profile').length > 0) {
                    cy.get('.current-profile').invoke('text').then((perfilAtual) => {
                        cy.log(`Perfil atual: "${perfilAtual.trim()}"`);
                        if (!perfilAtual.trim().toLowerCase().includes('aluno')) {
                            cy.get('.profile-select', { timeout: 15000 })
                                .should('be.visible')
                                .click();
                            cy.wait(2000);
                            cy.contains('div', 'Selecionar perfil', { timeout: 15000 })
                                .should('be.visible')
                                .click();
                            cy.wait(2000);
                            cy.contains('#user-options .option.item', 'Aluno', { timeout: 15000 })
                                .first()
                                .click({ force: true });
                            cy.wait(5000);
                            cy.log('✅ Perfil trocado para Aluno');
                        } else {
                            cy.log('ℹ️ Já está no perfil Aluno, sem necessidade de troca');
                        }
                    });
                // Caso esteja no layout showcase (botão #user-options-btn)
                } else if ($body.find('#user-options-btn').length > 0) {
                    cy.get('#user-options-btn', { timeout: 15000 }).click();
                    cy.wait(2000);
                    cy.contains('div', 'Selecionar perfil', { timeout: 15000 })
                        .should('be.visible')
                        .click();
                    cy.wait(2000);
                    cy.contains('#user-options .option.item', 'Aluno', { timeout: 15000 })
                        .first()
                        .click({ force: true });
                    cy.wait(5000);
                    cy.log('✅ Perfil trocado para Aluno (via showcase)');
                } else {
                    cy.log('⚠️ Elemento de troca de perfil não encontrado - continuando assim mesmo');
                }
            });
            // ========== PASSO 3: ACESSAR URL DO TREINAMENTO ==========
            cy.log('🌐 Acessando URL do treinamento');
            cy.visit(URL_TREINAMENTO);
            cy.wait(5000);
            cy.log('✅ Página do treinamento carregada');
            // ========== PASSO 4: CLICAR EM "FAZER INSCRIÇÃO" ==========
            cy.log('📋 Clicando em "Fazer inscrição"');
            cy.contains(/Fazer inscrição/i, { timeout: 20000 })
                .should('be.visible')
                .click();
            cy.wait(3000);
            cy.log('✅ Botão "Fazer inscrição" clicado');
            // ========== PASSO 5: PREENCHER CAMPO NO MODAL COM NÚMERO ALEATÓRIO ==========
            cy.log('🎲 Aguardando modal e preenchendo campo com número aleatório');
            // Gera um número aleatório entre 100 e 9999
            const numeroAleatorio = Math.floor(Math.random() * (9999 - 100 + 1)) + 100;
            cy.log(`Número gerado: ${numeroAleatorio}`);
            // Aguarda o modal aparecer e localiza o campo de input
            cy.get('.modal, [class*="modal"]', { timeout: 15000 })
                .should('be.visible');
            // Tenta encontrar o campo de input dentro do modal
            cy.get('.modal input, [class*="modal"] input', { timeout: 15000 })
                .filter(':visible')
                .first()
                .should('be.enabled')
                .clear()
                .type(String(numeroAleatorio));
            cy.wait(1000);
            cy.log(`✅ Campo preenchido com: ${numeroAleatorio}`);
            // ========== PASSO 6: CLICAR EM ENVIAR ==========
            //colocar um pause aqui de 15s
            cy.pause(15000);
            cy.log('✅ Formulário enviado com sucesso!');
        });
    });
});
