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
     * 删除词汇
     */
  it('Test destroy word', () => {
    cy.intercept('post', Cypress.env('api_url') + '/admin/sensitive-word/*', {
        "status": "success",
        "message": "敏感词删除成功",
        "data": ""
    }).as('sensitive.word.destroy')
    cy.intercept('get', Cypress.env('api_url') + '/admin/sensitive-word', { fixture: 'sensitive-word' }).as('sensitive.word')
    // cy.intercept('post', Cypress.env('api_url') + '/admin/sensitive-word/batch-delete', { fixture: 'sensitive-word-batch-destroy' }).as('sensitive.word.batch.destroy')

    cy.get('table .link-btn-danger').eq(0).click()
    cy.get('.el-message-box .el-button--primary').click()
    
    cy.wait(['@sensitive.word.destroy', '@sensitive.word'])
  })
})
