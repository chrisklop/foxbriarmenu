import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'lore_tags.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading lore data:', error)
    return NextResponse.json(
      { error: 'Failed to load lore data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tags, whisper } = await request.json()
    
    const filePath = path.join(process.cwd(), 'data', 'lore_tags.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    // Add new tags
    if (tags && Array.isArray(tags)) {
      data.tags = [...new Set([...data.tags, ...tags])]
    }
    
    // Add new whisper
    if (whisper && typeof whisper === 'string') {
      if (!data.whispers.includes(whisper)) {
        data.whispers.push(whisper)
      }
    }
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating lore data:', error)
    return NextResponse.json(
      { error: 'Failed to update lore data' },
      { status: 500 }
    )
  }
}