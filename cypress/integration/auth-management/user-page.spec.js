describe('Test authorize manage', () => {
  before(() => {
    cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', { fixture: 'user.json' }).as('user')
    cy.intercept('get', Cypress.env('api_url') + '/admin/manager/create', { fixture: 'auth/user/manager-create.json' }).as('manager.create')
    cy.intercept('post', Cypress.env('api_url') + '/csrf', { fixture: 'user/csrf.json' })
    cy.intercept('get', Cypress.env('api_url') + '/admin/user', { fixture: 'auth/user/user-list-0' }).as('user.list')
    cy.intercept('get', Cypress.env('image_url') + '/image/avatar/2021-10-06/449.97207100163615dc2d4ed5358.jpg', { fixture: 'images/avatar' }).as('avatar')
    cy.intercept('get', Cypress.env('image_url') + '/image/avatar/2021-10-06/449.97207100163615dc2d4ed5358.62463263.jpg', { fixture: 'images/avatar2' })
  })

  it('Load page', () => {
    cy.visit(Cypress.env('host') + '/user')
    cy.wait(['@user', '@user.list', '@avatar'])
  })

  it('Test manage manager', () => {
    let userListTick = 0
    cy.intercept('get', Cypress.env('api_url') + '/admin/user*', req => {
      req.reply({ fixture: `auth/user/user-list-${userListTick++}` })
    }).as('user.list')
    cy.intercept('get', Cypress.env('api_url') + '/admin/manager/create', { fixture: 'manager-create' }).as('manager.create')
    cy.intercept('get', Cypress.env('api_url') + '/admin/user/2', { fixture: 'auth/user/user-info' }).as('user.info')
    cy.intercept('put', Cypress.env('api_url') + '/admin/manager/2', req => {
      req.reply({message: '角色分配成功'})
    }).as('assign.role')
    cy.intercept('post', Cypress.env('api_url') + '/admin/user/freeze/2', req => { req.reply({message: '冻结成功'}) }).as('freeze')

    // 头像
    cy.intercept('get', Cypress.env('image_url') + '/image/avatar/2021-10-06/449.97207100163615dc2d4ed5358.62463263.jpg', { fixture: 'images/avatar2' })
    cy.intercept('get', Cypress.env('image_url') + '/image/avatar/2021-10-06/449.97207100163615dc2d4ed5358.jpg', { fixture: 'images/avatar' })

    // 分配权限
    cy.get('.link-btn-primary').eq(1).click()
    cy.wait(['@user.info', '@manager.create'])
    cy.get('.dialog .el-select').click()
    cy.wait(1000)
    cy.get('body > .el-select-dropdown .el-select-dropdown__item').eq(2).click()
    cy.wait(1000)
    // -------------提交表单
    cy.get('.dialog .btn-primary').click()
    cy.wait(['@assign.role', '@user.list'])

    // 冻结
    cy.get('.link-btn-danger').eq(1).click()
    cy.wait(['@freeze', '@user.list'])
    cy.wait(1000)

    // 搜索
    cy.get('.search-tools .v-input-box').click()
    cy.wait(1000)
    cy.get('.search-tools .v-input-box input').type('呆')
    cy.get('.search-tools .v-input-box input').blur()
    cy.wait(['@user.list'])
    cy.wait(1000)
    cy.get('.search-tools .el-select').click()
    cy.get('.auth-user-popper .el-select-dropdown__item').eq(1).click()
    cy.wait('@user.list')
    cy.wait(2000)
  })
})
