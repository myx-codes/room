import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Star, MapPin, Pencil, Trash2, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GET_ALL_PROPERTIES_BY_ADMIN } from '@/graphql/user/query'
import { REMOVE_PROPERTY_BY_ADMIN, UPDATE_PROPERTY_BY_ADMIN } from '@/graphql/user/mutation'

type PropertyStatus = 'ACTIVE' | 'HOLD' | 'DELETE' | 'BOOKED'

type AdminProperty = {
  _id: string
  propertyTitle: string
  propertyType: string
  propertyStatus: PropertyStatus
  propertyLocation: string
  propertyPrice: number
  propertyViews: number
  propertyLikes: number
  propertyComments: number
  propertyRank: number
  memberId: string
  createdAt: string
  updatedAt: string
}

type GetAllPropertiesByAdminResponse = {
  getAllPropertiesByAdmin: {
    list: AdminProperty[]
    metaCounter?: Array<{
      total?: number | null
    }> | null
  }
}

type GetAllPropertiesByAdminVariables = {
  input: {
    page: number
    limit: number
    sort: string
    direction: 'ASC' | 'DESC'
    search: {
      propertyStatus?: PropertyStatus
      propertyLocationList?: string[]
    }
  }
}

type UpdatePropertyByAdminResponse = {
  updatePropertyByAdmin: {
    _id: string
    propertyStatus: PropertyStatus
    updatedAt: string
  }
}

type UpdatePropertyByAdminVariables = {
  input: {
    _id: string
    propertyStatus?: PropertyStatus
    propertyTitle?: string
    propertyPrice?: number
  }
}

type RemovePropertyByAdminResponse = {
  removePropertyByAdmin: {
    _id: string
  }
}

type RemovePropertyByAdminVariables = {
  propertyId: string
}

const PAGE_SIZE = 20

function formatLocation(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ')
}

export default function AdminProperties() {
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | PropertyStatus>('ALL')
  const [updatingPropertyId, setUpdatingPropertyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')

  const searchFilters: GetAllPropertiesByAdminVariables['input']['search'] =
    selectedStatus === 'ALL' ? {} : { propertyStatus: selectedStatus }

  const { data, loading, error, refetch } = useQuery<GetAllPropertiesByAdminResponse, GetAllPropertiesByAdminVariables>(
    GET_ALL_PROPERTIES_BY_ADMIN,
    {
      variables: {
        input: {
          page: 1,
          limit: PAGE_SIZE,
          sort: 'propertyRank',
          direction: 'DESC',
          search: searchFilters,
        },
      },
      fetchPolicy: 'network-only',
    },
  )

  const [updatePropertyByAdmin] = useMutation<UpdatePropertyByAdminResponse, UpdatePropertyByAdminVariables>(
    UPDATE_PROPERTY_BY_ADMIN,
  )
  const [removePropertyByAdmin] = useMutation<RemovePropertyByAdminResponse, RemovePropertyByAdminVariables>(
    REMOVE_PROPERTY_BY_ADMIN,
  )

  const properties = data?.getAllPropertiesByAdmin?.list ?? []
  const totalProperties = useMemo(() => {
    const total = data?.getAllPropertiesByAdmin?.metaCounter?.[0]?.total
    return typeof total === 'number' ? total : properties.length
  }, [data, properties.length])

  const togglePropertyStatus = async (property: AdminProperty) => {
    setActionError('')
    setActionSuccess('')
    setUpdatingPropertyId(property._id)

    try {
      if (property.propertyStatus !== 'ACTIVE' && property.propertyStatus !== 'HOLD') {
        setActionError('Only ACTIVE and HOLD statuses can be toggled from this action.')
        return
      }

      const nextStatus: PropertyStatus = property.propertyStatus === 'ACTIVE' ? 'HOLD' : 'ACTIVE'
      await updatePropertyByAdmin({
        variables: {
          input: {
            _id: property._id,
            propertyStatus: nextStatus,
          },
        },
      })
      await refetch()
      setActionSuccess(`Property status updated to ${nextStatus}.`)
    } catch (mutationError) {
      const message = mutationError instanceof Error ? mutationError.message : 'Property update failed.'
      setActionError(message)
    } finally {
      setUpdatingPropertyId(null)
    }
  }

  const removeProperty = async (propertyId: string) => {
    setActionError('')
    setActionSuccess('')
    setUpdatingPropertyId(propertyId)

    try {
      await removePropertyByAdmin({
        variables: {
          propertyId,
        },
      })
      await refetch()
      setActionSuccess('Property removed successfully.')
    } catch (mutationError) {
      const message = mutationError instanceof Error ? mutationError.message : 'Property removal failed.'
      setActionError(message)
    } finally {
      setUpdatingPropertyId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Properties</h2>
          <p className="text-sm text-muted-foreground mt-1">{totalProperties} total listings</p>
        </div>
        <button
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 gentle-animation"
          disabled
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 mb-4">
        <select
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value as 'ALL' | PropertyStatus)}
          className="bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="HOLD">HOLD</option>
          <option value="BOOKED">BOOKED</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      {actionError && <p className="text-sm text-destructive mb-3">{actionError}</p>}
      {actionSuccess && <p className="text-sm text-green-600 mb-3">{actionSuccess}</p>}
      {loading && <p className="text-sm text-muted-foreground mb-3">Loading properties...</p>}
      {error && <p className="text-sm text-destructive mb-3">Failed to load properties: {error.message}</p>}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-6 py-4 font-medium text-muted-foreground">Property</th>
              <th className="px-6 py-4 font-medium text-muted-foreground hidden md:table-cell">Type</th>
              <th className="px-6 py-4 font-medium text-muted-foreground hidden sm:table-cell">Price</th>
              <th className="px-6 py-4 font-medium text-muted-foreground hidden lg:table-cell">Rating</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => {
              const isUpdating = updatingPropertyId === property._id
              return (
                <tr key={property._id} className="border-b border-border/50 hover:bg-muted/30 gentle-animation">
                  <td className="px-6 py-4">
                    <div>
                      <Link to={`/properties/${property._id}`} className="font-medium text-foreground hover:text-primary">
                        {property.propertyTitle}
                      </Link>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {formatLocation(property.propertyLocation)}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="capitalize bg-muted px-2.5 py-1 rounded-full text-xs font-medium text-foreground">
                      {property.propertyType.toLowerCase()}
                    </span>
                  </td>

                  <td className="px-6 py-4 hidden sm:table-cell font-medium text-foreground">
                    ${property.propertyPrice}/night
                  </td>

                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                      <span className="text-foreground">{Number(property.propertyRank || 0).toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({property.propertyComments ?? 0})</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        property.propertyStatus === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : property.propertyStatus === 'HOLD'
                            ? 'bg-gold/20 text-gold-dark'
                            : property.propertyStatus === 'BOOKED'
                              ? 'bg-primary/10 text-foreground'
                              : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {property.propertyStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePropertyStatus(property)}
                        className="p-2 hover:bg-muted rounded-lg gentle-animation disabled:opacity-50"
                        disabled={isUpdating}
                        title={property.propertyStatus === 'ACTIVE' ? 'Move to HOLD' : 'Activate property'}
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </button>

                      <button
                        onClick={() => removeProperty(property._id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg gentle-animation disabled:opacity-50"
                        disabled={isUpdating}
                        title="Remove property"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}

            {!loading && !error && properties.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No properties found for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
