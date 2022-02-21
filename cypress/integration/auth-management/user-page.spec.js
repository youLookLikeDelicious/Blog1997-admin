describe('Test authorize manage', () => {
  before(() => {
    cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', { fixture: 'user.json' }).as('user')
    cy.intercept('get', Cypress.env('api_url') + '/admin/auth', { fixture: 'auth-list' }).as('auth.list')
  })

  it('Load page', () => {
    cy.visit(Cypress.env('host') + '/auth')
    cy.wait(['@user', '@auth.list'])
  })

  it('Test manage manager', () => {
    cy.intercept('get', Cypress.env('api_url') + '/admin/manager?role_id=3', { fixture: 'manager-search' })
    cy.intercept('get', Cypress.env('api_url') + '/admin/manager/create', { fixture: 'manager-create' }).as('manager.create')
    cy.intercept('get', Cypress.env('api_url') + '/admin/manager/user/454948077@qq.com', { fixture: 'manager-user' }).as('manager.user')
    cy.intercept('get', Cypress.env('api_url') + '/admin/manager', { fixture: 'manager' })
    // 用户的头像
    cy.intercept('get', 'https://www.blog1997.com/image/avatar/2020-10-29/95a5c0e7e08e4873cefa7b3962a66884', { fixture: 'images/avatar2.jpg' })
    cy.intercept('post', Cypress.env('api_url') + '/admin/manager/3', (req) => {
      const fixture = req.body.indexOf('roles') >= 0 ? { fixture: 'manager-store' } : { fixture: 'manager-store-without-role' }
      req.reply(fixture)
    }).as('manager.store')

    cy.get('.sidebar a[href="/admin/manager"]').click()

    // 添加一个管理员
    cy.wait(1000)
    cy.get('.tool-bar a[name="create"]').click()
    cy.wait('@manager.create')
    // ------------ 填写邮箱
    cy.get('.create-manager input').eq(0).click()
    cy.wait(300)
    cy.get('.create-manager input').eq(0).type('454948077@qq.com')
    cy.wait(1000)
    // ------------ 选择角色
    cy.get('.create-manager input[type="checkbox"]').eq(0).click()
    cy.get('.create-manager input[type="checkbox"]').eq(2).click()
    cy.get('.create-manager input[type="checkbox"]').eq(1).click()
    // ------------ 提交
    cy.get('.create-manager .btn-enable').click()
    cy.wait('@manager.store')

    // 去除管理员所有的角色
    cy.wait(1000)
    cy.get('.data-list .icofont-edit').eq(2).click()
    cy.get('.create-manager input[type="checkbox"]').eq(0).click()
    cy.get('.create-manager input[type="checkbox"]').eq(2).click()
    cy.get('.create-manager input[type="checkbox"]').eq(1).click()
    // ------------ 提交
    cy.get('.create-manager .btn-enable').click()
    cy.wait('@manager.store')
    cy.wait(1000)

    // 搜索管理员
    cy.get('.search-tools .ui-select').click()
    cy.wait(1000)
    cy.get('.search-tools .ui-select input').type('a')
    cy.get('.search-tools .ui-select li').eq(0).click()
    // -------- 点击搜索按钮
    cy.get('.search-tools .btn-enable').click()
    cy.wait(1000)
  })
})
