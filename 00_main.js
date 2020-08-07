var express = require('express')
var app = express()
var port = 3000
var fs = require('fs');
var bodyParser = require('body-parser')
var compression = require('compression');
var topicRouter = require('./routes/00_topic.js');
var indexRouter = require('./routes/00_index.js');
var authRouter = require('./routes/00_auth.js');
var helmet = require('helmet');
var session = require('express-session')
var FileStore = require('session-file-store')(session);

app.use(helmet());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store:new FileStore()
  }))


app.get('*', function(request, response, next){
    fs.readdir('./data', 'utf8', (error, filelist)=>{
        request.list = filelist;
        next();
    })
})

app.use('/topic', topicRouter);
app.use('/', indexRouter);
app.use('/auth', authRouter);

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


// 