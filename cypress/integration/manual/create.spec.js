describe('Test message manager', () => {
  before(() => {
      // 载入页面
      cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', { fixture: 'user' }).as('user')
      cy.intercept('get', Cypress.env('api_url') + '/csrf', { fixture: 'user/csrf.json' }).as('csrf')
      cy.intercept('get', Cypress.env('api_url') + '/admin/manual', { fixture: 'manual/list.json' }).as('list')

      // 封面
      cy.intercept('get', 'https://www.blog1997.com/image/manual/2.jpg', { fixture: 'images/gallery/2.jpg' })
      cy.intercept('get', 'https://www.blog1997.com/image/manual/3.jpg', { fixture: 'images/gallery/3.jpg' })
      
      cy.visit(Cypress.env('host') + '/manual')
    })
    it('test create', () => {
      cy.wait('@list')
      // 封面
      cy.intercept('get', 'https://www.blog1997.com/image/manual/4.jpg', { fixture: 'images/galaxy.jpg' })
      cy.intercept('post', Cypress.env('api_url') + '/admin/manual', { message: '手册创建成功', status: 'success' }).as('create')
      cy.intercept('get', Cypress.env('api_url') + '/admin/manual', { fixture: 'manual/created.json' })
      
      cy.get('.search-tools .btn-primary').click()
      cy.wait(1000)

      cy.get('.el-form .v-input-inline').eq(0).type('Go')
      cy.get('.el-form .v-input-inline textarea').type(`
        窗前明月光,
        疑是地上霜.
        举头望明月,
        低头思故乡
      `)
      cy.wait(1000)
      cy.get('.el-form input[name=file]').selectFile('cypress/fixtures/images/galaxy.jpg', { force: true })
      cy.wait(1000)
      cy.get('.dialog .btn-primary').click()
      cy.wait('@create')
  })
  // it()
})
