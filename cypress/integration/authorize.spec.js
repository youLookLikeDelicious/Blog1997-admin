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

  // it('Test manage role', () => {
  //   cy.intercept('get', Cypress.env('api_url') + '/admin/role?name=%E7%94%A8%E6%88%B7', { fixture: 'role-search' }).as('role.search')
  //   cy.intercept('get', Cypress.env('api_url') + '/admin/role', { fixture: 'role-list' }).as('role.list')
  //   cy.get('.sidebar a[href="/admin/role"]').click()
  //   cy.wait('@role.list')
  //   cy.wait(2000)

  //   cy.intercept('post', Cypress.env('api_url') + '/admin/role/4', (req) => {
  //     const response = req.body._method === 'DELETE' ? {
  //       fixture: 'role-destroy-4'
  //     } : {
  //       fixture: 'role-put-4'
  //     }
  //     req.reply(response)
  //   }).as('role.post')
  //   cy.intercept('get', Cypress.env('api_url') + '/admin/auth/create', { fixture: 'role-create' }).as('role.create')
  //   cy.intercept('post', Cypress.env('api_url') + '/admin/role', { fixture: 'role-store' }).as('role.store')
  //   // 创建一个新的角色
  //   cy.get('.tool-bar a[name="create"]').click()
  //   cy.wait('@role.create')
  //   // -------------- 填写角色名称
  //   cy.get('.create-role .v-input-inline input').click()
  //   cy.wait(1000)
  //   cy.get('.create-role .v-input-inline input').type('Auditor')
  //   cy.wait(1000)
  //   // -------------- 填写备注
  //   cy.get('.create-role textarea').type('审核评论和举报信息')
  //   // -------------- 设置相关的权限
  //   // -------------- ------------- 点击博客管理权限
  //   cy.get('.create-role .xy-checkbox').eq(0).click({ force: true })
  //   // -------------- ------------- 展开博客权限
  //   cy.get('.tree-node a').eq(0).click()
  //   // ---------------------------- 展开博客权限下所有的子权限
  //   cy.get('.tree-node a').eq(1).click()
  //   cy.get('.tree-node a').eq(2).click()
  //   cy.get('.tree-node a').eq(3).click()
  //   // ---------------------------- 取消查看专题权限
  //   cy.get('.create-role .xy-checkbox').eq(0).scrollIntoView()
  //   cy.wait(1000)
  //   cy.get('.create-role .xy-checkbox').eq(2).click()
  //   cy.wait(1000)
  //   cy.get('.create-role .xy-checkbox').eq(0).scrollIntoView()
  //   cy.wait(1000)
  //   cy.get('.create-role .xy-checkbox').eq(2).click()
  //   cy.get('.create-role .xy-checkbox').eq(0).scrollIntoView()
  //   cy.wait(1000)
  //   // -------------- 提交表单
  //   cy.get('.create-role .btn-enable').scrollIntoView()
  //   cy.wait(1000)
  //   cy.get('.create-role .btn-enable').click()
  //   cy.wait('@role.store')

  //   // 编辑新创建的角色
  //   cy.get('.icofont-edit').eq(0).click()
  //   cy.get('.xy-checkbox').eq(0).scrollIntoView()
  //   cy.wait(1000)
  //   cy.get('.xy-checkbox').eq(0).click()
  //   cy.get('td > .tree-list > li').eq(1).find('.xy-checkbox').eq(0).click()
  //   // -------------- 重新提交表单
  //   cy.get('.create-role .btn-enable').scrollIntoView()
  //   cy.wait(1000)
  //   cy.get('.create-role .btn-enable').click()
  //   cy.wait('@role.post')
  //   cy.wait(1000)

  //   // 删除角色
  //   cy.get('.icofont-delete').eq(0).click()
  //   cy.wait('@role.post')
  //   cy.wait(1000)

  //   // 搜索角色
  //   cy.get('.search-tools input').click()
  //   cy.wait(300)
  //   cy.get('.search-tools input').type('用户')
  //   cy.get('.search-tools .btn-enable').click()
  //   cy.wait(1000)
  // })

  // it('Test manage manager', () => {
  //   cy.intercept('get', Cypress.env('api_url') + '/admin/manager?role_id=3', { fixture: 'manager-search' })
  //   cy.intercept('get', Cypress.env('api_url') + '/admin/manager/create', { fixture: 'manager-create' }).as('manager.create')
  //   cy.intercept('get', Cypress.env('api_url') + '/admin/manager/user/454948077@qq.com', { fixture: 'manager-user' }).as('manager.user')
  //   cy.intercept('get', Cypress.env('api_url') + '/admin/manager', { fixture: 'manager' })
  //   // 用户的头像
  //   cy.intercept('get', 'https://www.blog1997.com/image/avatar/2020-10-29/95a5c0e7e08e4873cefa7b3962a66884', { fixture: 'images/avatar2.jpg' })
  //   cy.intercept('post', Cypress.env('api_url') + '/admin/manager/3', (req) => {
  //     const fixture = req.body.indexOf('roles') >= 0 ? { fixture: 'manager-store' } : { fixture: 'manager-store-without-role' }
  //     req.reply(fixture)
  //   }).as('manager.store')

  //   cy.get('.sidebar a[href="/admin/manager"]').click()

  //   // 添加一个管理员
  //   cy.wait(1000)
  //   cy.get('.tool-bar a[name="create"]').click()
  //   cy.wait('@manager.create')
  //   // ------------ 填写邮箱
  //   cy.get('.create-manager input').eq(0).click()
  //   cy.wait(300)
  //   cy.get('.create-manager input').eq(0).type('454948077@qq.com')
  //   cy.wait(1000)
  //   // ------------ 选择角色
  //   cy.get('.create-manager input[type="checkbox"]').eq(0).click()
  //   cy.get('.create-manager input[type="checkbox"]').eq(2).click()
  //   cy.get('.create-manager input[type="checkbox"]').eq(1).click()
  //   // ------------ 提交
  //   cy.get('.create-manager .btn-enable').click()
  //   cy.wait('@manager.store')

  //   // 去除管理员所有的角色
  //   cy.wait(1000)
  //   cy.get('.data-list .icofont-edit').eq(2).click()
  //   cy.get('.create-manager input[type="checkbox"]').eq(0).click()
  //   cy.get('.create-manager input[type="checkbox"]').eq(2).click()
  //   cy.get('.create-manager input[type="checkbox"]').eq(1).click()
  //   // ------------ 提交
  //   cy.get('.create-manager .btn-enable').click()
  //   cy.wait('@manager.store')
  //   cy.wait(1000)

  //   // 搜索管理员
  //   cy.get('.search-tools .ui-select').click()
  //   cy.wait(1000)
  //   cy.get('.search-tools .ui-select input').type('a')
  //   cy.get('.search-tools .ui-select li').eq(0).click()
  //   // -------- 点击搜索按钮
  //   cy.get('.search-tools .btn-enable').click()
  //   cy.wait(1000)
  // })
})
