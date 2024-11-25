import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const leagueId = searchParams.get('leagueId')
  const type = searchParams.get('type')

  if (!process.env.FOOTBALL_API_KEY) {
    console.error('FOOTBALL_API_KEY is not set')
    return NextResponse.json({ error: 'API key configuration error' }, { status: 500 })
  }

  try {
    const endpoint = type === 'standings'
      ? `https://api.football-data.org/v4/competitions/${leagueId}/standings`
      : `https://api.football-data.org/v4/competitions/${leagueId}/matches`

    console.log('Making request to:', endpoint)
    console.log('Using API key:', process.env.FOOTBALL_API_KEY.substring(0, 5) + '...')

    const response = await fetch(endpoint, {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_KEY,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Football API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in football API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from football API' },
      { status: 500 }
    )
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(request: Request) {
  const headersList = headers()
  const origin = headersList.get('origin') || ''

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
} 