import React, { useState,useEffect } from 'react'
import {ADD_BORN} from '../graphql/mutations'
import { useMutation} from '@apollo/client'
import {ALL_AUTHORS} from '../graphql/queries'

const SetBorn= ({authors,user,setNotification}) => {

  const authorsWithNoBorn = authors.data.allAuthors.filter(author => !author.born)
  
  const [born,setBorn] = useState('')
  const [name,setName] = useState('')
  const [addBirthYear] = useMutation(ADD_BORN, {
    refetchQueries: [ { query: ALL_AUTHORS}]
  })

useEffect (()=>{
  setName(authorsWithNoBorn[0]?authorsWithNoBorn[0].name:'')
},[authors,authorsWithNoBorn])
  
const submit = async (event) => {
    event.preventDefault()
    try{
      await addBirthYear({variables:{name,born:Number(born)}})
      setNotification({type:'success',message:`Birth year added to  ${name}`})
      setName(name,authorsWithNoBorn[0].name)
      setBorn('')
    } catch (e) {
      setNotification({type:'error',message:`Filed to update  Birth year on ${name}, ${e}`})
    }
    
    
}

const selectChange = (event) => {
  console.log(event.target.value)  
  setName(event.target.value)  

}

if(!user){
  return null
}


  return (
    <div>
      <h2>Set BirthYear</h2>
      <form onSubmit = {submit}>
        <div>
        {name===""?"All authors have born year":""} 
        <select value= {name } onChange={ (e) => selectChange(e)}>
          { authorsWithNoBorn.map(author => <option key={author.name} value={author.name}>{author.name}</option>)}
        </select>
        </div>
        <div>
          born
          <input
            type='number'
            disabled = {name===""}
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
      </div>
      <button  disabled = {name===""} type='submit'>Update Author</button>
      </form>
    </div>
  )

}

export default SetBorn