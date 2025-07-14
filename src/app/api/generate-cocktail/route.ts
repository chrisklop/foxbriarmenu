import { NextRequest, NextResponse } from 'next/server'
import { generateCocktail } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json()
    
    if (!answers) {
      return NextResponse.json(
        { error: 'Missing quiz answers' },
        { status: 400 }
      )
    }

    const cocktail = await generateCocktail(answers)
    
    return NextResponse.json(cocktail)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate cocktail' },
      { status: 500 }
    )
  }
}