import { gql } from '@apollo/client'

/**************************
 *         MEMBER         *
 *************************/

export const LOGIN = gql`
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
      memberRank
      memberProperties
      memberArticles
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
`;


export const SIGN_UP = gql `
mutation Signup($input: MemberInput!) {
    signup(input: $input) {
        _id
        memberType
        memberStatus
        memberAuthType
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberProperties
        memberArticles
        memberPoints
        memberLikes
        memberViews
        memberComments
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_MEMBER = gql `
  mutation UpdateMember($input: MemberUpdate!) {
    updateMember(input: $input) {
        _id
        memberType
        memberStatus
        memberAuthType
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberProperties
        memberArticles
        memberLikes
        memberViews
        memberComments
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        meLiked {
            memberId
            likeRefId
            myFavorite
        }
        memberPoints
    }
}
`;
