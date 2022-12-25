describe('Test message manager', () => {
  before(() => {
      // 载入页面
      cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', { fixture: 'user' }).as('user')
      cy.intercept('get', Cypress.env('api_url') + '/csrf', { fixture: 'user/csrf.json' }).as('csrf')
      cy.intercept('get', Cypress.env('api_url') + '/admin/notification', { fixture: 'message/notification' }).as('notification')
      cy.visit(Cypress.env('host') + '/message/notification')
  })

  /**
   * 测试通知的内容
   */
  it('Test notification', () => {
      cy.wait('@notification')

      // 回复评论
      cy.intercept('post', Cypress.env('api_url') + '/comment', {fixture: 'comment-reply'}).as('comment.reply')
      cy.wait(1000)
      cy.get('.comment').eq(0).trigger('mouseenter')
      cy.wait(1000)
      cy.get('.comment-box .link-btn-primary').eq(0).click()
      // ------ 向下滚动页面
      // cy.get('.comment-box .btn-wrapper a').eq(1).scrollIntoView()
      cy.wait(1000)
      cy.get('.edui-icon-emotion').eq(0).click()
      cy.get('.edui-emotion-jd').eq(0).click()
      cy.wait(1000)
      cy.get('.edui-body-container').eq(0).scrollIntoView()
      cy.get('.edui-body-container').eq(0).type('少林功夫好啊~')
      cy.wait(1000)
      cy.get('.comment-box .btn-wrapper a').eq(1).click()
      cy.wait('@comment.reply')
      cy.wait(1000)
  })
});
