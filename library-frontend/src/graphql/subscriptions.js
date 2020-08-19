import { gql } from '@apollo/client';

export const BOOK_ADDED = gql`
  subscription {
    bookAdded{
      id
      title
      author{name,born}
      published
      genres
    }

  }
`