'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchLeaderboard, recordUpvote } from '@/lib/api'

export function useLeaderboard(club?: string) {
  const query = useQuery({
    queryKey: ['leaderboard', club || 'global'],
    queryFn: () => fetchLeaderboard(club),
  })

  return { entries: query.data || [], isLoading: query.isLoading }
}

/** Credits the author of a take with an upvote, from any viewer's session. */
export function useAwardUpvote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      authorId,
      clubs,
    }: {
      authorId: string
      clubs?: string[]
    }) => recordUpvote(authorId, clubs),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fan', variables.authorId] })
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
    },
  })
}
