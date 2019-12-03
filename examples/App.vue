<template>
  <div id="app">
    <search_input :isHistory="true"
                  :lists_title="search_result_title"
                  :lists_note="search_result_note"
                  :input_length="my_input_length"
                  @parent_get_lists="get_selected_lists"
                  @parent_search="finish_search">
    </search_input>
  </div>
</template>

<script>

export default {
    name: 'app',
    data(){
        return{
          //搜索结果中的标题
          search_result_title:[],
          //搜索结果中的备注(不需要可以删掉)
          search_result_note:[],
            // 自定义搜索框长度
            my_input_length: "200px"
        }
    },
    methods:{
      get_selected_lists(input_content){
        // eslint-disable-next-line no-console
        // console.log(input_content);
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
          // eslint-disable-next-line no-console
        console.log("用户搜索了",input_content);
        //搜索框显示完成，页面展示搜索结果
        //这里写入你之后想要运行的程序
      }
    }
}
</script>

<style>

</style>
