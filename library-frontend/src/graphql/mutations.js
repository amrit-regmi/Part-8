import { gql } from '@apollo/client'

export const ADD_BOOK = gql `
mutation createBook ($title: String!, $author: String!, $published: Int!,  $genres: [String!]!) {
  addBook (
    title: $title
    author: $author
    published: $published
    genres: $genres
  ){
    title,
    author{name}
    published,
    genres

  }
}`

export const ADD_BORN = gql `
mutation editAuthor ($name: String!, $born:Int!) {
  addBorn(
    name:$name,
    setBornTo:$born
  ) {
    name,
    born
  }
}`

export const LOGIN = gql `
mutation login ($username: String!, $password:String!) {
  login(
    username:$username,
    password:$password
  ) {
   token,
   username,
   favouriteGenre
  }
}`