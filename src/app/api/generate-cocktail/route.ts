import { NextRequest, NextResponse } from 'next/server'
import { recommendDrink } from '@/lib/menu-recommender'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json()
    
    if (!answers) {
      return NextResponse.json(
        { error: 'Missing quiz answers' },
        { status: 400 }
      )
    }

    // Load menu data
    const menuPath = path.join(process.cwd(), 'menu.json')
    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf-8'))

    const cocktail = recommendDrink(answers, menuData)
    
    return NextResponse.json(cocktail)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate cocktail' },
      { status: 500 }
    )
  }
}