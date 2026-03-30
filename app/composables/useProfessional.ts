import type { Review } from '~~/shared/types/review'

export const useProfessional = (id: string) => {
  const { data: professionalData, error } = useFetch<Professional>(`/api/profissionais/${id}`)
  const { data: reviewsData } = useFetch<Review[]>(`/api/profissionais/${id}/reviews`)

  const professional = computed(() => professionalData.value ?? null)
  const reviews = computed(() => reviewsData.value ?? [])

  return { professional, reviews, error }
}
