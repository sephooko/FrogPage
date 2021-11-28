const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
const users = require('./data').userSessionDatabase;

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/pictures', express.static(__dirname + 'public/pictures'));
app.use('/gallery', express.static(__dirname + 'public/gallery'));
// app.use(express.static(path.join(__dirname,'./gallery')));

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});

app.post('/register', async (req, res) => {
    try{
        let checkUser = users.find((data) => req.body.email === data.email);
        if (!checkUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
            
            res.sendFile(__dirname + '/public/registerSuccess.html');
        } else {
            res.sendFile(__dirname + '/public/registerError.html');
        }
    } catch{
        res.send("Internal 5000 error");
    }
});

app.post('/login', async (req, res) => {
    try{
        let findUser = users.find((data) => req.body.email === data.email);
        if (findUser) {
    
            let submittedPass = req.body.password; 
            let storedPass = findUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = findUser.username;
                res.sendFile(__dirname + '/public/gallery/gallery.html');
            } else {
                res.sendFile(__dirname + '/public/loginError.html');
            }
        }
        else {
    
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);
            res.sendFile(__dirname + '/public/loginError.html');
        }
    } catch{
        res.send("Internal 500 error");
    }
});


server.listen(5000, function(){
    console.log("server is listening on port: 5000");
});