describe('Test gallery', () => {
  beforeEach(() => {
    cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', { fixture: 'user' }).as('user')
    cy.intercept('post', Cypress.env('api_url') + '/csrf', { fixture: 'user/csrf.json' }).as('csrf')
    cy.intercept('get', Cypress.env('api_url') + '/admin/gallery*', req => {
      const { color } = req.query
      const res = {}
      if (color) {
        res.fixture = 'gallery/list-blue'
      } else {
        res.fixture = 'gallery/list'
      }
      req.reply(res)
    }).as('list')

    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2020-12-09/98.1580210016085fd08fa8269547.61618326.jpg', { fixture: 'images/gallery/1.jpg' }).as('v1')
    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2020-12-09/228.087949001615fd08fc21579d0.79028584.jpg', { fixture: 'images/gallery/2.jpg' })
    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2020-12-09/73.0739020016085fd09025120bb4.45066014.jpg', { fixture: 'images/gallery/3.jpg' })
    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2020-12-09/893.460028001615fd09025705076.85434726.jpg', { fixture: 'images/gallery/4.jpg' })
    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2020-12-09/181.903819001615fd09048dcaa24.27510566.jpg', { fixture: 'images/gallery/5.jpg' })
    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2020-12-09/829.578764001615ff1dfaf8d4e60.42187602.jpg*', { fixture: 'images/gallery/new-gallery.jpg' })
    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2020-12-09/58.685566001615ff1dfb1a76071.41032210.jpg*', { fixture: 'images/gallery/new-gallery-2.jpg' })
    cy.intercept('get', Cypress.env('api_url') + '/admin/gallery/*', { fixture: 'gallery/image-info.json' }).as('imageInfo')
  })
  it('Visit gallery', () => {
    cy.visit(Cypress.env('host') + '/gallery')

    cy.wait(['@list'])
    cy.wait(1000)

    cy.get('.el-color-picker__trigger').click()
    cy.wait(300)
    cy.get('.el-color-predefine__color-selector').eq(5).click()
    cy.wait(300)
    cy.get('.el-color-dropdown__btns .el-color-dropdown__btn').click()
    cy.wait('@list')
    cy.wait(2000)
    // 重置
    cy.get('.btn-danger').click()
    cy.wait('@list')
    cy.wait(1000)
  })
  it('Test show Image', () => {
    cy.intercept('put', Cypress.env('api_url') + '/admin/gallery/*', {
        "status": "success",
        "message": "更新成功",
        "data": ""
    })
    // 放大图片
    cy.get('.gallery-image-list li').eq(1).click()
    cy.wait(1000)

    cy.get('.preview-tools .el-icon-warning-outline').click()
    cy.get(1000)

    // 编辑描述
    cy.get('.image-exif .icofont-edit').click()
    cy.wait(1000)
    cy.get('.image-remark textarea').type(`
      蓝是那么的天,
      白石那么的云
    `)
    cy.get('.image-exif .link-btn-default').eq(0).click()

    // 关闭放大显示对话框
    cy.get('.big-image a').eq(0).scrollIntoView({ duration: 210 })
    cy.wait(300)
    cy.get('.big-image a').eq(0).click({ force: true })
    cy.wait(2000)
  })
  it('Test Upload Image', () => {
    cy.intercept('get', Cypress.env('api_url') + '/admin/gallery/album-all', { fixture: 'gallery/album-all.json' }).as('albumAll')
    cy.intercept('post', Cypress.env('api_url') + '/admin/gallery', { fixture: 'gallery/store-image.json' }).as('storeImage')
    cy.intercept('get', Cypress.env('api_url') + '/admin/gallery', { fixture: 'gallery/list-updated.json' }).as('list')
    
    // 添加图片
    cy.get('.right-btn .btn-primary').click()
    cy.wait(300)
    cy.get('.upload-image-wrapper input[type="file"]').selectFile(
      [
        'cypress/fixtures/images/gallery/new-gallery.jpg',
        'cypress/fixtures/images/gallery/new-gallery-2.jpg'
      ],
      { force: true }
    )
    cy.wait(300)

    // 选择相册
    cy.get('.upload-image-wrapper .ui-select').click()
    cy.wait(300)
    cy.get('.upload-image-wrapper .ui-select ul li').eq(0).click()
    cy.wait(300)

    // ----- 上传图片
    cy.get('.dialog-footer .btn-primary').click()
    cy.wait('@storeImage')
    cy.wait('@list')
  })

  // 删除
  it('Test delete', () => {
    cy.intercept('post', Cypress.env('api_url') + '/admin/gallery/*', {
        "status": "success",
        "message": "删除成功",
        "data": ""
    })
    cy.intercept('get', Cypress.env('api_url') + '/admin/gallery*', { fixture: 'gallery/list-deleted' })
    cy.get('.gallery-image-list li').eq(0).trigger('mouseenter')
    cy.wait(300)
    cy.get('.gallery-image-list li').eq(0).find('a').click({ force: true })
    cy.get('.el-message-box .el-button--primary').click()
    cy.wait(1000)
  })
})
