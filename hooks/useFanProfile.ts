'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchFanProfile,
  recordCheckIn,
  recordPost,
  verifyFanToken,
} from '@/lib/api'
import { useFanId } from './useFanId'

export function useFanProfile() {
  const { id, address } = useFanId()
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: ['fan', id],
    queryFn: () => fetchFanProfile(id as string),
    enabled: Boolean(id),
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['fan', id] })
    queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
  }

  const postMutation = useMutation({
    mutationFn: (clubs?: string[]) => recordPost(id as string, clubs),
    onSuccess: invalidate,
  })

  const checkInMutation = useMutation({
    mutationFn: (clubs?: string[]) => recordCheckIn(id as string, clubs),
    onSuccess: invalidate,
  })

  const verifyMutation = useMutation({
    mutationFn: (club: string) => {
      if (!address) {
        throw new Error('Connect a wallet to verify Fan Token ownership')
      }
      return verifyFanToken(id as string, address, club)
    },
    onSuccess: invalidate,
  })

  return {
    id,
    address,
    isWallet: Boolean(address),
    profile: profileQuery.data?.profile,
    tier: profileQuery.data?.tier,
    isLoading: profileQuery.isLoading,
    post: postMutation.mutateAsync,
    checkIn: checkInMutation.mutateAsync,
    verify: verifyMutation.mutateAsync,
    isVerifying: verifyMutation.isPending,
    verifyError: verifyMutation.error,
  }
}
