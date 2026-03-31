/// <reference types="cypress" />

// Ignora erros internos da aplicação
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild')) {
        return false;
    }
});

// Lista de certificados para adicionar/trocar (3 iterações)
const certificados = [
    'Certificado em duas páginas - Trilha #CODIGO_VALIDACAO#',
    'Certificado da Trilha',
    'CERTIFICADO 16.01.2025 - TRILHA'
];

describe("Teste - Adicionar e Trocar Certificados", () => {

    for (let i = 0; i < certificados.length; i++) {

        describe(`Iteração ${i + 1} - ${certificados[i]}`, () => {

            // Login antes de cada iteração
            beforeEach(() => {
                cy.visit("https://www.hml.lector.live/lector_suporte/subscribe/login");
                cy.wait(3000);

                cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input').should('be.visible').type("suporte2@lectortec.com.br");
                cy.wait(2000);
                cy.get('#login_password').should('be.visible').type("#C4iocl4r413");
                cy.wait(1000);
                cy.get('#btn-entrar').should('be.enabled').click();
                cy.wait(5000);

                cy.url().should('not.include', '/subscribe/login');
            });

            it(`Adicionar certificado: ${certificados[i]}`, () => {

                // ========== PASSO 2: ACESSAR ABA TRILHAS ==========
                cy.get('[title="Trilhas"] > .sideitem').click();
                cy.wait(3000);

                // ========== PASSO 3: BUSCAR PELA TRILHA ==========
                cy.get('input[placeholder="Pesquisar trilhas"]', { timeout: 15000 })
                    .should('be.visible')
                    .clear()
                    .type('Trilha importação automação caio');
                cy.get('button[ng-click="filterText()"]').click();
                cy.wait(5000);

                // ========== PASSO 4: CLICAR NO CARD DA TRILHA ==========
                cy.contains('Trilha importação automação caio', { timeout: 15000 })
                    .should('be.visible')
                    .click();
                cy.wait(5000);

                // ========== PASSO 5: ABRIR PARA EDIÇÃO ==========
                cy.get('button[ng-click="editTrail(trail)"]', { timeout: 15000 })
                    .should('be.visible')
                    .click();
                cy.wait(3000);

                // ========== PASSO 6: ACESSAR ABA CERTIFICADO ==========
                cy.get('[ui-sref="accessLink.content.trails.edit.id.version.certificate"]', { timeout: 15000 })
                    .should('be.visible')
                    .click();
                cy.wait(2000);

                // ========== PASSO 7: CLICAR EM ESCOLHER CERTIFICADO ==========
                cy.get('button[ng-click="editTrailCertificate()"]', { timeout: 15000 })
                    .should('be.visible')
                    .click();
                cy.wait(2000);

                // ========== PASSO 8: BUSCAR E SELECIONAR O CERTIFICADO ==========
                // Primeiro clica no span para abrir o dropdown
                cy.get('[name="TrailCertificateSelect"] .ui-select-toggle', { timeout: 15000 })
                    .should('be.visible')
                    .click();
                cy.wait(1000);
                // Depois digita no input de busca que aparece
                cy.get('[name="TrailCertificateSelect"] input[placeholder="Escolha um certificado"]', { timeout: 15000 })
                    .should('be.visible')
                    .type(certificados[i]);
                cy.wait(5000); //espera os resultados carregarem

                // Seleciona o certificado no dropdown
                cy.get('.ui-select-highlight', { timeout: 15000 })
                    .first()
                    .should('be.visible')
                    .click();
                cy.wait(2000);

                // ========== PASSO 9: SALVAR A TRILHA ==========
                cy.get('button[ng-click="setKeepEditingAfterSave(false)"]', { timeout: 15000 })
                    .should('be.visible')
                    .click();
                cy.wait(5000);

                cy.log(`✅ Certificado "${certificados[i]}" adicionado com sucesso!`);
            });
        });
    }
});
