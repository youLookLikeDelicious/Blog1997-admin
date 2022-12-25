describe('Test sensitive word', () => {
  before(() => {
    cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', { fixture: 'user' }).as('user')
    cy.intercept('post', Cypress.env('api_url') + '/csrf', { fixture: 'user/csrf.json' }).as('csrf')
  })

  /**
     * 访问页面
     */
  it('Visit page', () => {
    cy.intercept('get', Cypress.env('api_url') + '/admin/sensitive-word', { fixture: 'sensitive-word' }).as('sensitive.word')
    cy.visit(Cypress.env('host') + '/sensitive-word')
    cy.wait(['@user', '@sensitive.word'])
  })

  /**
   * 导入词汇
   */
  it('Test import word', () => {
    cy.intercept('post', Cypress.env('api_url') + '/admin/sensitive-word/import', {
        "status": "success",
        "message": "\u6279\u91cf\u5bfc\u5165\u6210\u529f,\u5171\u5f55\u51655\u6761\u8bb0\u5f55",
        "data": ""
    })
    cy.intercept('get', Cypress.env('api_url') + '/admin/sensitive-word*', { fixture: 'sensitive-word-search' }).as('sensitive.word.search')
    cy.get('.right-btn .btn-primary').eq(0).click()
    cy.wait(300)
    cy.get('.import-sensitive-word .ui-select').click({ force: true })
    cy.wait(300)
    cy.get('.import-sensitive-word .ui-select li').eq(1).click()
    cy.get('.import-sensitive-word input[type=file]').selectFile('cypress/fixtures/sensitive-word/word.txt', { force: true })
    cy.wait(1000)
    cy.get('.dialog-wrap .btn-primary').click()
    cy.wait('@sensitive.word.search')
    cy.wait(1000)
  })
})
