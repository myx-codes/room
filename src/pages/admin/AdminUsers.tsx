import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Shield, Ban, MoreVertical, UserCog } from 'lucide-react'
import { GET_ALL_MEMBERS_BY_ADMIN } from '@/graphql/user/query'
import { UPDATE_MEMBERS_BY_ADMIN } from '@/graphql/user/mutation'

type MemberType = 'USER' | 'AGENT' | 'ADMIN'
type MemberStatus = 'ACTIVE' | 'BLOCK' | 'DELETE'

type AdminMember = {
  _id: string
  memberNick: string
  memberPhone: string
  memberType: MemberType
  memberStatus: MemberStatus
  memberFullName?: string | null
  memberImage?: string | null
  memberLikes?: number | null
  memberViews?: number | null
  memberComments?: number | null
  createdAt: string
  updatedAt: string
}

type GetAllMembersByAdminResponse = {
  getAllMembersByAdmin: {
    list: AdminMember[]
    metaCounter?: Array<{
      total?: number | null
    }> | null
  }
}

type GetAllMembersByAdminVariables = {
  input: {
    page: number
    limit: number
    sort: string
    direction: 'ASC' | 'DESC'
    search: {
      memberStatus?: MemberStatus
      memberType?: MemberType
      text?: string
    }
  }
}

type UpdateMembersByAdminResponse = {
  updateMembersByAdmin: {
    _id: string
    memberType: MemberType
    memberStatus: MemberStatus
    updatedAt: string
  }
}

type UpdateMembersByAdminVariables = {
  input: {
    _id: string
    memberType?: MemberType
    memberStatus?: MemberStatus
    memberFullName?: string
  }
}

const PAGE_SIZE = 20

export default function AdminUsers() {
  const [searchText, setSearchText] = useState('')
  const [selectedType, setSelectedType] = useState<'ALL' | MemberType>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | MemberStatus>('ALL')
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')

  const { data, loading, error, refetch } = useQuery<GetAllMembersByAdminResponse, GetAllMembersByAdminVariables>(
    GET_ALL_MEMBERS_BY_ADMIN,
    {
      variables: {
        input: {
          page: 1,
          limit: PAGE_SIZE,
          sort: 'createdAt',
          direction: 'DESC',
          search: {
            text: searchText,
            memberType: selectedType === 'ALL' ? undefined : selectedType,
            memberStatus: selectedStatus === 'ALL' ? undefined : selectedStatus,
          },
        },
      },
      fetchPolicy: 'network-only',
    },
  )

  const [updateMemberByAdmin] = useMutation<UpdateMembersByAdminResponse, UpdateMembersByAdminVariables>(
    UPDATE_MEMBERS_BY_ADMIN,
  )

  const members = data?.getAllMembersByAdmin?.list ?? []
  const totalMembers = useMemo(() => {
    const total = data?.getAllMembersByAdmin?.metaCounter?.[0]?.total
    return typeof total === 'number' ? total : members.length
  }, [data, members.length])

  const toggleMemberStatus = async (member: AdminMember) => {
    if (member.memberType === 'ADMIN') return

    setActionError('')
    setUpdatingMemberId(member._id)

    try {
      const nextStatus: MemberStatus = member.memberStatus === 'BLOCK' ? 'ACTIVE' : 'BLOCK'
      await updateMemberByAdmin({
        variables: {
          input: {
            _id: member._id,
            memberStatus: nextStatus,
          },
        },
      })
      await refetch()
    } catch (mutationError) {
      const message = mutationError instanceof Error ? mutationError.message : 'Status update failed.'
      setActionError(message)
    } finally {
      setUpdatingMemberId(null)
    }
  }

  const toggleMemberRole = async (member: AdminMember) => {
    if (member.memberType === 'ADMIN') return

    setActionError('')
    setUpdatingMemberId(member._id)

    try {
      const nextType: MemberType = member.memberType === 'AGENT' ? 'USER' : 'AGENT'
      await updateMemberByAdmin({
        variables: {
          input: {
            _id: member._id,
            memberType: nextType,
          },
        },
      })
      await refetch()
    } catch (mutationError) {
      const message = mutationError instanceof Error ? mutationError.message : 'Role update failed.'
      setActionError(message)
    } finally {
      setUpdatingMemberId(null)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">Users</h2>
        <p className="text-sm text-muted-foreground mt-1">{totalMembers} registered users</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by nick/phone"
          className="bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
        />

        <select
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value as 'ALL' | MemberType)}
          className="bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
        >
          <option value="ALL">All roles</option>
          <option value="USER">USER</option>
          <option value="AGENT">AGENT</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value as 'ALL' | MemberStatus)}
          className="bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="BLOCK">BLOCK</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      {actionError && <p className="text-sm text-destructive mb-3">{actionError}</p>}

      {loading && <p className="text-sm text-muted-foreground mb-3">Loading users...</p>}
      {error && <p className="text-sm text-destructive mb-3">Failed to load users: {error.message}</p>}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-6 py-4 font-medium text-muted-foreground">User</th>
              <th className="px-6 py-4 font-medium text-muted-foreground hidden sm:table-cell">Role</th>
              <th className="px-6 py-4 font-medium text-muted-foreground hidden md:table-cell">Joined</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const isUpdating = updatingMemberId === member._id

              return (
                <tr key={member._id} className="border-b border-border/50 hover:bg-muted/30 gentle-animation">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{member.memberFullName || member.memberNick}</p>
                    <p className="text-xs text-muted-foreground">{member.memberPhone}</p>
                  </td>

                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        member.memberType === 'ADMIN'
                          ? 'bg-gold/20 text-gold-dark'
                          : member.memberType === 'AGENT'
                            ? 'bg-primary/10 text-foreground'
                            : 'bg-muted text-foreground'
                      }`}
                    >
                      {member.memberType === 'ADMIN' && <Shield className="w-3 h-3" />}
                      {member.memberType}
                    </span>
                  </td>

                  <td className="px-6 py-4 hidden md:table-cell text-muted-foreground">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        member.memberStatus === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : member.memberStatus === 'BLOCK'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-muted text-foreground'
                      }`}
                    >
                      {member.memberStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleMemberStatus(member)}
                        className="p-2 hover:bg-destructive/10 rounded-lg gentle-animation disabled:opacity-50"
                        title={member.memberStatus === 'BLOCK' ? 'Activate user' : 'Block user'}
                        disabled={isUpdating || member.memberType === 'ADMIN'}
                      >
                        <Ban className="w-4 h-4 text-muted-foreground" />
                      </button>

                      <button
                        onClick={() => toggleMemberRole(member)}
                        className="p-2 hover:bg-muted rounded-lg gentle-animation disabled:opacity-50"
                        title={member.memberType === 'AGENT' ? 'Demote to USER' : 'Promote to AGENT'}
                        disabled={isUpdating || member.memberType === 'ADMIN'}
                      >
                        <UserCog className="w-4 h-4 text-muted-foreground" />
                      </button>

                      <button className="p-2 hover:bg-muted rounded-lg gentle-animation" title="More actions" disabled>
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}

            {!loading && !error && members.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No users found for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
