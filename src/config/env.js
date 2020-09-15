// 公共地址

let baseUrl = 'https://www.bolekids.com/learn' //线上服务器

let baseFileUrl = 'https://www.bolekids.com' //线上服务器

// let baseUrl = 'https://zhjy.917tou.com/learn' //测试服务器

// let baseFileUrl = 'https://zhjy.917tou.com' //测试服务器

//  let baseUrl = 'https://zhjy.917tou.com/learn';// 开发服务器

let imgUrl = baseFileUrl+'/file-local-1.0.0/img/upload'//上传图片接口

let newVideoUrl = baseUrl+'/file/uploadAndChangeFomart'//上传视频接口

let VideoUrl  = baseFileUrl+'/file-local-1.0.0/upload/upload'//上传文件，音频接口

let imagesUrl = baseFileUrl+'/file-local-1.0.0/download/file?filePath=/'  //视频地址,文件，音频返回地址

let zipFileUrl = baseUrl+'/file/uploadAndUnzip'  //电子书文件上传地址

export {
    baseUrl,
    baseFileUrl,
    imgUrl,
    VideoUrl,
    imagesUrl,
    newVideoUrl,
    zipFileUrl
}
