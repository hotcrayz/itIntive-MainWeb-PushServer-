/**
 * 패스포트 라우팅 함수 정의
 *
 * @date 2016-11-10
 * @author Mike
 */
  
module.exports = function(router, passport) {
    console.log('user_passport 호출됨.');

    // 홈 화면
    router.route('/index2').get(function(req, res) {
        console.log('/ 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('index2.ejs', {login_success:false});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('index2.ejs', {login_success:true});
        }
    });
    
    // 로그인 화면
    router.route('/login2').get(function(req, res) {
        console.log('/login 패스 요청됨.');
        res.render('login2.ejs', {message: req.flash('loginMessage')});
    });
	 
    // 회원가입 화면
    router.route('/signup2').get(function(req, res) {
        console.log('/signup 패스 요청됨.');
        res.render('signup2.ejs', {message: req.flash('signupMessage')});
    });
	 
    // 프로필 화면
    router.route('/profile2').get(function(req, res) {
        console.log('/profile 패스 요청됨.');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/profile 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('profile2.ejs', {user: req.user[0]._doc});
            } else {
                res.render('profile2.ejs', {user: req.user});
            }
        }
    });
	
    // 로그아웃
    router.route('/logout2').get(function(req, res) {
        console.log('/logout 패스 요청됨.');
        req.logout();
        res.redirect('/');
    });


    // 로그인 인증
    router.route('/login2').post(passport.authenticate('local-login', {
        successRedirect : '/teacher', //이 부분을 바꾸면 됨
        failureRedirect : '/login2',
        failureFlash : true 
    }));

    // 회원가입 인증
    router.route('/signup2').post(passport.authenticate('local-signup', {
        successRedirect : '/profile2',
        failureRedirect : '/signup2',
        failureFlash : true 
    }));

    // 패스포트 - 페이스북 인증 콜백 라우팅
    router.route('/auth/facebook/callback').get(passport.authenticate('facebook', {
        successRedirect : '/profile2',
        failureRedirect : '/'
    }));

};