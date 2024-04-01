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

export const userUpdateInfoService = ({ id, nickname, email }) =>
  request.get('/user/profile', { id, nickname, email })

export const userUpdateAvatarService = (avatar) =>
  request.put('/user/profile', { avatar })

export const userUpdatePasswordService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.put('/user/profile', { old_pwd, new_pwd, re_pwd })

//export const userGetInfoService = () => request.get('/admin/user')
