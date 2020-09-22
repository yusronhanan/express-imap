const port = 3000
const app = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer') // v1.0.5
const upload = multer() // for parsing multipart/form-data
const imaps = require('imap-simple');
app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/loginmail', upload.array(), function (req, res, next) {
//   console.log(req.body)
//   res.json(req.body)
  // start here

 var config = {
  imap: {
      user: req.body.email,
      password: req.body.password,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 3000
  }
 };


 imaps.connect(config).then(function (connection) {
    
   
    
  return connection.openBox('INBOX').then(function () {
      var searchCriteria = [
          'UNSEEN'
      ];
 
      var fetchOptions = {
          bodies: ['HEADER'],
          markSeen: false
      };
 
      return connection.search(searchCriteria, fetchOptions).then(function (results) {
          var subjects = results.map(function (res) {
              return res.parts.filter(function (part) {
                  return part.which === 'HEADER';
              })[0].body.subject[0];
          });
          var dates = results.map(function (res) {
            return res.parts.filter(function (part) {
                return part.which === 'HEADER';
            })[0].body.date[0];
        });
        var froms = results.map(function (res) {
            return res.parts.filter(function (part) {
                return part.which === 'HEADER';
            })[0].body.from[0];
        });
 
        var data = {
            subject : subjects,
            date : dates,
            from : froms
        }

       
          console.log(data);
          res.json(data)
          // =>
          //   [ 'Hey Chad, long time no see!',
          //     'Your amazon.com monthly statement',
          //     'Hacker Newsletter Issue #445' ]
      });
  });
 });
  // end here
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })