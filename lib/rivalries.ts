export type Rivalry = {
  id: string
  home: string
  away: string
  homeShort: string
  awayShort: string
  color: string
  description: string
  members: number
  messages: number
  heat: number
}

export const RIVALRIES: Rivalry[] = [
  {
    id: 'north-london',
    home: 'Arsenal',
    away: 'Tottenham',
    homeShort: 'ARS',
    awayShort: 'TOT',
    color: '#d71920',
    description:
      'North London is open for business. Victory laps, cope posts and everything in between.',
    members: 12840,
    messages: 342,
    heat: 94,
  },
  {
    id: 'manchester',
    home: 'Man United',
    away: 'Man City',
    homeShort: 'MUN',
    awayShort: 'MCI',
    color: '#6cabdd',
    description:
      'Manchester rivalry room. Bring your receipts and leave your excuses at the door.',
    members: 18620,
    messages: 517,
    heat: 91,
  },
  {
    id: 'merseyside',
    home: 'Liverpool',
    away: 'Everton',
    homeShort: 'LIV',
    awayShort: 'EVE',
    color: '#c8102e',
    description:
      'Merseyside derby territory. One city. Two clubs. Unlimited ammunition.',
    members: 9320,
    messages: 219,
    heat: 87,
  },
  {
    id: 'london-derby',
    home: 'Chelsea',
    away: 'Arsenal',
    homeShort: 'CHE',
    awayShort: 'ARS',
    color: '#034694',
    description:
      'London rivals going head-to-head. Expect strong opinions and questionable predictions.',
    members: 11420,
    messages: 286,
    heat: 84,
  },
]

export type Club = { code: string; label: string; color: string }

export function getAllClubs(rivalries: Rivalry[]): Club[] {
  const seen = new Map<string, Club>()

  for (const rivalry of rivalries) {
    if (!seen.has(rivalry.homeShort)) {
      seen.set(rivalry.homeShort, {
        code: rivalry.homeShort,
        label: rivalry.home,
        color: rivalry.color,
      })
    }
    if (!seen.has(rivalry.awayShort)) {
      seen.set(rivalry.awayShort, {
        code: rivalry.awayShort,
        label: rivalry.away,
        color: rivalry.color,
      })
    }
  }

  return Array.from(seen.values())
}
