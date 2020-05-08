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


//课程管理
export const courseAdd = data => fetch('/course', data, 'POST') // 添加课程

export const courseAddOther = data => fetch('/courseResourceBundle/addBunbdleAndFile', data, 'POST') // 添加课程资源包

export const courseDel = id => fetch('/course?ids=' + id, {}, 'DELETE') // 删除课程

export const courseputOn = id => fetch('/course/putOn?id=' + id, {}, 'PUT') // 上架课程

export const coursePut = data => fetch('/course', data, 'PUT') // 修改课程

export const courseGet = data => fetch('/course', data, 'GET') // 查看课程

export const courseDetail = courseId => fetch('/course/' + courseId, {}, 'GET') // 根据id查看课程详情

export const courseDetails = data => fetch('/courseResourceBundle/getCourseBundleWithAllBoListByFilter', data, 'GET') // 根据id查看课程资源包详情

export const courseResourcesEdit = data => fetch('/courseResourceBundle/updateBunbdleAndFile', data, 'PUT') // 修改课程资源包内容

export const courseResourcesDel = courseResourceBundleId => fetch('/courseResourceBundle/deleteBunbdle?courseResourceBundleId=' + courseResourceBundleId, {}, 'DELETE') // 删除课程资源包

export const courseResourcesFileDel = courseResourceBundleFileId => fetch('/courseResourceBundle/deleteBunbdleFile?courseResourceBundleFileId=' + courseResourceBundleFileId, {}, 'DELETE') // 删除课程资源包文件明细

export const courseSetTop = id => fetch('/course/setTop?id=' + id, {},  'PUT') // 置顶课程

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