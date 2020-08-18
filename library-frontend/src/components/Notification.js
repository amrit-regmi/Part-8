import React from 'react'
const Notification = ({notification}) => {
  const color = () => notification.type === "success"? 'green': 'red'

  if ( !notification ) {
    return null
  }

  return (
    <div style={{color: color()}}>
      {notification.message}
    </div>
  )
}

export default Notification