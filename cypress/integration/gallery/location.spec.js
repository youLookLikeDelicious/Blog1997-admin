describe('Test gallery location', () => {
  beforeEach(() => {
    cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', { fixture: 'user' }).as('user')
    cy.intercept('post', Cypress.env('api_url') + '/csrf', { fixture: 'user/csrf.json' }).as('csrf')

    cy.intercept('get', Cypress.env('api_url') + '/admin/gallery/*', { fixture: 'gallery/image-info.json' }).as('imageInfo')
    cy.intercept('get', Cypress.env('api_url') + '/admin/gallery/all', { fixture: 'gallery/location.json' }).as('list')

    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2020-12-09/98.1580210016085fd08fa8269547.61618326.jpg', { fixture: 'images/gallery/1.jpg' }).as('v1')
    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2020-12-09/228.087949001615fd08fc21579d0.79028584.jpg', { fixture: 'images/gallery/2.jpg' })
    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2020-12-09/73.0739020016085fd09025120bb4.45066014.jpg', { fixture: 'images/gallery/3.jpg' })
    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2020-12-09/893.460028001615fd09025705076.85434726.jpg', { fixture: 'images/gallery/4.jpg' })
    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2020-12-09/181.903819001615fd09048dcaa24.27510566.jpg', { fixture: 'images/gallery/5.jpg' })
    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2020-12-09/829.578764001615ff1dfaf8d4e60.42187602.jpg*', { fixture: 'images/gallery/new-gallery.jpg' })
    cy.intercept('get', 'https://www.blog1997.com/image/gallery/2020-12-09/58.685566001615ff1dfb1a76071.41032210.jpg*', { fixture: 'images/gallery/new-gallery-2.jpg' })
  })
  it('Visit location', () => {
    cy.visit(Cypress.env('host') + '/gallery/place')
    cy.wait('@list')
    cy.wait(5000)

    cy.get('.amap-marker-content').eq(1).click()
    cy.wait(1000)
    cy.get('.amap-marker-content').eq(1).click()
    cy.wait(300)
    cy.get('.preview-tools .el-icon-circle-close').click()
    cy.wait(1000)
  })
})
