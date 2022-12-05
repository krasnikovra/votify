import React from 'react'
import { useMatch } from 'react-router-dom'
import UserProfile from './UserProfile'

export default function Profile(props) {
  const match = useMatch('/profile/:id')
  const id = match.params.id

  return <UserProfile id={id} />
}
