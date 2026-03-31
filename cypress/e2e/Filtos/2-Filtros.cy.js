/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('unselectable')) {
    return false;
    }
});

describe("Teste - Login", () => {
    beforeEach(() => {
        //Entra na página de login
        cy.visit("https://www.hml.lector.live/lector_suporte/showcase/2257");
        cy.contains("button", "Entrar").click();
    
    //Faz login
        cy.get('[style="z-index: 26;"] > :nth-child(1) > :nth-child(1) > .popup > :nth-child(1) > .ng-pristine').type("qualidade@lectortec.com.br");
        cy.get("#login_password_navbar").type("c8d593QGXOkjRjC");
        cy.get(".popup").contains("button", "Entrar").click();
    });


    context("Filtros", () => {
    
    it("Pesquisar Trilhas", () => {

        // Clicando na aba Trilhas
        cy.get('[title="Trilhas"] > .sideitem', { timeout: 60000 })
            .should('be.visible')
            .click();

        //Pesquisa
        cy.get('input[placeholder="Pesquisar trilhas"]', { timeout: 60000 })
            .should('be.visible')
            .clear()
            .type('Teste', { delay: 50 });

        cy.wait(1000)
        cy.get('.multiselect.ng-dirty > .btn').click()

    });

    it("Filtro Ordenação AZ/ZA", () => {

        // Clicando na aba Trilhas
        cy.get('[title="Trilhas"] > .sideitem', { timeout: 60000 })
            .should('be.visible')
            .click();
        
        //Clica em nome Z/A
        cy.get('[ng-model="$parent.order"]').click()
        cy.wait(1000)
        
        cy.get('.open > .ui-select-choices > :nth-child(2)', { timeout: 60000 })
            .should('be.visible')
            .click({ force: true });
        cy.wait(3000)

        //Clica em nome A/Z
        cy.get('[ng-model="$parent.order"]').click()
        cy.wait(1000)

        cy.get('.open > .ui-select-choices > :nth-child(1)', { timeout: 60000 })
            .should('be.visible')
            .click({ force: true });

    });
    it("Filtro Mais Recente/Mais Antigo", () => {

        // Clicando na aba Trilhas
        cy.get('[title="Trilhas"] > .sideitem', { timeout: 60000 })
            .should('be.visible')
            .click();

        cy.get('[ng-model="$parent.order"]').click()
        cy.wait(1000)
        
        //Mais recente
        cy.get('.open > .ui-select-choices > :nth-child(3)', { timeout: 60000 })
            .should('be.visible')
            .click({ force: true });
        cy.wait(3000)

        cy.get('[ng-model="$parent.order"]').click()
        cy.wait(1000)

        //Mais antigo
        cy.get('.open > .ui-select-choices > :nth-child(4)', { timeout: 60000 })
            .should('be.visible')
            .click({ force: true });
});

    it("Filtro Card", () => {

        // Clicando na aba Trilhas
        cy.get('[title="Trilhas"] > .sideitem', { timeout: 60000 })
            .should('be.visible')
            .click();

        cy.get('[ng-model="$parent.order"]').click()
        cy.wait(1000)
        
        //Miniaturas
        cy.get(':nth-child(1) > .btn-square').click()

        //Miniaturas pequenas
        cy.get(':nth-child(2) > .btn-square').click()

        //Lista
        cy.get(':nth-child(3) > .btn-square').click()
    });
    });
});
