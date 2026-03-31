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

export const GET_MY_BOOKINGS = gql `
query GetMyBookings($input: BookingsInquiry!) {
    getMyBookings(input: $input) {
        list {
            _id
            bookingStatus
            bookingStart
            bookingEnd
            totalPrice
            bookingCheckIn
            bookingCheckOut
            bookingPrice
            bookingGuests
            propertyId
            memberId
            createdAt
            updatedAt
            propertyData {
                _id
                propertyType
                propertyTitle
                propertyLocation
                propertyAddress
            }
        }
        metaCounter {
            total
        }
    }
}
`

export const GET_COMMENTS = gql`
  query GetComments($input: CommentsInquiry!) {
    getComments(input: $input) {
      list {
        _id
        commentStatus
        commentGroup
        commentContent
        commentRefId
        createdAt
        updatedAt
        memberData {
          _id
          memberNick
          memberFullName
          memberImage
        }
      }
      metaCounter {
        total
      }
    }
  }
`
