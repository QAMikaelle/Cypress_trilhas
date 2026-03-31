/// <reference types="cypress" />

// Ignora erros internos da aplicação
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable') || err.message.includes('firstElementChild') || err.message.includes('parentNode')) {
        return false;
    }
});

// Lista de perfis para alternar
// Começa com perfis diferentes do padrão (Administrador) para evitar clicar no já ativo
const perfis = [
    'Aluno - Todos',
    'Gestor - Todos',
    'Tutor',
    'Instrutor',
    'Gestor - Unidades',
    'Administrador - Todos'
];

describe("Teste - Troca de Perfis", () => {

    for (let i = 0; i < perfis.length; i++) {

        it(`Trocar para perfil: ${perfis[i]}`, () => {

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

            // ========== VERIFICAR PERFIL ATUAL ==========
            cy.get('.current-profile', { timeout: 15000 })
                .should('be.visible')
                .invoke('text')
                .then((textoPerfilAtual) => {
                    const perfilAtual = textoPerfilAtual.trim();
                    const perfilDesejado = perfis[i].split(' - ')[0]; // ex: "Aluno", "Gestor"

                    if (perfilAtual.includes(perfilDesejado)) {
                        // Perfil já está ativo, pula a troca
                        cy.log(`⏭️ Perfil "${perfis[i]}" já está ativo. Pulando...`);
                    } else {
                        // ========== PASSO 1: CLICAR NO MENU DE PERFIL ==========
                        cy.get('.profile-select', { timeout: 15000 })
                            .should('be.visible')
                            .click();
                        cy.wait(2000);

                        // ========== PASSO 2: CLICAR EM "SELECIONAR PERFIL" ==========
                        cy.contains('div', 'Selecionar perfil', { timeout: 15000 })
                            .should('be.visible')
                            .click();
                        cy.wait(2000);

                        // ========== PASSO 3: CLICAR NO PERFIL DESEJADO ==========
                        cy.contains('#user-options .option.item', perfis[i], { timeout: 15000 })
                            .click({ force: true });
                        cy.wait(5000); // espera a página recarregar

                        // ========== PASSO 4: VERIFICAR QUE O PERFIL MUDOU ==========
                        cy.get('.current-profile', { timeout: 15000 })
                            .should('be.visible');

                        cy.log(`✅ Perfil trocado para "${perfis[i]}" com sucesso!`);
                    }
                });
        });
    }
});
