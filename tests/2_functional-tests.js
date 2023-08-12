const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let testThreadId;
let testReplyId;

suite('Functional Tests', function() {
suite("Integration tests with chai-http", function () {
     test("Creating a new thread: POST request to /api/threads/{board}", function (done) {
      chai
        .request(server)
        .post("/api/threads/test")
        .send({  text:'thread1', delete_password:'pass1' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          
          done();
        });
      });
     
     test("Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}", function (done) {
      chai
        .request(server)
        .get("/api/threads/test")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          const responseData = res.body;
          testThreadId = responseData.filter(t => t.text === 'thread1')[0]._id;
          assert.isArray(responseData);
          assert.isAtMost(responseData.length, 10);
          responseData.forEach(t => {
            assert.isString(t.text);
            assert.typeOf(new Date(t.created_on), 'date');
            assert.typeOf(new Date(t.bumped_on), 'date');
            assert.isArray(t.replies);
            assert.isAtMost(t.replies.length, 3);
            assert.isAtMost(t.replycount, 3);
          })
          done();
        });
     });  
     test('Reporting a thread: PUT request to /api/threads/{board}', function (done) {
      chai
        .request(server)
        .put("/api/threads/test")
        .send({ report_id : testThreadId })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
      });
      test("Creating a new reply: POST request to /api/replies/{board}", function (done) {
      chai
        .request(server)
        .post("/api/replies/test")
        .send({ text:'reply1', delete_password:'pass1', thread_id:testThreadId })
        .end(function (err, res) {
          assert.equal(res.status, 200);      
          done();
        });
      });
     test("Viewing a single thread with all replies: GET request to /api/replies/{board}", function (done) {
      chai
        .request(server)
        .get(`/api/replies/test?thread_id=${testThreadId}`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          const responseData = res.body;
          assert.isArray(responseData.replies);
          testReplyId = responseData.replies.filter(r => r.text === 'reply1')[0]._id
           responseData.replies.forEach(r => {
            assert.isString(r.text);
            assert.typeOf(new Date(r.created_on), 'date');
          })
          done();
        });
     }); 

     test('Reporting a reply: PUT request to /api/replies/{board}', function (done) {
      chai
        .request(server)
        .put("/api/replies/test")
        .send({ reply_id : testReplyId, thread_id : testThreadId })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
      });
     test("Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password", function (done) {
      chai
        .request(server)
        .delete("/api/replies/test")
        .send({ thread_id: testThreadId, reply_id:testReplyId, delete_password:'password' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
     test('Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password', function (done) {
      chai
        .request(server)
        .delete("/api/replies/test")
        .send({ thread_id: testThreadId,reply_id:testReplyId, delete_password:'pass1'})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      }); 
   
     test("Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password", function (done) {
      chai
        .request(server)
        .delete("/api/threads/test")
        .send({ thread_id: testThreadId, delete_password:'password' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
     test('Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password', function (done) {
      chai
        .request(server)
        .delete("/api/threads/test")
        .send({ thread_id:testThreadId, delete_password:'pass1' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    
  

  
  });
});
