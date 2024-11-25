import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const leagueId = searchParams.get('leagueId')

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${leagueId}/matches?status=SCHEDULED,FINISHED`,
      {
        headers: {
          'X-Auth-Token': process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || ''
        }
      }
    )
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
} 