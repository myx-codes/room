import { gql } from '@apollo/client'

export const CHECK_AUTH = gql`
  query CheckAuth {
    checkAuth
  }
`

export const CHECK_AUTH_QUERY = CHECK_AUTH


export const GET_PROPERTIES = gql `
query GetProperties($input: PropertiesInquiry!) {
    getProperties(input: $input) {
        list {
            _id
            propertyType
            propertyStatus
            propertyLocation
            propertyAddress
            propertyTitle
            propertyPrice
            propertySquare
            propertyBeds
            propertyRooms
            propertyViews
            propertyLikes
            propertyComments
            propertyRank
            propertyImages
            propertyDesc
            propertyRent
            memberId
            deletedAt
            constructedAt
            createdAt
            updatedAt
        }
        metaCounter {
            total
        }
    }
}
`;
