describe('Test authorize manage', () => {
  beforeEach(() => {
    cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', { fixture: 'user.json' }).as('user')
    // cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', req => {
    //   req.headers['Cookie'] = 'XSRF-TOKEN=eyJpdiI6IkswYUFHNHRma1lNbVRjZkdMZ3dCXC9BPT0iLCJ2YWx1ZSI6InY3U05PNzRIbDQrdlwvcHNnNnhnMWMwb1Y1SDFzN2NFbDFMQ0xlMkdDbmVuNEJhb3pPam9EczhZRHZRMklPR2dMIiwibWFjIjoiYzIyYjNlY2JiMWIyMGFmZWRhOWUyMzMyNzgyMWFhN2UxNDdmZjRmYjg1Yzk0ZjUyZjM3NzZjNWFjODhjNmRhMCJ9; blog1997_session=eyJpdiI6IjFyZ0ZhU1pxV1dHbkpRS1QxSml4OXc9PSIsInZhbHVlIjoiVjFcL0k2bDNwS1AwNUJFbDVwQWsrVmRVQXdSRVlTWGRWcHk1QisrNm5Kc2tuRmhSUlExd1NrZ2RmOHJwYzd3aVYiLCJtYWMiOiJhYzI4NjBhZDdhOTNmYzg1MDJhYTU5NGM2ZmI0ZjFkOTEyY2EyNTIxYjEzNmI4YzU3NDlkODUwMmM3ZjU3YzljIn0%3D'
    //   req.headers['X-CSRF-TOKEN'] = 'SSgfITx06zn0897oKoIKxLhy3aUXRqGRTDoL4Wjc'
    // }).as('user')
    cy.intercept('get', Cypress.env('api_url') + '/admin/role', { fixture: 'role-list-0' }).as('role.list')
  })

  it('Load page', () => {
    cy.visit(Cypress.env('host') + '/role')
    cy.wait(['@user', '@role.list'])
  })

  it('Test manage role', () => {
    let roleListTick = 0
    cy.intercept('post', Cypress.env('api_url') + '/admin/role/1', (req) => {
      const response = req.body._method === 'DELETE' ? {
        fixture: 'role-destroy-4'
      } : {
        fixture: 'role-put-4'
      }
      req.reply(response)
    }).as('role.post')
    cy.intercept('post', Cypress.env('api_url') + '/admin/role', { fixture: 'role-store' }).as('role.store')
    cy.intercept('get', Cypress.env('api_url') + '/admin/auth', { fixture: 'auth-list' }).as('auth.list')
    cy.intercept('get', Cypress.env('api_url') + '/admin/role/1', { fixture: 'role-info' }).as('role.info')
    cy.intercept('get', Cypress.env('api_url') + '/admin/role*', req => { 
      ++roleListTick
      // if (roleListTick > 3) {
      //   console.log(roleListTick - 1)
      //   req.reply({ fixture: `role-list-${roleListTick - 1}` })
      // } else {
      //   console.log(roleListTick)
      // }
      req.reply({ fixture: `role-list-${roleListTick}` })
      }).as('role.list')

    // 创建一个新的角色
    cy.get('.right-btn .btn-primary').click()
    cy.wait(['@auth.list'])
    // -------------- 填写角色名称
    cy.get('.dialog-wrap .v-input-inline input').eq(0).click()
    cy.wait(1000)
    cy.get('.dialog-wrap .v-input-inline input').eq(0).type('用户')
    cy.wait(1000)
    // -------------- 填写备注
    cy.get('.dialog-wrap textarea').type(`个人理解只要平常工作中是做软件开发，涉及系统架构的，前两门通过的概率都很大，最难得通过的应该就是论文了，所以重点介绍一下论文。
    论文要求在两个小时内，写一篇2000~2500字的论文，估算一下，两个小时120分钟，除去审题，构思，写作时间可能只有100分钟，每分钟需要写20~25个字，每2~3秒写一个字，你可以感受一下。  
    参加工作后，实际写字机会已经不多，不要说写作，就是写字，有时都提笔忘字，所有论文一定要提前准备好3~5篇，最好抄写两遍，否则难有机会通过。
  `)
    // -------------- 设置相关的权限
    // -------------- ------------- 点击博客管理权限
    cy.get('.dialog-wrap .xy-checkbox').eq(0).click({ force: true })
    // -------------- ------------- 展开博客权限
    cy.get('.tree-node a').eq(0).click()
    // ---------------------------- 展开博客权限下所有的子权限
    cy.get('.tree-node a').eq(1).click()
    cy.get('.tree-node a').eq(2).click()
    cy.get('.tree-node a').eq(3).click()
    // ---------------------------- 取消查看专题权限
    cy.get('.dialog-wrap .xy-checkbox').eq(0).scrollIntoView()
    cy.wait(1000)
    cy.get('.dialog-wrap .xy-checkbox').eq(2).click()
    cy.wait(1000)
    cy.get('.dialog-wrap .xy-checkbox').eq(0).scrollIntoView()
    cy.wait(1000)
    cy.get('.dialog-wrap .xy-checkbox').eq(0).scrollIntoView()
    cy.wait(1000)
    // -------------- 提交表单
    cy.get('.dialog-footer .btn-primary').scrollIntoView().click()
    cy.wait(1000)
    cy.wait(['@role.store', '@role.list'])
    cy.wait(1000)

    // 编辑新创建的角色
    cy.get('.icofont-edit').eq(0).click()
    cy.get('.xy-checkbox').eq(0).scrollIntoView()
    cy.wait(1000)
    cy.get('.xy-checkbox').eq(0).click()
    cy.get('.tree-list > li').eq(1).find('.xy-checkbox').eq(0).click()
    // -------------- 重新提交表单
    cy.get('.dialog-footer .btn-primary').scrollIntoView()
    cy.wait(1000)
    cy.get('.dialog-footer .btn-primary').click()
    cy.wait(['@role.post', '@role.list'])
    cy.wait(1000)

    // 删除角色
    cy.get('.icofont-delete').eq(0).click()
    cy.get('.el-message-box .el-button--primary').click()
    cy.wait(['@role.post', '@role.list'])
    cy.wait(1000)

    // 搜索角色
    cy.get('.search-tools input').click()
    cy.wait(300)
    cy.get('.search-tools input').type('Master')
    cy.wait(1000)
    cy.get('.search-tools input').blur()
    cy.wait(['@role.list'])
    cy.wait(1000)
  })
})
