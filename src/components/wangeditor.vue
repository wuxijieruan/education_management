<template>
  <div class="editor">
    <div ref="toolbar" class="toolbar"></div>
    <div ref="editor" class="text"></div>
  </div>
</template>
<script>
import E from "wangeditor";
import { imgUrl } from "@/config/env";
export default {
  name: "editoritem",
  data() {
    return {
      editor: {},
      info_: null
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear();
        this.info_ = null;
      }
    },
    value: function(value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value);
      }
    }
    //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  mounted() {
    this.seteditor();
    this.editor.txt.html(this.value);
  },
  methods: {
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);
      this.editor.customConfig.uploadImgShowBase64 = true; // base 64 存储图片
      this.editor.customConfig.uploadImgServer = imgUrl; // 配置服务器端地址
      this.editor.customConfig.uploadImgHeaders = {}; // 自定义 header
      this.editor.customConfig.uploadFileName = "files"; // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 6; // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间
      this.editor.customConfig.showLinkImg = false; // 隐藏“网络图片”tab
      // 配置菜单
      this.editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        "video", // 插入视频
        "code", // 插入代码/
        "undo", // 撤销
        "redo",// 重复
        "fullscreen" // 全屏
      ];
      this.editor.customConfig.customUploadImg = function(files, insert) {
        //对上传的图片进行处理，图片上传的方式
        console.log(files[0]); //files【0】即文件信息及文件流
        var data = new FormData(); //用ajax传递文件流必须用FormData，其他格式不可传递
        data.append("file", files[0]);
        $.ajax({
          url: imgUrl,
          type: "post",
          data: data,
          cache: false, //上传文件不需要缓存。
          processData: false, //ajax里面的processData设置为false,因为data值是FormData对象，不需要对数据做处理。
          contentType: false, //不设置contentType值，因为是由<form>表单构造的FormData对象，且已经声明了属性enctype="multipart/form-data"，所以这里设置为false。
          success: function(data) {
            console.log(data)
            //返回的data为图片名
            insert( data.url); //上传代码返回结果之后，将图片插入到编辑器中。括号内为图片路径imgUrl
          },
          error: function() {
            alert("图片上传错误");
          }
        });
      };
      this.editor.customConfig.onchange = html => {
        this.info_ = html; // 绑定当前逐渐地值
        this.$emit("change", this.info_); // 将内容同步到父组件中
      };
      // 创建富文本编辑器
      this.editor.create();
      $('#div1').attr('style','height:auto;');
    }
  }
};
</script>

<style>
.editor {
  width: 600px;
  position: relative;
  z-index: 0;
}
.toolbar {
  border: 1px solid #ccc;
  margin-bottom: 20px;
}
.text {
  border: 1px solid #ccc;
  min-height: 500px;
  text-overflow: ellipsis;
}
.w-e-toolbar{
  flex-wrap:wrap;
}
</style>
