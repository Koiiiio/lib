import request from '@/utils/request'

//注册接口
export const userRegisterService = ({
  username,
  password,
  repassword,
  email,
  userRole
}) => {
  return request.post('/register', {
    username,
    password,
    repassword,
    email,
    userRole
  })
}
//登录接口
export const userLoginService = ({ username, password, userRole }) => {
  return request.post('/login', {
    username,
    password,
    userRole
  })
}

export const userGetInfoService = () => request.get('/user/profile')

export const userUpdateInfoService = ({ email }) =>
  request.put('/user/profile', { email })

export const userUpdateAvatarService = (avatar) =>
  request.put('/user/profile', avatar)

//export const userUpdatePasswordService = ({ old_pwd, new_pwd, re_pwd }) =>
//request.put('/user/profile', { old_pwd, new_pwd, re_pwd })

export const userUpdatePasswordService = ({ password }) =>
  request.put('/user/profile', { password })

export const GetBorrowingService = () =>
  request.get('/admin/borrowing/overdue-readers')
