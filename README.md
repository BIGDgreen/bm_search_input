# bm_search_input
## 介绍
基于vue3的搜索框，包含存储和删除历史记录以及搜索建议列表，用户可以在配置中选择是否需要历史记录。

## 展示
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019083118304461.gif)

## 下载
```
npm install bm_search_input -S
```

## 引入
```
import bm_search_input from 'bm_search_input'

Vue.component('bm_search_input',bm_search_input);
```
## 配置
<table>
  <tr>
    <th width=10%>参数</th>
    <th width=20%>类型</th>
    <th width=30%>默认值</th>
    <th width="40%">备注</th>
  </tr>
  <tr>
    <td> isHistory</td>
    <td> Boolean </td>
    <td>
           true
     </td>
    <td>
    要选择是否需要历史记录，需要用true，不需要用false
    </td>
  </tr>
    <tr>
    <td> lists_title</td>
    <td> Array </td>
    <td>
           无
     </td>
    <td>
    搜索建议列表中的标题，不需要可以不传参
    </td>
  </tr>
      <tr>
    <td> lists_note</td>
    <td> Array </td>
    <td>
           无
     </td>
    <td>
    搜索建议列表中的备注，不需要可以不传参
    </td>
  </tr>
</table>


### 使用示例
template中

```
 <search_input :isHistory="true"
                  :lists_title="search_result_title"
                  :lists_note="search_result_note"
                  @parent_get_lists="get_selected_lists"
                  @parent_search="finish_search">
    </search_input>
```
script中

```
  data(){
        return{
          //搜索结果中的标题
          search_result_title:[],
          //搜索结果中的备注(不需要可以删掉)
          search_result_note:[]
        }
    },
    methods:{
      get_selected_lists(input_content){
        // eslint-disable-next-line no-console
        console.log(input_content);
        //发送请求，获取筛选结果
        this.axios.get('demo.json',{
          params:{
            //将用户输入内容加入参数，其余参数根据需要自行添加
            param1:input_content
          }
        })
          .then((res) => {
            // console.log(res.data);
            //将筛选结果(数组)传入子组件，完成显示
            res.data.forEach((item,index) => {
              this.search_result_title[index] = res.data[index].title;
              this.search_result_note[index] = res.data[index].note;
            })
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.log(err);
          })
      },
      finish_search(input_content){
        console.log(input_content);
        //搜索框显示完成，页面展示搜索结果
        //这里写入你之后想要运行的程序
      }
    }
```

### GitHub
开源地址： [bm_search_input](https://github.com/BigMonkeyyy/bm_search_input.git).
欢迎star！
