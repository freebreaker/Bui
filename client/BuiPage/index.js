require('../page/index')

require("./index.scss");

require("./modules/form.scss")




;!function(window){
    "use strict";

    var config = {
        modules:{  //各个模块的物理路径
        },
        status:{},
        events:{}
    }

    var getIndexPath = function(){
        var jsPath = document.currentScript? document.currentScript.src : function(){
            var js = doc.scripts
            ,last = js.length - 1
            ,src;
            for(var i = last; i > 0; i--){
              if(js[i].readyState === 'interactive'){
                src = js[i].src;
                break;
              }
            }
            return src || js[last].src;
        }()
        return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
    }()

    var Bui = function(){
        this.version = '1.0.0'
    }

    var bui = new Bui()

    if(window.jQuery && jQuery.fn.on){
        Bui.prototype.jquery = Bui.prototype.$ = jQuery;
      }

    Bui.prototype.define = function(name,producer){
        
        var that = this
 
        var callback = function(){
          typeof producer === 'function' && producer(function(app, exports){
            bui[app] = exports
            config.status[app] = true;
          });
          return this;
        };
        
        callback.call(that);

        // that.use(name, callback);

        // return that;
    }

    Bui.prototype.use = function(name,callback,exports){

        var that =this,head = document.getElementsByTagName('head')[0],

        dirPath = config.dir = config.dir?config.dir:getIndexPath,

        names = typeof name === 'string' ? [name] : name;

        var item = names[0],exports = exports||[]

        function scriptCallback(){
            exports.push(bui[item])
            names.length > 1 ?
            that.use(names.slice(1), callback, exports)
          : ( typeof callback === 'function' && callback.apply(bui, exports) );
        }

        function scriptLoad(e,path){
            if(e.type === 'load'){
                head.removeChild(node) //移除module
                scriptCallback()
            }
        }
        
        if(!config.modules[item]){

            var node = document.createElement('script'),
            
            url = dirPath + (that.modules[item]||item) + '.js'

            node.async = true

            node.charset = "utf-8"

            node.src = url

            head.appendChild(node)

            node.addEventListener('load',function(e){
                scriptLoad(e,url)
            },false)

            config.modules[item] = url

        }else{

            //如果不是首次加载
            scriptCallback()
        }
        
        return that
    }

    Bui.prototype.each = function(obj,fn){
        var that = this,key
        if(typeof fn !=='function') return that;
        obj=obj||[]

        if(obj.constructor === Object){
            for(key in obj){
                if(fn.call(obj[key],key,obj[key])) break 
            }
        }else{
            for(key=0;key<obj.length;key++){
               if(fn.call(obj[key],key,obj[key])) break
            }
        }
        return that
    }

    Bui.prototype.modules = function(){
        return {
            form: 'modules/form', //表单
            jquery:'modules/jquery'
        };
    }()

    Bui.prototype.onevent = function(moduleName,events,callback){
        if(typeof moduleName!=='string'||typeof callback!=='function'){
            return this
        }
        return bui.event(moduleName,events,null,callback)
    }

    Bui.prototype.event = function(moduleName,events,params,callback){

        //callback 是select on的回调函数

        var that = this,result = null

        var fn = function(_,item){
            var res = item && item.call(that, params);
            res === false && result === null && (result = false);
        }

        var eventName = moduleName + '.' + events

        if(callback){
            //如果回调存在，将之加入到config.event
            config.events[eventName] = config.events[eventName] || []

            config.events[eventName].push(callback)

            return this

        }

        bui.each(config.events[eventName],fn)

        return result

    }

    window.bui = bui
    
}(window);



$(function(){

    var body = document.getElementsByTagName('body')[0];

    var scriptText = $('.Bui-Textarea .Script-Textarea').val()

    var createScript = document.createElement('script')

    createScript.async = true

    createScript.charset = 'utf-8'
    
    createScript.appendChild(document.createTextNode(scriptText))

    body.appendChild(createScript) 

    $('.Bui-Textarea .Html-Button').on('click',function(){
        var node = $('.Bui-Textarea .Html-Textarea').val()
        $('.Bui-Demo').html(node)
    })

    $('.Bui-Textarea .Script-Button').on('click',function(){

        var newScriptText = $('.Bui-Textarea .Script-Textarea').val()

        eval(newScriptText)

    })    

    $('.Bui-Textarea .Html-Button').click()

})

