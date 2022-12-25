export function createCatalog(title = 'title') {
  cy.intercept('post', Cypress.env('api_url') + '/admin/catalog', { message: '章节成功', status: 'success' }).as('create')
  cy.get('.manual-info-wrapper .btn-enable').trigger('mouseenter')
  cy.wait(1000)
  cy.get('.manual-info-wrapper .v-sub-menu li').eq(1).click()

  cy.get('.dialog-wrap .v-input-inline input').type(title)
  cy.get('.dialog-wrap .btn-primary').click()
  cy.wait(1000)
}