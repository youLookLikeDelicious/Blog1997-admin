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
     * 修改词汇
     */
  it('Test update word', () => {
    cy.intercept('post', Cypress.env('api_url') + '/admin/sensitive-word/*', {
        "status": "success",
        "message": "\u654f\u611f\u8bcd\u6c47\u66f4\u65b0\u6210\u529f",
        "data": {}
    }).as('sensitive.word.update')
    cy.intercept('get', Cypress.env('api_url') + '/admin/sensitive-word', { fixture: 'sensitive-word-updated' }).as('sensitive.word')

    cy.get('table .link-btn-primary').eq(0).click()
    // ---- 填写敏感词
    cy.get('table .create-sensitive-word input').eq(0).clear()
    cy.wait(300)
    cy.get('table .create-sensitive-word input').eq(0).type('没头脑')
    // ---- 选择分类
    cy.get('table .create-sensitive-word .el-select').click()
    cy.wait(300)
    cy.get('.el-select-dropdown__wrap').eq(-1).find('li').eq(1).click()
    cy.wait(300)
    // ---- 提交表单
    cy.get('table .create-sensitive-word .link-btn-primary').eq(1).click()
    cy.wait('@sensitive.word.update')
  })
})
