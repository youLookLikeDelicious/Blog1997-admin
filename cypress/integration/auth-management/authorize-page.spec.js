describe('Test authorize manage', () => {
  before(() => {
    cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', { fixture: 'user.json' }).as('user')
    cy.intercept('get', Cypress.env('api_url') + '/admin/auth', { fixture: 'auth-list' }).as('auth.list')
  })

  it('Load page', () => {
    cy.visit(Cypress.env('host') + '/auth')
    cy.wait(['@user', '@auth.list'])
  })

  it('Test manage auth', () => {
    // 新建一个权限
    // cy.intercept('get', Cypress.env('api_url') + '/admin/auth', { fixture: 'auth-create' }).as('auth.create')
    cy.intercept('get', Cypress.env('api_url') + '/admin/auth', { fixture: 'auth-list' }).as('auth.list')
    cy.intercept('post', Cypress.env('api_url') + '/admin/auth/83', (req) => {
      const response = req.body._method === 'DELETE' ? {
        fixture: 'auth-destroy'
      } : {
        fixture: 'auth-update'
      }

      req.reply(response)
    }).as('auth.post')
    cy.intercept('post', Cypress.env('api_url') + '/admin/auth', { fixture: 'auth-store' }).as('auth.store')
    cy.intercept('get', Cypress.env('api_url') + '/admin/auth/2', { fixture: 'auth-info' }).as('auth.info')

    // 点击添加
    cy.get('.right-btn .v-button').click()
    cy.wait('@auth.list')
    // ----------- 填写权限名称
    cy.get('.el-form-item input').eq(0).type('添加评论')
    // ----------- 填写路由名称
    cy.get('.el-form-item input').eq(1).type('comment.store')
    // ----------- 选择父级权限
    cy.get('.el-form-item .el-input').click()
    cy.wait(300)
    cy.get('.el-cascader-panel .el-radio__inner').eq(0).trigger('mouseenter')
    cy.wait(1000)
    cy.get('.el-cascader-panel .el-radio__inner').eq(1).trigger('mouseenter')
    cy.wait(1000)
    cy.get('.el-cascader-panel .el-radio__inner').eq(2).click()
    cy.get('.dialog > header').click()
    cy.wait(1000)
    cy.get('.dialog-footer .btn-primary').click()
    cy.wait('@auth.store')
    cy.wait(1000)

    // 编辑权限
    // ------- hover css事件无效
    cy.get('.el-table .el-icon-arrow-right').eq(0).click()
    cy.wait(1000)
    cy.get('.el-table .link-btn-primary').eq(1).click()
    cy.wait(1000)
    cy.wait('@auth.info')
    // -------- 关闭编辑对话框
    cy.get('.dialog > header a').click()
    cy.wait(1000)

    // 删除权限
    cy.get('.el-table .link-btn-danger').eq(76).click()
    cy.get('.el-message-box__btns .el-button--primary').click()
    cy.wait(['@auth.post', '@auth.list'])
    cy.wait(1000)

    // 搜索权限
    cy.get('.search-tools .v-input-box').click()
    cy.wait(1000)
    cy.get('.search-tools .v-input-box').type('文章')
    cy.wait(300)
    cy.get('.search-tools .v-input-box input').blur()
    cy.wait(1000)
  })
})
