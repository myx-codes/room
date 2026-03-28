import { gql } from '@apollo/client'

export const LOGIN_MUTATION = gql`
  mutation Login($memberNick: String!, $memberPassword: String!) {
    login(input: { memberNick: $memberNick, memberPassword: $memberPassword }) {
      _id
      memberType
      memberStatus
      memberAuthType
      memberPhone
      memberNick
      memberFullName
      memberImage
      memberAddress
      memberRank
      memberDesc
      memberProperties
      memberArticles
      memberFollowers
      memberFollowings
      memberPoints
      memberLikes
      memberViews
      memberComments
      memberWarnings
      memberBlocks
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`

export const CHECK_AUTH_QUERY = gql`
  query CheckAuth {
    checkAuth
  }
`
