const http = require("http");
const https = require("https");
const fs = require("fs");

const nodemailer = require('nodemailer');
//npm install nodemailer


const host = '0.0.0.0';
const port = 8000;

const requestListener = function (req, res)
{
    res.setHeader("Content-Type", "application/json")
    
    let data = "";
    var dataParsed = "";
    switch (req.url) {
        case "/getEmail":
            
            

                req.on("data", chunk => {
                    data += chunk;
                });
                req.on("end", () => {
                    
                    dataParsed = JSON.parse(data);

                    let dataEmail = String(dataParsed.email);
                    if (dataEmail.indexOf(' ') != -1 || dataEmail.indexOf('@') == -1
                        || dataEmail.indexOf('@') == dataEmail.length - 1
                        || dataEmail.indexOf('.', dataEmail.indexOf('@')) == -1) {

                        res.writeHead(405);
                        res.end(JSON.stringify({ "code": 405, "type": "unkwown", "message": "incorrect structure of the email" }));
                    } else {
                        console.log(dataParsed.email);
                        fs.appendFileSync('emls.txt', String(dataParsed.email) + "\n");
                        res.writeHead(200);
                        res.end(JSON.stringify({ "code": 200, "type": "unknow", "message": "the email was written" }));
                        
                    }
                    
                });
            
            break
        case "/giveCourse":
            res.writeHead(200)

            var mail = nodemailer.createTransport({
                host: "smtp.ukr.net",
                port: 2525,
                secure: true,
                auth: {
                    user: "btcuahexch@ukr.net",
                    pass: "v1M6m3jJMUvjCxAh",
                },
            });

            let mailsStr = fs.readFileSync("emls.txt", "utf-8");
            let mailsLst = mailsStr.split("\n");
            mailsLst.splice(mailsLst.length - 1)
            
            console.log(String(mailsLst));
            //let mailAr1 = new Array();
            
            let crs1 = fs.readFileSync("crs.txt", "utf-8");

            
            for (let i = 0; i < mailsLst.length; i++) {

                options = {
                    from: 'btcuahexch@ukr.net',
                    to: mailsLst[i],
                    subject: 'Exchange',
                    text: '1 btc is ' + crs1 + ' uah.'
                };

                mail.sendMail(options, function (error, succes) {
                    if (!error) {
                        console.log('message was sent');
                            
                    }
                    else {
                        console.log('failed' + error)
                            
                        }
                    });
                }
                
                res.end(JSON.stringify({ "code": 200, "type": "unknown", "message": "emails were sent" }));
            
            
            

            
            
            
            
            
            break
        case "/getCourse":
            res.writeHead(200);

            

            var options = {
                host: 'minfin.com.ua',
                path: '/api/currency/crypto/list/?filter[code]=btc'
            };

            callback = function (response) {
                var answer = '';
                response.on('data', function (chank) {
                    answer += chank;
                    
                });
                response.on('end', function () {
                    
                    dataParsed = JSON.parse(answer);
                    fs.writeFileSync('crs.txt', String(dataParsed.data[0].price.uah));
                    
                })
            }
            https.request(options, callback).end();
            res.end(JSON.stringify({ "code": 200, "type": "unknown", "message": "course was got" }));
            

                
            break
        default:
            
            res.writeHead(404);
            res.end({"code":404, "type":"unknown", "message":"unknown request"})

            

            
    }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => { console.log(`Server is running on htpp://${host}:${port}`) });