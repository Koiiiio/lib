import request from '@/utils/request'

export const GetBookService = () => request.get('/user/books/info')

export const AddBookService = (data) => request.post('/admin/books/info', data)

export const EditBookService = (data) => {
  const path = '/admin/books/info/{isbn}'
  const requestPath = path.replace('{isbn}', data.isbn)
  return request.put(requestPath, data)
}

export const AddInstanceService = ({ isbn, number }) => {
  const parsedNumber = parseInt(number, 10) // 将number转换为整数
  return request.post('/admin/books/instances', { isbn, number: parsedNumber })
}
export const DelInstanceService = (id) => {
  const path = '/admin/books/info/{instanceId}'
  const requestPath = path.replace('{instanceId}', id.toString())
  return request.delete(requestPath)
}

//export const DelBookService = (isbn) =>
//request.delete('/admin/books/info/{{isbn}}', isbn)
export const DelBookService = (isbn) => {
  const path = '/admin/books/info/{{isbn}}'
  const requestPath = path.replace('{{isbn}}', isbn)
  return request.delete(requestPath, isbn)
}
// export const GetInstanceService = (params) => {
//   request.get('/my/article/list', {
//     params
//   })
// }

//获取借阅申请
export const GetBorrowService = (approved) =>
  request.get('/admin/borrowing/applications', {
    params: {
      approved: approved
    }
  })
//获取预约
export const GetReserveList = () => request.get('/user/reservation')

//获取借阅记录
export const GetBorrowRecord = () => request.get('/user/borrowing/records')

//获取迟还
export const GetLateListService = (approved) =>
  request.get('/admin/borrowing/late-returns', {
    params: {
      approved: approved
    }
  })
//获取预约
export const GetReserveService = (data) => {
  request.post('/user/reservation', data)
}

//借阅图书
export const Borrow = ({ isbn, dueDate }) =>
  request.post('/user/borrowing', { isbn, dueDate })

//处理借阅
export const HandleRequest = (id, agree) => {
  const path = '/admin/borrowing/applications/{borrowingId}'
  const requestPath = path.replace('{borrowingId}', id.toString())
  return request.put(requestPath, { agree: agree })
}

export const Return = (id) => {
  const path = '/user/borrowing/return/{instanceId}'
  const requestPath = path.replace('{instanceId}', id.toString())
  return request.put(requestPath)
}
