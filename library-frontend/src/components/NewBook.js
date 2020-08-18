import React, { useState } from 'react'
import {ADD_BOOK} from '../graphql/mutations'
import {ALL_BOOKS} from '../graphql/queries'
import { useMutation} from '@apollo/client'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      props.setNotification({type:"error", message:error.graphQLErrors[0].message})
    },
      update : (store,response) => {
      let data_allBooksbyGenre
      try {
         data_allBooksbyGenre = store.readQuery({query: ALL_BOOKS,variables:{genre:props.user.favouriteGenre}})
      }catch (e){
        console.log(e)
        data_allBooksbyGenre = 'not Initialised'
      }

      if (data_allBooksbyGenre !== 'not Initialised'){
        console.log(data_allBooksbyGenre)
        console.log(response.data.addBook)
        
        store.writeQuery({
          query: ALL_BOOKS,
          variables:{genre:props.user.favouriteGenre},
          data: {...data_allBooksbyGenre,
            allBooks: [...data_allBooksbyGenre.allBooks,response.data.addBook]
          }
        })
      }
      
      


      
    }
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    addBook({variables:{title,author,published: Number(published),genres}})

    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook