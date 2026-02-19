describe("Teste - Trilha com Importação", () => {

    // "before" roda UMA VEZ antes de todos os testes — aqui fazemos o login
    before(() => {
        //Entra na página de login
        cy.visit("https://www.hml.lector.live/lector_suporte/subscribe/login");
        cy.wait(3000); //espera a página carregar

        //Faz login
        cy.get('body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div.ng-scope > div > div.landing-form.ng-scope > div:nth-child(3) > form > input').should('be.visible').type("suporte2@lectortec.com.br");
        cy.wait(2000);
        cy.get('#login_password').should('be.visible').type("#C4iocl4r413");
        cy.wait(1000);
        cy.get('#btn-entrar').should('be.enabled').click();
        cy.wait(5000); //espera a página carregar após o login

        //ve se logou
        cy.url().should('not.include', '/subscribe/login');
    });

    // "context" é como uma subpasta dentro do describe
    context("Criar Trilha com Importação", () => {

        // "it" é o teste em si — tudo que o Cypress vai fazer fica AQUI DENTRO
        it("Criando trilha com etapas importadas", () => {

            //Acessar aba trilha
            cy.get('[title="Trilhas"] > .sideitem').click();
            cy.wait(3000); //espera a página de trilhas carregar


        });
    });
});