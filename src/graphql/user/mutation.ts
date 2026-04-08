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

export const CREATE_COMMENT = gql `
mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
        _id
        commentStatus
        commentGroup
        commentContent
        commentStars
        commentRefId
        memberId
        createdAt
        updatedAt
        memberData {
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
            accessToken
        }
    }
}
`
;

export const UPDATE_COMMENT = gql `
mutation UpdateComment($input: CommentUpdate!) {
    updateComment(input: $input) {
        _id
        commentContent
        commentStars
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

export const CREATE_BOOKINGS = gql `
mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
        _id
        bookingStatus
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
        memberData {
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
            accessToken
        }
    }
}
`

/**************************
 *         AGENT          *
 *************************/

export const IMAGES_UPLOADER = gql `
mutation ImagesUploader($files: [Upload!]!, $target: String!) {
    imagesUploader(files: $files, target: $target)
}
`;

export const CREATE_PROPERTY = gql `
mutation CreateProperty($input: PropertyInput!) {
    createProperty(input: $input) {
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
        memberData {
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
            accessToken
        }
        meLiked {
            memberId
            likeRefId
            myFavorite
        }
    }
}
`;

