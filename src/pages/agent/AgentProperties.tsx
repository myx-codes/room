import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import Swal from 'sweetalert2'
import { Star, MapPin, Pencil, Plus, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CREATE_PROPERTY } from '@/graphql/user/mutation'
import { GET_PROPERTIES } from '@/graphql/user/query'
import { usePropertyRatings } from '@/hooks/usePropertyRatings'
import { getMemberProfile } from '@/lib/auth'
import { amenityLabels } from '@/data/mockData'

type PropertyType = 'VILLA' | 'HOTEL' | 'SANATORIUM'

type CreatedProperty = {
  _id: string
  propertyType: string
  propertyLocation: string
  propertyTitle: string
  propertyPrice: number
  propertyRank?: number
  propertyRatingCount?: number
  propertyComments: number
  propertyImages: string[]
}

type CreatePropertyResponse = {
  createProperty: CreatedProperty
}

type CreatePropertyVariables = {
  input: {
    propertyType: PropertyType
    propertyLocation: string
    propertyAddress: string
    propertyTitle: string
    propertyPrice: number
    propertySquare: number
    propertyBeds: number
    propertyRooms: number
    propertyImages: string[]
    propertyDesc: string
    propertyRent: boolean
  }
}

type GetPropertiesResponse = {
  getProperties: {
    list: CreatedProperty[]
    metaCounter?: {
      total?: number
    }
  }
}

type GetPropertiesVariables = {
  input: {
    page: number
    limit: number
    sort?: string
    direction?: 'ASC' | 'DESC'
    search: {
      memberId?: string
    }
  }
}

type LocalPropertyCard = {
  id: string
  title: string
  location: string
  price: number
  rating: number
  ratingCount: number
  image: string
  category: 'villa' | 'hotel' | 'sanatorium'
}

type ImagesUploaderPayload = {
  data?: {
    imagesUploader?: string[]
  }
  errors?: Array<{
    message: string
  }>
}

type SanatoriumHighlight = {
  label: string
  desc: string
}

type SanatoriumMeta = {
  badge: string
  quote: string
  highlights: SanatoriumHighlight[]
}

type CompactSanatoriumMeta = {
  b: string
  q: string
  h: Array<[string, string]>
}

const FALLBACK_IMAGE = '/assets/hero-villa.jpg'
const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3008/graphql'
const PROPERTY_DESC_MAX_LENGTH = 500
const AMENITY_OPTIONS = Object.entries(amenityLabels)
const SANATORIUM_META_MARKER = 'ROOMI_SANATORIUM_META:'
const DEFAULT_SANATORIUM_HIGHLIGHTS: SanatoriumHighlight[] = [
  { label: 'Mineral Source', desc: 'Healing Waters' },
  { label: 'Detox Menu', desc: 'Organic Nutrition' },
  { label: 'Yoga Zen', desc: 'Mental Health' },
  { label: 'Expert Care', desc: '24/7 Support' },
]

function getBackendOrigin(): string {
  try {
    return new URL(GRAPHQL_URL).origin
  } catch {
    return 'http://localhost:3008'
  }
}

function resolveImageUrl(imagePath?: string): string {
  if (!imagePath) return FALLBACK_IMAGE
  if (/^https?:\/\//i.test(imagePath) || imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
    return imagePath
  }

  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${getBackendOrigin()}${cleanPath}`
}

function mapPropertyTypeToCategory(type: string): 'villa' | 'hotel' | 'sanatorium' {
  const normalized = type.toUpperCase()
  if (normalized === 'HOTEL') return 'hotel'
  if (normalized === 'SANATORIUM') return 'sanatorium'
  return 'villa'
}

function toLocalPropertyCard(item: CreatedProperty): LocalPropertyCard {
  return {
    id: item._id,
    title: item.propertyTitle,
    location: item.propertyLocation,
    price: item.propertyPrice,
    rating: item.propertyRank || 0,
    ratingCount: item.propertyRatingCount ?? item.propertyComments ?? 0,
    image: resolveImageUrl(item.propertyImages?.[0]),
    category: mapPropertyTypeToCategory(item.propertyType),
  }
}

function buildDescriptionWithExtras(
  baseDescription: string,
  amenities: string[],
  sanatoriumMeta?: SanatoriumMeta,
): string {
  const cleanDescription = baseDescription.trim()
  const chunks = [cleanDescription]

  if (amenities.length > 0) {
    const amenityText = amenities
      .map((key) => amenityLabels[key] || key)
      .join(', ')

    chunks.push(`Amenities: ${amenityText}`)
  }

  const basePayload = chunks.filter(Boolean).join('\n\n')

  if (!sanatoriumMeta) {
    return basePayload
  }

  const compactMeta: CompactSanatoriumMeta = {
    b: sanatoriumMeta.badge.trim(),
    q: sanatoriumMeta.quote.trim(),
    h: sanatoriumMeta.highlights.map((item) => [item.label.trim(), item.desc.trim()]),
  }

  const withMeta = [basePayload, `${SANATORIUM_META_MARKER}${JSON.stringify(compactMeta)}`]
    .filter(Boolean)
    .join('\n\n')

  // Keep create flow stable with backend validator (`<= 500`) even for rich sanatorium metadata.
  if (withMeta.length > PROPERTY_DESC_MAX_LENGTH) {
    return basePayload
  }

  return withMeta
}

function getCookieValue(name: string): string {
  if (typeof document === 'undefined') return ''
  const encodedName = encodeURIComponent(name)
  const parts = document.cookie.split(';')

  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed.startsWith(`${encodedName}=`)) {
      return decodeURIComponent(trimmed.slice(encodedName.length + 1))
    }
  }

  return ''
}

function getCsrfToken(): string {
  if (typeof window === 'undefined') return ''
  return (
    getCookieValue('XSRF-TOKEN') ||
    getCookieValue('CSRF-TOKEN') ||
    getCookieValue('csrfToken') ||
    getCookieValue('_csrf') ||
    window.localStorage.getItem('XSRF-TOKEN') ||
    window.localStorage.getItem('csrfToken') ||
    ''
  )
}

async function uploadImages(files: File[], target: string): Promise<string[]> {
  const formData = new FormData()
  const query = `
    mutation ImagesUploader($files: [Upload!]!, $target: String!) {
      imagesUploader(files: $files, target: $target)
    }
  `

  const operations = {
    query,
    variables: {
      files: files.map(() => null),
      target,
    },
  }

  const map: Record<string, string[]> = {}
  files.forEach((_, index) => {
    map[String(index)] = [`variables.files.${index}`]
  })

  formData.append('operations', JSON.stringify(operations))
  formData.append('map', JSON.stringify(map))

  files.forEach((file, index) => {
    formData.append(String(index), file, file.name)
  })

  const csrfToken = getCsrfToken()
  const headers: Record<string, string> = {}
  headers['apollo-require-preflight'] = 'true'
  headers['x-apollo-operation-name'] = 'ImagesUploader'

  if (csrfToken) {
    headers['x-csrf-token'] = csrfToken
    headers['x-xsrf-token'] = csrfToken
  }

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: formData,
  })

  if (!response.ok) {
    throw new Error('A server error occurred while uploading images.')
  }

  const payload = (await response.json()) as ImagesUploaderPayload
  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message || 'An error occurred while uploading images.')
  }

  const uploaded = payload.data?.imagesUploader || []
  if (uploaded.length === 0) {
    throw new Error('Image upload returned an empty result.')
  }

  return uploaded
}

export default function AgentProperties() {
  const memberId = getMemberProfile()?._id
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  const [propertyType, setPropertyType] = useState<PropertyType>('VILLA')
  const [propertyTitle, setPropertyTitle] = useState('')
  const [propertyLocation, setPropertyLocation] = useState('')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [propertyPrice, setPropertyPrice] = useState('')
  const [propertySquare, setPropertySquare] = useState('')
  const [propertyBeds, setPropertyBeds] = useState('')
  const [propertyRooms, setPropertyRooms] = useState('')
  const [propertyDesc, setPropertyDesc] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sanatoriumBadge, setSanatoriumBadge] = useState('Wellness & Spa')
  const [sanatoriumQuote, setSanatoriumQuote] = useState('Experience the perfect harmony of nature and modern medicine in our exclusive retreats.')
  const [sanatoriumHighlights, setSanatoriumHighlights] = useState<SanatoriumHighlight[]>(
    DEFAULT_SANATORIUM_HIGHLIGHTS,
  )

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [activePreviewIndex, setActivePreviewIndex] = useState(0)

  const [createProperty, { loading: createLoading }] = useMutation<CreatePropertyResponse, CreatePropertyVariables>(CREATE_PROPERTY)

  const {
    data: propertiesData,
    loading: propertiesLoading,
    error: propertiesError,
    refetch: refetchProperties,
  } = useQuery<GetPropertiesResponse, GetPropertiesVariables>(GET_PROPERTIES, {
    skip: !memberId,
    variables: {
      input: {
        page: 1,
        limit: 100,
        sort: 'createdAt',
        direction: 'DESC',
        search: {
          memberId: memberId || undefined,
        },
      },
    },
    fetchPolicy: 'network-only',
  })

  const myProperties = useMemo(
    () => (propertiesData?.getProperties?.list || []).map(toLocalPropertyCard),
    [propertiesData],
  )
  const propertyIds = useMemo(() => myProperties.map((property) => property.id), [myProperties])
  const ratingsById = usePropertyRatings(propertyIds)
  const myPropertiesWithDbRatings = useMemo(
    () =>
      myProperties.map((property) => {
        const dbRating = ratingsById[property.id]
        if (!dbRating) return property

        return {
          ...property,
          rating: dbRating.rating,
          ratingCount: dbRating.ratingCount,
        }
      }),
    [myProperties, ratingsById],
  )

  const mainPreviewImage = previewUrls[activePreviewIndex] || previewUrls[0] || ''
  const sidePreviewImages = previewUrls
    .map((image, index) => ({ image, index }))
    .filter((item) => item.index !== activePreviewIndex)
    .slice(0, 4)

  const resetForm = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url))
    setPropertyType('VILLA')
    setPropertyTitle('')
    setPropertyLocation('')
    setPropertyAddress('')
    setPropertyPrice('')
    setPropertySquare('')
    setPropertyBeds('')
    setPropertyRooms('')
    setPropertyDesc('')
    setSelectedAmenities([])
    setSanatoriumBadge('Wellness & Spa')
    setSanatoriumQuote('Experience the perfect harmony of nature and modern medicine in our exclusive retreats.')
    setSanatoriumHighlights(DEFAULT_SANATORIUM_HIGHLIGHTS.map((item) => ({ ...item })))
    setSelectedFiles([])
    setPreviewUrls([])
    setActivePreviewIndex(0)
  }

  const updateSanatoriumHighlight = (index: number, field: 'label' | 'desc', value: string) => {
    setSanatoriumHighlights((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const toggleAmenity = (amenityKey: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityKey)
        ? prev.filter((item) => item !== amenityKey)
        : [...prev, amenityKey],
    )
  }

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const maxSizeInBytes = 5 * 1024 * 1024
    const hasInvalidFile = files.some((file) => !file.type.startsWith('image/') || file.size > maxSizeInBytes)
    if (hasInvalidFile) {
      setSubmitSuccess('')
      setSubmitError('Each file must be an image and smaller than 5MB.')
      e.target.value = ''
      return
    }

    const existingKeys = new Set(selectedFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`))
    const filesToAdd = files.filter((file) => !existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`))

    if (filesToAdd.length === 0) {
      setSubmitSuccess('')
      setSubmitError('The selected images have already been added.')
      e.target.value = ''
      return
    }

    const previews = filesToAdd.map((file) => URL.createObjectURL(file))

    setSelectedFiles((prev) => [...prev, ...filesToAdd])
    setPreviewUrls((prev) => [...prev, ...previews])
    if (previewUrls.length === 0) {
      setActivePreviewIndex(0)
    }
    setSubmitError('')
    e.target.value = ''
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove))
    setPreviewUrls((prev) => {
      const removed = prev[indexToRemove]
      if (removed) URL.revokeObjectURL(removed)
      const next = prev.filter((_, index) => index !== indexToRemove)
      if (next.length === 0) {
        setActivePreviewIndex(0)
      } else if (activePreviewIndex >= next.length) {
        setActivePreviewIndex(next.length - 1)
      }
      return next
    })
  }

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitSuccess('')

    const numericPrice = Number(propertyPrice)
    const numericSquare = Number(propertySquare)
    const numericBeds = Number(propertyBeds)
    const numericRooms = Number(propertyRooms)

    if (!propertyTitle.trim() || !propertyLocation.trim() || !propertyAddress.trim() || !propertyDesc.trim()) {
      setSubmitError('Please fill in all required fields.')
      return
    }

    if (selectedAmenities.length === 0) {
      setSubmitError('Please select at least one amenity.')
      return
    }

    if (propertyType === 'SANATORIUM') {
      const hasInvalidHighlights = sanatoriumHighlights.some(
        (item) => !item.label.trim() || !item.desc.trim(),
      )

      if (!sanatoriumBadge.trim() || !sanatoriumQuote.trim() || hasInvalidHighlights) {
        setSubmitError('Please complete all sanatorium details.')
        return
      }
    }

    if (selectedFiles.length < 5) {
      setSubmitError('At least 5 images are required.')
      return
    }

    if ([numericPrice, numericSquare, numericBeds, numericRooms].some((value) => Number.isNaN(value) || value <= 0)) {
      setSubmitError('Price, square, beds, and rooms must be positive numbers.')
      return
    }

    try {
      const uploadedPaths = await uploadImages(selectedFiles, 'property')

      if (uploadedPaths.length < 5) {
        setSubmitError('The server returned fewer than 5 images. Please try again.')
        return
      }

      const sanatoriumMeta: SanatoriumMeta | undefined =
        propertyType === 'SANATORIUM'
          ? {
              badge: sanatoriumBadge.trim(),
              quote: sanatoriumQuote.trim(),
              highlights: sanatoriumHighlights.map((item) => ({
                label: item.label.trim(),
                desc: item.desc.trim(),
              })),
            }
          : undefined

      const propertyDescPayload = buildDescriptionWithExtras(propertyDesc, selectedAmenities, sanatoriumMeta)

      if (propertyDescPayload.length > PROPERTY_DESC_MAX_LENGTH) {
        setSubmitError(`Description must be ${PROPERTY_DESC_MAX_LENGTH} characters or fewer.`)
        return
      }

      const { data } = await createProperty({

        variables: {
          input: {
            propertyType,
            propertyTitle: propertyTitle.trim(),
            propertyLocation: propertyLocation.trim(),
            propertyAddress: propertyAddress.trim(),
            propertyPrice: numericPrice,
            propertySquare: numericSquare,
            propertyBeds: numericBeds,
            propertyRooms: numericRooms,
            propertyImages: uploadedPaths,
            propertyDesc: propertyDescPayload,
            propertyRent: true,
          },
        },
      })

      if (!data?.createProperty?._id) {
        const message = 'Listing was not created. Please try again.'
        setSubmitError(message)
        await Swal.fire({
          icon: 'error',
          title: 'Property add failed',
          text: message,
          confirmButtonText: 'OK',
        })
        return
      }

      await refetchProperties()
      setSubmitSuccess('Listing was created successfully.')
      resetForm()
      setIsAddOpen(false)
      await Swal.fire({
        icon: 'success',
        title: 'Property added successfully',
        text: 'Your listing has been published.',
        confirmButtonText: 'Great',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred while creating the listing.'
      setSubmitError(message)
      await Swal.fire({
        icon: 'error',
        title: 'Property add failed',
        text: message,
        confirmButtonText: 'OK',
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">My Properties</h2>
          <p className="text-sm text-muted-foreground mt-1">{myPropertiesWithDbRatings.length} listings</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsAddOpen(true)
            setSubmitError('')
            setSubmitSuccess('')
          }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 gentle-animation"
        >
          <Plus className="w-4 h-4" />
          Add Listing
        </button>
      </div>

      {isAddOpen && (
        <div className="mb-8 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">Add New Listing</h3>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="p-1.5 rounded-lg hover:bg-muted gentle-animation"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleCreateProperty} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-foreground mb-1.5 block">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
              >
                <option value="VILLA">Villa</option>
                <option value="HOTEL">Hotel</option>
                <option value="SANATORIUM">Sanatorium</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-foreground mb-1.5 block">Title</label>
              <input
                value={propertyTitle}
                onChange={(e) => setPropertyTitle(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
                placeholder="Chimgan Mountain Villa"
              />
            </div>

            <div>
              <label className="text-sm text-foreground mb-1.5 block">Location</label>
              <input
                value={propertyLocation}
                onChange={(e) => setPropertyLocation(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
                placeholder="Chimgan, Uzbekistan"
              />
            </div>

            <div>
              <label className="text-sm text-foreground mb-1.5 block">Address</label>
              <input
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
                placeholder="Street, house number"
              />
            </div>

            <div>
              <label className="text-sm text-foreground mb-1.5 block">Price (night)</label>
              <input
                type="number"
                min={1}
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-foreground mb-1.5 block">Square (m²)</label>
              <input
                type="number"
                min={1}
                value={propertySquare}
                onChange={(e) => setPropertySquare(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-foreground mb-1.5 block">Beds</label>
              <input
                type="number"
                min={1}
                value={propertyBeds}
                onChange={(e) => setPropertyBeds(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-foreground mb-1.5 block">Rooms</label>
              <input
                type="number"
                min={1}
                value={propertyRooms}
                onChange={(e) => setPropertyRooms(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-foreground mb-1.5 block">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map(([key, label]) => {
                  const isSelected = selectedAmenities.includes(key)
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleAmenity(key)}
                      className={`px-3 py-1.5 rounded-lg text-sm border gentle-animation ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background text-foreground hover:bg-muted'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              <p className={`text-xs mt-1 ${selectedAmenities.length > 0 ? 'text-muted-foreground' : 'text-destructive'}`}>
                Selected amenities: {selectedAmenities.length}
              </p>
            </div>

            {propertyType === 'SANATORIUM' && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border border-border rounded-xl p-4 bg-background/40">
                <div className="md:col-span-2">
                  <h4 className="text-sm font-semibold text-foreground">Sanatorium Showcase (Featured Section)</h4>
                </div>

                <div>
                  <label className="text-sm text-foreground mb-1.5 block">Badge</label>
                  <input
                    value={sanatoriumBadge}
                    onChange={(e) => setSanatoriumBadge(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
                    placeholder="Wellness & Spa"
                  />
                </div>

                <div>
                  <label className="text-sm text-foreground mb-1.5 block">Quote</label>
                  <input
                    value={sanatoriumQuote}
                    onChange={(e) => setSanatoriumQuote(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
                    placeholder="A short highlight sentence"
                  />
                </div>

                {sanatoriumHighlights.map((item, index) => (
                  <div key={`sanatorium-${index}`} className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      value={item.label}
                      onChange={(e) => updateSanatoriumHighlight(index, 'label', e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
                      placeholder="Card title"
                    />
                    <input
                      value={item.desc}
                      onChange={(e) => updateSanatoriumHighlight(index, 'desc', e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
                      placeholder="Card subtitle"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="md:col-span-2">
              <label className="text-sm text-foreground mb-1.5 block">Property Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground"
              />
              <p className={`text-xs mt-1 ${selectedFiles.length >= 5 ? 'text-black-600' : 'text-destructive'}`}>
                Minimum required images: 5. Selected images: {selectedFiles.length}
              </p>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-background cursor-pointer group">
                    <img
                      src={mainPreviewImage}
                      alt={`Main preview ${activePreviewIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(activePreviewIndex)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {sidePreviewImages.map(({ image, index }) => (
                      <div
                        key={`${image.slice(0, 16)}-${index}`}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-background cursor-pointer group"
                        onClick={() => setActivePreviewIndex(index)}
                      >
                        <img
                          src={image}
                          alt={`Property ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleRemoveImage(index)
                          }}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewUrls.length > 5 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">All selected images</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {previewUrls.map((image, index) => (
                      <button
                        key={`all-preview-${index}`}
                        type="button"
                        onClick={() => setActivePreviewIndex(index)}
                        className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border gentle-animation ${
                          activePreviewIndex === index ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                        }`}
                      >
                        <img src={image} alt={`All preview ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-foreground mb-1.5 block">Description</label>
              <textarea
                value={propertyDesc}
                onChange={(e) => setPropertyDesc(e.target.value)}
                className="w-full min-h-24 bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={createLoading}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-60 gentle-animation"
              >
                <Plus className="w-4 h-4" />
                {createLoading ? 'Adding...' : 'Create Listing'}
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setIsAddOpen(false)
                }}
                className="border border-border text-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-muted gentle-animation"
              >
                Cancel
              </button>
            </div>

            {submitError && (
              <p className="md:col-span-2 text-sm text-destructive">{submitError}</p>
            )}

            {submitSuccess && (
              <p className="md:col-span-2 text-sm text-green-600">{submitSuccess}</p>
            )}
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {propertiesLoading && (
          <p className="text-sm text-muted-foreground">Loading your properties...</p>
        )}

        {propertiesError && (
          <p className="text-sm text-destructive">Failed to load properties: {propertiesError.message}</p>
        )}

        {!propertiesLoading && !propertiesError && myPropertiesWithDbRatings.length === 0 && (
          <p className="text-sm text-muted-foreground">No properties found for this agent yet.</p>
        )}

        {myPropertiesWithDbRatings.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Link to={`/properties/${p.id}`} className="block h-full">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              </Link>
              <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium capitalize text-foreground">{p.category}</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                <MapPin className="w-3.5 h-3.5" />{p.location}
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{p.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    {p.ratingCount > 0 ? (
                      <>
                        <Star className="w-4 h-4 text-gold fill-gold" />
                        <span className="text-sm font-medium text-foreground">{p.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({p.ratingCount} ta baho)</span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground"></span>
                    )}
                </div>
                <span className="font-semibold text-foreground">${p.price}/night</span>
              </div>
              <button className="mt-4 w-full flex items-center justify-center gap-2 border border-border text-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted gentle-animation">
                <Pencil className="w-4 h-4" />
                Edit Listing
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
