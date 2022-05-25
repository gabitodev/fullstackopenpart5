describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user1 = {
      username: 'gabito45',
      name: 'Gabriel Garcia',
      password: 'test12345'
    };
    cy.request('POST','http://localhost:3003/api/users', user1);
    const user2 = {
      username: 'Juneke',
      name: 'Vervin Gomez',
      password: 'notest45'
    };
    cy.request('POST','http://localhost:3003/api/users', user2);
    cy.visit('http://localhost:3001');
    cy.contains('Login').click();
  });

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('gabito45');
      cy.get('#password').type('test12345');
      cy.get('#login-button').click();
      cy.contains('Gabriel Garcia logged-in');
    });

    it('fails with wrong credentials', function() {
      cy.get('#username').type('juneke69');
      cy.get('#password').type('test123');
      cy.get('#login-button').click();
      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)');
      cy.get('html').should('not.contain', 'Gabriel Garcia logged-in');
    });
  });

  describe('when logged in', function() {
    beforeEach(function () {
      cy.login({ username: 'gabito45', password: 'test12345' });
    });
    it('a blog can be created', function() {
      cy.contains('Create Blog').click();
      cy.get('#title-input').type('React Patterns');
      cy.get('#author-input').type('Ronald McGregor');
      cy.get('#url-input').type('www.reactpatterns.com');
      cy.get('#create-button').click();
      cy.get('.blog').contains('React Patterns by Ronald McGregor');
      cy.get('.success')
        .should('contain', 'A new blog React Patterns by Ronald McGregor was added')
        .and('have.css', 'color', 'rgb(0, 128, 0)');
    });

    describe('and several blogs exist', function() {
      beforeEach(function () {
        cy.createBlog({ title: 'Learning with FullStack2022', author: 'Professor Junior', url: 'www.fullstackopen2022.com' });
        cy.createBlog({ title: 'The mind behind JavaScript', author: 'Javascript Creator', url: 'www.javascript.com' });
        cy.createBlog({ title: 'Test Blog 3', author: 'Cypress', url: 'www.cypress.com' });
      });

      it('a blog can be liked', function() {
        cy.get('.blog').contains('Learning with FullStack2022 by Professor Junior')
          .contains('View').click();
        cy.get('.blog').contains('Like').click();
        cy.get('.blog').contains('Likes 1');
      });

      it('blogs list are ordered by most likes', function() {
        cy.get('.blog').contains('Test Blog 3 by Cypress')
          .contains('View').click();
        cy.get('.blog').contains('Like').click();
        cy.get('.blog').contains('Likes 1');
        cy.get('.blog').contains('Like').click();
        cy.get('.blog').contains('Likes 2');
        cy.get('.blog').contains('Like').click();
        cy.get('.blog').contains('Likes 3');
        cy.get('.blog').contains('Test Blog 3 by Cypress')
          .contains('Hide').click();
        cy.get('.blog').contains('The mind behind JavaScript by Javascript Creator')
          .contains('View').click();
        cy.get('.blog').contains('Like').click();
        cy.get('.blog').contains('Likes 1');
        cy.get('.blog').eq(0).should('contain', 'Test Blog 3 by Cypress');
        cy.get('.blog').eq(1).should('contain', 'The mind behind JavaScript by Javascript Creator');
      });

      it('a blog can be removed by the user who created', function() {
        cy.get('.blog').contains('Learning with FullStack2022 by Professor Junior')
          .contains('View').click();
        cy.get('.blog').contains('Remove').click();
        cy.get('.success')
          .should('contain', 'Blog removed')
          .and('have.css', 'color', 'rgb(0, 128, 0)');
        cy.get('.blog').should('not.contain', 'Learning with FullStack2022 by Professor Junior');
      });
    });
  });

  describe('another user logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'gabito45', password: 'test12345' });
      cy.createBlog({ title: 'Learning with FullStack2022', author: 'Professor Junior', url: 'www.fullstackopen2022.com' });
      cy.login({ username: 'Juneke', password: 'notest45' });
    });

    it('a blog cannot be removed if user logged in is not the creator', function() {
      cy.get('.blog').contains('Learning with FullStack2022 by Professor Junior')
        .contains('View').click();
      cy.get('.blog').should('not.contain', 'Remove');
    });
  });
});