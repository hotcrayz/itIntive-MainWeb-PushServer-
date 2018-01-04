var express = require('express')
  , http = require('http')
  , path = require('path');

var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

var favicon = require('serve-favicon');
var logger = require('morgan');
var ejs = require('ejs');
var fs = require('fs');

var expressErrorHandler = require('express-error-handler');

var expressSession = require('express-session');
  

var passport = require('passport');
var flash = require('connect-flash');

//페이지 추가 최산화
var config = require('./config/config');
var database = require('./database/database');
var route_loader = require('./routes/route_loader');
var background = require('./routes/background');
var page1 = require('./routes/page1');
var page2 = require('./routes/page2');
var main = require('./routes/main');
var teacher = require('./routes/teacher');
var nearcoffeeshop2 = require('./routes/nearcoffeeshop2');
var socketio = require('socket.io');
var cors = require('cors');
var index3 = require('./routes/index3');
var news = require('./routes/news');
var services = require('./routes/servcies');
var products = require('./routes/products');
var contacts = require('./routes/contacts');
var extra = require('./routes/extra');
var teacher1 = require('./routes/teacher1');
var teacher2 = require('./routes/teacher2');


var app = express();

app.set('views', __dirname + '/views');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);


//포트 3000번으로 뚫어버리기
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use('/public', static(path.join(__dirname, 'public')));
app.use('/views',static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname,'views')));

app.use(cookieParser());

//여기부터
app.use(logger('dev'));

app.use('/', main);
app.use('/', background);
app.use('/', page1);
app.use('/', page2);
app.use('/', nearcoffeeshop2);
app.use('/', teacher);
app.use('/', index3);
app.use('/', news);
app.use('/', services);
app.use('/', products);
app.use('/', contacts);
app.use('/', extra);
app.use('/', teacher1);
app.use('/', teacher2);
app.use('/routes',express.static('routes'));
app.use('/public',express.static('public')); //여기 추가하니까 가능했음! middle ware 뚫어줌! -> 11.15
app.use('/views',express.static('views'));
app.use('/teacher', express.static('teacher')); //선생님화면도 css적용하려면 모든 css파일을 public경로 밑에다가 적어줘야 됬음 -> 11.24



// 세션 설정
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));



// 이거 몰라가지고 Passport의 세션을 사용할 때는 그 전에 Express의 세션을 사용하는 코드가 있어야 함
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(cors());

var router = express.Router();
route_loader.init(app, router);

var configPassport = require('./config/passport');
configPassport(app, passport);

var userPassport = require('./routes/user_passport');
userPassport(router, passport);


//로그인창 추가
var userPassport2 = require('./routes/user_passport2');
userPassport2(router, passport);



//에러
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    console.log("err!");
    next(err);
});

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


//여기부터 서버
process.on('uncaughtException', function (err) {

	console.log(err.stack);
});

process.on('SIGTERM', function () {
    app.close();
});

app.on('close', function () {
	if (database.db) {
		database.db.close();
	}
});

var server = http.createServer(app).listen(app.get('port'), function(){

	// 데이터베이스 초기화
	database.init(app, config);
   
});



//여기부터 socket통신
var login_ids = {};



var io = socketio.listen(server);

io.sockets.on('connection', function(socket) {
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;


    socket.on('login', function(login) {

        login_ids[login.id] = socket.id;
        socket.login_id = login.id;


        sendResponse(socket, 'login', '200', '로그인되었습니다.');
    });


    socket.on('message', function(message) {

        if (message.recepient =='ALL') {
            io.sockets.emit('message', message);
        } else {
            if (message.command == 'chat') {
                if (login_ids[message.recepient]) {
                    io.sockets.connected[login_ids[message.recepient]].emit('message', message);

                    // 응답 메시지 전송
                    sendResponse(socket, 'message', '200', '메시지를 전송했습니다.');
                } else {
                    // 응답 메시지 전송
                    sendResponse(socket, 'login', '404', '상대방의 로그인 ID를 찾을 수 없습니다.');
                }
            } else if (message.command == 'groupchat') {
                io.sockets.in(message.recepient).emit('message', message);

                sendResponse(socket, 'message', '200', '방 [' + message.recepient + '] 전송했습니다.');
            }

        }
    });



});

function getRoomList() {
    console.dir(io.sockets.adapter.rooms);

    var roomList = [];

    Object.keys(io.sockets.adapter.rooms).forEach(function(roomId) { // for each room
        console.log('current room id : ' + roomId);
        var outRoom = io.sockets.adapter.rooms[roomId];

        // find default room using all attributes
        var foundDefault = false;
        var index = 0;
        Object.keys(outRoom.sockets).forEach(function(key) {
            console.log('#' + index + ' : ' + key + ', ' + outRoom.sockets[key]);

            if (roomId == key) {  // default room
                foundDefault = true;
                console.log('this is default room.');
            }
            index++;
        });

        if (!foundDefault) {
            roomList.push(outRoom);
        }
    });

    console.log('[ROOM LIST]');
    console.dir(roomList);

    return roomList;
}

function sendResponse(socket, command, code, message) {
    var statusObj = {command: command, code: code, message: message};
    socket.emit('response', statusObj);
}



