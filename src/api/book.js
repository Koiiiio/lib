import request from '@/utils/request'

export const GetBookService = () => request.get('/user/books/info')

export const AddBookService = (data) => request.post('/admin/books/info', data)

export const EditBookService = (data) =>
  request.put('/admin/books/info/{isbn}', data) //{ title, author, cover, description }

export const DelBookService = (isbn) =>
  request.delete('/admin/books/info/{isbn}', isbn)

// export const GetInstanceService = (params) => {
//   request.get('/my/article/list', {
//     params
//   })
// }
//export const BorrowBookService = (params) => {
//  request.post('/user/borrowing', {
//    params
//  })
//}

//借阅申请
export const GetBorrowService = (approved) =>
  request.get('/admin/borrowing/applications', approved)
//预约
export const GetReserveList = () => request.get('/user/reservation')
//借阅记录
export const GetBorrowRecord = () => request.get('/user/borrowing/records')
