import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const leagueId = searchParams.get('leagueId')
  const type = searchParams.get('type') // 'matches' or 'standings'

  try {
    const endpoint = type === 'standings'
      ? `https://api.football-data.org/v4/competitions/${leagueId}/standings`
      : `https://api.football-data.org/v4/competitions/${leagueId}/matches?status=SCHEDULED,FINISHED`

    const response = await fetch(endpoint, {
      headers: {
        'X-Auth-Token': process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || ''
      }
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
} 