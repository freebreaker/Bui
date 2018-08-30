var express = require('express'),
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

module.exports = router;