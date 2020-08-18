import React,{useState, useEffect} from 'react'
import { useMutation} from '@apollo/client'
import  {LOGIN} from '../graphql/mutations'

const LoginForm = ({setNotification,setUser,show,setPage}) => {
  const [username,setUsername] =useState('')
  const [password,setPassword] = useState('')

  const [login,result] = useMutation(LOGIN,{
    onError: (error) => {
      console.log(error)
    }
  })

 

  useEffect(() => {
    if(result.data) {
      const user = result.data.login
      setUser(user)
      setPage('authors')
      localStorage.setItem('library-user-token',JSON.stringify(user))
    }
  },[result.data, setPage, setUser])

  const submit = async (e) => {
    e.preventDefault()
    login({variables:{username,password}})
  }
  if (!show) {
    return null
  }

  return(
    <div>
      <form onSubmit ={submit}>
        <div>
          username: <input value={username} onChange = {({target})=> setUsername(target.value) }/>
          password: <input type = "password" value={password} onChange = {({target})=> setPassword(target.value) }/>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}
export default LoginForm