describe('Test friend link', () => {
    before(() => {
        cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', { fixture: 'user' }).as('user')
        cy.intercept('get', Cypress.env('api_url') + '/csrf', { fixture: 'user/csrf.json' }).as('csrf')
        cy.intercept('get', Cypress.env('api_url') + '/admin/friend-link', { fixture: 'friend-link/list' }).as('list')
    })

    it('Visit friend link', () => {
        cy.visit(Cypress.env('host') + '/friend-link')
        cy.wait(['@user', '@list'])
    })

    /**
     * 测试添加友链
     */
    it('Test store new friend link', () => {
        cy.intercept('post', Cypress.env('api_url') + '/admin/friend-link', res => res.reply({message: '添加成功'})).as('store')
        cy.intercept('get', Cypress.env('api_url') + '/admin/friend-link', { fixture: 'friend-link/appended-list' }).as('list')

        cy.get('.right-btn .btn-primary').click()
        cy.wait(300)
        // ----------- 填写名称
        cy.get('.create-friend-link input').eq(0).click()
        cy.wait(300)
        cy.get('.create-friend-link input').eq(0).type('Friend Link')
        cy.wait(300)
        // ----------- 填写地址
        cy.get('.create-friend-link input').eq(1).click()
        cy.wait(300)
        cy.get('.create-friend-link input').eq(1).type('https://www.blog1997.com')
        cy.get('.create-friend-link .link-btn-primary').eq(1).click()
        cy.wait(['@store', '@list'])
        cy.wait(1000)
    })

    /**
     * 测试更新友链信息
     */
    it('Test update friend link', () => {
        cy.intercept('post', Cypress.env('api_url') + '/admin/friend-link/*', res => res.reply({ message: '更新成功' })).as('update')
        cy.intercept('get', Cypress.env('api_url') + '/admin/friend-link', { fixture: 'friend-link/updated-list' }).as('list')
        cy.get('.el-table .link-btn-primary').eq(0).click()
        cy.wait(300)

        // 修改名称
        cy.get('.el-table .create-friend-link input').eq(0).clear()
        cy.get('.el-table .create-friend-link input').eq(0).type('new name')
        // 修改连接地址
        cy.get('.el-table .create-friend-link input').eq(1).clear()
        cy.get('.el-table .create-friend-link input').eq(1).type('https://www.chaosxy.com')
        cy.get('.el-table .create-friend-link .link-btn-primary').eq(1).click()
        cy.wait(['@update', '@list'])
        cy.wait(1000)
    })

    /**
     * 删除友链
     */
    it('Test destroy friend link', () => {
        cy.intercept('post', Cypress.env('api_url') + '/admin/friend-link/*', res => res.reply({ message: '删除成功' })).as('destroy')
        cy.intercept('get', Cypress.env('api_url') + '/admin/friend-link', { fixture: 'friend-link/deleted-list' }).as('list')

        cy.get('.el-table .link-btn-danger').eq(0).click()
        cy.get('.el-message-box .el-button--primary').click()
        cy.wait(['@destroy', '@list'])
        cy.wait(1000)
    })

    /**
     * 测试查询友链
     */
    it('Test search friend link', () => {
        cy.intercept('get', Cypress.env('api_url') + '/admin/friend-link?name=Docker', { fixture: 'friend-link/search-list' }).as('list')

        cy.get('.search-tools .v-input-box').click()
        cy.wait(300)
        cy.get('.search-tools input').type('Docker')
        cy.get('.search-tools input').blur()
        cy.wait('@list')
    })
});
