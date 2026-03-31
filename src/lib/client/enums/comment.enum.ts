// Client-side (frontend) enum definitions.
// These must not import any backend-only packages (e.g. `@nestjs/graphql`),
// otherwise Vite bundling will fail.

export enum CommentStatus {
  HOLD = 'HOLD',
  ACTIVE = 'ACTIVE',
  DELETE = 'DELETE',
}

export enum CommentGroup {
  MEMBER = 'MEMBER',
  ARTICLE = 'ARTICLE',
  PROPERTY = 'PROPERTY',
}

