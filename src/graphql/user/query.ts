import { gql } from '@apollo/client'

export const CHECK_AUTH = gql`
  query CheckAuth {
    checkAuth
  }
`

export const CHECK_AUTH_QUERY = CHECK_AUTH
