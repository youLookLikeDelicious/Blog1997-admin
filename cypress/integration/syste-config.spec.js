describe('Test config system', () => {
    before(() => {
        cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', {
            fixture: 'user'
        }).as('user')
        cy.intercept('get', Cypress.env('api_url') + '/csrf', { fixture: 'user/csrf.json' }).as('csrf')
    })
    
    /**
     * 访问页面
     */
    it('Visit page', () => {
        cy.intercept('get', Cypress.env('api_url') + '/admin/system-setting', { fixture: 'system-setting' }).as('system.setting')
        cy.visit(Cypress.env('host') + '/system/setting')
        cy.wait(['@user', '@system.setting'])
    })

    /**
     * 测试开启|关闭评论
     * 测试开启|关闭 审核评论
     */
    it('Test toggle enable comment', () => {
        cy.wait(1000)
        cy.intercept('put', Cypress.env('api_url') + '/admin/system-setting/*', (req) => {
            let fixture
            console.log(JSON.stringify(req.body))
            switch (JSON.stringify(req.body)) {
                case '{"enable_comment":"yes","verify_comment":"no","id":1}':
                        fixture = { fixture: 'system-setting-disable-comment' }
                        break
                case '{"enable_comment":"yes","verify_comment":"yes","id":1}':
                    fixture = { fixture: 'system-setting-enable-comment' }
                    break
                case '{"enable_comment":"no","verify_comment":"yes","id":1}':
                    fixture = { fixture: 'system-setting-disable-verify-comment' }
                    break
                case '{"enable_comment":"yes","verify_comment":"yes","id":1}':
                    fixture = { fixture: 'system-setting-enable-comment' }
                    break
            }
            
            req.reply(fixture)
        }).as('setting.update')

        cy.get('.v-switch').eq(0).click()
        cy.wait('@setting.update')
        cy.wait(1000)
        cy.get('.v-switch').eq(0).click()
        cy.wait('@setting.update')
        cy.wait(1000)
        cy.get('.v-switch').eq(1).click()
        cy.wait('@setting.update')
        cy.wait(1000)
        cy.get('.v-switch').eq(1).click()
        cy.wait('@setting.update')
        cy.wait(1000)
    })

    /**
     * 测试邮箱配置
     */
    it('Test config email', () => {
        cy.intercept('put', Cypress.env('api_url') + '/admin/email-config/*', { fixture: 'email-config-update' }).as('email.config.update')
        cy.intercept('get', Cypress.env('api_url') + '/admin/email-config', { fixture: 'email-config' })
        cy.get('li[data-name=EmailSetting]').click()
        cy.get('input[name=email]').clear()
        cy.get('input[name=email]').type('blog_1997@163.coms')
        
        // ------ 提交
        cy.get('.email-setting .btn-enable').click()
        cy.wait('@email.config.update')
        cy.wait(1000)
    })
});
