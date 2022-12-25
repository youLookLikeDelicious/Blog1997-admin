describe('Test message manager', () => {
    before(() => {
        // 载入页面
        cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', { fixture: 'user' }).as('user')
        cy.intercept('get', Cypress.env('api_url') + '/csrf', { fixture: 'user/csrf.json' }).as('csrf')
        cy.intercept('get', Cypress.env('api_url') + '/admin/illegal-info', { fixture: 'message/illegal-info' }).as('illegal.info')
        cy.visit(Cypress.env('host') + '/message/illegal-info')
    })

    /**
     * 载入消息页面
     */
    it('Test illegal info', () => {
        cy.wait(['@user', '@illegal.info'])
    })

    /**
     * 测试忽略举报的记录
     */
    it('Test ignore report', () => {
        cy.intercept('get', Cypress.env('api_url') + '/admin/illegal-info', { fixture: '/message/illegal-info-ignored' }).as('illegal.info.ignored')
        cy.intercept('post', Cypress.env('api_url') + '/admin/illegal-info/ignore/*', { message: '操作成功', status: 'success' }).as('illegal.info.ignore')
        cy.get('.el-table .icofont-focus').eq(0).click()
        cy.wait('@illegal.info.ignore')
        cy.wait(1000)
    })

    /**
     * 测试通过举报的内容
     */
    it('Test approve report', () => {
        cy.intercept('get', Cypress.env('api_url') + '/admin/illegal-info', { fixture: 'message/illegal-info-approved' }).as('illegal.info.approve')
        cy.intercept('post', Cypress.env('api_url') + '/admin/illegal-info/approve/*', { message: '操作成功', status: 'success' })

        cy.get('.el-table .icofont-court-hammer').eq(1).click()
        cy.wait('@illegal.info.approve')
        cy.wait(1000)
    })
});
