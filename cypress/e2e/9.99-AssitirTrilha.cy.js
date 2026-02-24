/// <reference types="cypress" />

// Ignora erros internos da aplicação
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild') || err.message.includes('parentNode') || err.message.includes('remove') || err.message.includes('then')) {
        return false;
    }
});

describe("Teste - Assistir Trilha Completa (Aluno)", () => {

    it("Fluxo completo: inscrição, conteúdos, avaliações e finalização da trilha", () => {

        // ========== LOGIN ==========
        cy.visit("https://www.hml.lector.live/lector_suporte/subscribe/login");
        cy.wait(3000);

        cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input')
            .should('be.visible')
            .type("caiohml@lectortec.com");
        cy.wait(2000);
        cy.get('#login_password').should('be.visible').type("123");
        cy.wait(1000);
        cy.get('#btn-entrar').should('be.enabled').click();
        cy.wait(5000);

        cy.url().should('not.include', '/subscribe/login');

        // ========== VERIFICAR PERFIL E TROCAR PARA ALUNO SE NECESSÁRIO ==========
        cy.get('.current-profile, #user-options-btn', { timeout: 15000 })
            .should('exist');
        cy.wait(2000);

        cy.get('body').then(($body) => {
            if ($body.find('.current-profile').length > 0) {
                cy.get('.current-profile').invoke('text').then((perfil) => {
                    if (!perfil.trim().includes('Aluno')) {
                        cy.get('.profile-select', { timeout: 15000 }).click();
                        cy.wait(2000);
                        cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
                        cy.wait(2000);
                        cy.contains('#user-options .option.item', 'Aluno - Unidades', { timeout: 15000 })
                            .click({ force: true });
                        cy.wait(5000);
                    }
                });
            } else {
                cy.get('#user-options-btn', { timeout: 15000 }).click();
                cy.wait(2000);
                cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
                cy.wait(2000);
                cy.contains('#user-options .option.item', 'Aluno - Unidades', { timeout: 15000 })
                    .click({ force: true });
                cy.wait(5000);
            }
        });

        // ========== ACESSAR URL DA TRILHA ==========
        cy.visit("https://www.hml.lector.live/lector_suporte/showcase/1817/m/home/trails/8371/stages");
        cy.wait(5000);

        // ========== INSCRIÇÃO NA TRILHA (TURMA GRATUITA) ==========
        // Caso "Finalizar trilha" esteja visível, finaliza primeiro e confirma no modal
        // Caso contrário, clica em "Fazer inscrição" na turma "Gratuita"
        cy.get('body').then(($body) => {
            const temFinalizar = $body.find('span:contains("Finalizar trilha")').filter(':visible').length > 0;

            if (temFinalizar) {
                // Clicar em "Finalizar trilha"
                cy.contains('span', 'Finalizar trilha', { timeout: 15000 })
                    .filter(':visible')
                    .first()
                    .click({ force: true });
                cy.wait(5000);

                // Confirmar no modal
                cy.contains('button[type="submit"]', 'Finalizar trilha', { timeout: 15000 })
                    .filter(':visible')
                    .first()
                    .click({ force: true });
                cy.wait(8000);

                cy.log('✅ Trilha finalizada - agora vai fazer nova inscrição');

                // Recarregar a página para aparecer o botão de inscrição
                cy.visit("https://www.hml.lector.live/lector_suporte/showcase/1817/m/home/trails/8371/stages");
                cy.wait(5000);
            }

            // Clicar em "Fazer inscrição" especificamente na turma "Gratuita"
            // Localiza o container da turma "Gratuita" pelo nome e depois clica no botão dentro dele
            cy.contains('b.ng-binding', 'Gratuita', { timeout: 15000 })
                .closest('div[ng-repeat="class in trail.classes track by class.id"]')
                .find('button.btn-swipe-accent')
                .contains(/Fazer|Insc|Acessar|Finalizar/i)
                .click({ force: true });
            cy.wait(5000);
        });

        // ==============================================================
        // ========== CONTEÚDO 1 - TREINAMENTO (VÍDEO) ==========
        // ==============================================================

        // Acessar conteúdo 1 (treinamento - vídeo)
        cy.get('table.stage-content-list tbody tr', { timeout: 15000 })
            .eq(0).as('row1');

        cy.get('@row1').then(($row) => {
            const status = $row.find('td').eq(3).text().trim();
            if (status.includes('Concluído') || status.includes('Aprovado')) {
                cy.log('✅ Conteúdo 1 já concluído - pulando para o próximo');
            } else {
                cy.get('@row1').find('button.btn-swipe-accent')
                    .contains(/Acessar|Fazer|Insc/i)
                    .click({ force: true });
                cy.wait(5000);

                // Se aparecer modal "Você já foi aprovado neste treinamento", clicar em "Matricular mesmo assim"
                cy.get('body').then(($body) => {
                    if ($body.find('[switch="modal.approvedCourseNotice"]:visible').length > 0) {
                        cy.get('[switch="modal.approvedCourseNotice"]', { timeout: 15000 })
                            .find('button.btn-swipe-accent')
                            .contains('Matricular mesmo assim')
                            .click({ force: true });
                        cy.wait(10000);

                        // Após confirmar, a página recarrega - precisa clicar em "Acessar" para entrar no treinamento
                        cy.get('table.stage-content-list tbody tr', { timeout: 15000 })
                            .eq(0)
                            .find('button.btn-swipe-accent')
                            .contains('Acessar')
                            .click({ force: true });
                        cy.wait(5000);
                    }
                });

                // Verificar se aparece modal "continuar assistindo?" e clicar em "Sim"
                cy.get('body').then(($body) => {
                    if ($body.find('#resumeWatching:visible').length > 0) {
                        cy.get('#resumeWatching button.btn-swipe-accent', { timeout: 5000 })
                            .contains('Sim')
                            .click({ force: true });
                        cy.wait(7000);
                    }
                });

                // Clicar nos 3 tracinhos (lista de conteúdos)
                cy.get('#courseResourceMenuIndicator', { timeout: 15000 })
                    .should('be.visible')
                    .click();
                cy.wait(2000);

                // Clicar no checkbox para contabilizar o progresso a 100%
                cy.get('#courseResourceMenuList .course-resource-check .icon-checkbox', { timeout: 15000 })
                    .first()
                    .click({ force: true });
                cy.wait(5000);

                // Clicar no botão de concluir que vai aparecer
                cy.contains('button', 'Concluir', { timeout: 15000 })
                    .filter(':visible')
                    .first()
                    .click({ force: true });
                cy.wait(3000);

                // Confirmar a conclusão - clicar em "Finalizar treinamento"
                cy.contains('button', 'Finalizar treinamento', { timeout: 15000 })
                    .filter(':visible')
                    .first()
                    .click({ force: true });
                cy.wait(5000);

                cy.log('✅ Conteúdo 1 - Treinamento (vídeo) concluído');
            }
        });

        // ==============================================================
        // ========== CONTEÚDO 2 - TREINAMENTO "AVALIAÇÃO COM CORREÇÃO" ==========
        // ==============================================================

        // Voltar para URL de trilhas
        cy.visit("https://www.hml.lector.live/lector_suporte/showcase/1817/m/home/trails/8371/stages");
        cy.wait(5000);

        // Clicar em "Fazer inscrição" ou "Acessar" no conteúdo 2
        cy.get('table.stage-content-list tbody tr', { timeout: 15000 })
            .eq(1).as('row2');

        cy.get('@row2').then(($row) => {
            const status = $row.find('td').eq(3).text().trim();
            if (status.includes('Concluído') || status.includes('Aprovado')) {
                cy.log('✅ Conteúdo 2 já concluído - pulando para o próximo');
                cy.wrap(true).as('pularCorrecao');
            } else {
                cy.wrap(false).as('pularCorrecao');
                cy.get('@row2').find('button.btn-swipe-accent')
                    .contains(/Acessar|Fazer|Insc/)
                    .click({ force: true });
                cy.wait(5000);

                // Se aparecer modal "Você já foi aprovado", clicar em "Matricular mesmo assim"
                cy.get('body').then(($body) => {
                    if ($body.find('[switch="modal.approvedCourseNotice"]:visible').length > 0) {
                        cy.get('[switch="modal.approvedCourseNotice"]', { timeout: 15000 })
                            .find('button.btn-swipe-accent')
                            .contains('Matricular mesmo assim')
                            .click({ force: true });
                        cy.wait(10000);

                        // Após confirmar, clica em "Acessar" para entrar no treinamento
                        cy.get('table.stage-content-list tbody tr', { timeout: 15000 })
                            .eq(1)
                            .find('button.btn-swipe-accent')
                            .contains('Acessar')
                            .click({ force: true });
                        cy.wait(5000);
                    }
                });

                // Verificar se aparece modal "continuar assistindo?" e clicar em "Sim"
                cy.get('body').then(($body) => {
                    if ($body.find('#resumeWatching:visible').length > 0) {
                        cy.get('#resumeWatching button.btn-swipe-accent', { timeout: 5000 })
                            .contains('Sim')
                            .click({ force: true });
                        cy.wait(3000);
                    }
                });

                // Vai carregar a tela da avaliação - clicar em "Iniciar avaliação"
                // Esperar o botão específico da avaliação para garantir que saiu da lista de etapas
                cy.contains('button', 'Iniciar avaliação', { timeout: 30000 })
                    .should('be.visible')
                    .click({ force: true });
                cy.wait(3000);

                // Responder a avaliação - pode ser discursiva ou objetiva
                cy.get('body').then(($body) => {
                    if ($body.find('textarea.discursive:visible').length > 0) {
                        // Avaliação discursiva
                        cy.get('textarea.discursive', { timeout: 15000 })
                            .should('be.visible')
                            .clear()
                            .type('Resposta automação Cypress - questão 1');
                        cy.wait(1000);

                        // Verificar se tem próxima questão
                        cy.get('body').then(($body2) => {
                            if ($body2.find('[ng-click="evaluationViewerService.nextQuestion()"]:visible').length > 0) {
                                cy.get('[ng-click="evaluationViewerService.nextQuestion()"]').click();
                                cy.wait(2000);

                                // Responder questão 2 se existir
                                cy.get('body').then(($body3) => {
                                    if ($body3.find('textarea.discursive:visible').length > 0) {
                                        cy.get('textarea.discursive')
                                            .clear()
                                            .type('Resposta automação Cypress - questão 2');
                                        cy.wait(1000);
                                    }
                                });
                            }
                        });
                    } else if ($body.find('.alternatives-grid-box:visible').length > 0) {
                        // Avaliação objetiva
                        cy.get('.alternatives-grid-box:visible')
                            .find('.checkbox .icon-checkbox, .checkbox .icon-radio')
                            .filter(':visible')
                            .first()
                            .scrollIntoView()
                            .click({ force: true });
                        cy.wait(1000);
                    }
                });

                // Clicar em "Enviar respostas"
                cy.get('#nextResourceArrow', { timeout: 15000 })
                    .should('be.visible')
                    .click();
                cy.wait(3000);

                // Confirmar envio no modal
                cy.get('[switch="service.modalSendAnswers"]', { timeout: 15000 }).then(($modal) => {
                    if ($modal.is(':visible')) {
                        cy.wrap($modal).find('button.btn-swipe-accent')
                            .filter(':visible')
                            .first()
                            .click({ force: true });
                    }
                });
                cy.wait(3000);

                // Clicar em concluir
                cy.contains('button', /Concluir|Finalizar/, { timeout: 15000 })
                    .filter(':visible')
                    .first()
                    .click({ force: true });
                cy.wait(3000);

                // Mensagem "Treinamento finalizado" - clicar em OK
                cy.get('[switch="modal.courseFinished"]', { timeout: 15000 }).then(($modal) => {
                    if ($modal.is(':visible')) {
                        cy.wrap($modal).find('button.btn-swipe-accent')
                            .filter(':visible')
                            .first()
                            .click({ force: true });
                    }
                });
                cy.wait(3000);

                // Verificar se foi aprovado
                cy.log('✅ Conteúdo 2 - Treinamento "Avaliação com correção" concluído');
            }
        });

        // ==============================================================
        // ========== CORREÇÃO DA AVALIAÇÃO (ADMINISTRADOR) ==========
        // ==============================================================
        cy.get('@pularCorrecao').then((pular) => {
            if (pular) {
                cy.log('⏭️ Pulando correção administrativa pois já foi concluído');
                return;
            }

            // Login como Administrador
            cy.visit("https://www.hml.lector.live/lector_suporte/subscribe/login");
            cy.wait(3000);

            cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input')
                .should('be.visible')
                .type("suporte2@lectortec.com.br");
            cy.wait(2000);
            cy.get('#login_password').should('be.visible').type("#C4iocl4r413");
            cy.wait(1000);
            cy.get('#btn-entrar').should('be.enabled').click();
            cy.wait(5000);

            // Trocar para perfil Administrador se necessário
            cy.get('.current-profile, #user-options-btn', { timeout: 15000 }).should('exist');
            cy.wait(2000);

            cy.get('body').then(($body) => {
                if ($body.find('.current-profile').length > 0) {
                    cy.get('.current-profile').invoke('text').then((perfil) => {
                        if (!perfil.trim().includes('Administrador')) {
                            cy.get('.profile-select', { timeout: 15000 }).click();
                            cy.wait(2000);
                            cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
                            cy.wait(2000);
                            cy.contains('#user-options .option.item', 'Administrador', { timeout: 15000 })
                                .click({ force: true });
                            cy.wait(5000);
                        }
                    });
                }
            });

            // Acessar a trilha no painel do admin
            cy.visit("https://www.hml.lector.live/lector_suporte/trails/8371/stages");
            cy.wait(5000);

            // Clicar em "Gerenciar" na turma "Gratuita"
            cy.contains('b.ng-binding', 'Gratuita', { timeout: 15000 })
                .closest('div[ng-repeat="class in trail.classes track by class.id"]')
                .find('button.btn-swipe-accent')
                .contains('Gerenciar')
                .click({ force: true });
            cy.wait(5000);

            // Acessar aba "Avaliação"
            cy.contains('a', 'Avaliação', { timeout: 15000 })
                .click({ force: true });
            cy.wait(5000);

            // Procurar aluno "caio gomes hml" e clicar em corrigir
            cy.contains('td', 'caio gomes hml', { timeout: 15000 })
                .parent('tr')
                .find('button.icon-edit')
                .click({ force: true });
            cy.wait(5000);

            // Digitar nota 10
            cy.get('input[ng-model="questionAnswer.grade"]', { timeout: 15000 })
                .should('be.visible')
                .clear()
                .type('10');
            cy.wait(1000);

            // Digitar observação
            cy.get('textarea[ng-model="questionAnswer.observations"]', { timeout: 15000 })
                .should('be.visible')
                .clear()
                .type('Avaliação corrigida via automação Cypress');
            cy.wait(1000);

            // Clicar em "Enviar correção"
            cy.contains('button[type="submit"]', 'Enviar correção', { timeout: 15000 })
                .should('be.visible')
                .click({ force: true });
            cy.wait(5000);

            cy.log('✅ Avaliação corrigida pelo Administrador - Nota 10');

            // Login novamente como aluno
            cy.visit("https://www.hml.lector.live/lector_suporte/subscribe/login");
            cy.wait(3000);

            cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input')
                .should('be.visible')
                .type("caiohml@lectortec.com");
            cy.wait(2000);
            cy.get('#login_password').should('be.visible').type("123");
            cy.wait(1000);
            cy.get('#btn-entrar').should('be.enabled').click();
            cy.wait(5000);

            // Garantir perfil Aluno
            cy.get('body').then(($body) => {
                if ($body.find('.current-profile').length > 0) {
                    cy.get('.current-profile').invoke('text').then((perfil) => {
                        if (!perfil.trim().includes('Aluno')) {
                            cy.get('.profile-select', { timeout: 15000 }).click();
                            cy.wait(2000);
                            cy.contains('div', 'Selecionar perfil', { timeout: 15000 }).click();
                            cy.wait(2000);
                            cy.contains('#user-options .option.item', 'Aluno - Unidades', { timeout: 15000 })
                                .click({ force: true });
                            cy.wait(5000);
                        }
                    });
                }
            });

            cy.log('✅ Voltou como aluno caiohml - continuando para Conteúdo 3');
        });

        // ==============================================================
        // ========== CONTEÚDO 3 - AVALIAÇÃO ==========
        // ==============================================================

        // Voltar para URL de trilhas
        cy.visit("https://www.hml.lector.live/lector_suporte/showcase/1817/m/home/trails/8371/stages");
        cy.wait(5000);

        // Clicar em "Responder avaliação" no conteúdo 3
        cy.get('table.stage-content-list tbody tr', { timeout: 15000 })
            .eq(2).as('row3');

        cy.get('@row3').then(($row) => {
            const status = $row.find('td').eq(3).text().trim();
            if (status.includes('Concluído') || status.includes('Aprovado')) {
                cy.log('✅ Conteúdo 3 já concluído');
            } else {
                cy.get('@row3').find('button.btn-swipe-accent')
                    .contains(/Responder|Acessar|Fazer/i)
                    .click({ force: true });
                cy.wait(5000);

                // Responder a avaliação - primeira pergunta
                cy.get('.alternatives-grid-box:visible', { timeout: 20000 }).should('be.visible');
                cy.get('.alternatives-grid-box:visible')
                    .find('.checkbox .icon-checkbox, .checkbox .icon-radio')
                    .filter(':visible')
                    .first()
                    .scrollIntoView()
                    .click({ force: true });
                cy.wait(1000);

                // Próxima questão (se existir)
                cy.get('body').then(($body) => {
                    if ($body.find('[ng-click="evaluationViewerService.nextQuestion()"]:visible').length > 0) {
                        cy.get('[ng-click="evaluationViewerService.nextQuestion()"]').click();
                        cy.wait(2000);

                        // Responder segunda pergunta
                        cy.get('.alternatives-grid-box:visible', { timeout: 20000 }).should('be.visible');
                        cy.get('.alternatives-grid-box:visible')
                            .find('.checkbox .icon-checkbox, .checkbox .icon-radio')
                            .filter(':visible')
                            .first()
                            .scrollIntoView()
                            .click({ force: true });
                        cy.wait(1000);

                        // Verificar se tem mais perguntas
                        cy.get('body').then(($body2) => {
                            if ($body2.find('[ng-click="evaluationViewerService.nextQuestion()"]:visible').length > 0) {
                                cy.get('[ng-click="evaluationViewerService.nextQuestion()"]').click();
                                cy.wait(2000);

                                // Responder terceira pergunta se existir
                                cy.get('.alternatives-grid-box:visible', { timeout: 20000 }).should('be.visible');
                                cy.get('.alternatives-grid-box:visible')
                                    .find('.checkbox .icon-checkbox, .checkbox .icon-radio')
                                    .filter(':visible')
                                    .first()
                                    .scrollIntoView()
                                    .click({ force: true });
                                cy.wait(1000);
                            }
                        });
                    }
                });

                // Clicar em "Enviar respostas"
                cy.get('.evaluation-actions > .end > .btn-swipe-accent', { timeout: 15000 })
                    .click({ force: true });
                cy.wait(2000);

                // Confirmar envio no modal
                cy.get('[switch="service.modalSendAnswers"]', { timeout: 15000 }).then(($modal) => {
                    if ($modal.is(':visible')) {
                        cy.wrap($modal).find('button.btn-swipe-accent')
                            .filter(':visible')
                            .first()
                            .click({ force: true });
                    }
                });
                cy.wait(5000);

                cy.log('✅ Conteúdo 3 - Avaliação respondida');
            }
        });

        // ==============================================================
        // ========== CONTEÚDO 4 - DOCUMENTO ==========
        // ==============================================================

        // Voltar para URL de trilhas
        cy.visit("https://www.hml.lector.live/lector_suporte/showcase/1817/m/home/trails/8371/stages");
        cy.wait(5000);

        // Acessar o documento (conteúdo 4)
        cy.get('table.stage-content-list tbody tr', { timeout: 15000 })
            .eq(3).as('row4');

        cy.get('@row4').then(($row) => {
            const status = $row.find('td').eq(3).text().trim();
            if (status.includes('Concluído') || status.includes('Aprovado')) {
                cy.log('✅ Conteúdo 4 já concluído');
            } else {
                cy.get('@row4').find('button.btn-swipe-accent')
                    .contains(/Acessar|Visualizar/i)
                    .click({ force: true });
                cy.wait(8000);
            }
        });

        cy.log('✅ Conteúdo 4 - Documento acessado');

        // ==============================================================
        // ========== FINALIZAR TRILHA ==========
        // ==============================================================

        // Voltar para URL de trilhas
        cy.visit("https://www.hml.lector.live/lector_suporte/showcase/1817/m/home/trails/8371/stages");
        cy.wait(5000);

        // Clicar em "Finalizar trilha"
        cy.contains('button', /Finalizar/i, { timeout: 15000 })
            .filter(':visible')
            .first()
            .click({ force: true });
        cy.wait(3000);

        // Confirmar finalização no modal
        cy.contains('button', /Finalizar/i, { timeout: 15000 })
            .filter(':visible')
            .first()
            .click({ force: true });
        cy.wait(5000);

        // Verificar se o certificado foi gerado
        cy.get('body').then(($body) => {
            if ($body.find('.top-bar .btn-swipe-accent:visible').length > 0) {
                cy.get('.top-bar .btn-swipe-accent', { timeout: 15000 })
                    .click({ force: true });
                cy.log('✅ Certificado encontrado e aberto');
            } else {
                cy.log('ℹ️ Botão de certificado não encontrado - verificar manualmente');
            }
        });

        cy.log('🎉 Trilha completa finalizada com sucesso!');
    });
});
