var express = require('express'),
    fs = require('fs'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('page');
});

router.get('/ui',function(req,res){
    res.render('BuiPage',{
        component:'form'
    })
})

router.get('/ui/:component',function(req,res){
    res.render('BuiPage',{
        component:req.params.component
    })
})


router.get('/article',function(req,res){
    res.render('ArticlePage')
})

router.get('/BuiPage/modules/:module',function(req,res){
    res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8'});
    var data = fs.readFileSync('client/BuiPage/modules/'+req.params.module,'utf-8');
    res.write(data)
    res.end()
})

module.exports = router;