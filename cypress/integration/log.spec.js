describe('Test log', () => {
    before(() => {
        cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', {
            fixture: 'user'
        }).as('user')
    })

    it('Visit page', () => {
        cy.intercept('get', 'https://www.blog1997.com/admin/system/schedule-log', { fixture: 'log-schedule' }).as('log.schedule')
        cy.intercept('get', Cypress.env('api_url') + '/admin/log', { fixture: 'log-user' }).as('log.user')
        cy.visit(Cypress.env('host') + '/system/user-log')
        cy.wait('@log.user')
        cy.wait(1000)

        // 查看任务日志
        cy.get('.sidebar a[href="/admin/system/schedule-log"]').click()
        cy.wait(1000)
    })
});
