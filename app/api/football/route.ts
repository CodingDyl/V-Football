import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const leagueId = searchParams.get('leagueId')
    const type = searchParams.get('type')

    if (!leagueId || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters: leagueId and type' },
        { status: 400 }
      )
    }

    if (!process.env.FOOTBALL_API_KEY) {
      console.error('FOOTBALL_API_KEY is not set')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const endpoint = type === 'standings'
      ? `https://api.football-data.org/v4/competitions/${leagueId}/standings`
      : `https://api.football-data.org/v4/competitions/${leagueId}/matches`

    const apiResponse = await fetch(endpoint, {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_KEY,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000)
    })

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      console.error('Football API error:', {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        endpoint,
        errorBody: errorText
      })
      
      return NextResponse.json(
        { 
          error: true,
          message: `Failed to fetch ${type}. Status: ${apiResponse.status}`,
          details: apiResponse.statusText 
        },
        { status: apiResponse.status }
      )
    }

    const data = await apiResponse.json()
    return NextResponse.json({
      error: false,
      ...data
    })
    
  } catch (error) {
    console.error('Unhandled error in football API route:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        error: true,
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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