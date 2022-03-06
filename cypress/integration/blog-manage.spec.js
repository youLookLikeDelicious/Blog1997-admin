import testTopic from './blog-manager/article-topic'
import testTag from './blog-manager/article-tag-.spec'
beforeEach(() => {
  cy.on('window:confirm', () => true)
})
describe('test manage blog', () => {
  before(() => {
    cy.intercept('post', Cypress.env('api_url') + '/oauth/currentUser', {
      fixture: 'user'
    }).as('user')

    cy.intercept('get', /https:\/\/www\.blog1997\.com\/api\/admin\/article\??$/, {
      fixture: 'article-list'
    }).as('article.list')
  })

  it('Visit blog manage page', () => {
    cy.visit(Cypress.env('host') + '/article')

    cy.wait(['@user'])
    cy.wait(1000)
  })
  /**
   * 测试专题的增删改查
   */
  it('Test topic', () => {
    cy.intercept('get', Cypress.env('api_url') + '/admin/topic', {
      fixture: 'article-topic'
    }).as('article.topic')

    // 删除修改的相关路由
    cy.intercept({
      matchUrlAgainstPath: false,
      url: Cypress.env('api_url') + '/admin/topic/25',
      method: 'post'
    }, (req) => {
      const response = req.body._method === 'DELETE' ? {
        fixture: 'article-topic-destroy'
      } : {
        fixture: 'article-topic-put'
      }
      req.reply(response)
    }).as('article.topic.post')

    // 新建的路由
    cy.intercept('post', Cypress.env('api_url') + '/admin/topic', {
      fixture: 'article-topic-store'
    }).as('article.topic.store')

    testTopic()
  })
})
