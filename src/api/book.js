import request from '@/utils/request'

export const GetBookService = () => request.get('/user/books/info')

export const AddBookService = (data) => request.post('/admin/books/info', data)

export const EditBookService = (data) => request.put('/my/cate/info', data)

export const DelBookService = (id) =>
  request.delete('/my/cate/del', {
    params: { id }
  })

export const GetListService = (params) => {
  request.get('/my/article/list', {
    params
  })
}
