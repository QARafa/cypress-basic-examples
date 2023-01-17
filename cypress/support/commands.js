
Cypress.Commands.add('enviar', () => {

    cy.get('.button').click()
})

Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () => {

    const longText = "Parabéns! Vimos que vem trabalhando há tempos para construir essa conquista. Na minha opinião o que te levou até ela foram tal e tal coisa, e na sua? O que fez que te levou a acertar nessa ação? Acha que pode compartilhar esse conhecimento com a equipe?"
    
    cy.get('input[ id="firstName"]')

        .type('Rafael')
    cy.get('input[ id="lastName"]')
        .type('Moreira')
    cy.get('input[ id="email"]')
        .type('rafa123@gmail.com')
    cy.get('#open-text-area')
        .type(longText, { delay: 0 })
    cy.get('button[type="submit"]').click()

    cy.get('.success > strong')
        .should('be.visible')
        .should('have.text', 'Mensagem enviada com sucesso.')
})
