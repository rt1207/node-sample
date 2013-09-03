var should = require('should'),
    mongoose = require('mongoose'),
    models = require('../models'),
    User,
    Project;

models.defineModels(mongoose, function() {
  User = mongoose.model('User');
  Project = mongoose.model('Project');
});

describe('UserModel', function() {
  describe('インスタンス生成', function() {
  it('指定した属性でインスタンスが作成されること', function() {
    var user = new User();
    // user.name.should.be.empty;
    // user.project.should.be.empty;
  });

    it('nameのみを指定し、指定した属性でインスタンスが生成されること', function() {
      var user = new User({ name : 'tajima' });
      user.name.should.be.equal('tajima');
      // user.project.should.be.empty;
    });

    it('nameとprojectを指定し、指定した属性でインスタンが生成されること', function() {
      var project = new Project({
        name : 'hoge',
        url  : 'http://piyo.com'
      });
      var user = new User({ name : 'tajima', project : project });
      user.name.should.be.equal('tajima');
      user.project.should.have.length(1);
      user.project[0].name.should.be.equal('hoge');
      user.project[0].url.should.be.equal('http://piyo.com');
    });

    it('nameと複数projectを指定し、指定した属性でインスタンが生成されること', function() {
      var projects = new Array();
      for(var i = 0 ; i < 3 ; i ++) {
        projects.push(new Project({
          name : 'hoge' + i,
          url  : 'http://piyo.com'
        }));
      }
      var user = new User({ name : 'tajima', project : projects });
      user.name.should.be.equal('tajima');
      user.project.should.have.length(3);
      for(var i = 0 ; i < 3 ; i ++) {
        user.project[i].name.should.be.equal('hoge' + i);
        user.project[i].url.should.be.equal('http://piyo.com');
      }
    });
  });
});
// var express = require('express');
// var app = express();
// var AM = require('../server/modules/account-manager');

// describe('xxx API test', function() {
//   before(function(done) {
//     // ログインや、テスト前に設定する事
//     done();
//   });
//   after(function(done) {
//     // 一連のテスト終了後に行う処理
//     done();
//   });
//   it('ログインのテスト 成功ケース', function(done) {
//     done();
//   });

// // describe('xxx API test', function() {
// //   before(function(done) {
// //     // ログインや、テスト前に設定する事
// //     done();
// //   });
// //   after(function(done) {
// //     // 一連のテスト終了後に行う処理
// //     done();
// //   });
// //   it('ログインのテスト 成功ケース', function(done) {
//     // request({
//     //   url : '/',
//     //   qs : {
//     //     user : 'test',
//     //      pass : '9987dcba'
//     //   }

//     // 期待通りであれば完了
//     // }, function(err, res, body) {
//     //   assert.equal(err, null, 'Request Error ' + JSON.stringify(err));
//     //   assert.equal(res.statusCode, 200, 'HTTP Status Code is not 200:' + res.statusCode);
//     //   assert.notEqual(body, null, 'Body is null');
//     //   var json = JSON.parse(body);
//     //   assert.equal(json.status, 0, 'Status Code is not 0');
//     //   done();
//     // });
//   // });
//   it('ログインのテスト 不正ユーザ名', function(done) {
//     request({
//       url : 'ログインURL',
//       qs : {
//         user : 't',
//          pass : '9987dcba'
//       }
//     }, function(err, res, body) {
//       assert.equal(err, null, 'Request Error ' + JSON.stringify(err));
//       assert.equal(res.statusCode, 200, 'HTTP Status Code is not 200:' + res.statusCode);
//       assert.notEqual(body, null, 'Body is null');
//       var json = JSON.parse(body);
//       assert.notEqual(json.status, 0, 'Status Code is not 0');
//       assert.equal(json.error_message, 'ユーザ名かパスワードが不正です。', 'Error Message is wrong.\n' + body);
//       done();
//     });
//   });
// });