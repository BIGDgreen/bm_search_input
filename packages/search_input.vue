<template>
    <div>
        <div class="search_input" ref="search_input" @mouseleave="mouseout">
            <div></div>
            <div class="search_bar" @click="focus()">
                <span>
                    <svg t="1567053204806" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2003" width="200" height="200"><path d="M897.2 882.3l-210-221.1c54.5-57.7 85.6-132.5 87.5-212.4 2.1-86-28.8-167.7-88.1-230.1-59.3-62.5-139.4-98.2-225.3-100.4h-8.5c-82.8 0-161.2 31-221.6 88.1-128.7 122.3-134.6 326.8-12.3 455.5 59.3 62.5 139.4 98.2 225.3 100.4h9.1c76.3 0 148.6-26.8 206.7-75.4l210.1 221.2 27.1-25.8zM453.3 719.5h-8.5c-74.3-2-143.5-32.9-194.9-87.1-106-111.5-101.1-288.7 10.7-395 52-49.3 120.3-76.4 192.2-76.4h8c74.3 2 143.5 32.9 194.9 87.1 51.1 53.9 78.2 124.8 76.4 199.7-1.9 74.5-32.8 143.9-86.9 195.2-52.7 49.3-120.8 76.5-191.9 76.5z" p-id="2004" fill="#8a8a8a"></path></svg>
                </span>
                <input type="text" placeholder="搜索" ref="search" @keyup="search()" v-model="search_content" @keyup.enter="finish_input()">
            </div>
            <div v-if="isFocus && !isEmpty">
                <div class="suggestions" v-for="(list,index) in lists" :key="index" @click="selectItem(index)">
                    <div class="suggestion_item">{{list.title}}</div>
                    <div class="suggestion_item">{{list.note}}</div>
                </div>
            </div>
            <div v-if="isFocus && isEmpty && hasHistory">
                <div class="history_suggestion_title">
                    <div>搜索历史</div>
                    <div class="history_clear" @click="clear_history()">
                        <div>
                            <svg t="1567218276841" class="icon clear_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2103" width="200" height="200"><path d="M829.952 271.36h-126.976v-51.2a76.288 76.288 0 0 0-75.776-76.288h-256a76.288 76.288 0 0 0-75.776 76.8v51.2H168.448a25.6 25.6 0 0 0 0 51.2h661.504a25.6 25.6 0 0 0 0-51.712z m-178.176 0h-307.2v-51.2a26.112 26.112 0 0 1 25.6-25.6h256a24.576 24.576 0 0 1 24.576 25.6zM448.512 677.376V398.336a25.6 25.6 0 0 0-51.2 0v279.04a25.6 25.6 0 0 0 51.2 0zM601.088 677.376V398.336a25.6 25.6 0 0 0-51.2 0v279.04a25.6 25.6 0 0 0 51.2 0z" fill="" p-id="2104"></path><path d="M735.744 346.624a25.6 25.6 0 0 0-25.6 25.6v381.44a102.4 102.4 0 0 1-102.4 102.4H390.656a102.4 102.4 0 0 1-102.4-102.4V372.224a25.6 25.6 0 0 0-51.2 0v381.44a153.6 153.6 0 0 0 153.6 153.6h217.6a153.6 153.6 0 0 0 153.6-153.6V372.224a25.6 25.6 0 0 0-26.112-25.6z" fill="" p-id="2105"></path></svg>
                        </div>
                        <div>清空</div>
                    </div>
                </div>
                <div class="suggestions history_suggestion" v-for="(history_list,index) in history_lists" :key="index" ref="historyList" @click="selectHistory(index)">
                    <div class="suggestion_item">{{history_list}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "search_input",
        data(){
            return{
                isFocus:false,
                isEmpty:true,
                search_content:"",
                lists:[],
                history_lists:[],
                flag:0
            }
        },
        props:["isHistory","lists_title","lists_note"],
        computed:{
          hasHistory(){
              if (this.isHistory !== undefined){
                  return this.isHistory;
              } else {
                  return true;
              }
          }
        },
        mounted(){
            //获得历史搜索记录
            let histories = localStorage.getItem('history_lists');
            if ( histories !== "" && histories !== null && histories !== undefined){
                this.history_lists = histories.split(',');
            }
        },
        methods:{
            search(){
                //输入框内容判空
                let that = this;
                this.isEmpty = this.search_content === "";
                if (!this.isEmpty){
                    //发送请求,传递用户输入内容，返回筛选结果
                    this.$emit('parent_get_lists',this.search_content);
                    //将筛选结果放在搜索建议，限制建议最大条数为10条
                    if (this.lists_title.length !== 0 || this.lists_note.length !== 0){
                        that.isEmpty = false;
                        let lists_length = this.lists_title.length > 0 ? this.lists_title.length : this.lists_note.length;
                        if (lists_length > 10){
                            for (let i = 0 ; i < 10 ; i++){
                                //限制标题最多十个字，备注最多八个字，超出部分用省略号代替
                                let final_title = this.lists_title[i].length > 10 ? this.lists_title[i].substr(0,10)+'...': this.lists_title[i];
                                let final_note = this.lists_note[i].length > 4 ? this.lists_note[i].substr(0,8)+'...': this.lists_note[i];
                                that.$set(that.lists,i,{title:final_title,note:final_note});
                            }
                        } else{
                            for (let i = 0 ; i < lists_length ; i++){
                                that.$set(that.lists,i,{title:this.lists_title[i],note:this.lists_note[i]});
                            }
                        }
                    } else {
                        that.isEmpty = true;
                    }
                }
            },
            finish_input(){
                //完成输入
                let that = this;
                let history = this.search_content;
                //将此次搜索放进历史纪录
                if (this.history_lists.length === 0 || this.history_lists.indexOf(history) === -1){
                    that.history_lists.push(history);
                    that.history_lists = that.history_lists.reverse();
                    let history_string = that.history_lists.toString();
                    localStorage.setItem('history_lists',history_string);
                    //搜索，建议栏显示搜索建议列表
                    this.search();
                    //搜索完成后加载页面
                    this.$emit('parent_search',this.search_content);
                }
                this.isFocus = false;
            },
            clear_history(){
              //清空历史记录
              localStorage.removeItem('history_lists');
              this.history_lists = [];
            },
            focus(){
                //聚焦
                this.isFocus = true;
                //改变输入框样式
                this.$refs.search_input.style.border="0.5px solid #007cdc";
                this.$refs.search_input.style.boxShadow = "0px 0px 2px #31AADC";
                this.$refs.search_input.style.background = "white";
                this.$refs.search.style.background = "white";
            },
            blur(){
                //失焦
                this.isFocus = false;
                this.$refs.search_input.style.border = "0.5px solid #999999";
                this.$refs.search_input.style.boxShadow = "none";
                this.$refs.search_input.style.background = "#eeeeee";
                this.$refs.search.style.background = "#eeeeee";
            },
            mouseout(){
                this.blur();
            },
            selectItem(index){
                //选择搜索建议进行搜索
                this.search_content = this.lists[index].title;
                this.blur();
                //将此次搜索放入历史记录,显示搜索建议并加载页面
                this.finish_input();
            },
            selectHistory(index){
                //将历史记录放入输入框
                this.search_content = this.history_lists[index];
                this.blur();
                //选择历史记录进行搜索
                this.search();
                //搜索完成后加载页面
                this.$emit('parent_search',this.search_content);
            }
        }
    }
</script>

<style scoped>
    .search_input{
        width: 86%;
        position: fixed;
        top: 3%;
        left: 7%;
        right: 7%;
        background: #f3f3f3;
        border: .5px solid #999999;
        border-radius: .4rem;
    }

    .search_bar{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: left;
    }

   .suggestions{
       width: 86%;
       margin: 0 auto;
       border-top: 0.5px solid #dddddd;
       display: flex;
       flex-direction: row;
       justify-content: space-between;
       padding: .6rem 1rem;
       color: #666666;
       font-size: .8rem;
   }

   .suggestions:active{
       color: #007cdc;
   }

   .history_suggestion{
       font-size: 1rem;
   }

   .history_suggestion_title{
       font-size: .8rem;
       color: #aaaaaa;
       text-align: center;
       display: flex;
       flex-direction: row;
       align-items: flex-end;
       margin-bottom: .2rem;
       margin-left: 40%;
   }

   .history_clear{
       margin-left: 43%;
       font-size: .68rem;
       display: flex;
       flex-direction: row;
   }

   .history_clear:active{
       color: black;
   }

    .search_input input[type="text"]{
        width: 80%;
        margin-top: .1rem;
        margin-bottom: .1rem;
        margin-left: .32rem;
        font-size: 18px;
        border: 0;
        outline: none;
        padding-top: .4rem;
        padding-bottom: .4rem;
        background: #f3f3f3;
        color: #666666;
    }

    .search_input input[type="text"]::placeholder{
        color: #999999;
    }


    .icon{
        width: 1.6rem;
        height: 1.6rem;
        margin-left: .6rem;
    }

    .clear_icon{
        width: .82rem;
        height: .82rem;
        opacity: 0.5;
    }

    .clear_icon:active{
        opacity: 1;
    }
</style>
