const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog API', function() {

  before(function() {
     return runServer();
   });

  after(function() {
     return closeServer();
   });

  it('should show all blog posts on GET', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        expect(res).to.be.json;

        const expectedKeys = ['title', 'content', 'author'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

  it('should add blog post on POST', function() {
    const newPost = {
      title: 'new music fridays',
      content: 'here is the content',
      author: 'DR YAKA'
    };
    return chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('title', 'content', 'author');
        expect(res.body.id).to.not.equal(null);
      });
  })

  it('should update blog posts on PUT', function() {
    const updatePost = {
      title: 'new music fridays hey oh',
      content: 'here is the content dude',
      author: 'DR YAKA MOOSE'
    };
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        updatePost.id = res.body[0].id;
        updatePost.publishDate = res.body[0].publishDate;
        return chai.request(app)
          .put(`/blog-posts/${updatePost.id}`)
          .send(updatePost);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      })
  });

  it('should delete a blog post on DELETE', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });



});
