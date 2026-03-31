// Client-side (frontend) enum definitions.
// These must not import any backend-only packages (e.g. `@nestjs/graphql`),
// otherwise Vite bundling will fail.

export enum MemberType {
  USER = 'USER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
}

