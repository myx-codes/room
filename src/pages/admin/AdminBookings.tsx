import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { CheckCircle, Clock, XCircle, CircleDot, Trash2 } from 'lucide-react'
import {
  GET_ALL_BOARD_ARTICLES_BY_ADMIN,
} from '@/graphql/user/query'
import {
  REMOVE_BOARD_ARTICLE_BY_ADMIN,
  UPDATE_BOARD_ARTICLE_BY_ADMIN,
} from '@/graphql/user/mutation'

type ArticleStatus = 'ACTIVE' | 'WAITING' | 'DELETE' | 'HOLD'
type ArticleCategory = 'FREE' | 'NEWS' | 'EVENT' | 'HELP' | 'RECOMMEND' | 'LIFESTYLE'

type AdminArticle = {
  _id: string
  articleCategory: ArticleCategory
  articleStatus: ArticleStatus
  articleTitle: string
  articleLikes: number
  articleViews: number
  articleComments: number
  memberId: string
  createdAt: string
  updatedAt: string
}

type GetAllBoardArticlesByAdminResponse = {
  getAllBoardArticlesByAdmin: {
    list: AdminArticle[]
    metaCounter?: Array<{
      total?: number | null
    }> | null
  }
}

type GetAllBoardArticlesByAdminVariables = {
  input: {
    page: number
    limit: number
    sort: string
    direction: 'ASC' | 'DESC'
    search: {
      articleStatus?: ArticleStatus
      articleCategory?: ArticleCategory
    }
  }
}

type UpdateBoardArticleByAdminResponse = {
  updateBoardArticleByAdmin: {
    _id: string
    articleStatus: ArticleStatus
    updatedAt: string
  }
}

type UpdateBoardArticleByAdminVariables = {
  input: {
    _id: string
    articleStatus?: ArticleStatus
    articleTitle?: string
  }
}

type RemoveBoardArticleByAdminResponse = {
  removeBoardArticleByAdmin: {
    _id: string
  }
}

type RemoveBoardArticleByAdminVariables = {
  articleId: string
}

const PAGE_SIZE = 20

const statusConfig: Record<ArticleStatus, { icon: typeof CheckCircle; color: string }> = {
  ACTIVE: { icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  WAITING: { icon: Clock, color: 'text-gold bg-gold/20' },
  HOLD: { icon: CircleDot, color: 'text-muted-foreground bg-muted' },
  DELETE: { icon: XCircle, color: 'text-destructive bg-destructive/10' },
}

export default function AdminBookings() {
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | ArticleStatus>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ArticleCategory>('ALL')
  const [updatingArticleId, setUpdatingArticleId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')

  const { data, loading, error, refetch } = useQuery<
    GetAllBoardArticlesByAdminResponse,
    GetAllBoardArticlesByAdminVariables
  >(GET_ALL_BOARD_ARTICLES_BY_ADMIN, {
    variables: {
      input: {
        page: 1,
        limit: PAGE_SIZE,
        sort: 'createdAt',
        direction: 'DESC',
        search: {
          articleStatus: selectedStatus === 'ALL' ? undefined : selectedStatus,
          articleCategory: selectedCategory === 'ALL' ? undefined : selectedCategory,
        },
      },
    },
    fetchPolicy: 'network-only',
  })

  const [updateArticleByAdmin] = useMutation<
    UpdateBoardArticleByAdminResponse,
    UpdateBoardArticleByAdminVariables
  >(UPDATE_BOARD_ARTICLE_BY_ADMIN)

  const [removeArticleByAdmin] = useMutation<
    RemoveBoardArticleByAdminResponse,
    RemoveBoardArticleByAdminVariables
  >(REMOVE_BOARD_ARTICLE_BY_ADMIN)

  const articles = data?.getAllBoardArticlesByAdmin?.list ?? []
  const totalArticles = useMemo(() => {
    const total = data?.getAllBoardArticlesByAdmin?.metaCounter?.[0]?.total
    return typeof total === 'number' ? total : articles.length
  }, [data, articles.length])

  const toggleArticleStatus = async (article: AdminArticle) => {
    setActionError('')
    setUpdatingArticleId(article._id)

    try {
      const nextStatus: ArticleStatus = article.articleStatus === 'ACTIVE' ? 'HOLD' : 'ACTIVE'
      await updateArticleByAdmin({
        variables: {
          input: {
            _id: article._id,
            articleStatus: nextStatus,
          },
        },
      })
      await refetch()
    } catch (mutationError) {
      const message = mutationError instanceof Error ? mutationError.message : 'Article update failed.'
      setActionError(message)
    } finally {
      setUpdatingArticleId(null)
    }
  }

  const removeArticle = async (articleId: string) => {
    setActionError('')
    setUpdatingArticleId(articleId)

    try {
      await removeArticleByAdmin({
        variables: {
          articleId,
        },
      })
      await refetch()
    } catch (mutationError) {
      const message = mutationError instanceof Error ? mutationError.message : 'Article removal failed.'
      setActionError(message)
    } finally {
      setUpdatingArticleId(null)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">Board Articles</h2>
        <p className="text-sm text-muted-foreground mt-1">{totalArticles} total articles</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value as 'ALL' | ArticleStatus)}
          className="bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="WAITING">WAITING</option>
          <option value="HOLD">HOLD</option>
          <option value="DELETE">DELETE</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value as 'ALL' | ArticleCategory)}
          className="bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
        >
          <option value="ALL">All categories</option>
          <option value="FREE">FREE</option>
          <option value="NEWS">NEWS</option>
          <option value="EVENT">EVENT</option>
          <option value="HELP">HELP</option>
          <option value="RECOMMEND">RECOMMEND</option>
          <option value="LIFESTYLE">LIFESTYLE</option>
        </select>
      </div>

      {actionError && <p className="text-sm text-destructive mb-3">{actionError}</p>}
      {loading && <p className="text-sm text-muted-foreground mb-3">Loading articles...</p>}
      {error && <p className="text-sm text-destructive mb-3">Failed to load articles: {error.message}</p>}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-6 py-4 font-medium text-muted-foreground">Article</th>
              <th className="px-6 py-4 font-medium text-muted-foreground hidden sm:table-cell">Category</th>
              <th className="px-6 py-4 font-medium text-muted-foreground hidden md:table-cell">Metrics</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => {
              const cfg = statusConfig[article.articleStatus] || statusConfig.HOLD
              const Icon = cfg.icon
              const isUpdating = updatingArticleId === article._id

              return (
                <tr key={article._id} className="border-b border-border/50 hover:bg-muted/30 gentle-animation">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{article.articleTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(article.createdAt).toLocaleDateString()} · by {article.memberId.slice(0, 8)}...
                    </p>
                  </td>

                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="bg-muted px-2.5 py-1 rounded-full text-xs font-medium text-foreground">
                      {article.articleCategory}
                    </span>
                  </td>

                  <td className="px-6 py-4 hidden md:table-cell text-muted-foreground">
                    Likes: {article.articleLikes} · Views: {article.articleViews} · Comments: {article.articleComments}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {article.articleStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleArticleStatus(article)}
                        className="p-2 hover:bg-muted rounded-lg gentle-animation disabled:opacity-50"
                        disabled={isUpdating}
                        title={article.articleStatus === 'ACTIVE' ? 'Move to HOLD' : 'Activate article'}
                      >
                        <CircleDot className="w-4 h-4 text-muted-foreground" />
                      </button>

                      <button
                        onClick={() => removeArticle(article._id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg gentle-animation disabled:opacity-50"
                        disabled={isUpdating}
                        title="Remove article"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}

            {!loading && !error && articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No articles found for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
