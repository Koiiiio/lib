import request from '@/utils/request'
import axios from 'axios'
export const GetBookService = () => request.get('/user/books/info')
//检索
export const SearchBookService = ({ method, keyword }) => {
  // 使用模板字符串简化替换过程
  const requestPath = `/user/books/search?method=${method}&keyword=${encodeURIComponent(keyword)}`
  return request.get(requestPath)
}

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
  const path = '/admin/books/instances/{instanceId}'
  const requestPath = path.replace('{instanceId}', id.toString())
  return request.delete(requestPath)
}

export const DelBookService = (isbn) => {
  const path = '/admin/books/info/{{isbn}}'
  const requestPath = path.replace('{{isbn}}', isbn)
  return request.delete(requestPath, isbn)
}
export const GetInstanceService = (isbn) => {
  const path = '/admin/books/instance-list/{isbn}'
  const requestPath = path.replace('{isbn}', isbn)
  return request.get(requestPath)
}

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
//export const GetBorrowRecord = () => request.get('/user/borrowing/records')
export const GetBorrowRecord = (status) =>
  request.get(`/user/borrowing/records?status=${status}`)
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
//获取处分
export const GetPenaltyService = () => request.get('/user/penalty')

//借阅图书
export const Borrow = ({ isbn, dueDate }) =>
  request.post('/user/borrowing', { isbn, dueDate })

//处理借阅
export const HandleRequest = (id, agree) => {
  const path = '/admin/borrowing/applications/{borrowingId}'
  const requestPath = path.replace('{borrowingId}', id.toString())
  return request.put(requestPath, { agree: agree })
}
// //还书
// export const Return = (id) => {
//   const path = '/user/borrowing/return/{instanceId}'
//   const requestPath = path.replace('{instanceId}', id.toString())
//   return request.put(requestPath)
// }
//还书确认
export const admitReturn = (id) => {
  const path = '/user/borrowing/return/{instanceId}'
  const requestPath = path.replace('{instanceId}', id.toString())
  return request.put(requestPath)
}
//预约
export const Reserve = (isbn) => {
  const path = '/user/reservation/{isbn}'
  const requestPath = path.replace('{isbn}', isbn.toString())
  return request.put(requestPath)
}
//取消预约
export const CancelReserve = (isbn) => {
  const path = '/user/reservation/cancel/{isbn}'
  const requestPath = path.replace('{isbn}', isbn.toString())
  return request.put(requestPath)
}
//处罚
export const Penalty = ({ reason, endDate, userId }) => {
  const path = '/admin/penalty/{userId}'
  const requestPath = path.replace('{userId}', userId.toString())
  return request.put(requestPath, { reason, endDate })
}
//迟还
export const LateReturn = ({ borrowId, lateRetDate }) =>
  request.post('/user/borrowing/lateret-request', {
    borrowId,
    lateRetDate
  })
//迟还2.0
export const LateReturn2 = ({ borrowId }) =>
  request.post('/user/borrowing/lateretBorrow', {borrowId})
//处理迟还
export const HandleLateReturn = ({ borrowingId, agree }) => {
  const path = '/admin/borrowing/late-returns/{borrowingId}'
  const requestPath = path.replace('{borrowingId}', borrowingId.toString())
  return request.put(requestPath, { agree: agree })
}
//isbn搜索
export const ISBNSearchService = ({ isbn }) => {
  const requestPath = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyBDEqgCzTeIRqvZV573XzsVA3yQn_FQUCU&projection=full`
  console.log(requestPath)
  return axios.get(requestPath)
}
