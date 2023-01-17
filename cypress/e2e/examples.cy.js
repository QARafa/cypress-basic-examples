/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {


  beforeEach(function () {

    cy.visit('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')


  })

  it('verificar titulo da aplicação', function () {


    cy.title()
      .should('eq', 'Central de Atendimento ao Cliente TAT')

  })

  context('Exercícios Extras', () => {

    it('preenche os campos obrigatórios e envia o formulário', function () {

      const longText = "Parabéns! Vimos que vem trabalhando há tempos para construir essa conquista. Na minha opinião o que te levou até ela foram tal e tal coisa, e na sua? O que fez que te levou a acertar nessa ação? Acha que pode compartilhar esse conhecimento com a equipe?"


      cy.get('input[ id="firstName"]')
        .type('Rafael')
      cy.get('input[ id="lastName"]')
        .type('Moreira')
      cy.get('input[ id="email"]')
        .type('rafa123@gmail.com')
      cy.get('#open-text-area')
        .type(longText, { delay: 0 })
      cy.contains('button', 'Enviar').click() //primeiro argumento CSS segundo o Texto contido

      cy.get('.success > strong')
        .should('be.visible')
        .should('have.text', 'Mensagem enviada com sucesso.')



    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {


      cy.get('input[ id="firstName"]')
        .type('Rafael')
      cy.get('input[ id="lastName"]')
        .type('Moreira')
      cy.get('input[ id="email"]')
        .type('rafa123gmail.com')
      cy.get('#open-text-area')
        .type('Teste')
      cy.get('button[type="submit"]').click()

      cy.get('.error')
        .should('be.visible')
      //.should('have.text', 'Valide os campos obrigatórios!')



    })

    it('se um valor não-numérico for digitado, seu valor continuará vazio', function () {

      cy.log('Dado que use caracteres o mesmo não deve aceitar')
      cy.get('#phone')
        .type('testeletras')
      cy.get('#phone')
        .should('not.have.value')


    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {

      cy.get('input[ id="firstName"]')
        .type('Rafael')
      cy.get('input[ id="lastName"]')
        .type('Moreira')
      cy.get('input[ id="email"]')
        .type('rafa123@gmail.com')
      cy.get('#open-text-area')
        .type('Teste')
      cy.get('#phone-checkbox').check()

      cy.get('button[type="submit"]').click()

      cy.get('.error')
        .should('be.visible')

    })

    it(' preenche e limpa os campos nome, sobrenome, email e telefone', function () {

      cy.get('input[ id="firstName"]')
        .type('Rafael')
        .should('have.value', 'Rafael')
        .clear()
        .should('not.have.value')

      cy.get('input[ id="lastName"]')
        .type('Moreira')
        .should('have.value', 'Moreira')
        .clear()
        .should('not.have.value')

      cy.get('input[ id="email"]')
        .type('rafa123@gmail.com')
        .should('have.value', 'rafa123@gmail.com')
        .clear()
        .should('not.have.value')

      cy.get('input[ id="phone"]')
        .type('11999988888')
        .should('have.value', '11999988888')
        .clear()
        .should('not.have.value')

      //cy.get('button[type="submit"]').click()


    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {

      cy.get('button[type="submit"]').click()
      cy.get('.error')
        .should('be.visible')


    })

    it('envia o formulário com sucesso usando um comando customaizado', function () {

      cy.fillMandatoryFieldsAndSubmit()


    })

  })

  context('Exercícios Select', () => {


    it('seleciona um produto (YouTube) por seu texto', function () {

      cy.get('select[id="product"]')
        .select('YouTube')
        .should('have.value', 'youtube')


    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function () {

      cy.get('select[id="product"]')
        .select('mentoria')
        .should('have.value', 'mentoria')


    })

    it('seleciona um produto (Blog) por seu índice', function () {

      cy.get('select[id="product"]')
        .select(1)
        .should('have.value', 'blog')


    })

  })

  context('Exercícios inputs do tipo radio', () => {


    it('marca o tipo de atendimento "Feedback"', function () {

      cy.get('input[type="radio"][value="feedback"')
        .check() //pode ser usado o .click()
        .should('have.value', 'feedback')

    })

    it('marca cada tipo de atendimento', function () {

      cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(function ($radio) {
          cy.wrap($radio).check()
          cy.wrap($radio).should('be.checked')
        })

    })

  })

  context('Exercícios Marcando (e desmarcando) inputs do tipo checkbox', () => {

    it('marca ambos checkboxes, depois desmarca o último', function () {
      cy.get('input[type="checkbox"]')
        .check()
        .should('be.checked')
        .last() //ultimo step
        .uncheck()
        .should('not.be.checked')

    })

  })

  context('Exercícios fazendo upload de arquivos com Cypress ', () => {

    it('seleciona um arquivo da pasta fixtures', function () {

      cy.get('input[id="file-upload"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json')
        .should(function ($input) {
          //console.log($input)
          expect($input[0].files[0].name).to.equal('example.json')
        })

    })

    it('seleciona um arquivo simulando um drag-and-drop', function () {

      cy.get('input[id="file-upload"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' }) //drag-drop simula arrastar o arquivo da sua "Workspace" para o campo de upload
        .should(function ($input) {

          expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
      cy.fixture('example.json').as('sampleFile')
      cy.get('input[id="file-upload"]')
        .selectFile('@sampleFile')
        .should(function ($input) {

          expect($input[0].files[0].name).to.equal('example.json')


        })
    })

  })

  context('Exercícios lidando com links que abrem em outra aba do navegador', () => {

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
      cy.get('a[href="privacy.html"]').should('have.attr', 'target', '_blank')

    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function () {
      cy.get('a[href="privacy.html"]')
        .invoke('removeAttr', 'target') //removendo o target o teste abre a aba no mesma sequencia 
        .click()
        

       cy.contains('Talking About Testing').should('be.visible') 


    })


  })

  context('Avançando no uso do Cypress', () => {

    it('Verificar se a mensagem fica invisivel com o tempo definido', function () {

      const longText = "Parabéns! Vimos que vem trabalhando há tempos para construir essa conquista. Na minha opinião o que te levou até ela foram tal e tal coisa, e na sua? O que fez que te levou a acertar nessa ação? Acha que pode compartilhar esse conhecimento com a equipe?"


      cy.log('Utilizando Clock e Tick')
      cy.clock() //trava o relogio do navegador

      cy.get('input[ id="firstName"]')
        .type('Rafael')
      cy.get('input[ id="lastName"]')
        .type('Moreira')
      cy.get('input[ id="email"]')
        .type('rafa123@gmail.com')
      cy.get('#open-text-area')
        .type(longText, { delay: 0 })
      cy.contains('button', 'Enviar').click() //primeiro argumento CSS segundo o Texto contido

      cy.get('.success > strong')
        .should('be.visible')

      cy.tick(3000) // avança o tempo 

      cy.get('.success > strong')
        .should('not.be.visible')



    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke()', function () {
      cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')


    })

    it('preenche a area de texto com um texto longo usando o comando invoke()', function () {
      const longText = Cypress._.repeat('0123456789', 20)

      cy.get('#open-text-area')
      .invoke('val', longText)
      .should('have.value', longText)
    })


  })

})
