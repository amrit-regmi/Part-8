import React, {useEffect,useState} from 'react'

const Books = (props) => {
  const [books,filterBooks] = useState([])
  
  useEffect(() => {
    if(props.books.data){
      filterBooks(props.books.data.allBooks)
    }
  },[props.books.data])
 
 
  if (!props.show || !props.books.data || !props.books.data.allBooks ) {
    return null
  }



  const genreList = [...new Set (props.books.data.allBooks.reduce((t,c)=> t.concat(c.genres),[]))]

  const filterBy = (genre)=> {  
    if(genre==='all'){  
      return filterBooks (props.books.data.allBooks)
    } 
    
   filterBooks( props.books.data.allBooks.filter(book => book.genres.includes(genre)))

  }


  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      {genreList.map( genre => <button onClick = {()=> filterBy(genre)} key={genre}>{genre}</button>)}<button onClick = {()=> filterBy('all')}>all</button>
    </div>
  )
}

export default Books