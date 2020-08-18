
import React from 'react'
import SetBorn from './SetBorn'

const Authors = (props) => {
  if (!props.show) {
    return null
  }
  
  const authors =  props.authors
  if(authors.loading){
    return <div>Loading</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <SetBorn authors= {authors} user={props.user} setNotification = {props.setNotification}></SetBorn>

    </div>
  )
}

export default Authors
