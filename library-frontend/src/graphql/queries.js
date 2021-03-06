import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql `
query{
  allAuthors {
    name
    born
    bookCount
  }
}`

export const ALL_BOOKS = gql `
query getBooks ($genre: String, $author:String){
  allBooks(author:$author,genre:$genre) {
    id
    title  
    author{name,born}
    published
    genres
  }
}`