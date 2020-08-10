import fetch from '@/config/fetch'

//登出
export const loginOut = data => fetch('/scm/common/logout', data, 'GET') // 登出

//登录
export const login = (userName, userPassword) => fetch('/manageUserLongin?userName=' + userName + '&userPassword=' + userPassword, {}, 'POST') // 登录

//修改密码
export const resetPassword = (id, oldPassword,newPassword) => fetch('/updatePassword?id=' + id + '&oldPassword=' + oldPassword+ '&newPassword=' + newPassword, {}, 'PUT') // 登录

//年龄段管理
export const gradeAdd = data => fetch('/grade', data, 'POST') // 添加年龄段

export const gradeDel = id => fetch('/grade?ids=' + id, {}, 'DELETE') // 删除年龄段

export const gradePut = data => fetch('/grade', data, 'PUT') // 修改年龄段

export const gradeGet = data => fetch('/grade', data, 'GET') // 查看年龄段列表

//话题管理
export const subjectsAdd = data => fetch('/subjects', data, 'POST') // 添加话题

export const subjectsDel = id => fetch('/subjects?ids=' + id, {}, 'DELETE') // 删除话题

export const subjectsPut = data => fetch('/subjects', data, 'PUT') // 修改话题

export const subjectsGet = data => fetch('/subjects', data, 'GET') // 查看话题列表

export const updateSubjectsWeightByID = data => fetch('/subjects/updateSubjectsWeightByID' , data, 'POST') // 修改权重


//课程管理
export const courseAdd = data => fetch('/course', data, 'POST') // 添加课程

export const courseAddOther = data => fetch('/courseResourceBundle/addBunbdleAndFile', data, 'POST') // 添加课程资源包

export const courseDel = id => fetch('/course?ids=' + id, {}, 'DELETE') // 删除课程

export const courseputOn = id => fetch('/course/putOn?id=' + id, {}, 'PUT') // 上架课程

export const courseHidden = data => fetch('/course/updateIsShowNumAll', data, 'POST') // 隐藏浏览数

//export const updateIsShowNumAll = data => fetch('/course/updateIsShowNumAll', data, 'POST') // 设置浏览数隐藏显示

export const updateIsShowNumAll = data => fetch('/course/updateIsShowNumAll?type='+ data,{}, 'POST') // 修改课程的序号

export const coursePut = data => fetch('/course', data, 'PUT') // 修改课程

export const courseGet = data => fetch('/course', data, 'GET') // 查看课程

export const courseDetail = courseId => fetch('/course/' + courseId, {}, 'GET') // 根据id查看课程详情

export const courseDetails = data => fetch('/courseResourceBundle/getCourseBundleWithAllBoListByFilter', data, 'GET') // 根据id查看课程资源包详情

export const courseResourcesEdit = data => fetch('/courseResourceBundle/updateBunbdleAndFile', data, 'PUT') // 修改课程资源包内容

export const courseResourcesDel = courseResourceBundleId => fetch('/courseResourceBundle/deleteBunbdle?courseResourceBundleId=' + courseResourceBundleId, {}, 'DELETE') // 删除课程资源包

export const courseResourcesFileDel = courseResourceBundleFileId => fetch('/courseResourceBundle/deleteBunbdleFile?courseResourceBundleFileId=' + courseResourceBundleFileId, {}, 'DELETE') // 删除课程资源包文件明细

export const courseSetTop = id => fetch('/course/setTop?id=' + id, {},  'PUT') // 置顶课程

export const updateCourseIndexByID = data => fetch('/course/updateCourseIndexByID' , data, 'POST') // 修改课程的序号

export const updateCourseResourceBundleIndex = data => fetch('/courseResourceBundle/updateCourseResourceBundleIndex' , data, 'POST') // 修改资源的排列序号

export const courseNameGet = data => fetch('/course/getCourseName', data, 'GET') // 查看课程列表

export const selectAllEnumsCourse = data => fetch('/course/selectAllEnumsCourse', data, 'GET') // 查看课程默认封面列表

export const setFirst = data => fetch('/course/sortCourse?courseId='+ data,{}, 'POST') // 修改课程的序号


//管理员管理
export const adminAdd = data => fetch('/addUser', data, 'POST') // 添加

export const adminDel = (id, isCan) => fetch('/banUser?id=' + id + '&isCan=' + isCan, {}, 'DELETE') // 禁用

export const adminEdit = data => fetch('/updateUser', data, 'PUT') // 修改

export const adminList = data => fetch('/getUserList', data, 'GET') // 列表

export const adminresetPassword = (id, newPassword) => fetch('/resetPassword?id=' + id + '&newPassword=' + newPassword, {}, 'PUT') // 重置密码


//审核作业

export const getConStudentExercisesList = data => fetch('/userMessageManger/getConStudentExercisesList', data, 'GET') // 查看作业列表

export const reviewStudentExercises = data => fetch('/userMessageManger/reviewStudentExercises', data, 'GET') // 审核作业



//获取活动列表
export const actList = data => fetch('/activity', data, 'GET') // 获取活动列表

export const actAdd = data => fetch('/activity', data, 'POST') // 添加

export const actEdit = data => fetch('/activity', data, 'PUT') // 修改

export const actDel = id => fetch('/activity?ids=' + id , {}, 'DELETE') // 删除

export const actDetail = courseId => fetch('/activity/' + courseId, {}, 'GET') // 根据id查看课程详情

export const enterpriseGet = data => fetch('/enterprise', data, 'GET') // 查看企业

export const selectAllEnumsActivity = data => fetch('/course/selectAllEnumsActivity', data, 'GET') // 查看活动注册方式


//获取作业
export const homeworkList = data => fetch('/StudentExercises/list', data, 'GET') // 获取作业列表

export const searchhomework = data => fetch('/StudentExercises/getActivity', data, 'GET') // 搜素作业

export const allactList = data => fetch('/StudentExercises/getActivity', data, 'GET') // 获取所有活动

// export const homeworkdownload = data => fetch('/activity/getManyStudentExercisesByIds?ids='+data, {}, 'GET') // 导出

//用户列表
export const userList = data => fetch('/wechat/getStudentListByFilter', data, 'GET') // 获取作业列表

export const changejifen = data => fetch('/wechat/updateStudentStudentIdentityOverdueTimeByID', data, 'POST') // 修改积分和会员到期时间

export const toSubscribe = data => fetch('/wechat/updateStudentIsSubscribeByOPen', data, 'POST') // 邀请订阅


//统计
//复刷板块
export const plateList = data => fetch('/StudentBrowseDetal/selectPlatesReViewCount', data, 'GET') 

//热门课程统计
export const hotCourseList = data => fetch('/StudentBrowseDetal/selectCourseHotCount', data, 'GET') 

//热门标签统计
export const hotTagList = data => fetch('/StudentBrowseDetal/selectTagHotCount', data, 'GET') 

//课程复刷统计
export const reCourseList = data => fetch('/StudentBrowseDetal/getCourseReViewCount', data, 'GET') 

//资源使用统计
export const sourceList = data => fetch('/StudentBrowseDetal/selectResourcesCount', data, 'GET') 

//用户时长统计
export const timeList = data => fetch('/StudentBrowseDetal/selectUseIntervalCount', data, 'GET') 

//用户深度统计
export const deepList = data => fetch('/StudentBrowseDetal/selectStuProfundityCount', data, 'GET') 

export const returnBackStu = data => fetch('/StudentBrowseDetal/updateStuIsReturn' , data, 'GET') // 邀请回访

export const getNewList = data => fetch('/wechat/selectNewUserQtyTotalDay' , data, 'GET') // 总共新增人数统计

export const getPerNewList = data => fetch('/wechat/selectNewUserQtyPerDay' , data, 'GET') // 每日新增人数统计

export const getMessList = data => fetch('/MessageTemplate/selectStudentTemplateFilter' , data, 'GET') // 获取消息列表



export const getTemID = data => fetch('/MessageTemplate/selectTemplateMessageAll' , data, 'GET') // 获取消息模板

export const postTemID = data => fetch('/MessageTemplate/sendMessageTemplate' , data, 'POST') // 发送消息模板


