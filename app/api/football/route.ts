import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  // Add CORS headers
  const headersList = headers()
  const origin = headersList.get('origin') || ''

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
    
    return new NextResponse(JSON.stringify(data), {
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
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