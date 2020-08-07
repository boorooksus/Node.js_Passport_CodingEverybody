var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/00_template.js');
var express = require('express')
var router = express.Router()
var user = require('../lib/00_user.js');

// ☆★※앱 실행 전에 로그인 정보 설정해둘 것!!!!☆★※
var authData = {
    email: user.email,
    password:user.password,
    nickname:user.nickname
}

router.get('/login', (request, response) => {
    var title = 'Web login';
    var list = template.list(request.list);
    var html = template.html(title, list, `
    <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p>
        <input type="password" name="pwd" placeholder="password"></p>
        </p>
        <p>
            <input type="submit" value="login">
        </p>
    </form>
    `, '');
    response.send(html);
})

router.get('/logout', (request, response) => {
    request.session.destroy(function(err){
        response.redirect('/');
    });
})

router.post('/login_process', (request, response)=>{
    var post = request.body;
    var email = post.email;
    var password = post.pwd;
    if(email === authData.email && password === authData.password){
        request.session.is_logined = true;
        request.session.nickname = authData.nickname;
        // session 객체의 데이터를 session store에 반영.
        request. session.save(function(){
            // call back 함수로 메인 페이지로 redirection하게 해서 session 저장 작업이 끝난 후에 수행하게함. 이렇게 안하면 session 저장이 끝나기 전에 redirection이 되서 로그인 안된 채로 메인화면으로 갈 수도 있음
            response.redirect(302, `/`);
        });
    }
    else{
        response.send('login failed');
    }
})

module.exports = router;