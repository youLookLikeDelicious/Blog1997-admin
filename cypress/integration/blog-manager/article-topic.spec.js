// 专题列表页面测试
describe('Test article topic', () => {
    before(() => {
        cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', {
            fixture: 'user.json'
            }).as('user')
        cy.intercept('post', Cypress.env('api_url') + '/csrf', {
            fixture: 'user/csrf.json'
        })
        cy.intercept('get', Cypress.env('api_url') + '/admin/topic', {
            fixture: 'article-topic/list.json'
        }).as('article-topic.list')
    })
    it('Visit topic page', () => {
        cy.visit(Cypress.env('host') + '/article/topic')
        cy.wait(['@user', '@article-topic.list'])
    })
    it('Test create topic', () => {
        cy.intercept('get', Cypress.env('api_url') + '/admin/topic', { fixture: 'article-topic/appended-list' }).as('topic.list')
        cy.intercept('post', Cypress.env('api_url') + '/admin/topic', req => req.reply({message: '添加成功'})).as('topic.create')
        cy.get('.right-btn .btn-primary').click()
        cy.wait(1000)
        cy.get('.create-topic input').click()
        cy.wait(1000)
        cy.get('.create-topic input').type('CV')
        cy.get('.create-topic .link-btn-primary').eq(1).click()
        cy.wait(['@topic.list'])
    })
    it('Test edit topic', () => {
        cy.intercept('get', Cypress.env('api_url') + '/admin/topic', { fixture: 'article-topic/updated-list' }).as('topic.list')
        cy.intercept('post', Cypress.env('api_url') + '/admin/topic/15', req => req.reply({ message: '更新成功' })).as('topic.update')
        cy.get('.el-table .link-btn-primary ').eq(0).click()
        cy.wait(1000)
        cy.get('.el-table .v-input-inline input').type('更新了')
        cy.get('.el-table .create-topic .link-btn-primary').eq(1).click()
        cy.wait(['@topic.update', '@topic.list'])
        cy.wait(1000)
    })
    it('Test delete', () => {
        cy.intercept('get', Cypress.env('api_url') + '/admin/topic', { fixture: 'article-topic/deleted-list' }).as('topic.list')
        cy.intercept('post', Cypress.env('api_url') + '/admin/topic/15', req => req.reply({ message: '删除成功' })).as('topic.delete')
        cy.get('.el-table .link-btn-danger').eq(0).click()
        cy.get('.el-message-box .el-button--primary').click()
        cy.wait(1000)
        cy.wait(['@topic.delete', '@topic.list'])
        cy.wait(1000)
    })
})
