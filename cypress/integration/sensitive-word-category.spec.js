describe('Test sensitive category', () => {
    before(() => {
        cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', { fixture: 'user' }).as('user')
        cy.intercept('post', Cypress.env('api_url') + '/csrf', { fixture: 'user/csrf.json' }).as('csrf')
        cy.intercept('get', Cypress.env('api_url') + '/admin/sensitive-word-category', { fixture: 'sensitive-word-category' }).as('list')
    })
    
    it('Visit sensitive word category', () => {
        cy.visit(Cypress.env('host') + '/sensitive-word/category')
        cy.wait('@list')
    })
    
    /**
     * 添加分类
     */
    it('Test store new category', () => {
        cy.intercept('post', Cypress.env('api_url') + '/admin/sensitive-word-category', { fixture: 'sensitive-word-category-store' }).as('sensitive-word-category-store')
        cy.intercept('get', Cypress.env('api_url') + '/admin/sensitive-word-category', { fixture: 'sensitive-word-category-created.json' }).as('list')
        cy.get('.search-tools .btn-primary').click()

        cy.get('.sensitive-word-inline-form input').eq(0).click()
        cy.wait(300)
        // ------------- 编辑名称
        cy.get('.sensitive-word-inline-form input').eq(0).type('不喜欢')
        // ------------- 修改屏蔽级别
        cy.get('.sensitive-word-inline-form .el-select').click()
        cy.wait(300)
        // ------------- 上传
        cy.get('.sensitive-word-inline-form .icofont-upload-alt').click()
        cy.wait(['@sensitive-word-category-store', '@list'])
        cy.wait(1000)
    })

    /**
     * 修改分类
     */
    it('Test modify category', () => {
        cy.intercept('post', Cypress.env('api_url') + '/admin/sensitive-word-category/*', { "status": "success", "message": "修改成功", "data": "" }).as('sensitive-word-category-update')
        cy.intercept('get', Cypress.env('api_url') + '/admin/sensitive-word-category', { fixture: 'sensitive-word-category-updated.json' }).as('list')
        cy.get('.cell .link-btn-primary').eq(0).click()
        cy.wait(300)
        
        cy.get('table .sensitive-word-inline-form input').eq(0).click()
        cy.wait(300)
        // ------------- 修改名称
        cy.get('table .sensitive-word-inline-form input').eq(0).clear()
        cy.get('table .sensitive-word-inline-form input').eq(0).type('不高兴')
        cy.wait(300)

        cy.get('.el-select-dropdown').eq(-1).get('li').eq(1).click({ force: true })
        cy.wait(300)
        // ------------- 上传
        cy.get('table .sensitive-word-inline-form .link-btn-primary').eq(1).click()
        cy.wait('@sensitive-word-category-update')
        cy.wait(1000)
    })
    
    /**
     * 删除分类
     */
    it('Test destroy category', () => {
        cy.intercept('post', Cypress.env('api_url') + '/admin/sensitive-word-category/*', { fixture: 'sensitive-word-category-destroy' }).as('sensitive-word-category-destroy')
        cy.intercept('get', Cypress.env('api_url') + '/admin/sensitive-word-category', { fixture: 'sensitive-word-category' }).as('list')
        cy.get('table .link-btn-danger').eq(0).click()
        cy.get('.el-message-box').find('.el-button--primary').click()

        cy.wait(['@sensitive-word-category-destroy', '@list'])
    })

    /**
     * 搜索分类
     */
    it('Test search', () => {
        cy.intercept('get', Cypress.env('api_url') + '/admin/sensitive-word-category*', { fixture: 'sensitive-word-category-search' }).as('list')

        // ------ 输入关键字
        cy.get('.search-tools input').eq(0).type('高兴')
        cy.wait(1000)
        cy.get('.search-tools input').eq(0).blur()
        // ------ 选择分类
        // cy.get('.search-tools .ui-select').click()
        cy.wait('@list')
        cy.wait(300)
        cy.wait(1000)
    })
});
