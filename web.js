var util = require('util');

var express = require('express');
var mailer = require('nodemailer');
var _ = require('underscore');

if (!process.env.TO || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  throw new Error("Environment variables TO, SMTP_USER and SMTP_PASS are required");
}

var app = express();
var port = process.env.PORT || 5000;

var mail = {
    from: "\"%name% (Recruit)\" <%from%>",
    replyTo: "\"%name%\" <%email%>",
    to: process.env.TO,
    subject: "Resume submission by %name% (%ip%)"
}
var smtp = mailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

process.on('SIGINT', function() {
  console.log("\nGracefully shutting down from SIGINT");
  smtp.close();
  process.exit();
});

app.use(express.bodyParser());
app.use(function(req, res, next){
  console.log("%s %s %s %s", req.method, req.url, req.ip, req.get('user-agent'));
  next();
});
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, { error: 'Something blew up!' });
});

app.listen(port, function() {
  console.log("Listening on " + port);
});

app.get('/', function(req, res) {
  res.send({ "message": "POST to /resumes with 'name', 'email', 'about' (255 max) and 'file' (attachment) instead." });
});

app.get('/resumes', function(req, res, next) {
  res.set('Allow', ['POST']);
  res.send(405, { "message": "Method not allowed" });
  res.end();
});

app.post('/resumes', function(req, res, next) {

  if (!req.param('name') || !req.param('email') || !req.param('about') || !req.files.file) {
    res.send(400, { "message": "These parameters are required: 'name', 'email', 'about' (255 max) and 'file' (attachment)" });
    res.end();
    return;
  }

  var m = _.extend({
    text: util.format("%s (%s) has posted his/her resume via %s.\n\n", req.param('name'), req.ip, req.get('user-agent')) +
          "About: " + req.param('about', '').substr(0, 255)
  }, mail);

  m.from = m.from.replace(/%name%/, req.param('name')).replace(/%from%/, process.env.FROM ? process.env.FROM : process.env.SMTP_USER);
  m.replyTo = m.replyTo.replace(/%name%/, req.param('name')).replace(/%email%/, req.param('email'));
  m.subject = m.subject.replace(/%name%/, req.param('name')).replace(/%ip%/, req.ip);
  m.attachments = [{
    fileName: req.files.file.name,
    filePath: req.files.file.path
  }];

  smtp.sendMail(m, function(err, mres){
      if (err) {
          console.log(err);
      } else{
          console.log("Message sent: " + mres.message);
      }
  });
  res.send({ "message": "OK!" });
});
