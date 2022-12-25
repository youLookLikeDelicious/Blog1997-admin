import { createCatalog } from './utils/helper'

describe('Test message manager', () => {
  before(() => {      
      // 封面
      cy.intercept('get', 'https://www.blog1997.com/image/manual/2.jpg', { fixture: 'images/gallery/2.jpg' })
      cy.intercept('get', 'https://www.blog1997.com/image/manual/3.jpg', { fixture: 'images/gallery/3.jpg' })
      cy.intercept('get', 'https://www.blog1997.com/image/manual/4.jpg', { fixture: 'images/galaxy.jpg' })
      cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', { fixture: 'user' }).as('user')
      cy.intercept('get', Cypress.env('api_url') + '/csrf', { fixture: 'user/csrf.json' }).as('csrf')
      cy.intercept('get', Cypress.env('api_url') + '/admin/manual/*', { fixture: 'manual/empty-info' }).as('info')
      
      cy.visit(Cypress.env('host') + '/manual/4',)
    })
    it('test create article', () => {
      cy.intercept('post', Cypress.env('api_url') + '/admin/catalog', { message: '手册创建成功', status: 'success' }).as('create')
      cy.wait('@info')
      cy.intercept('get', Cypress.env('api_url') + '/admin/manual/*', { fixture: 'manual/info-article-1' })
      cy.intercept('post', Cypress.env('api_url') + '/admin/manual/article', { message: '添加成功', status: 'success' })
      cy.intercept('get', Cypress.env('api_url') + '/admin/manual/article/*', { fixture: 'manual/article-1' })

      cy.get('.manual-info-wrapper .btn-enable').trigger('mouseenter')
      cy.wait(1000)
      cy.get('.manual-info-wrapper .v-sub-menu li').eq(0).click()
      
      // 输入标题
      cy.get('.dialog-wrap .v-input-inline input').type('月光光,照大床')
      cy.get('.dialog-wrap .btn-primary').click()
      cy.wait(1000)

      // 进入文章节点
      cy.get('.el-tree-node').eq(0).trigger('mouseenter')
      cy.wait(1000)
      cy.get('.el-tree-node .icon-2601caidan2').eq(0).trigger('mouseenter')
      cy.wait(1000)
      cy.get('.el-dropdown-menu').eq(1).find('.el-dropdown-menu__item').eq(2).click()
      
      // 输入markdown 文本
      cy.get('.marked-editor textarea').type(`
# 1
# 2
`)

      cy.wait(2000)
      cy.get('.publish-article .link-btn-primary').click()
      cy.wait(1000)
    })
    
    it('test delete article', () => {
      cy.intercept('delete', Cypress.env('api_url') + '/admin/catalog/*', { message: '删除文章成功', status: 'success' }).as('create')
      cy.intercept('get', Cypress.env('api_url') + '/admin/manual/*', { fixture: 'manual/empty-info' }).as('info')
      cy.get('article .el-tree-node').trigger('mouseenter')
      cy.wait(1000)
      cy.get('.el-tree-node .icon-2601caidan2').eq(0).trigger('mouseenter')
      cy.wait(1000)
      cy.get('.el-dropdown-menu').eq(1).find('.el-dropdown-menu__item').eq(1).click()
    })

    it('test create catalog', () => {
      cy.intercept('get', Cypress.env('api_url') + '/admin/manual/*', { fixture: 'manual/catalog1' })
      createCatalog('第一章')
      cy.intercept('get', Cypress.env('api_url') + '/admin/manual/*', { fixture: 'manual/catalog2' })
      createCatalog('第二章')
      cy.intercept('put', Cypress.env('api_url') + '/admin/manual/*', { message: '手册更新成功', status: 'success' })

      // 拖动
      // cy.draganddrop('.el-tree .el-tree-node:nth-child(1)', '.el-tree .el-tree-node:nth-child(2)')
      // cy.draganddrop('.el-tree .el-tree-node:nth-child(1)', '.el-tree .el-tree-node:nth-child(2)')
    })
})
