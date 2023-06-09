var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser=require("body-parser");
var http = require('http');
var https = require('https');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var mangaslistRouter = require('./routes/mangas');
var singleRouter=require('./routes/single');
var adminRouter= require('./routes/admin');
var publisherRouter= require('./routes/publisher');
var viewpublisherRouter= require('./routes/viewpublishers');
var deletepublisherRouter= require('./routes/deletepublishers');
var updatepublisherRouter= require('./routes/updatepublisher');
var credentialsRouter= require('./routes/credentials');
var addmangaRouter= require('./routes/addmanga'); 
var deletemangaRouter= require('./routes/deletemanga'); 
var updatemangaRouter= require('./routes/updatemanga'); 
var addchapterRouter= require('./routes/addchapter'); 
var viewchapterRouter= require('./routes/viewchapters'); 
var chapterapprovalRouter= require('./routes/chapterapproval'); 
var chapteracceptorrejectRouter= require('./routes/chaptersacceptrej'); 
var singlemangajectRouter= require('./routes/singlemanga'); 
var adminprofileRouter= require('./routes/adminprofile'); 
var updateadminRouter= require('./routes/updateadmin'); 
var sendemailRouter= require('./routes/adminemails'); 
var updatepublisherpasswordRouter= require('./routes/publisherpassword'); 
var publisheremailRouter= require('./routes/publisheremail'); 
var publisherprofileRouter= require('./routes/publisherprofile'); 
var updatepublisherprofileRouter= require('./routes/updatepublisherprofile'); 
var approvepublisherRouter= require('./routes/approvepublisher'); 
var dashboardRouter= require('./routes/dashboard'); 
var passresetRouter= require('./routes/passreset'); 
var verificationRouter= require('./routes/verification'); 
var addtofavouriteRouter= require('./routes/addtofavourite'); 
var getfavouriteRouter= require('./routes/getfavourite'); 
var postcommentRouter= require('./routes/comment'); 
var getcommentRouter= require('./routes/getcomments'); 
var passresetRouter= require('./routes/userpassreset'); 
var resetverifyRouter= require('./routes/resetverify'); 
var adminpasschangeRouter= require('./routes/adminpasschange'); 
var adminresetRouter= require('./routes/adminreset'); 
var addcarouselRouter= require('./routes/addcarosel'); 
var getcarouselRouter= require('./routes/getcarousel'); 
var getusersRouter= require('./routes/getusers'); 
var freezeRouter= require('./routes/freeze'); 
var deleteuserRouter= require('./routes/deleteuser'); 
var getcommentRouter= require('./routes/getcomment'); 
var deletecommentRouter= require('./routes/deletecomment'); 
var removefavouriteRouter= require('./routes/removefavourite'); 
var addmemberRouter= require('./routes/addmemberemail'); 
var getmemberRouter= require('./routes/getmember'); 
var deletememberRouter= require('./routes/deletemember'); 
var getapicountRouter= require('./routes/getapicount'); 
var publisherloginRouter= require('./routes/publisherlogin'); 
var publisherresetRouter= require('./routes/publisherreset'); 
var moderatorloginRouter= require('./routes/moderatorlogin'); 
var moderatorresetRouter= require('./routes/moderatorreset'); 
var userprofileRouter= require('./routes/userprofile'); 
var updateuserprofileRouter= require('./routes/updateuserprofile'); 
var updateuserbyadminRouter= require('./routes/updateuser'); 
var deleteuserbyadminRouter= require('./routes/deleteuserbyadmin'); 

var app = express();
var cors=require('cors');
app.use(cors());
var db=require('./mongodb/db');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json())
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Replace with your own domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/mangaslist', mangaslistRouter);
app.use('/viewmanga', singleRouter);
app.use('/admin', adminRouter);
app.use('/publisher', publisherRouter);
app.use('/viewpublisher', viewpublisherRouter);
app.use('/deletepublisher', deletepublisherRouter);
app.use('/deletemanga', deletemangaRouter);
app.use('/updatepublisher', updatepublisherRouter);
app.use('/updatecredentials', credentialsRouter);
app.use('/addmanga', addmangaRouter);
app.use('/updatemanga', updatemangaRouter);
app.use('/addchapter', addchapterRouter);
app.use('/viewchapters', viewchapterRouter);
app.use('/chapterapproval', chapterapprovalRouter);
app.use('/chapteracceptorreject', chapteracceptorrejectRouter);
app.use('/singlemanga', singlemangajectRouter);
app.use('/adminprofile', adminprofileRouter);
app.use('/updateadmin', updateadminRouter);
app.use('/sendingemails', sendemailRouter);
app.use('/updatepublisherpassword', updatepublisherpasswordRouter);
app.use('/publisheremail', publisheremailRouter);
app.use('/publisherprofile', publisherprofileRouter);
app.use('/updatepublisherprofile', updatepublisherprofileRouter);
app.use('/approvepublisher', approvepublisherRouter);
app.use('/passreset', passresetRouter);
app.use('/dashboard', dashboardRouter);
app.use('/verification', verificationRouter);
app.use('/addtofavourite', addtofavouriteRouter);
app.use('/getfavourite', getfavouriteRouter);
app.use('/postcomment', postcommentRouter);
app.use('/getcomment', getcommentRouter);
app.use('/passwordreset', passresetRouter);
app.use('/resetverify', resetverifyRouter);
app.use('/adminpasschange', adminpasschangeRouter);
app.use('/adminreset', adminresetRouter);
app.use('/publisherreset', publisherresetRouter);
app.use('/addcarousel', addcarouselRouter);
app.use('/getcarousel', getcarouselRouter);
app.use('/getusers', getusersRouter);
app.use('/freeze', freezeRouter);
app.use('/deleteuser', deleteuserRouter);
app.use('/getcomment', getcommentRouter);
app.use('/deletecomment', deletecommentRouter);
app.use('/removefavourite', removefavouriteRouter);
app.use('/addmember', addmemberRouter);
app.use('/getmembers', getmemberRouter);
app.use('/deletemember', deletememberRouter);
app.use('/getapicount', getapicountRouter);
app.use('/publisherlogin', publisherloginRouter);
app.use('/moderatorlogin', moderatorloginRouter);
app.use('/moderatorreset', moderatorresetRouter);
app.use('/userprofile', userprofileRouter);
app.use('/updateuserprofile', updateuserprofileRouter);
app.use('/updateuseradmin', updateuserbyadminRouter);
app.use('/deleteuserbyadmin', deleteuserbyadminRouter);

app.listen(8080,()=>{
  console.log('Listening on 8080')
})

module.exports = app;
