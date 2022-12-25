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
     * 添加词汇
     */
  it('Test add word', () => {
    cy.intercept('post', Cypress.env('api_url') + '/admin/sensitive-word', {
        "status": "success",
        "message": "敏感词添加成成功",
        "data": ""
    }).as('create')
    cy.intercept('get', Cypress.env('api_url') + '/admin/sensitive-word', { fixture: 'sensitive-word-created' }).as('sensitive.word')

    cy.wait(300)
    cy.get('.tool-bar .btn-primary').eq(-1).click()
    // ---- 填写敏感词
    cy.get('.tool-bar .create-sensitive-word .v-input-box').click()
    cy.wait(300)
    cy.get('.tool-bar .create-sensitive-word input').eq(0).type('不高兴')
    // ---- 选择分类
    cy.get('.tool-bar .create-sensitive-word .el-input').click()
    cy.wait(300)
    cy.get('.el-select-dropdown__wrap').eq(-1).find('li').eq(0).click()
    cy.wait(300)
    // ---- 提交表单
    cy.get('.tool-bar .create-sensitive-word .link-btn-primary').eq(-1).click()
    cy.wait('@create')
    cy.wait(2000)
  })
})
