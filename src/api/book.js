import request from '@/utils/request'

export const GetBookService = () => request.get('/user/books/info')

export const AddBookService = (data) => request.post('/admin/books/info', data)

export const EditBookService = (data) =>
  request.put('/admin/books/info/{isbn}', data)

export const DelBookService = (id) =>
  request.delete('/admin/books/info/{isbn}', {
    params: { id }
  })

export const GetListService = (params) => {
  request.get('/my/article/list', {
    params
  })
}
