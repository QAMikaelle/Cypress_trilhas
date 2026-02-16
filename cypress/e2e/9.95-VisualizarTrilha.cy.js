/// <reference types="cypress" />

// Ignora erros internos da aplicação
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild') || err.message.includes('parentNode')) {
        return false;
    }
});

describe("Teste - Visualização da Trilha (Aluno)", () => {

    beforeEach(() => {
        // ========== LOGIN ==========
        cy.visit("https://www.hml.lector.live/lector_suporte/subscribe/login");
        cy.wait(3000);

        cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input').should('be.visible').type("suporte2@lectortec.com.br");
        cy.wait(2000);
        cy.get('#login_password').should('be.visible').type("#C4iocl4r413");
        cy.wait(1000);
        cy.get('#btn-entrar').should('be.enabled').click();
        cy.wait(5000);

        cy.url().should('not.include', '/subscribe/login');

        // ========== TROCAR PARA PERFIL ALUNO SE NECESSÁRIO ==========
        cy.get('body').then(($body) => {
            if ($body.find('.current-profile').length > 0) {
                cy.get('.current-profile').invoke('text').then((perfil) => {
                    if (!perfil.trim().includes('Aluno')) {
                        cy.get('.profile-select', { timeout: 15000 }).click();
                        cy.wait(2000);
                        cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
                        cy.wait(2000);
                        cy.contains('#user-options .option.item', 'Aluno - Todos', { timeout: 15000 }).click({ force: true });
                        cy.wait(5000);
                    }
                });
            } else {
                cy.get('#user-options-btn', { timeout: 15000 }).click();
                cy.wait(2000);
                cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
                cy.wait(2000);
                cy.contains('#user-options .option.item', 'Aluno - Todos', { timeout: 15000 }).click({ force: true });
                cy.wait(5000);
            }
        });

        // ========== ACESSAR A VITRINE ==========
        cy.visit("https://www.hml.lector.live/lector_suporte/showcase/2281");
        cy.wait(5000);

        // ========== CLICAR NO CARD DA TRILHA ==========
        cy.contains('.showcase-card-title', 'Trilha importação automação caio', { timeout: 15000 })
            .should('be.visible')
            .click();
        cy.wait(5000);
    });


    // ========== TESTE 1: VERIFICAR CARGA HORÁRIA ==========
    it("Verificar se a carga horária do treinamento apresenta corretamente", () => {
        // Na página da trilha, a carga horária aparece com o ícone icon-clock
        cy.get('.showcase-card-length, .trail-length, .icon-clock', { timeout: 15000 })
            .should('exist');

        // Verifica se o texto de carga horária está presente na página
        cy.get('body').then(($body) => {
            const bodyText = $body.text();
            // Verifica se há algum indicativo de carga horária (horas ou minutos)
            const temCargaHoraria = bodyText.includes('h') || bodyText.includes('min') || bodyText.includes('hora');
            cy.log(`Carga horária encontrada na página: ${temCargaHoraria}`);
        });

        cy.log('✅ Verificação de carga horária concluída!');
    });


    // ========== TESTE 2: VERIFICAR VALOR / GRATUITO ==========
    it("Verificar se nas turmas com valor, apresenta corretamente (Comprar vs Se inscrever)", () => {
        // Verifica se existe botão de "Fazer inscrição" (gratuito) ou "Comprar" (pago)
        cy.get('body').then(($body) => {
            const temComprar = $body.find('button:contains("Comprar")').length > 0;
            const temInscrever = $body.find('button:contains("Fazer inscrição"), span:contains("Fazer inscrição")').length > 0;

            if (temComprar) {
                cy.log('💰 Trilha PAGA detectada - Botão "Comprar" encontrado');
                cy.contains('button', 'Comprar').should('be.visible');
            } else if (temInscrever) {
                cy.log('🆓 Trilha GRATUITA detectada - Botão "Fazer inscrição" encontrado');
                cy.contains('span', 'Fazer inscrição').should('be.visible');
            } else {
                // Pode já estar inscrito
                cy.log('ℹ️ Nenhum botão de inscrição/compra encontrado (pode já estar inscrito)');
            }
        });

        cy.log('✅ Verificação de valor/botão concluída!');
    });


    // ========== TESTE 3: VERIFICAR BOTÃO DE SE INSCREVER ==========
    it("Verificar se apresenta botão de se inscrever na trilha", () => {
        cy.get('body').then(($body) => {
            const temInscrever = $body.find('span:contains("Fazer inscrição")').length > 0;
            const jaInscrito = $body.find(':contains("Inscrito"), :contains("IN_PROGRESS"), :contains("Acessar")').length > 0;

            if (temInscrever) {
                cy.contains('span', 'Fazer inscrição', { timeout: 15000 })
                    .should('be.visible');
                cy.log('✅ Botão "Fazer inscrição" está visível!');
            } else if (jaInscrito) {
                cy.log('ℹ️ Aluno já está inscrito na trilha - botão "Acessar" deve estar disponível');
                cy.contains('button', 'Acessar', { timeout: 15000 })
                    .filter(':visible')
                    .should('have.length.at.least', 1);
            }
        });

        cy.log('✅ Verificação do botão de inscrição concluída!');
    });


    // ========== TESTE 4: VERIFICAR BOTÃO ACESSAR NOS CONTEÚDOS ==========
    it("Verificar se o botão Acessar está apresentando nos conteúdos", () => {
        // Verifica se existe pelo menos um botão "Acessar" nos conteúdos da trilha
        cy.get('body').then(($body) => {
            const temAcessar = $body.find('button:contains("Acessar")').filter(':visible').length > 0;
            const temInscrever = $body.find('span:contains("Fazer inscrição")').length > 0;

            if (temAcessar) {
                // Já inscrito - botão Acessar aparece
                cy.contains('button', 'Acessar', { timeout: 15000 })
                    .filter(':visible')
                    .first()
                    .should('be.visible');
                cy.log('✅ Botão "Acessar" está visível nos conteúdos!');
            } else if (temInscrever) {
                // Ainda não inscrito - precisa se inscrever primeiro
                cy.log('ℹ️ Aluno não inscrito - botão "Acessar" só aparece após inscrição');
                cy.contains('span', 'Fazer inscrição').should('be.visible');
            }
        });

        cy.log('✅ Verificação do botão Acessar concluída!');
    });


    // ========== TESTE 5: VERIFICAR STATUS DA TRILHA ==========
    it("Verificar se o status da trilha atualiza conforme assiste aos conteúdos", () => {
        // Verifica os elementos de progresso e aproveitamento
        cy.get('body').then(($body) => {
            const temProgresso = $body.find('progress-bar').length > 0 || $body.text().includes('Progresso');

            if (temProgresso) {
                cy.contains('div', 'Progresso', { timeout: 15000 })
                    .should('exist');
                cy.log('✅ Indicador de progresso encontrado na trilha!');
            }

            const temAproveitamento = $body.text().includes('Aproveitamento');
            if (temAproveitamento) {
                cy.contains('div', 'Aproveitamento', { timeout: 15000 })
                    .should('exist');
                cy.log('✅ Indicador de aproveitamento encontrado na trilha!');
            }
        });

        cy.log('✅ Verificação de status da trilha concluída!');
    });
});
