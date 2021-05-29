const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = (pageCount === readPage)
  if (!name) {
    const response1 = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response1.code(400)
    return response1
  }
  if (pageCount < readPage) {
    const response1 = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response1.code(400)
    return response1
  }

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}
const getAllBooksHandler = (request, h) => {
  const mybook = []
  const { name, reading, finished } = request.query
  if (name) {
    for (const book in books) {
      if (books[book].name.toLowerCase().includes(name.toLowerCase())) {
        if (reading === '1' || reading === '0') {
          if (books[book].reading === (reading === '1')) {
            mybook.push(books[book])
          }
        } else {
          mybook.push(books[book])
        }
      }
    }
  } else {
    for (const book in books) {
      if (reading === '1' || reading === '0') {
        if (books[book].reading === (reading === '1')) {
          mybook.push(books[book])
        }
      } else {
        mybook.push(books[book])
      }
    }
  }
  let tempdata = []
  if (finished) {
    for (const book in mybook) {
      if (finished === '1' || finished === '0') {
        if (mybook[book].finished === (finished === '1')) {
          tempdata.push(books[book])
        }
      } else {
        tempdata.push(mybook[book])
      }
    }
  } else {
    tempdata = JSON.parse(JSON.stringify(mybook))
  }
  const desiredBook = []
  for (const book in tempdata) {
    desiredBook.push({
      id: books[book].id,
      name: books[book].name,
      publisher: books[book].publisher
    })
  }
  return {
    status: 'success',
    data: {
      books: desiredBook
    }
  }
}
const getBookByIdHandler = (request, h) => {
  const { id } = request.params
  const Book = books.filter((n) => n.id === id)[0]

  if (Book !== undefined) {
    return {
      status: 'success',
      data: {
        book: Book
      }
    }
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}
const editBookByIdHandler = (request, h) => {
  const { id } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  if (!name) {
    const response1 = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response1.code(400)
    return response1
  }
  if (pageCount < readPage) {
    const response1 = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response1.code(400)
    return response1
  }
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((Book) => Book.id === id)
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params
  const index = books.findIndex((Book) => Book.id === id)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}
module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
