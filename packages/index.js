import search_input from './search_input'

const components = [
    search_input
]

const install = function (Vue) {
    if (install.installed) return
        components.map(component => Vue.component(component.name,component))
}

if (typeof window !== 'undefined' && window.Vue){
    install(window.Vue)
}

export default {
    //导出的对象必须具有 install，才能被 Vue.use() 方法安装
    install,
    //组件列表
    search_input
}
