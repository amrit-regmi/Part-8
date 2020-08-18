import React from 'react'

const Recommend = (props) => {

  if (!props.show || !props.books.data || !props.books.data.allBooks ) {
    return null
  }

  return (
    <div>
      <h2>Recommendations </h2>
      <p>based in your faviourite genre {props.genre}</p>
    
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
        {props.books.data.allBooks.map(a =>
          <tr key={a.title}>
            <td>{a.title}</td>
            <td>{a.author.name}</td>
            <td>{a.published}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  )
  
}
export default (Recommend)