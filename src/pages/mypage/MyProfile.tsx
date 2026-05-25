import { useMemo, useRef, useState } from 'react'
import { User, Phone, Save } from 'lucide-react'
import { useMutation } from '@apollo/client/react'
import { UPDATE_MEMBER } from '@/graphql/user/mutation'
import { useI18n } from '@/i18n'
import { getMemberProfile, setMemberProfile } from '@/lib/auth'
import type { StoredMemberProfile } from '@/lib/auth'
import type { Member } from '@/types/member'

type UpdateMemberResponse = {
  updateMember: Member
}

type UpdateMemberVariables = {
  input: {
    _id: string
    memberNick: string
    memberPhone: string
    memberFullName: string
    memberImage: string
  }
}

export default function MyProfile() {
  const { t, memberTypeLabel, memberStatusLabel } = useI18n()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [profile, setProfile] = useState<StoredMemberProfile | null>(getMemberProfile())
  const [fullName, setFullName] = useState(profile?.memberFullName || '')
  const [memberNick, setMemberNick] = useState(profile?.memberNick || '')
  const [memberPhone, setMemberPhone] = useState(profile?.memberPhone || '')
  const [memberImage, setMemberImage] = useState(profile?.memberImage || '')
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  const [updateMember, { loading: isSaving }] = useMutation<UpdateMemberResponse, UpdateMemberVariables>(UPDATE_MEMBER)

  const backendProfile = profile

  const memberType = backendProfile?.memberType || '-'
  const memberStatus = backendProfile?.memberStatus || '-'
  const normalizedFullName = useMemo(() => fullName.trim(), [fullName])
  const normalizedNick = useMemo(() => memberNick.trim(), [memberNick])
  const normalizedPhone = useMemo(() => memberPhone.trim(), [memberPhone])
  const normalizedImage = useMemo(() => memberImage.trim(), [memberImage])
  const originalFullName = backendProfile?.memberFullName || ''
  const originalNick = backendProfile?.memberNick || ''
  const originalPhone = backendProfile?.memberPhone || ''
  const originalImage = backendProfile?.memberImage || ''
  const hasChanges =
    normalizedFullName !== originalFullName ||
    normalizedNick !== originalNick ||
    normalizedPhone !== originalPhone ||
    normalizedImage !== originalImage

  const handleSelectPhoto = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/')) {
      setSubmitSuccess('')
      setSubmitError(t('myPage.imageOnly'))
      return
    }

    const maxSizeInBytes = 2 * 1024 * 1024
    if (selectedFile.size > maxSizeInBytes) {
      setSubmitSuccess('')
      setSubmitError(t('myPage.imageTooLarge'))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      if (!result) {
        setSubmitSuccess('')
        setSubmitError(t('myPage.imageReadFailed'))
        return
      }

      setMemberImage(result)
      setSubmitError('')
    }

    reader.onerror = () => {
      setSubmitSuccess('')
      setSubmitError(t('myPage.imageReadFailed'))
    }

    reader.readAsDataURL(selectedFile)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!backendProfile) {
      setSubmitError(t('myPage.accountMissing'))
      setSubmitSuccess('')
      return
    }

    if (!hasChanges) {
      setSubmitError('')
      setSubmitSuccess(t('myPage.noChanges'))
      return
    }

    if (!normalizedNick || !normalizedPhone) {
      setSubmitSuccess('')
      setSubmitError(t('myPage.requiredNickPhone'))
      return
    }

    setSubmitError('')
    setSubmitSuccess('')

    try {
      const { data } = await updateMember({
        variables: {
          input: {
            _id: backendProfile._id,
            memberNick: normalizedNick,
            memberPhone: normalizedPhone,
            memberFullName: normalizedFullName,
            memberImage: normalizedImage,
          },
        },
      })

      if (!data?.updateMember) {
        setSubmitError(t('myPage.profileNotUpdated'))
        return
      }

      const updated = data.updateMember
      const nextProfile: StoredMemberProfile = {
        _id: updated._id,
        memberType: updated.memberType,
        memberStatus: updated.memberStatus,
        memberAuthType: updated.memberAuthType,
        memberPhone: updated.memberPhone,
        memberNick: updated.memberNick,
        memberFullName: updated.memberFullName,
        memberImage: updated.memberImage || backendProfile.memberImage,
        memberProperties: updated.memberProperties,
        memberArticles: updated.memberArticles,
        memberPoints: updated.memberPoints,
        memberLikes: updated.memberLikes,
        memberViews: updated.memberViews,
        memberComments: updated.memberComments,
        memberRank: updated.memberRank,
        memberWarnings: updated.memberWarnings,
        memberBlocks: updated.memberBlocks,
        deletedAt: updated.deletedAt,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      }

      setMemberProfile(nextProfile)
      setProfile(nextProfile)
      setFullName(nextProfile.memberFullName || '')
      setMemberNick(nextProfile.memberNick || '')
      setMemberPhone(nextProfile.memberPhone || '')
      setMemberImage(nextProfile.memberImage || '')
      setSubmitSuccess(t('myPage.profileUpdated'))
    } catch (error) {
      const message = error instanceof Error ? error.message : t('myPage.profileUpdateError')
      setSubmitError(message)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">{t('myPage.profileSettings')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('myPage.manageAccountDetails')}</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
            {normalizedImage || backendProfile?.memberImage ? (
              <img src={normalizedImage || backendProfile?.memberImage} alt={normalizedNick || '-'} className="w-full h-full object-cover rounded-full" />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-medium text-foreground">{normalizedNick || '-'}</p>
            {typeof backendProfile?.memberRank === 'number' && (
              <p className="text-xs text-muted-foreground mt-1">
                {t('myPage.rank', { value: backendProfile.memberRank })}
              </p>
            )}
            <button
              type="button"
              onClick={handleSelectPhoto}
              className="text-sm text-gold hover:underline mt-1"
            >
              {t('myPage.changePhoto')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t('common.memberNick')}</label>
            <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <input
                value={memberNick}
                onChange={(e) => setMemberNick(e.target.value)}
                className="bg-transparent text-foreground text-sm w-full outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t('common.phone')}</label>
            <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <input
                value={memberPhone}
                onChange={(e) => setMemberPhone(e.target.value)}
                className="bg-transparent text-foreground text-sm w-full outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t('common.fullName')}</label>
            <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="bg-transparent text-foreground text-sm w-full outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background border border-border rounded-xl px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">{t('myPage.memberType')}</p>
              <p className="text-sm font-medium text-foreground">{memberTypeLabel(memberType)}</p>
            </div>
            <div className="bg-background border border-border rounded-xl px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">{t('common.status')}</p>
              <p className="text-sm font-medium text-foreground">{memberStatusLabel(memberStatus)}</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving || !backendProfile || !hasChanges}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 gentle-animation disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {t('common.saveChanges')}
          </button>

          {submitError && (
            <p className="text-sm text-destructive">{submitError}</p>
          )}

          {submitSuccess && (
            <p className="text-sm text-green-600">{submitSuccess}</p>
          )}
        </form>
      </div>
    </div>
  )
}
