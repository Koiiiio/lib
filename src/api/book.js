import request from '@/utils/request'

export const GetBookService = () => request.get('/user/books/info')

export const AddBookService = (data) => request.post('/admin/books/info', data)

export const EditBookService = (data) => {
  const path = '/admin/books/info/{isbn}'
  const requestPath = path.replace('{isbn}', data.isbn)
  return request.put(requestPath, data)
}

export const AddInstanceService = (data) =>
  request.post('/admin/books/instances', data)

export const DelInstanceService = (id) => {
  const path = '/admin/books/info/{instanceId}'
  const requestPath = path.replace('{instanceId}', id)
  return request.delete(requestPath, id)
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

//借阅申请
export const GetBorrowService = (approved) =>
  request.get('/admin/borrowing/applications', approved)

//预约
export const GetReserveList = () => request.get('/user/reservation')

//借阅记录
export const GetBorrowRecord = () => request.get('/user/borrowing/records')

//迟还
export const GetLateListService = () =>
  request.get('/admin/borrowing/late-returns')

export const BorrowBookService = (data) => {
  request.post('/user/reservation', data)
}
