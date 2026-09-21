// English football club directory: one disambiguated nickname + one emoji
// glyph per club, covering the Premier League and Championship.
//
// Where a club has multiple common nicknames, we pick whichever is least
// likely to collide with another club's identity in this same directory
// (e.g. Man City -> "Cityzens" rather than "Sky Blues", since Chelsea
// already owns "The Blues" and Coventry owns "Sky Blues"; Aston Villa ->
// "Villans" rather than "The Lions", since Millwall owns "The Lions").

export type Tier = 'Premier League' | 'Championship'

export type ClubInfo = {
  code: string
  name: string
  nickname: string
  emoji: string
  tier: Tier
}

export const CLUBS: ClubInfo[] = [
  // Premier League
  { code: 'ARS', name: 'Arsenal', nickname: 'The Gunners', emoji: '💥', tier: 'Premier League' },
  { code: 'AVL', name: 'Aston Villa', nickname: 'The Villans', emoji: '🏛️', tier: 'Premier League' },
  { code: 'BOU', name: 'Bournemouth', nickname: 'The Cherries', emoji: '🍒', tier: 'Premier League' },
  { code: 'BRE', name: 'Brentford', nickname: 'The Bees', emoji: '🐝', tier: 'Premier League' },
  { code: 'BHA', name: 'Brighton & Hove Albion', nickname: 'The Seagulls', emoji: '🏖️', tier: 'Premier League' },
  { code: 'CHE', name: 'Chelsea', nickname: 'The Blues', emoji: '🔵', tier: 'Premier League' },
  { code: 'CRY', name: 'Crystal Palace', nickname: 'The Eagles', emoji: '🦅', tier: 'Premier League' },
  { code: 'EVE', name: 'Everton', nickname: 'The Toffees', emoji: '🍬', tier: 'Premier League' },
  { code: 'FUL', name: 'Fulham', nickname: 'The Cottagers', emoji: '🏡', tier: 'Premier League' },
  { code: 'IPS', name: 'Ipswich Town', nickname: 'The Tractor Boys', emoji: '🚜', tier: 'Premier League' },
  { code: 'LEI', name: 'Leicester City', nickname: 'The Foxes', emoji: '🦊', tier: 'Premier League' },
  { code: 'LIV', name: 'Liverpool', nickname: 'The Reds', emoji: '🔴', tier: 'Premier League' },
  { code: 'MCI', name: 'Manchester City', nickname: 'The Cityzens', emoji: '🏙️', tier: 'Premier League' },
  { code: 'MUN', name: 'Manchester United', nickname: 'The Red Devils', emoji: '😈', tier: 'Premier League' },
  { code: 'NEW', name: 'Newcastle United', nickname: 'The Magpies', emoji: '🐦‍⬛', tier: 'Premier League' },
  { code: 'NFO', name: 'Nottingham Forest', nickname: 'The Tricky Trees', emoji: '🌳', tier: 'Premier League' },
  { code: 'SOU', name: 'Southampton', nickname: 'The Saints', emoji: '😇', tier: 'Premier League' },
  { code: 'TOT', name: 'Tottenham Hotspur', nickname: 'Spurs', emoji: '🤠', tier: 'Premier League' },
  { code: 'WHU', name: 'West Ham United', nickname: 'The Hammers', emoji: '🔨', tier: 'Premier League' },
  { code: 'WOL', name: 'Wolverhampton Wanderers', nickname: 'Wolves', emoji: '🐺', tier: 'Premier League' },

  // Championship
  { code: 'BLA', name: 'Blackburn Rovers', nickname: 'The Riversiders', emoji: '🌊', tier: 'Championship' },
  { code: 'BRC', name: 'Bristol City', nickname: 'The Robins', emoji: '🐦', tier: 'Championship' },
  { code: 'BUR', name: 'Burnley', nickname: 'The Clarets', emoji: '🍷', tier: 'Championship' },
  { code: 'CAR', name: 'Cardiff City', nickname: 'The Bluebirds', emoji: '🦜', tier: 'Championship' },
  { code: 'COV', name: 'Coventry City', nickname: 'The Sky Blues', emoji: '🩵', tier: 'Championship' },
  { code: 'DER', name: 'Derby County', nickname: 'The Rams', emoji: '🐏', tier: 'Championship' },
  { code: 'HUL', name: 'Hull City', nickname: 'The Tigers', emoji: '🐯', tier: 'Championship' },
  { code: 'LEE', name: 'Leeds United', nickname: 'The Peacocks', emoji: '🦚', tier: 'Championship' },
  { code: 'LUT', name: 'Luton Town', nickname: 'The Hatters', emoji: '🎩', tier: 'Championship' },
  { code: 'MID', name: 'Middlesbrough', nickname: 'Boro', emoji: '⚓', tier: 'Championship' },
  { code: 'MIL', name: 'Millwall', nickname: 'The Lions', emoji: '🦁', tier: 'Championship' },
  { code: 'NOR', name: 'Norwich City', nickname: 'The Canaries', emoji: '🐤', tier: 'Championship' },
  { code: 'OXF', name: 'Oxford United', nickname: "The U's", emoji: 'Ⓤ', tier: 'Championship' },
  { code: 'PLY', name: 'Plymouth Argyle', nickname: 'The Green Army', emoji: '🪖', tier: 'Championship' },
  { code: 'POR', name: 'Portsmouth', nickname: 'Pompey', emoji: '🚢', tier: 'Championship' },
  { code: 'PNE', name: 'Preston North End', nickname: 'PNE', emoji: '⚪', tier: 'Championship' },
  { code: 'QPR', name: 'Queens Park Rangers', nickname: 'The Hoops', emoji: '🎯', tier: 'Championship' },
  { code: 'SHU', name: 'Sheffield United', nickname: 'The Blades', emoji: '⚔️', tier: 'Championship' },
  { code: 'SHW', name: 'Sheffield Wednesday', nickname: 'The Owls', emoji: '🦉', tier: 'Championship' },
  { code: 'STK', name: 'Stoke City', nickname: 'The Potters', emoji: '🏺', tier: 'Championship' },
  { code: 'SUN', name: 'Sunderland', nickname: 'The Black Cats', emoji: '🐈‍⬛', tier: 'Championship' },
  { code: 'SWA', name: 'Swansea City', nickname: 'The Swans', emoji: '🦢', tier: 'Championship' },
  { code: 'WAT', name: 'Watford', nickname: 'The Hornets', emoji: '⚡', tier: 'Championship' },
  { code: 'WBA', name: 'West Bromwich Albion', nickname: 'The Throstles', emoji: '🎶', tier: 'Championship' },
]

const BY_CODE = new Map(CLUBS.map((club) => [club.code, club]))

export function getClub(code: string): ClubInfo | undefined {
  return BY_CODE.get(code)
}
