import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AbaiSearch = {
  articleCategory?: InputMaybe<BoardArticleCategory>;
  articleStatus?: InputMaybe<BoardArticleStatus>;
};

export type AiSearch = {
  text?: InputMaybe<Scalars['String']['input']>;
};

export type AlpiSearch = {
  propertyLocationList?: InputMaybe<Array<PropertyLocation>>;
  propertyStatus?: InputMaybe<PropertyStatus>;
};

export type ApiSearch = {
  propertyStatus?: InputMaybe<PropertyStatus>;
};

export type AgentPropertiesInquiry = {
  direction?: InputMaybe<Direction>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search: ApiSearch;
  sort?: InputMaybe<Scalars['String']['input']>;
};

export type AgentsInquiry = {
  direction?: InputMaybe<Direction>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search: AiSearch;
  sort?: InputMaybe<Scalars['String']['input']>;
};

export type AllBoardArticlesInquiry = {
  direction?: InputMaybe<Direction>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search: AbaiSearch;
  sort?: InputMaybe<Scalars['String']['input']>;
};

export type AllPropertiesInquiry = {
  direction?: InputMaybe<Direction>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search: AlpiSearch;
  sort?: InputMaybe<Scalars['String']['input']>;
};

export type Availability = {
  __typename?: 'Availability';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['String']['output'];
  isBooked: Scalars['Boolean']['output'];
  memberId: Scalars['ID']['output'];
  propertyId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AvailabilityInput = {
  date: Scalars['String']['input'];
  isBooked: Scalars['Boolean']['input'];
  propertyId: Scalars['ID']['input'];
};

export type BaiSearch = {
  articleCategory?: InputMaybe<BoardArticleCategory>;
  memberId?: InputMaybe<Scalars['ID']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type BoardArticle = {
  __typename?: 'BoardArticle';
  _id: Scalars['ID']['output'];
  articleCategory: BoardArticleCategory;
  articleComments: Scalars['Int']['output'];
  articleContent: Scalars['String']['output'];
  articleImage?: Maybe<Scalars['String']['output']>;
  articleLikes: Scalars['Int']['output'];
  articleStatus: BoardArticleStatus;
  articleTitle: Scalars['String']['output'];
  articleViews: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  meLiked?: Maybe<Array<MeLiked>>;
  memberData?: Maybe<Member>;
  memberId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** ROOMi platformasidagi maqolalar kategoriyalari */
export enum BoardArticleCategory {
  Event = 'EVENT',
  Free = 'FREE',
  Help = 'HELP',
  Lifestyle = 'LIFESTYLE',
  News = 'NEWS',
  Recommend = 'RECOMMEND'
}

export type BoardArticleInput = {
  articleCategory: BoardArticleCategory;
  articleContent: Scalars['String']['input'];
  articleImage?: InputMaybe<Scalars['String']['input']>;
  articleTitle: Scalars['String']['input'];
};

/** Maqolalarning holati */
export enum BoardArticleStatus {
  Active = 'ACTIVE',
  Delete = 'DELETE',
  Waiting = 'WAITING'
}

export type BoardArticleUpdate = {
  _id: Scalars['ID']['input'];
  articleContent?: InputMaybe<Scalars['String']['input']>;
  articleImage?: InputMaybe<Scalars['String']['input']>;
  articleStatus?: InputMaybe<BoardArticleStatus>;
  articleTitle?: InputMaybe<Scalars['String']['input']>;
};

export type BoardArticles = {
  __typename?: 'BoardArticles';
  list: Array<BoardArticle>;
  metaCounter?: Maybe<Array<TotalCounter>>;
};

export type BoardArticlesInquiry = {
  direction?: InputMaybe<Direction>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search: BaiSearch;
  sort?: InputMaybe<Scalars['String']['input']>;
};

export type Booking = {
  __typename?: 'Booking';
  _id: Scalars['ID']['output'];
  /** Check-in sanasi: YYYY-MM-DD */
  bookingCheckIn: Scalars['String']['output'];
  /** Check-out sanasi: YYYY-MM-DD */
  bookingCheckOut: Scalars['String']['output'];
  bookingEnd: Scalars['DateTime']['output'];
  bookingGuests: Scalars['Int']['output'];
  /** Alias for totalPrice */
  bookingPrice: Scalars['Int']['output'];
  bookingStart: Scalars['DateTime']['output'];
  bookingStatus: BookingStatus;
  createdAt: Scalars['DateTime']['output'];
  memberData?: Maybe<Member>;
  memberId: Scalars['ID']['output'];
  propertyData?: Maybe<Property>;
  propertyId: Scalars['ID']['output'];
  totalPrice: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type BookingInput = {
  /** Check-out sana: YYYY-MM-DD */
  bookingEnd: Scalars['String']['input'];
  bookingGuests: Scalars['Int']['input'];
  /** Check-in sana: YYYY-MM-DD */
  bookingStart: Scalars['String']['input'];
  propertyId: Scalars['ID']['input'];
  totalPrice?: InputMaybe<Scalars['Int']['input']>;
};

/** Bron qilish holatlari */
export enum BookingStatus {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Finished = 'FINISHED',
  Waiting = 'WAITING'
}

export type Bookings = {
  __typename?: 'Bookings';
  list: Array<Booking>;
  metaCounter?: Maybe<Array<TotalCounter>>;
};

export type BookingsInquiry = {
  bookingStatus?: InputMaybe<BookingStatus>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};

export type CiSearch = {
  commentRefId: Scalars['ID']['input'];
};

export type Comment = {
  __typename?: 'Comment';
  _id: Scalars['ID']['output'];
  commentContent: Scalars['String']['output'];
  commentGroup: CommentGroup;
  commentRefId: Scalars['ID']['output'];
  commentStars?: Maybe<Scalars['Int']['output']>;
  commentStatus: CommentStatus;
  createdAt: Scalars['DateTime']['output'];
  memberData?: Maybe<Member>;
  memberId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Izoh qaysi turdagi obyektga tegishli ekanligi */
export enum CommentGroup {
  Article = 'ARTICLE',
  Member = 'MEMBER',
  Property = 'PROPERTY'
}

export type CommentInput = {
  commentContent: Scalars['String']['input'];
  commentGroup: CommentGroup;
  commentRefId: Scalars['ID']['input'];
  commentStars?: InputMaybe<Scalars['Int']['input']>;
};

/** Izohlarning hayotiy sikli (Moderatsiya qoʻshilgan) */
export enum CommentStatus {
  Active = 'ACTIVE',
  Delete = 'DELETE',
  Hold = 'HOLD'
}

export type CommentUpdate = {
  _id: Scalars['ID']['input'];
  commentContent?: InputMaybe<Scalars['String']['input']>;
  commentStars?: InputMaybe<Scalars['Int']['input']>;
  commentStatus?: InputMaybe<CommentStatus>;
};

export type Comments = {
  __typename?: 'Comments';
  list: Array<Comment>;
  metaCounter?: Maybe<Array<TotalCounter>>;
};

export type CommentsInquiry = {
  direction?: InputMaybe<Direction>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search: CiSearch;
  sort?: InputMaybe<Scalars['String']['input']>;
};

/** Saralash yo'nalishi: ASC (1) yoki DESC (-1) */
export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type LoginInput = {
  memberNick: Scalars['String']['input'];
  memberPassword: Scalars['String']['input'];
};

export type MiSearch = {
  memberStatus?: InputMaybe<MemberStatus>;
  memberType?: InputMaybe<MemberType>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type MeLiked = {
  __typename?: 'MeLiked';
  likeRefId: Scalars['ID']['output'];
  memberId: Scalars['ID']['output'];
  myFavorite: Scalars['Boolean']['output'];
};

export type Member = {
  __typename?: 'Member';
  _id: Scalars['ID']['output'];
  accessToken?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  meLiked?: Maybe<Array<MeLiked>>;
  memberArticles: Scalars['Int']['output'];
  memberAuthType: MemberAuthType;
  memberBlocks: Scalars['Int']['output'];
  memberComments: Scalars['Int']['output'];
  memberFullName?: Maybe<Scalars['String']['output']>;
  memberImage?: Maybe<Scalars['String']['output']>;
  memberLikes: Scalars['Int']['output'];
  memberNick: Scalars['String']['output'];
  memberPhone: Scalars['String']['output'];
  memberPoints: Scalars['Int']['output'];
  memberProperties: Scalars['Int']['output'];
  memberRank: Scalars['Int']['output'];
  memberStatus: MemberStatus;
  memberType: MemberType;
  memberViews: Scalars['Int']['output'];
  memberWarnings: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Ro'yxatdan o'tish turi: Telefon, Email, Telegram yoki Google */
export enum MemberAuthType {
  Email = 'EMAIL',
  Google = 'GOOGLE',
  Phone = 'PHONE',
  Telegram = 'TELEGRAM'
}

export type MemberInput = {
  memberAuthType?: InputMaybe<MemberAuthType>;
  memberFullName?: InputMaybe<Scalars['String']['input']>;
  memberImage?: InputMaybe<Scalars['String']['input']>;
  memberNick: Scalars['String']['input'];
  memberPassword: Scalars['String']['input'];
  memberPhone: Scalars['String']['input'];
  memberType?: InputMaybe<MemberType>;
};

/** Foydalanuvchi holati: ACTIVE, BLOCK yoki DELETE */
export enum MemberStatus {
  Active = 'ACTIVE',
  Block = 'BLOCK',
  Delete = 'DELETE'
}

/** Foydalanuvchi roli: USER (mijoz), AGENT (rieltor), ADMIN (boshqaruvchi) */
export enum MemberType {
  Admin = 'ADMIN',
  Agent = 'AGENT',
  User = 'USER'
}

export type MemberUpdate = {
  _id: Scalars['String']['input'];
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  memberFullName?: InputMaybe<Scalars['String']['input']>;
  memberImage?: InputMaybe<Scalars['String']['input']>;
  memberNick?: InputMaybe<Scalars['String']['input']>;
  memberPassword?: InputMaybe<Scalars['String']['input']>;
  memberPhone?: InputMaybe<Scalars['String']['input']>;
  memberStatus?: InputMaybe<MemberStatus>;
  memberType?: InputMaybe<MemberType>;
};

export type Members = {
  __typename?: 'Members';
  list: Array<Member>;
  metaCounter?: Maybe<Array<TotalCounter>>;
};

export type MembersInquiry = {
  direction?: InputMaybe<Direction>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search: MiSearch;
  sort?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addMember: Scalars['String']['output'];
  checkout: Payment;
  createBoardArticle: BoardArticle;
  createBooking: Booking;
  createComment: Comment;
  createProperty: Property;
  imageUploader: Scalars['String']['output'];
  imagesUploader: Array<Scalars['String']['output']>;
  likeTargetBoardArticle: BoardArticle;
  likeTargetMember: Member;
  login: Member;
  logout: Scalars['String']['output'];
  removeBoardArticleByAdmin: BoardArticle;
  removeCommentByAdmin: Comment;
  removePropertyByAdmin: Property;
  signup: Member;
  updateAvailability?: Maybe<Availability>;
  updateBoardArticle: BoardArticle;
  updateBoardArticleByAdmin: BoardArticle;
  updateComment: Comment;
  updateMember: Member;
  updateMembersByAdmin: Member;
  updateNotificationStatus: Notice;
  updateProperty: Property;
  updatePropertyByAdmin: Property;
};


export type MutationCheckoutArgs = {
  bookingId: Scalars['String']['input'];
  paymentMethod?: InputMaybe<PaymentMethod>;
};


export type MutationCreateBoardArticleArgs = {
  input: BoardArticleInput;
};


export type MutationCreateBookingArgs = {
  input: BookingInput;
};


export type MutationCreateCommentArgs = {
  input: CommentInput;
};


export type MutationCreatePropertyArgs = {
  input: PropertyInput;
};


export type MutationImageUploaderArgs = {
  file: Scalars['Upload']['input'];
  target: Scalars['String']['input'];
};


export type MutationImagesUploaderArgs = {
  files: Array<Scalars['Upload']['input']>;
  target: Scalars['String']['input'];
};


export type MutationLikeTargetBoardArticleArgs = {
  articleId: Scalars['String']['input'];
};


export type MutationLikeTargetMemberArgs = {
  memberId: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRemoveBoardArticleByAdminArgs = {
  articleId: Scalars['String']['input'];
};


export type MutationRemoveCommentByAdminArgs = {
  commentId: Scalars['String']['input'];
};


export type MutationRemovePropertyByAdminArgs = {
  propertyId: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  input: MemberInput;
};


export type MutationUpdateAvailabilityArgs = {
  input: AvailabilityInput;
};


export type MutationUpdateBoardArticleArgs = {
  input: BoardArticleUpdate;
};


export type MutationUpdateBoardArticleByAdminArgs = {
  input: BoardArticleUpdate;
};


export type MutationUpdateCommentArgs = {
  input: CommentUpdate;
};


export type MutationUpdateMemberArgs = {
  input: MemberUpdate;
};


export type MutationUpdateMembersByAdminArgs = {
  input: MemberUpdate;
};


export type MutationUpdateNotificationStatusArgs = {
  notificationId: Scalars['String']['input'];
};


export type MutationUpdatePropertyArgs = {
  input: PropertyUpdate;
};


export type MutationUpdatePropertyByAdminArgs = {
  input: PropertyUpdate;
};

export type Notice = {
  __typename?: 'Notice';
  _id: Scalars['ID']['output'];
  category: NoticeCategory;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  creatorId?: Maybe<Scalars['ID']['output']>;
  propertyId?: Maybe<Scalars['ID']['output']>;
  receiverId: Scalars['ID']['output'];
  status: NoticeStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Platformadagi bildirishnoma va hujjatlar turlari */
export enum NoticeCategory {
  Announcement = 'ANNOUNCEMENT',
  Booking = 'BOOKING',
  Faq = 'FAQ',
  Inquiry = 'INQUIRY',
  Payment = 'PAYMENT',
  Privacy = 'PRIVACY',
  Property = 'PROPERTY',
  Terms = 'TERMS'
}

/** Bildirishnoma holatlari */
export enum NoticeStatus {
  Active = 'ACTIVE',
  Delete = 'DELETE',
  Hold = 'HOLD',
  Read = 'READ',
  Unread = 'UNREAD'
}

export type OrdinaryInquiry = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};

export type PiSearch = {
  bedsList?: InputMaybe<Array<Scalars['Int']['input']>>;
  locationList?: InputMaybe<Array<PropertyLocation>>;
  memberId?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<Scalars['String']['input']>>;
  periodsRange?: InputMaybe<PeriodsRange>;
  pricesRange?: InputMaybe<PricesRange>;
  roomsList?: InputMaybe<Array<Scalars['Int']['input']>>;
  squaresRange?: InputMaybe<SquaresRange>;
  text?: InputMaybe<Scalars['String']['input']>;
  typeList?: InputMaybe<Array<PropertyType>>;
};

export type Payment = {
  __typename?: 'Payment';
  _id: Scalars['ID']['output'];
  bookingId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  memberId: Scalars['ID']['output'];
  paidAt?: Maybe<Scalars['DateTime']['output']>;
  paymentAmount: Scalars['Int']['output'];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

/** Toʻlov turlari */
export enum PaymentMethod {
  Cash = 'CASH',
  Click = 'CLICK',
  Payme = 'PAYME',
  Uzum = 'UZUM',
  Wallet = 'WALLET'
}

/** Toʻlov tranzaksiyasining holati */
export enum PaymentStatus {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Refunded = 'REFUNDED',
  Success = 'SUCCESS'
}

export type PeriodsRange = {
  end: Scalars['DateTime']['input'];
  start: Scalars['DateTime']['input'];
};

export type PricesRange = {
  end: Scalars['Int']['input'];
  start: Scalars['Int']['input'];
};

export type Properties = {
  __typename?: 'Properties';
  list: Array<Property>;
  metaCounter?: Maybe<Array<TotalCounter>>;
};

export type PropertiesInquiry = {
  direction?: InputMaybe<Direction>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search: PiSearch;
  sort?: InputMaybe<Scalars['String']['input']>;
};

export type Property = {
  __typename?: 'Property';
  _id: Scalars['ID']['output'];
  constructedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  meLiked?: Maybe<Array<MeLiked>>;
  memberData?: Maybe<Member>;
  memberId: Scalars['ID']['output'];
  propertyAddress: Scalars['String']['output'];
  propertyBeds: Scalars['Int']['output'];
  propertyComments: Scalars['Int']['output'];
  propertyDesc?: Maybe<Scalars['String']['output']>;
  propertyImages: Array<Scalars['String']['output']>;
  propertyLikes: Scalars['Int']['output'];
  propertyLocation: PropertyLocation;
  propertyPrice: Scalars['Float']['output'];
  propertyRank: Scalars['Float']['output'];
  propertyRatingCount: Scalars['Int']['output'];
  propertyRent: Scalars['Boolean']['output'];
  propertyRooms: Scalars['Int']['output'];
  propertySquare: Scalars['Float']['output'];
  propertyStatus: PropertyStatus;
  propertyTitle: Scalars['String']['output'];
  propertyType: PropertyType;
  propertyViews: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PropertyInput = {
  constructedAt?: InputMaybe<Scalars['DateTime']['input']>;
  propertyAddress: Scalars['String']['input'];
  propertyBeds: Scalars['Int']['input'];
  propertyDesc?: InputMaybe<Scalars['String']['input']>;
  propertyImages: Array<Scalars['String']['input']>;
  propertyLocation: PropertyLocation;
  propertyPrice: Scalars['Float']['input'];
  propertyRent?: InputMaybe<Scalars['Boolean']['input']>;
  propertyRooms: Scalars['Int']['input'];
  propertySquare: Scalars['Float']['input'];
  propertyTitle: Scalars['String']['input'];
  propertyType: PropertyType;
};

export enum PropertyLocation {
  Bostonliq = 'BOSTONLIQ',
  Bukhara = 'BUKHARA',
  Busan = 'BUSAN',
  Chimgan = 'CHIMGAN',
  Chodak = 'CHODAK',
  Chonju = 'CHONJU',
  Chorvoq = 'CHORVOQ',
  Daegu = 'DAEGU',
  Daejon = 'DAEJON',
  Gwangju = 'GWANGJU',
  Gyeongju = 'GYEONGJU',
  Incheon = 'INCHEON',
  Jeju = 'JEJU',
  Khiva = 'KHIVA',
  Samarkand = 'SAMARKAND',
  Seoul = 'SEOUL',
  Tashkent = 'TASHKENT',
  Zaamin = 'ZAAMIN'
}

export enum PropertyStatus {
  Active = 'ACTIVE',
  Booked = 'BOOKED',
  Delete = 'DELETE',
  Hold = 'HOLD'
}

export enum PropertyType {
  Apartment = 'APARTMENT',
  Hotel = 'HOTEL',
  Resort = 'RESORT',
  Sanatorium = 'SANATORIUM',
  Villa = 'VILLA'
}

export type PropertyUpdate = {
  _id: Scalars['ID']['input'];
  constructedAt?: InputMaybe<Scalars['DateTime']['input']>;
  propertyAddress?: InputMaybe<Scalars['String']['input']>;
  propertyBeds?: InputMaybe<Scalars['Int']['input']>;
  propertyDesc?: InputMaybe<Scalars['String']['input']>;
  propertyImages?: InputMaybe<Array<Scalars['String']['input']>>;
  propertyLocation?: InputMaybe<PropertyLocation>;
  propertyPrice?: InputMaybe<Scalars['Float']['input']>;
  propertyRent?: InputMaybe<Scalars['Boolean']['input']>;
  propertyRooms?: InputMaybe<Scalars['Int']['input']>;
  propertySquare?: InputMaybe<Scalars['Float']['input']>;
  propertyStatus?: InputMaybe<PropertyStatus>;
  propertyTitle?: InputMaybe<Scalars['String']['input']>;
  propertyType?: InputMaybe<PropertyType>;
};

export type Query = {
  __typename?: 'Query';
  checkAuth: Scalars['String']['output'];
  checkAuthRoles: Scalars['String']['output'];
  getAgentProperties: Properties;
  getAgents: Members;
  getAllBoardArticlesByAdmin: BoardArticles;
  getAllMembersByAdmin: Members;
  getAllPropertiesByAdmin: Properties;
  getBoardArticle: BoardArticle;
  getBoardArticles: BoardArticles;
  getComments: Comments;
  getFavorites: Properties;
  getMember: Member;
  getMyBookings: Bookings;
  getMyNotifications: Array<Notice>;
  getProperties: Properties;
  getProperty: Property;
  getPropertyAvailability: Array<Availability>;
  getVisited: Properties;
  healthCheck: Scalars['String']['output'];
  introduce: Scalars['String']['output'];
};


export type QueryGetAgentPropertiesArgs = {
  input: AgentPropertiesInquiry;
};


export type QueryGetAgentsArgs = {
  input: AgentsInquiry;
};


export type QueryGetAllBoardArticlesByAdminArgs = {
  input: AllBoardArticlesInquiry;
};


export type QueryGetAllMembersByAdminArgs = {
  input: MembersInquiry;
};


export type QueryGetAllPropertiesByAdminArgs = {
  input: AllPropertiesInquiry;
};


export type QueryGetBoardArticleArgs = {
  articleId: Scalars['String']['input'];
};


export type QueryGetBoardArticlesArgs = {
  input: BoardArticlesInquiry;
};


export type QueryGetCommentsArgs = {
  input: CommentsInquiry;
};


export type QueryGetFavoritesArgs = {
  input: OrdinaryInquiry;
};


export type QueryGetMemberArgs = {
  memberId: Scalars['String']['input'];
};


export type QueryGetMyBookingsArgs = {
  input: BookingsInquiry;
};


export type QueryGetPropertiesArgs = {
  input: PropertiesInquiry;
};


export type QueryGetPropertyArgs = {
  propertyId: Scalars['String']['input'];
};


export type QueryGetPropertyAvailabilityArgs = {
  propertyId: Scalars['String']['input'];
};


export type QueryGetVisitedArgs = {
  input: OrdinaryInquiry;
};

export type SquaresRange = {
  end: Scalars['Int']['input'];
  start: Scalars['Int']['input'];
};

export type TotalCounter = {
  __typename?: 'TotalCounter';
  total?: Maybe<Scalars['Int']['output']>;
};

export type LoginMutationVariables = Exact<{
  memberNick: Scalars['String']['input'];
  memberPassword: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'Member', _id: string, memberType: MemberType, memberStatus: MemberStatus, memberAuthType: MemberAuthType, memberPhone: string, memberNick: string, memberFullName?: string | null, memberImage?: string | null, memberRank: number, memberProperties: number, memberArticles: number, memberPoints: number, memberLikes: number, memberViews: number, memberComments: number, memberWarnings: number, memberBlocks: number, deletedAt?: any | null, createdAt: any, updatedAt: any, accessToken?: string | null } };

export type SignupMutationVariables = Exact<{
  input: MemberInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'Member', _id: string, memberType: MemberType, memberStatus: MemberStatus, memberAuthType: MemberAuthType, memberPhone: string, memberNick: string, memberFullName?: string | null, memberImage?: string | null, memberProperties: number, memberArticles: number, memberPoints: number, memberLikes: number, memberViews: number, memberComments: number, memberRank: number, memberWarnings: number, memberBlocks: number, deletedAt?: any | null, createdAt: any, updatedAt: any } };

export type CreateCommentMutationVariables = Exact<{
  input: CommentInput;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'Comment', _id: string, commentStatus: CommentStatus, commentGroup: CommentGroup, commentContent: string, commentStars?: number | null, commentRefId: string, memberId: string, createdAt: any, updatedAt: any, memberData?: { __typename?: 'Member', _id: string, memberType: MemberType, memberStatus: MemberStatus, memberAuthType: MemberAuthType, memberPhone: string, memberNick: string, memberFullName?: string | null, memberImage?: string | null, memberProperties: number, memberArticles: number, memberPoints: number, memberLikes: number, memberViews: number, memberComments: number, memberRank: number, memberWarnings: number, memberBlocks: number, deletedAt?: any | null, createdAt: any, updatedAt: any, accessToken?: string | null } | null } };

export type UpdateCommentMutationVariables = Exact<{
  input: CommentUpdate;
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment: { __typename?: 'Comment', _id: string, commentContent: string, commentStars?: number | null, updatedAt: any } };

export type UpdateMemberMutationVariables = Exact<{
  input: MemberUpdate;
}>;


export type UpdateMemberMutation = { __typename?: 'Mutation', updateMember: { __typename?: 'Member', _id: string, memberType: MemberType, memberStatus: MemberStatus, memberAuthType: MemberAuthType, memberPhone: string, memberNick: string, memberFullName?: string | null, memberImage?: string | null, memberProperties: number, memberArticles: number, memberLikes: number, memberViews: number, memberComments: number, memberRank: number, memberWarnings: number, memberBlocks: number, deletedAt?: any | null, createdAt: any, updatedAt: any, accessToken?: string | null, memberPoints: number, meLiked?: Array<{ __typename?: 'MeLiked', memberId: string, likeRefId: string, myFavorite: boolean }> | null } };

export type CreateBookingMutationVariables = Exact<{
  input: BookingInput;
}>;


export type CreateBookingMutation = { __typename?: 'Mutation', createBooking: { __typename?: 'Booking', _id: string, bookingStatus: BookingStatus, bookingCheckIn: string, bookingCheckOut: string, bookingPrice: number, bookingGuests: number, propertyId: string, memberId: string, createdAt: any, updatedAt: any, propertyData?: { __typename?: 'Property', _id: string, propertyType: PropertyType, propertyStatus: PropertyStatus, propertyLocation: PropertyLocation, propertyAddress: string, propertyTitle: string, propertyPrice: number, propertySquare: number, propertyBeds: number, propertyRooms: number, propertyViews: number, propertyLikes: number, propertyComments: number, propertyRank: number, propertyImages: Array<string>, propertyDesc?: string | null, propertyRent: boolean, memberId: string, deletedAt?: any | null, constructedAt?: any | null, createdAt: any, updatedAt: any } | null, memberData?: { __typename?: 'Member', _id: string, memberType: MemberType, memberStatus: MemberStatus, memberAuthType: MemberAuthType, memberPhone: string, memberNick: string, memberFullName?: string | null, memberImage?: string | null, memberProperties: number, memberArticles: number, memberPoints: number, memberLikes: number, memberViews: number, memberComments: number, memberRank: number, memberWarnings: number, memberBlocks: number, deletedAt?: any | null, createdAt: any, updatedAt: any, accessToken?: string | null } | null } };

export type ImagesUploaderMutationVariables = Exact<{
  files: Array<Scalars['Upload']['input']> | Scalars['Upload']['input'];
  target: Scalars['String']['input'];
}>;


export type ImagesUploaderMutation = { __typename?: 'Mutation', imagesUploader: Array<string> };

export type CreatePropertyMutationVariables = Exact<{
  input: PropertyInput;
}>;


export type CreatePropertyMutation = { __typename?: 'Mutation', createProperty: { __typename?: 'Property', _id: string, propertyType: PropertyType, propertyStatus: PropertyStatus, propertyLocation: PropertyLocation, propertyAddress: string, propertyTitle: string, propertyPrice: number, propertySquare: number, propertyBeds: number, propertyRooms: number, propertyViews: number, propertyLikes: number, propertyComments: number, propertyRank: number, propertyImages: Array<string>, propertyDesc?: string | null, propertyRent: boolean, memberId: string, deletedAt?: any | null, constructedAt?: any | null, createdAt: any, updatedAt: any, memberData?: { __typename?: 'Member', _id: string, memberType: MemberType, memberStatus: MemberStatus, memberAuthType: MemberAuthType, memberPhone: string, memberNick: string, memberFullName?: string | null, memberImage?: string | null, memberProperties: number, memberArticles: number, memberPoints: number, memberLikes: number, memberViews: number, memberComments: number, memberRank: number, memberWarnings: number, memberBlocks: number, deletedAt?: any | null, createdAt: any, updatedAt: any, accessToken?: string | null } | null, meLiked?: Array<{ __typename?: 'MeLiked', memberId: string, likeRefId: string, myFavorite: boolean }> | null } };

export type UpdateMembersByAdminMutationVariables = Exact<{
  input: MemberUpdate;
}>;


export type UpdateMembersByAdminMutation = { __typename?: 'Mutation', updateMembersByAdmin: { __typename?: 'Member', _id: string, memberNick: string, memberPhone: string, memberType: MemberType, memberStatus: MemberStatus, memberFullName?: string | null, memberImage?: string | null, updatedAt: any } };

export type UpdatePropertyByAdminMutationVariables = Exact<{
  input: PropertyUpdate;
}>;


export type UpdatePropertyByAdminMutation = { __typename?: 'Mutation', updatePropertyByAdmin: { __typename?: 'Property', _id: string, propertyStatus: PropertyStatus, updatedAt: any } };

export type RemovePropertyByAdminMutationVariables = Exact<{
  propertyId: Scalars['String']['input'];
}>;


export type RemovePropertyByAdminMutation = { __typename?: 'Mutation', removePropertyByAdmin: { __typename?: 'Property', _id: string, propertyTitle: string, propertyStatus: PropertyStatus } };

export type UpdateBoardArticleByAdminMutationVariables = Exact<{
  input: BoardArticleUpdate;
}>;


export type UpdateBoardArticleByAdminMutation = { __typename?: 'Mutation', updateBoardArticleByAdmin: { __typename?: 'BoardArticle', _id: string, articleCategory: BoardArticleCategory, articleStatus: BoardArticleStatus, articleTitle: string, articleContent: string, articleImage?: string | null, updatedAt: any } };

export type RemoveBoardArticleByAdminMutationVariables = Exact<{
  articleId: Scalars['String']['input'];
}>;


export type RemoveBoardArticleByAdminMutation = { __typename?: 'Mutation', removeBoardArticleByAdmin: { __typename?: 'BoardArticle', _id: string, articleTitle: string, articleStatus: BoardArticleStatus } };

export type RemoveCommentByAdminMutationVariables = Exact<{
  commentId: Scalars['String']['input'];
}>;


export type RemoveCommentByAdminMutation = { __typename?: 'Mutation', removeCommentByAdmin: { __typename?: 'Comment', _id: string, commentGroup: CommentGroup, commentRefId: string, commentContent: string, commentStars?: number | null, memberId: string, createdAt: any, updatedAt: any } };

export type CheckAuthQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckAuthQuery = { __typename?: 'Query', checkAuth: string };

export type GetPropertiesQueryVariables = Exact<{
  input: PropertiesInquiry;
}>;


export type GetPropertiesQuery = { __typename?: 'Query', getProperties: { __typename?: 'Properties', list: Array<{ __typename?: 'Property', _id: string, propertyType: PropertyType, propertyStatus: PropertyStatus, propertyLocation: PropertyLocation, propertyAddress: string, propertyTitle: string, propertyPrice: number, propertySquare: number, propertyBeds: number, propertyRooms: number, propertyViews: number, propertyLikes: number, propertyComments: number, propertyRank: number, propertyImages: Array<string>, propertyDesc?: string | null, propertyRent: boolean, memberId: string, deletedAt?: any | null, constructedAt?: any | null, createdAt: any, updatedAt: any }>, metaCounter?: Array<{ __typename?: 'TotalCounter', total?: number | null }> | null } };

export type GetMyBookingsQueryVariables = Exact<{
  input: BookingsInquiry;
}>;


export type GetMyBookingsQuery = { __typename?: 'Query', getMyBookings: { __typename?: 'Bookings', list: Array<{ __typename?: 'Booking', _id: string, bookingStatus: BookingStatus, bookingStart: any, bookingEnd: any, totalPrice: number, bookingCheckIn: string, bookingCheckOut: string, bookingPrice: number, bookingGuests: number, propertyId: string, memberId: string, createdAt: any, updatedAt: any, propertyData?: { __typename?: 'Property', _id: string, propertyType: PropertyType, propertyTitle: string, propertyLocation: PropertyLocation, propertyAddress: string } | null }>, metaCounter?: Array<{ __typename?: 'TotalCounter', total?: number | null }> | null } };

export type GetCommentsQueryVariables = Exact<{
  input: CommentsInquiry;
}>;


export type GetCommentsQuery = { __typename?: 'Query', getComments: { __typename?: 'Comments', list: Array<{ __typename?: 'Comment', _id: string, commentStatus: CommentStatus, commentGroup: CommentGroup, commentContent: string, commentStars?: number | null, commentRefId: string, createdAt: any, updatedAt: any, memberData?: { __typename?: 'Member', _id: string, memberNick: string, memberFullName?: string | null, memberImage?: string | null } | null }>, metaCounter?: Array<{ __typename?: 'TotalCounter', total?: number | null }> | null } };

export type GetAllMembersByAdminQueryVariables = Exact<{
  input: MembersInquiry;
}>;


export type GetAllMembersByAdminQuery = { __typename?: 'Query', getAllMembersByAdmin: { __typename?: 'Members', list: Array<{ __typename?: 'Member', _id: string, memberNick: string, memberPhone: string, memberType: MemberType, memberStatus: MemberStatus, memberFullName?: string | null, memberImage?: string | null, memberLikes: number, memberViews: number, memberComments: number, createdAt: any, updatedAt: any }>, metaCounter?: Array<{ __typename?: 'TotalCounter', total?: number | null }> | null } };

export type GetAllPropertiesByAdminQueryVariables = Exact<{
  input: AllPropertiesInquiry;
}>;


export type GetAllPropertiesByAdminQuery = { __typename?: 'Query', getAllPropertiesByAdmin: { __typename?: 'Properties', list: Array<{ __typename?: 'Property', _id: string, propertyTitle: string, propertyType: PropertyType, propertyStatus: PropertyStatus, propertyLocation: PropertyLocation, propertyPrice: number, propertyViews: number, propertyLikes: number, propertyComments: number, propertyRank: number, memberId: string, createdAt: any, updatedAt: any }>, metaCounter?: Array<{ __typename?: 'TotalCounter', total?: number | null }> | null } };

export type GetAllBoardArticlesByAdminQueryVariables = Exact<{
  input: AllBoardArticlesInquiry;
}>;


export type GetAllBoardArticlesByAdminQuery = { __typename?: 'Query', getAllBoardArticlesByAdmin: { __typename?: 'BoardArticles', list: Array<{ __typename?: 'BoardArticle', _id: string, articleCategory: BoardArticleCategory, articleStatus: BoardArticleStatus, articleTitle: string, articleLikes: number, articleViews: number, articleComments: number, memberId: string, createdAt: any, updatedAt: any }>, metaCounter?: Array<{ __typename?: 'TotalCounter', total?: number | null }> | null } };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberNick"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"memberNick"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberNick"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"memberPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberPassword"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"memberStatus"}},{"kind":"Field","name":{"kind":"Name","value":"memberAuthType"}},{"kind":"Field","name":{"kind":"Name","value":"memberPhone"}},{"kind":"Field","name":{"kind":"Name","value":"memberNick"}},{"kind":"Field","name":{"kind":"Name","value":"memberFullName"}},{"kind":"Field","name":{"kind":"Name","value":"memberImage"}},{"kind":"Field","name":{"kind":"Name","value":"memberRank"}},{"kind":"Field","name":{"kind":"Name","value":"memberProperties"}},{"kind":"Field","name":{"kind":"Name","value":"memberArticles"}},{"kind":"Field","name":{"kind":"Name","value":"memberPoints"}},{"kind":"Field","name":{"kind":"Name","value":"memberLikes"}},{"kind":"Field","name":{"kind":"Name","value":"memberViews"}},{"kind":"Field","name":{"kind":"Name","value":"memberComments"}},{"kind":"Field","name":{"kind":"Name","value":"memberWarnings"}},{"kind":"Field","name":{"kind":"Name","value":"memberBlocks"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const SignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"memberStatus"}},{"kind":"Field","name":{"kind":"Name","value":"memberAuthType"}},{"kind":"Field","name":{"kind":"Name","value":"memberPhone"}},{"kind":"Field","name":{"kind":"Name","value":"memberNick"}},{"kind":"Field","name":{"kind":"Name","value":"memberFullName"}},{"kind":"Field","name":{"kind":"Name","value":"memberImage"}},{"kind":"Field","name":{"kind":"Name","value":"memberProperties"}},{"kind":"Field","name":{"kind":"Name","value":"memberArticles"}},{"kind":"Field","name":{"kind":"Name","value":"memberPoints"}},{"kind":"Field","name":{"kind":"Name","value":"memberLikes"}},{"kind":"Field","name":{"kind":"Name","value":"memberViews"}},{"kind":"Field","name":{"kind":"Name","value":"memberComments"}},{"kind":"Field","name":{"kind":"Name","value":"memberRank"}},{"kind":"Field","name":{"kind":"Name","value":"memberWarnings"}},{"kind":"Field","name":{"kind":"Name","value":"memberBlocks"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const CreateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"commentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"commentGroup"}},{"kind":"Field","name":{"kind":"Name","value":"commentContent"}},{"kind":"Field","name":{"kind":"Name","value":"commentStars"}},{"kind":"Field","name":{"kind":"Name","value":"commentRefId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"memberData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"memberStatus"}},{"kind":"Field","name":{"kind":"Name","value":"memberAuthType"}},{"kind":"Field","name":{"kind":"Name","value":"memberPhone"}},{"kind":"Field","name":{"kind":"Name","value":"memberNick"}},{"kind":"Field","name":{"kind":"Name","value":"memberFullName"}},{"kind":"Field","name":{"kind":"Name","value":"memberImage"}},{"kind":"Field","name":{"kind":"Name","value":"memberProperties"}},{"kind":"Field","name":{"kind":"Name","value":"memberArticles"}},{"kind":"Field","name":{"kind":"Name","value":"memberPoints"}},{"kind":"Field","name":{"kind":"Name","value":"memberLikes"}},{"kind":"Field","name":{"kind":"Name","value":"memberViews"}},{"kind":"Field","name":{"kind":"Name","value":"memberComments"}},{"kind":"Field","name":{"kind":"Name","value":"memberRank"}},{"kind":"Field","name":{"kind":"Name","value":"memberWarnings"}},{"kind":"Field","name":{"kind":"Name","value":"memberBlocks"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCommentMutation, CreateCommentMutationVariables>;
export const UpdateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentUpdate"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"commentContent"}},{"kind":"Field","name":{"kind":"Name","value":"commentStars"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateCommentMutation, UpdateCommentMutationVariables>;
export const UpdateMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MemberUpdate"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"memberStatus"}},{"kind":"Field","name":{"kind":"Name","value":"memberAuthType"}},{"kind":"Field","name":{"kind":"Name","value":"memberPhone"}},{"kind":"Field","name":{"kind":"Name","value":"memberNick"}},{"kind":"Field","name":{"kind":"Name","value":"memberFullName"}},{"kind":"Field","name":{"kind":"Name","value":"memberImage"}},{"kind":"Field","name":{"kind":"Name","value":"memberProperties"}},{"kind":"Field","name":{"kind":"Name","value":"memberArticles"}},{"kind":"Field","name":{"kind":"Name","value":"memberLikes"}},{"kind":"Field","name":{"kind":"Name","value":"memberViews"}},{"kind":"Field","name":{"kind":"Name","value":"memberComments"}},{"kind":"Field","name":{"kind":"Name","value":"memberRank"}},{"kind":"Field","name":{"kind":"Name","value":"memberWarnings"}},{"kind":"Field","name":{"kind":"Name","value":"memberBlocks"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"meLiked"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"likeRefId"}},{"kind":"Field","name":{"kind":"Name","value":"myFavorite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberPoints"}}]}}]}}]} as unknown as DocumentNode<UpdateMemberMutation, UpdateMemberMutationVariables>;
export const CreateBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bookingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"bookingCheckIn"}},{"kind":"Field","name":{"kind":"Name","value":"bookingCheckOut"}},{"kind":"Field","name":{"kind":"Name","value":"bookingPrice"}},{"kind":"Field","name":{"kind":"Name","value":"bookingGuests"}},{"kind":"Field","name":{"kind":"Name","value":"propertyId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"propertyData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"propertyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"propertyLocation"}},{"kind":"Field","name":{"kind":"Name","value":"propertyAddress"}},{"kind":"Field","name":{"kind":"Name","value":"propertyTitle"}},{"kind":"Field","name":{"kind":"Name","value":"propertyPrice"}},{"kind":"Field","name":{"kind":"Name","value":"propertySquare"}},{"kind":"Field","name":{"kind":"Name","value":"propertyBeds"}},{"kind":"Field","name":{"kind":"Name","value":"propertyRooms"}},{"kind":"Field","name":{"kind":"Name","value":"propertyViews"}},{"kind":"Field","name":{"kind":"Name","value":"propertyLikes"}},{"kind":"Field","name":{"kind":"Name","value":"propertyComments"}},{"kind":"Field","name":{"kind":"Name","value":"propertyRank"}},{"kind":"Field","name":{"kind":"Name","value":"propertyImages"}},{"kind":"Field","name":{"kind":"Name","value":"propertyDesc"}},{"kind":"Field","name":{"kind":"Name","value":"propertyRent"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"constructedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"memberStatus"}},{"kind":"Field","name":{"kind":"Name","value":"memberAuthType"}},{"kind":"Field","name":{"kind":"Name","value":"memberPhone"}},{"kind":"Field","name":{"kind":"Name","value":"memberNick"}},{"kind":"Field","name":{"kind":"Name","value":"memberFullName"}},{"kind":"Field","name":{"kind":"Name","value":"memberImage"}},{"kind":"Field","name":{"kind":"Name","value":"memberProperties"}},{"kind":"Field","name":{"kind":"Name","value":"memberArticles"}},{"kind":"Field","name":{"kind":"Name","value":"memberPoints"}},{"kind":"Field","name":{"kind":"Name","value":"memberLikes"}},{"kind":"Field","name":{"kind":"Name","value":"memberViews"}},{"kind":"Field","name":{"kind":"Name","value":"memberComments"}},{"kind":"Field","name":{"kind":"Name","value":"memberRank"}},{"kind":"Field","name":{"kind":"Name","value":"memberWarnings"}},{"kind":"Field","name":{"kind":"Name","value":"memberBlocks"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]}}]} as unknown as DocumentNode<CreateBookingMutation, CreateBookingMutationVariables>;
export const ImagesUploaderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImagesUploader"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"files"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"target"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imagesUploader"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"files"},"value":{"kind":"Variable","name":{"kind":"Name","value":"files"}}},{"kind":"Argument","name":{"kind":"Name","value":"target"},"value":{"kind":"Variable","name":{"kind":"Name","value":"target"}}}]}]}}]} as unknown as DocumentNode<ImagesUploaderMutation, ImagesUploaderMutationVariables>;
export const CreatePropertyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProperty"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PropertyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProperty"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"propertyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"propertyLocation"}},{"kind":"Field","name":{"kind":"Name","value":"propertyAddress"}},{"kind":"Field","name":{"kind":"Name","value":"propertyTitle"}},{"kind":"Field","name":{"kind":"Name","value":"propertyPrice"}},{"kind":"Field","name":{"kind":"Name","value":"propertySquare"}},{"kind":"Field","name":{"kind":"Name","value":"propertyBeds"}},{"kind":"Field","name":{"kind":"Name","value":"propertyRooms"}},{"kind":"Field","name":{"kind":"Name","value":"propertyViews"}},{"kind":"Field","name":{"kind":"Name","value":"propertyLikes"}},{"kind":"Field","name":{"kind":"Name","value":"propertyComments"}},{"kind":"Field","name":{"kind":"Name","value":"propertyRank"}},{"kind":"Field","name":{"kind":"Name","value":"propertyImages"}},{"kind":"Field","name":{"kind":"Name","value":"propertyDesc"}},{"kind":"Field","name":{"kind":"Name","value":"propertyRent"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"constructedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"memberData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"memberStatus"}},{"kind":"Field","name":{"kind":"Name","value":"memberAuthType"}},{"kind":"Field","name":{"kind":"Name","value":"memberPhone"}},{"kind":"Field","name":{"kind":"Name","value":"memberNick"}},{"kind":"Field","name":{"kind":"Name","value":"memberFullName"}},{"kind":"Field","name":{"kind":"Name","value":"memberImage"}},{"kind":"Field","name":{"kind":"Name","value":"memberProperties"}},{"kind":"Field","name":{"kind":"Name","value":"memberArticles"}},{"kind":"Field","name":{"kind":"Name","value":"memberPoints"}},{"kind":"Field","name":{"kind":"Name","value":"memberLikes"}},{"kind":"Field","name":{"kind":"Name","value":"memberViews"}},{"kind":"Field","name":{"kind":"Name","value":"memberComments"}},{"kind":"Field","name":{"kind":"Name","value":"memberRank"}},{"kind":"Field","name":{"kind":"Name","value":"memberWarnings"}},{"kind":"Field","name":{"kind":"Name","value":"memberBlocks"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meLiked"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"likeRefId"}},{"kind":"Field","name":{"kind":"Name","value":"myFavorite"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePropertyMutation, CreatePropertyMutationVariables>;
export const UpdateMembersByAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMembersByAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MemberUpdate"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMembersByAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"memberNick"}},{"kind":"Field","name":{"kind":"Name","value":"memberPhone"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"memberStatus"}},{"kind":"Field","name":{"kind":"Name","value":"memberFullName"}},{"kind":"Field","name":{"kind":"Name","value":"memberImage"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateMembersByAdminMutation, UpdateMembersByAdminMutationVariables>;
export const UpdatePropertyByAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePropertyByAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PropertyUpdate"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePropertyByAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"propertyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdatePropertyByAdminMutation, UpdatePropertyByAdminMutationVariables>;
export const RemovePropertyByAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemovePropertyByAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"propertyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removePropertyByAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"propertyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"propertyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"propertyTitle"}},{"kind":"Field","name":{"kind":"Name","value":"propertyStatus"}}]}}]}}]} as unknown as DocumentNode<RemovePropertyByAdminMutation, RemovePropertyByAdminMutationVariables>;
export const UpdateBoardArticleByAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBoardArticleByAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BoardArticleUpdate"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoardArticleByAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"articleCategory"}},{"kind":"Field","name":{"kind":"Name","value":"articleStatus"}},{"kind":"Field","name":{"kind":"Name","value":"articleTitle"}},{"kind":"Field","name":{"kind":"Name","value":"articleContent"}},{"kind":"Field","name":{"kind":"Name","value":"articleImage"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateBoardArticleByAdminMutation, UpdateBoardArticleByAdminMutationVariables>;
export const RemoveBoardArticleByAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveBoardArticleByAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeBoardArticleByAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"articleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"articleTitle"}},{"kind":"Field","name":{"kind":"Name","value":"articleStatus"}}]}}]}}]} as unknown as DocumentNode<RemoveBoardArticleByAdminMutation, RemoveBoardArticleByAdminMutationVariables>;
export const RemoveCommentByAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCommentByAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCommentByAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"commentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"commentGroup"}},{"kind":"Field","name":{"kind":"Name","value":"commentRefId"}},{"kind":"Field","name":{"kind":"Name","value":"commentContent"}},{"kind":"Field","name":{"kind":"Name","value":"commentStars"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<RemoveCommentByAdminMutation, RemoveCommentByAdminMutationVariables>;
export const CheckAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckAuth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkAuth"}}]}}]} as unknown as DocumentNode<CheckAuthQuery, CheckAuthQueryVariables>;
export const GetPropertiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProperties"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PropertiesInquiry"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProperties"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"propertyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"propertyLocation"}},{"kind":"Field","name":{"kind":"Name","value":"propertyAddress"}},{"kind":"Field","name":{"kind":"Name","value":"propertyTitle"}},{"kind":"Field","name":{"kind":"Name","value":"propertyPrice"}},{"kind":"Field","name":{"kind":"Name","value":"propertySquare"}},{"kind":"Field","name":{"kind":"Name","value":"propertyBeds"}},{"kind":"Field","name":{"kind":"Name","value":"propertyRooms"}},{"kind":"Field","name":{"kind":"Name","value":"propertyViews"}},{"kind":"Field","name":{"kind":"Name","value":"propertyLikes"}},{"kind":"Field","name":{"kind":"Name","value":"propertyComments"}},{"kind":"Field","name":{"kind":"Name","value":"propertyRank"}},{"kind":"Field","name":{"kind":"Name","value":"propertyImages"}},{"kind":"Field","name":{"kind":"Name","value":"propertyDesc"}},{"kind":"Field","name":{"kind":"Name","value":"propertyRent"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"constructedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metaCounter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<GetPropertiesQuery, GetPropertiesQueryVariables>;
export const GetMyBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyBookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BookingsInquiry"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMyBookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bookingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"bookingStart"}},{"kind":"Field","name":{"kind":"Name","value":"bookingEnd"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"bookingCheckIn"}},{"kind":"Field","name":{"kind":"Name","value":"bookingCheckOut"}},{"kind":"Field","name":{"kind":"Name","value":"bookingPrice"}},{"kind":"Field","name":{"kind":"Name","value":"bookingGuests"}},{"kind":"Field","name":{"kind":"Name","value":"propertyId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"propertyData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"propertyTitle"}},{"kind":"Field","name":{"kind":"Name","value":"propertyLocation"}},{"kind":"Field","name":{"kind":"Name","value":"propertyAddress"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"metaCounter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<GetMyBookingsQuery, GetMyBookingsQueryVariables>;
export const GetCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentsInquiry"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getComments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"commentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"commentGroup"}},{"kind":"Field","name":{"kind":"Name","value":"commentContent"}},{"kind":"Field","name":{"kind":"Name","value":"commentStars"}},{"kind":"Field","name":{"kind":"Name","value":"commentRefId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"memberData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"memberNick"}},{"kind":"Field","name":{"kind":"Name","value":"memberFullName"}},{"kind":"Field","name":{"kind":"Name","value":"memberImage"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"metaCounter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<GetCommentsQuery, GetCommentsQueryVariables>;
export const GetAllMembersByAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllMembersByAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MembersInquiry"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllMembersByAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"memberNick"}},{"kind":"Field","name":{"kind":"Name","value":"memberPhone"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"memberStatus"}},{"kind":"Field","name":{"kind":"Name","value":"memberFullName"}},{"kind":"Field","name":{"kind":"Name","value":"memberImage"}},{"kind":"Field","name":{"kind":"Name","value":"memberLikes"}},{"kind":"Field","name":{"kind":"Name","value":"memberViews"}},{"kind":"Field","name":{"kind":"Name","value":"memberComments"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metaCounter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllMembersByAdminQuery, GetAllMembersByAdminQueryVariables>;
export const GetAllPropertiesByAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllPropertiesByAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AllPropertiesInquiry"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllPropertiesByAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"propertyTitle"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"propertyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"propertyLocation"}},{"kind":"Field","name":{"kind":"Name","value":"propertyPrice"}},{"kind":"Field","name":{"kind":"Name","value":"propertyViews"}},{"kind":"Field","name":{"kind":"Name","value":"propertyLikes"}},{"kind":"Field","name":{"kind":"Name","value":"propertyComments"}},{"kind":"Field","name":{"kind":"Name","value":"propertyRank"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metaCounter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllPropertiesByAdminQuery, GetAllPropertiesByAdminQueryVariables>;
export const GetAllBoardArticlesByAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllBoardArticlesByAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AllBoardArticlesInquiry"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllBoardArticlesByAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"articleCategory"}},{"kind":"Field","name":{"kind":"Name","value":"articleStatus"}},{"kind":"Field","name":{"kind":"Name","value":"articleTitle"}},{"kind":"Field","name":{"kind":"Name","value":"articleLikes"}},{"kind":"Field","name":{"kind":"Name","value":"articleViews"}},{"kind":"Field","name":{"kind":"Name","value":"articleComments"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metaCounter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllBoardArticlesByAdminQuery, GetAllBoardArticlesByAdminQueryVariables>;