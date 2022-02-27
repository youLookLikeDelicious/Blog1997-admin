/**
 * 测试文章列表
 */
import createArticle from './article-create'

describe('Test article list', () => {
  before(() => {
    cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', {
      fixture: 'user.json'
    }).as('user')
    cy.intercept('post', Cypress.env('api_url') + '/csrf', {
      fixture: 'user/csrf.json'
    })
    cy.intercept('get', Cypress.env('api_url') + '/admin/user', {
      fixture: 'auth/user/user-list-0'
    }).as('user.list')
    cy.intercept('get', Cypress.env('api_url') + '/admin/article', {
      fixture: 'article/article-list'
    }).as('article.list')
  })
  it('Visit article page', () => {
    cy.visit(Cypress.env('host') + '/article')
    cy.wait(['@user', '@article.list'])
  })
  it('test', () => {
    // 草稿列表
    cy.intercept('get', Cypress.env('api_url') + '/admin/article*', req => {
      const { type, topicId = '' } = req.query
      let res = {}
      switch (type) {
        case 'draft':
          res.fixture = 'article/article-list-draft'
          break
        default:
          res.fixture = 'article/article-list'
          break
      }
      if (topicId && !type) {
        res.fixture = 'article/article-list-topic-17'
      }
      
      req.reply(res)
    }).as('article.list')

    // 文章列表
    cy.intercept('post', Cypress.env('api_url') + '/admin/article', {
      fixture: 'article-store'
    }).as('article.store')
    // 新建文章需要的表单数据
    cy.intercept('get', Cypress.env('api_url') + '/admin/article/create', {
      fixture: 'article/article-create'
    }).as('article.create')

    // 点击专题列表
    cy.get('.ui-select').click()
    cy.wait(1000)
    cy.get('.ui-select li').eq(1).click()
    cy.wait('@article.list')
    cy.wait(1000)
    // 点击草稿列表
    cy.get('.article-tab > a').eq(1).click()
    cy.wait('@article.list')
    cy.wait(1000)

    // 点击全部列表
    cy.get('.article-tab > a').eq(0).click()
    cy.wait('@article.list')
    cy.wait(1000)
  })
  // 创建微信素材
  it('Test create wechat material', () => {
    cy.intercept('post', Cypress.env('api_url') + '/admin/article/create-wechat-material/2',  req => {
      req.reply({ message: '微信素材创建成功' })
    }).as('article.material')
    cy.get('.article-list .link-btn-primary').eq(0).click()
    cy.wait('@article.material')
    cy.wait(1000)
  })
  // 删除文章
  it('Test delete article', () => {
    cy.intercept('post', Cypress.env('api_url') + '/admin/article/1', req => {
      req.reply({ message: '文章删除成功' })
    }).as('article.delete')
    cy.intercept('get', Cypress.env('api_url') + '/admin/article', { fixture: 'article/article-list-deleted' }).as('article.list')

    cy.get('.article-list .link-btn-danger').eq(2).click()
    cy.get('.el-message-box .el-button--primary').click()
    cy.wait(['@article.delete', '@article.list'])
    cy.wait(1000)
  })

  // 编辑文章
  it('Test edit article', () => {
    cy.intercept('get', Cypress.env('api_url') + '/admin/article/create', { fixture: 'article/article-create' }).as('article.create')
    cy.intercept('post', Cypress.env('api_url') + '/admin/article*', { fixture: 'article/article.store' }).as('article.store')
    createArticle()
  })
});
