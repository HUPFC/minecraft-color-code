jQuery.fn.minercraft_color_format = function(target){
    var obj = $($(this).selector);
    var string = strip_tags(obj.html());
    var arr = recursionResolutionString([],0);
    var final_arr = recursionResolutionArr(arr,0,0);
    var html = buildHtml(final_arr);

    console.log(string,arr,html,final_arr);
    if (target){
        $(target).html(html);
    }else{
        obj.html(html);
    }

    /**
     * 建立html字符串
     * @param out
     * @returns {string}
     */
    function buildHtml(out){
        var html = '';
        var need_span_close = 0;//是否需要span闭合
        var need_p_close = 0;//是否需要p标签闭合
        for (i in out){
            var s = out[i];
            if (!need_p_close){
                html += '<p style="margin: 0;">';
                need_p_close++;
            }
            if (s.indexOf('§') >=0 ){
                if(need_span_close){
                    html+='</span>';
                    need_span_close--;
                }
                html+='<span class="'+s+'">';
                need_span_close++;
                continue;
            }
            switch (s) {
                case '&nbsp':
                    html+=s;
                    break;
                case '<br>':
                    while (need_span_close){
                        html += '</span>';
                        need_span_close--;
                    }
                    if (need_p_close){
                        html += '</p>';
                        need_p_close --;
                    }
                    break;
                default:
                    html+=s;
                    break;
            }
        }
        return html;
    }

    /**
     * 递归数组 合并§元素
     * @param arr
     * @param i 位置i
     * @param select int 是否寻找并合并 递增 代表第x个
     */
    function recursionResolutionArr(arr,i,select){
        var cur_i = i+select;
        var s = arr[cur_i];
        if(!s){
            return arr;
        }
        if (s.indexOf('§')>=0){
            if(select === 0){
                //首次发现§ 进入递归查询
                select++;
            }else{
                //非首次发现§，删除当前元素，并修改i元素,并继续递归查询
                //因为删除了当前的元素 select不再需要递增
                arr[i] = arr[i]+' '+s;
                arr.splice(cur_i,1);
            }
        }else{
            //无§数据，重置select并i递增
            select = 0;
            i++;
        }
        return recursionResolutionArr(arr,i,select);
    }


    /**
     * 递归字符串生成数组
     * @param out
     * @param position_pointer 位置i
     * @returns {*}
     */
    function recursionResolutionString(out,position_pointer){
        var s = string.charAt(position_pointer);
        if(!s){
            return out;
        }
        switch (s) {
            case ' ':
                out.push('&nbsp;');
                break;
            case '§':
                out.push(s+string.charAt(position_pointer+1));
                position_pointer +=1;
                break;
            case "\n":
                out.push('<br>');
                break;
            default:
                out.push(s);
                break;
        }
        position_pointer+=1;
        return recursionResolutionString(out,position_pointer);
    }

    /**
     * 过滤特殊字符
     * @param string
     * @returns {string}
     */
    function strip_tags(string){
        string = string.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
        string = string.replace(/[|]*\n/, ''); //去除行尾空格
        string = string.replace(/&nbsp;/ig, ''); //去掉npsp
        return string;
    }
};