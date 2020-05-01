<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
// 引入ueditor
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      }
    },
    mounted() {
      const _this = this;
      this.editor = UE.getEditor('editor', this.config); // 初始化UE
       this.editor.addListener('ready', () => {
        _this.editor.setContent(_this.defaultMsg)
      })
    },
     destroyed() {
      this.editor.destroy();
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      }
    }
   
  }
</script>

