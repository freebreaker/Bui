bui.define('jquery', function(exports){ 
    
    var $ = bui.$,Module_Name = 'form',Show = 'Bui-show',Hide = 'Bui-hide',Elem = '.Bui-form',DISABLED ='Bui-disabled'

    var form = function(){
        this.config = {
            verify: {
                required: [
                    /[\S]+/
                    ,'必填项不能为空'
                ]
                ,phone: [
                /^1\d{10}$/
                ,'请输入正确的手机号'
                ]
                ,email: [
                /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
                ,'邮箱格式不正确'
                ]
                ,url: [
                /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/
                ,'链接格式不正确'
                ]
                ,number: function(value){
                if(!value || isNaN(value)) return '只能填写数字'
                }
                ,date: [
                /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/
                ,'日期格式不正确'
                ]
                ,identity: [
                /(^\d{15}$)|(^\d{17}(x|X|\d)$)/
                ,'请输入正确的身份证号'
                ]
            }
          };
        };

    var Form = new form()
    
    form.prototype.set = function(options){
        var that = this
        $.extends(true,that.config,options)
        return that
    }

    form.prototype.verify = function(options){
        var that = this
        $.extends(true,that.config.verify,options)
        return that
    }

    form.prototype.init = function(filter,obj){
        var that = this
        form.render(null,filter)
    }

    form.prototype.render = function(type,filter){
        var that = this,formTarget = $(Elem+function(){              //filter 用来匹配多表单情况下第几个表单
            return filter ? ('[bui-filter="' + filter +'"]') : '';
        }())
        
        var formItems = {
            select:function(){
                var tips = '请选择',Class = 'Bui-form-select',Title = 'Bui-form-title',initValue = ''
                var selects = $(Elem).find('select')
                var hideSelect = function(e,clear){
                    // alert('hide select')
                }
                var allEvents = function(replaceElem){
                    var select = $(this), //触发event的元素
                        selectedIndex = this.selectedIndex,
                        itemDl = replaceElem.find('dl'),itemDds=itemDl.children('dd'),
                        selectTitle = replaceElem.find('.'+Title),
                        selectInput = replaceElem.find('input')

                    var ddtShow= function(){

                        var top =  replaceElem.offset().top + replaceElem.outerHeight()+5 - $(window).scrollTop()

                        selectedIndex = select[0].selectedIndex

                        replaceElem.addClass(Class+'ed')

                        itemDds.removeClass(Hide)

                        itemDds.eq(selectedIndex).addClass('Bui-choosen').siblings().removeClass('Bui-choosen');

                    }

                    var  ddHide = function(choosen){
                        replaceElem.removeClass(Class+'ed ' + Class +'up')
                        if(choosen) return
                        selectInput.blur()
                    }

                    $('.'+ Title).on('click',function(e){
                        if(replaceElem.hasClass(Class+'ed')){
                            ddHide()
                        }else{
                            hideSelect(e,true)
                            ddtShow()
                        }
                    })

                    itemDds.on('click',function(){
                        var value = $(this).attr('bui-value')
                        if($(this).hasClass(DISABLED)) return false
                        if($(this).hasClass('Bui-select-tips')){
                            selectInput.val('')
                        }else{
                            selectInput.val($(this).text())
                            $(this).addClass('Bui-choosen')
                        }

                        select.val(value)      //将选中的value 赋给 select的value

                        bui.event.call(this,Module_Name,'select',{
                            element:select[0],
                            value:value,
                            replaceElem:replaceElem
                        })

                        ddHide(true)

                    })

                }



                selects.each(function(index,item){
                    var _this  = $(this),value = item.value
                        ,selected = $(item.options[item.selectedIndex]) 
                        ,optionsFirst = item.options[0]
                        ,placeholder = optionsFirst ? (
                            optionsFirst.value ? tips : (optionsFirst.innerHTML || tips)
                          ) : tips
                        ,disabled = this.disabled
                    var replaceElem =  $(['<div class="'+ 'Bui-unselect ' + Class +'">'
                    ,'<div class="'+Title+'">'
                    ,'<input type="text" placeholder="'+ placeholder +'" '
                        +('value="'+ (value ? selected.html() : '') +'"')
                        +' readonly'
                        +' class="Bui-input'
                        +' Bui-unselect'
                        + (disabled ? (' ' + DISABLED) : '') +'">',
                        '<i class="Bui-edge"></i>'
                    ,'</div>',
                    '<dl>'
                    ,function(options){
                        var arr = []
                        bui.each(options,function(index,item){
                            if(index=0&&!item.value){
                                arr.push('<dd bui-value ="" class="Bui-select-tips">'+tips+'</dd>')
                            }else{
                                arr.push('<dd bui-value="'+ item.value +'" class="'+ (value === item.value ?'Bui-choosen' : '') + (item.disabled ? (' '+DISABLED) : '') +'">'+ item.innerHTML +'</dd>');
                            }
                        })

                        arr.length === 0 && arr.push('<dd bui-value="" class="'+ DISABLED +'">没有选项</dd>');

                        return arr.join('')

                    }(_this.find('*'))+'</dl>',
                    '</div>'].join(''))

                    _this.after(replaceElem)
                    allEvents.call(this,replaceElem)
                })

                
            },
            radio:function(){
            },
            checkbox:function(){
            }
        }

        if(type){  //如果指定类型
            formItems[type]?formItems[type]():alert('不支持的表单')
        }else{
            //如果没指定类型，遍历formItems执行
            bui.each(formItems,function(index,item){
                item()
            })
        }
        return that;
    }

    //表单事件的监听事件
    form.prototype.on = function(events,callback){

        return bui.onevent.call(this,Module_Name,events,callback)

    }

    var submit = function(e){

        e.preventDefault()
        
        var btn = $(this),
            verifyElem = btn.parents(Elem).find('*[bui-verify]') //获取需要验证的元素
            formElem = btn.parents('form')[0]                   //获取当前的form
            formField = $(Elem).find('input,select,textarea'),  //获取所有的表单域
            field = {} //表单域所有元素的key value
            verifyConfig = Form.config.verify

        //遍历 开始校验
        bui.each(verifyElem,function(_,item){

            var verifyItems = $(this).attr('bui-verify').split('|')  // "required|number|phone"

            var val = $(this).val()

            //提示方式暂不写

            bui.each(verifyItems,function(_,verifyItem){  //验证的是verifyElem

                var isVerified  //是否命中校验

                var isFunction = typeof verifyConfig[verifyItem] === 'function',errorText = ''
                
                if(verifyConfig[verifyItem]){  //如果config有验证规则
                    
                    isVerified = isFunction?errorText = verifyConfig[verifyItem](val,fn):!verifyConfig[verifyItem][0].test(val)  //value 是否校验成功

                    errorText = errorText || verifyConfig[verifyItem][1]

                    if(isVerified){
                        //如果命中校验，即触发errorText,给出提示
                        alert(errorText)
                    }

                }

            })

        })

        bui.each(formField,function(_,item){

            item.name = (item.name || '').replace(/^\s*|\s*&/, '')

            if(!item.name) return

            field[item.name] = item.value

        })

        return bui.event.call(this,Module_Name,'submit',{
            element:this,
            form:formElem,
            field:field
        })


    }

    Form.render()

    $(document).on('submit',Elem,submit).on('click', '*[bui-submit]', submit);
    //……
    exports(Module_Name,Form);
}); 
