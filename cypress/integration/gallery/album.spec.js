describe('Test album', () => {
  beforeEach(() => {
    cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', { fixture: 'user' }).as('user')
    cy.intercept('post', Cypress.env('api_url') + '/csrf', { fixture: 'user/csrf.json' }).as('csrf')
    cy.intercept('get', Cypress.env('api_url') + '/admin/gallery/album*', { fixture: 'gallery/album.json' }).as('list')

    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2022-09-05/829.578764001615ff1dfaf8d4e60.42187602.jpg*', { fixture: 'images/gallery/new-gallery.jpg' })
    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2022-09-05/58.685566001615ff1dfb1a76071.41032210.jpg*', { fixture: 'images/gallery/new-gallery-2.jpg' })
  })

  // 列表
  it('Test index', () => {
    cy.intercept('get', Cypress.env('api_url') + '/admin/gallery?*', { fixture: 'gallery/list' }).as('image.list')
    cy.visit(Cypress.env('host') + '/gallery/album')
    cy.wait('@list')
    cy.wait(1000)
    cy.get('.album-box').eq(0).click()
    cy.wait('@image.list')
    cy.wait(2000)
    cy.get('.el-page-header .el-page-header__title').click()
    cy.wait(3000)
  })
  
  // 添加
  it('Test add', () => {
    cy.intercept('post', Cypress.env('api_url')  + '/admin/gallery/album', { "status": "success", "message": "添加成功", "data": "" }).as('store')
    cy.intercept('get', Cypress.env('api_url') + '/admin/gallery/album*', { fixture: 'gallery/album-updated.json' }).as('list')
    cy.get('.search-tools .btn-primary').eq(1).click()
    cy.wait(300)
    cy.get('.album-create-wrapper input').type('相册3')
    cy.wait(300)
    cy.get('.album-create-wrapper textarea').type(`
      ---
        /(ㄒoㄒ)/~~
      ---
    `)
    cy.wait(300)
    cy.get('.dialog-footer .btn-primary').eq(0).click()
    cy.wait(['@store', '@list'])
    cy.wait(2000)
  })

  // 删除
  it('Test delete', () => {
    cy.intercept('get', Cypress.env('api_url') + '/admin/gallery/album*', { fixture: 'gallery/album.json' }).as('list')
    cy.intercept('post', Cypress.env('api_url') + '/admin/gallery/album/*', { "status": "success", "message": "删除成功", "data": "" }).as('delete')
    cy.wait(2000)
    cy.get('.album-list .tool-bar .link-btn-default').eq(0).click()
    cy.get('.el-message-box .el-message-box__btns .el-button--primary').click()
    cy.wait(['@delete'])
    cy.wait(2000)
  })
})
