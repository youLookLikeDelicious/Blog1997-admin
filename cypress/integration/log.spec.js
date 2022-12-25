describe('Test log', () => {
    beforeEach(() => {
        cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', {
            fixture: 'user'
        }).as('user')
        cy.intercept('get', Cypress.env('api_url') + '/csrf', { fixture: 'user/csrf.json' }).as('csrf')
        cy.intercept('get', Cypress.env('api_url') + '/admin/log/schedule', { fixture: 'log-schedule' }).as('log.schedule')
        cy.intercept('get', Cypress.env('api_url') + '/admin/log', { fixture: 'log-user' }).as('log.user')
    })

    it('Visit page', () => {
        cy.visit(Cypress.env('host') + '/system/user-log')
        cy.wait(['@log.user', '@user'])

        cy.wait(1000)
        // 查看任务日志
        cy.get('a[href="/system/schedule-log"]').click()
        cy.wait(1000)
    })
});
