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
    cy.intercept('get', Cypress.env('api_url') + '/admin/user', {
      fixture: 'auth/user/user-list-0'
    }).as('user.list')
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
  })
  it ('Visit page', () => {
    cy.visit(Cypress.env('host') + '/tag')
    cy.wait('@.article-tag')
  })
  it('Test', () => {
    cy.intercept('get', Cypress.env('api_url') + '/admin/tag/create', {
      fixture: 'article-tag-create'
    }).as('article.tag.create')

    // 获取标签列表
    cy.intercept('get', Cypress.env('api_url') + '/admin/tag*', req => {
      const { name } = req.query
      if (name) {
        req.replay({ fixture: 'article-tag-search-v' })
      } else {
        req.replay({ fixture: 'article-tag' })
      }
    }).as('article.tag')

    // 删除修改的路由
    cy.intercept({
      matchUrlAgainstPath: false,
      url: /https:\/\/www.blog1997\.com\/api\/admin\/tag\/16/,
      method: 'post'
    }, (req) => {
      const response = req.body._method === 'DELETE' ? {
        fixture: 'article-tag-destroy'
      } : {
        fixture: 'article-tag-put'
      }
      req.reply(response)
    }).as('article.tag.post')

    // 新建的路由
    cy.intercept('post', Cypress.env('api_url') + '/admin/tag', {
      fixture: 'article-tag-store'
    }).as('article.tag.store')

    // 点击标签菜单
    cy.get('.sidebar').find('a[href="/admin/article/tag"]').click()
    cy.wait('@article.tag')

    // 展开标签列表
    cy.wait(1000)

    // 新建标签
    cy.get('.tool-bar a[name="create"]').click()
    cy.wait(1000)
    // ----------输入 标签名称
    cy.get('.create-tag input').eq(0).type('New Tag')
    // ----------选择 父标签
    cy.get('.ui-select').click()
    cy.wait(1000)
    cy.get('.ui-select li').eq(1).click()
    // ----------添加 描述
    cy.get('.create-tag textarea').type('New tag description')
    // ----------选择封面
    cy.get('.create-tag input[type="file"]').selectFile('images/tags/react.jpg')
    cy.wait(1000)
    // ----------提交
    cy.get('.create-tag a.btn-enable').click()
    cy.wait(1000)

    // 修改标签
    cy.get('a.icofont-edit').eq(1).click()
    cy.wait(500)
    // ----- 修改标签名称
    cy.get('.create-tag input').eq(0).clear()
    cy.get('.create-tag input').eq(0).type('Vue3.0')
    // ----- 修改标签封面
    cy.get('.create-tag input[type="file"]').selectFile('images/tags/vue.png')
    cy.wait(1000)
    // ----- 修改描述
    cy.get('.create-tag textarea').clear()
    cy.get('.create-tag textarea').type('vue3.0 up up up')
    cy.get('.create-tag a.btn-enable').click()
    cy.wait(1000)

    // 删除标签
    // ----- 展开标签列表
    cy.get('.right-arrow').click()
    cy.wait(1000)
    cy.get('.right-arrow').click()
    cy.wait(1000)
    cy.get('a.icofont-delete').eq(1).click()
    cy.wait(1000)

    // 搜索标签
    cy.get('.search-tools input').click()
    cy.get('.search-tools input').type('v')
    cy.get('.search-tools .btn-enable').click()
    cy.wait(1000)
  })
});

