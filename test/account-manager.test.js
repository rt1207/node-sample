
var express = require('express');
var request = require('request');
var assert = require('assert');
var app = express();
var AM = require('../server/modules/account-manager');

describe('xxx API test', function() {
  before(function(done) {
    // ログインや、テスト前に設定する事
    done();
  });
  after(function(done) {
    // 一連のテスト終了後に行う処理
    done();
  });
  it('ログインのテスト 成功ケース', function(done) {
    request({
      url : 'http://localhost:8080/',
      qs : {
        user : 'test',
         pass : '9987dcba'
      }

    // 期待通りであれば完了
    }, function(err, res, body) {
      assert.equal(err, null, 'Request Error ' + JSON.stringify(err));
      assert.equal(res.statusCode, 200, 'HTTP Status Code is not 200:' + res.statusCode);
      assert.notEqual(body, null, 'Body is null');
      // var json = JSON.parse(body);
      // assert.equal(json.status, 0, 'Status Code is not 0');
      done();
    });
  });
  // it('ログインのテスト 不正ユーザ名', function(done) {
  //   request({
  //     url : 'ログインURL',
  //     qs : {
  //       user : 't',
  //        pass : '9987dcba'
  //     }
  //   }, function(err, res, body) {
  //     assert.equal(err, null, 'Request Error ' + JSON.stringify(err));
  //     assert.equal(res.statusCode, 200, 'HTTP Status Code is not 200:' + res.statusCode);
  //     assert.notEqual(body, null, 'Body is null');
  //     var json = JSON.parse(body);
  //     assert.notEqual(json.status, 0, 'Status Code is not 0');
  //     assert.equal(json.error_message, 'ユーザ名かパスワードが不正です。', 'Error Message is wrong.\n' + body);
  //     done();
  //   });
  // });
});