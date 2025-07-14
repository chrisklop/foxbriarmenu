export interface LoreData {
  tags: string[]
  whispers: string[]
}

export async function getLoreData(): Promise<LoreData> {
  try {
    const response = await fetch('/api/lore')
    if (!response.ok) {
      throw new Error('Failed to fetch lore data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading lore data:', error)
    return {
      tags: [],
      whispers: [
        "The bar holds its secrets tonight.",
        "Something stirs in the shadows between bottles.",
        "The ice machine whispers stories of old."
      ]
    }
  }
}

export async function addToLore(tags: string[], whisper?: string): Promise<void> {
  try {
    await fetch('/api/lore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags, whisper }),
    })
  } catch (error) {
    console.error('Error updating lore data:', error)
  }
}

export function getRandomWhisper(whispers: string[]): string {
  if (whispers.length === 0) {
    return "The bar holds its secrets tonight."
  }
  return whispers[Math.floor(Math.random() * whispers.length)]
}

export function combineTags(allTags: string[]): string[] {
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Return tags that appear more than once (recurring themes)
  return Object.entries(tagCounts)
    .filter(([, count]) => count > 1)
    .map(([tag]) => tag)
}

export function generateLoreFragment(tags: string[]): string {
  const fragments = [
    "The recurring tale of {tag} grows stronger with each telling.",
    "Guests have begun to notice the pattern of {tag} in their drinks.",
    "The bar's memory holds the essence of {tag} close.",
    "Something about {tag} calls to the returning souls.",
    "The spirits whisper of {tag} when the night grows deep."
  ]
  
  if (tags.length === 0) return "The bar remembers all who enter."
  
  const randomTag = tags[Math.floor(Math.random() * tags.length)]
  const randomFragment = fragments[Math.floor(Math.random() * fragments.length)]
  
  return randomFragment.replace('{tag}', randomTag.replace('_', ' '))
}