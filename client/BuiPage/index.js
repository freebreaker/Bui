require("./index.scss");

require("./modules/form.scss")


;!function(window){
    "use strict";

    var config = {
        modules:{  //各个模块的物理路径
        }
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
          });
          return this;
        };
        
        // callback.call(that);

        that.use(name, callback);

        return that;
    }

    Bui.prototype.use = function(name,callback,exports){

        var that =this,head = document.getElementsByTagName('head')[0],

        dirPath = config.dir = config.dir?config.dir:getIndexPath

        var item = name[0],exports = exports||[]
        
        if(!config.modules[name]){

            var node = document.createElement('script'),
            
            url = dirPath + (that.modules[name]||name) + '.js'

            node.async = true

            node.charset = "utf-8"

            node.src = url

            head.appendChild(node)

        }

        callback.apply(that,exports)
        
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

    window.bui = bui
}(window);



$(function(){

    var head = document.getElementsByTagName('head')[0];

    $('.Bui-Textarea .Html-Button').on('click',function(){
        var node = $('.Bui-Textarea .Html-Textarea').val()
        $('.Bui-Demo').html(node)
    })

    $('.Bui-Textarea .Script-Button').on('click',function(){
        var scriptText = $('.Bui-Textarea .Script-Textarea').val()
        var createScript = document.createElement('script')

        createScript.async = true

        createScript.charset = 'utf-8'

        createScript.appendChild(document.createTextNode(scriptText))

        head.appendChild(createScript)
    })    

    $('.Bui-Textarea .Html-Button').click()

    $('.Bui-Textarea .Script-Button').click()

})

