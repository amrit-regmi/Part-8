import { useQuery,useLazyQuery} from '@apollo/client';  
import {ALL_AUTHORS,ALL_BOOKS}  from './graphql/queries'
import React, { useState,useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Recommend from './components/Recommend';



const App = () => {
  const [page, setPage] = useState('authors')
  const [user,setUser] = useState('')
  const [notification,setNotification] = useState('')
  

  const authors=  useQuery(ALL_AUTHORS)
  const [getBooks,books] = useLazyQuery(ALL_BOOKS)
  const [getRecomended,recomended] = useLazyQuery(ALL_BOOKS)


  const booksPage = () => {
    getBooks() 
    setPage('books')
  }
  
  const recommend = () => {
    
    getRecomended({variables: {genre: user.favouriteGenre}})
    setPage('recommend')
  }

  useEffect(() => {
    const user = localStorage.getItem('library-user-token')
    
    if ( user ) {
      setUser(JSON.parse(user))
    }
  }, [])

  const logInOut = () => {
    if(!user){
      setPage('login')
    }
    if (user){
      localStorage.clear()
      setUser('')
      setPage('authors')
    }
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() =>booksPage() }>books</button>
        {(user) && <button onClick={() => setPage('add')}>add book</button>}
        {(user) && <button onClick={() =>recommend() }>recommend</button> }
        <button onClick={() => logInOut()}>{user?'Logout':'Login'}</button>
      </div>

      <Notification notification={notification}/>

      <Authors
        show={page === 'authors'}
        authors = {authors}
        setNotification = {setNotification}
        user = {user}
      />

      <Books
        show={page === 'books'}
        books = {books}
       
        
      />

      
      <NewBook
        show= {page === 'add'}
        user = {user}
        setNotification = {setNotification}
      />

      
      <Recommend
        show= {page === 'recommend'} 
        genre = {user.favouriteGenre}
        books = {recomended}
      />
     
      <LoginForm
        setPage = {setPage}
        setUser = {setUser}
        setNotification ={setNotification}
        show={page === 'login'}

      />

    </div>
  )
}

export default App