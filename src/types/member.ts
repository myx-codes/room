export type MemberType = 'USER' | 'AGENT' | 'ADMIN'
export type MemberStatus = 'ACTIVE' | 'BLOCK' | 'DELETE'
export type MemberAuthType = 'PHONE' | 'EMAIL' | 'GOOGLE' | 'APPLE'

export interface Member {
  _id: string
  memberType: MemberType
  memberStatus: MemberStatus
  memberAuthType: MemberAuthType
  memberPhone: string
  memberNick: string
  memberFullName: string | null
  memberImage: string
  memberAddress: string | null
  memberDesc: string | null
  memberProperties: number
  memberArticles: number
  memberFollowers: number
  memberFollowings: number
  memberPoints: number
  memberLikes: number
  memberViews: number
  memberComments: number
  memberRank: number
  memberWarnings: number
  memberBlocks: number
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  accessToken: string
  meLiked: unknown
}