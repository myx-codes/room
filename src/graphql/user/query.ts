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

export const GET_PROPERTY_TYPES = gql`
  query GetPropertyTypes($input: PropertiesInquiry!) {
    getProperties(input: $input) {
      list {
        propertyType
      }
    }
  }
`

export const GET_FEATURED_PROPERTIES = gql`
  query GetFeaturedProperties($input: PropertiesInquiry!) {
    getProperties(input: $input) {
      list {
        _id
        propertyType
        propertyLocation
        propertyTitle
        propertyPrice
        propertyRank
        propertyComments
        propertyImages
        propertyDesc
      }
    }
  }
`

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

export const GET_BOOKINGS_FOR_MY_PROPERTIES = gql`
  query GetBookingsForMyProperties($input: BookingsInquiry!) {
    getBookingsForMyProperties(input: $input) {
      list {
        _id
        bookingStatus
        bookingCheckIn
        bookingCheckOut
        bookingGuests
        totalPrice
        propertyData {
          _id
          propertyTitle
        }
        memberData {
          _id
          memberNick
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
        commentStars
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

/**************************
 *         ADMIN          *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
  query GetAllMembersByAdmin($input: MembersInquiry!) {
    getAllMembersByAdmin(input: $input) {
      list {
        _id
        memberNick
        memberPhone
        memberType
        memberStatus
        memberFullName
        memberImage
        memberLikes
        memberViews
        memberComments
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`

export const GET_ALL_PROPERTIES_BY_ADMIN = gql`
  query GetAllPropertiesByAdmin($input: AllPropertiesInquiry!) {
    getAllPropertiesByAdmin(input: $input) {
      list {
        _id
        propertyTitle
        propertyType
        propertyStatus
        propertyLocation
        propertyPrice
        propertyViews
        propertyLikes
        propertyComments
        propertyRank
        memberId
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
  query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
    getAllBoardArticlesByAdmin(input: $input) {
      list {
        _id
        articleCategory
        articleStatus
        articleTitle
        articleLikes
        articleViews
        articleComments
        memberId
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`
