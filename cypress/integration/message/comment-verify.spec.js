describe('Test message manager', () => {
  before(() => {
      // 载入页面
      cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', { fixture: 'user' }).as('user')
      cy.intercept('get', Cypress.env('api_url') + '/csrf', { fixture: 'user/csrf.json' }).as('csrf')
      cy.visit(Cypress.env('host') + '/message/comments')
  })

  /**
   * 测试需要验证的评论
   */
  it('Test comments', () => {
      cy.intercept('get', Cypress.env('api_url') + '/admin/comment', {
          fixture: 'message/verify-comments'
      }).as('comments')
      cy.wait(1000)
      // 点击待审核评论菜单
      cy.wait('@comments')

      // 评论审批通过
      cy.intercept('post', Cypress.env('api_url') + '/admin/comment/approve', { message: '操作成功', status: 'success' }).as('comment.approve')
      cy.get('.el-table .link-btn-primary').eq(0).click()
      cy.wait('@comment.approve')
      cy.wait(1000)
      
      cy.intercept('get', Cypress.env('api_url') + '/admin/comment', {
          fixture: 'message/verify-comments-passed'
      }).as('comments')
      // ------------批量通过
      cy.get('.el-table .el-checkbox__input').eq(0).click()
      cy.wait(1000)
      // ----------- 单击子选项
      cy.get('.el-table .el-checkbox__input').eq(0).click()
      cy.wait(1000)
      // ----------- 再次单击全选按钮
      cy.get('.el-table .el-checkbox__input').eq(0).click()
      cy.wait(1000)

      cy.get('.el-table .el-checkbox__input').eq(1).click()
      cy.get('.el-table .el-checkbox__input').eq(2).click()
      cy.wait(1000)
      cy.get('.tool-bar .btn-primary').click()
      cy.wait('@comment.approve')
      cy.wait(1000)

      // 测试评论审核不通过
      cy.intercept('get', Cypress.env('api_url') + '/admin/comment', {
        fixture: 'message/verify-comments-empty'
      }).as('comment')
      cy.intercept('post', Cypress.env('api_url') + '/admin/comment/reject', {
          fixture: 'comment-reject'
      }).as('comment.reject')
      
      cy.get('.el-table .el-checkbox__input').eq(0).click() // -- 全选
      cy.get('.tool-bar .btn-danger').click()
      cy.wait('@comment')
  })
});
