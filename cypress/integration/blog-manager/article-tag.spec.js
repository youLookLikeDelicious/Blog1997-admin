/**
 * 测试标签页面
 */

describe('Test article tag', () => {
  before(() => {
    cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', {
      fixture: 'user.json'
    }).as('user')
    cy.intercept('post', Cypress.env('api_url') + '/csrf', {
      fixture: 'user/csrf.json'
    })
    cy.intercept('get', Cypress.env('api_url') + '/admin/tag', { fixture: 'article-tag' }).as('article-tag')
  })
  beforeEach(() => {
    cy.intercept('get', 'https://www.blog1997.com/image/tag/2020-12-22/201.701749001615fe16b55ab5449.42606432.jpg', {
      fixture: 'images/tags/front'
    })
    cy.intercept('get', 'https://www.blog1997.com/image/tag/2020-12-22/48.4479190016095fe16dee6d5bc7.92075244.png', {
      fixture: 'images/tags/vue'
    })
    cy.intercept('get', 'https://www.blog1997.com/image/tag/2020-12-22/218.413875001615fe1ddaf650e04.83086165.jpg', {
      fixture: 'images/tags/react'
    })
    cy.intercept('get', Cypress.env('api_url') + '/admin/tag/create', { fixture: 'article-tag/create' }).as('article.tag.create')
  })
  it ('Visit page', () => {
    cy.visit(Cypress.env('host') + '/article/tag')
    cy.wait(['@user', '@article-tag'])
  })

  it('Test', () => {
    cy.intercept('get', Cypress.env('api_url') + '/admin/tag*', req => {
      const { name } = req.query
      console.log(name)
      if (name) {
        req.reply({ fixture: 'article-tag/search-v' })
      } else {
        req.reply({ fixture: 'article-tag/appended-list' })
      }
    }).as('article.tag')

    // 新建的标签
    cy.intercept('post', Cypress.env('api_url') + '/admin/tag', {
      fixture: 'article-tag-store'
    }).as('article.tag.store')

    // 新建标签
    cy.get('.right-btn .btn-primary').click()
    cy.wait(1000)
    // ----------输入 标签名称
    cy.get('.dialog input').eq(0).click()
    cy.wait(1000)
    cy.get('.dialog input').eq(0).type(`New Tag`)
    // ----------选择 父标签
    cy.get('.dialog .el-input').click()
    cy.wait(1000)
    cy.get('body > .el-select-dropdown .el-select-dropdown__item').eq(1).click()
    // ----------添加 描述
    cy.get('.dialog textarea').type(`New tag description
      ------------
      +++
      ------------`)
    // ----------选择封面
    cy.get('.dialog input[type="file"]').selectFile('cypress/fixtures/images/tags/react.jpg', { force: true })
    cy.wait(1000)
    // ----------提交
    cy.get('.dialog-footer .btn-primary').click()
    cy.wait('@article.tag')
    cy.wait(1000)

    // 搜索标签
    cy.get('.search-tools input').click()
    cy.get('.search-tools input').type('v')
    cy.get('.search-tools input').blur()
    cy.wait('@article.tag')
    cy.wait(1000)
    cy.get('.search-tools .btn-danger').click()
    cy.wait('@article.tag')
    cy.wait(1000)
  })
  
  it('Test update tag', () => {
    cy.intercept('get', Cypress.env('api_url') + '/admin/tag/2', { fixture: 'article-tag/tag-info' }).as('tag.info')
    cy.intercept('post', Cypress.env('api_url') + '/admin/tag/2', { fixture: 'article-tag/tag-info' }).as('tag.update')
    cy.intercept('get', Cypress.env('api_url') + '/admin/tag', req => {
      req.reply({fixture: 'article-tag/updated-list'})
    }).as('article.tag')

    // 修改标签
    cy.get('.el-table .link-btn-primary').eq(0).click()
    cy.wait(['@tag.info', '@article.tag.create'])
    cy.wait(100)
    // ----- 修改标签名称
    cy.get('.dialog input').eq(0).clear()
    cy.get('.dialog input').eq(0).type('Vue3.0')
    // ----- 修改标签封面
    cy.get('.dialog input[type="file"]').selectFile('cypress/fixtures/images/tags/vue.png', { force: true })
    cy.wait(1000)
    // ----- 修改描述
    cy.get('.dialog textarea').clear()
    cy.get('.dialog textarea').type('vue3.0 up up up')
    cy.get('.dialog-footer .btn-primary').click()
    cy.wait(['@tag.update', '@article.tag'])
    cy.wait(1000)
  })
  // 删除标签
  it('Test delete tag', () => {
      // ----- 展开标签列表
      cy.intercept('get', Cypress.env('api_url') + '/admin/tag', { fixture: 'article-tag/deleted-list' }).as('article-tag.list')
      cy.intercept('post', Cypress.env('api_url') + '/admin/tag/*', res => res.reply({message: '删除成功'})).as('article-tag.delete')
      cy.get('.el-table .link-btn-danger').eq(3).click()
      cy.wait(1000)
      cy.get('.el-message-box .el-button--primary').click()
      cy.wait(['@article-tag.delete', '@article-tag.list'])
  })
});

