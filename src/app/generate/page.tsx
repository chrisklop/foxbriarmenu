'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Logo from '@/components/Logo'

interface Cocktail {
  names: string[]
  selectedName: string
  ingredients: string[]
  story: string
  whisper: string
  flavorProfile: string
  tags: string[]
  foodPairing?: {
    name: string
    price: number
    description: string
    pairingReason: string
  }
}

function GenerateContent() {
  const [cocktail, setCocktail] = useState<Cocktail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const generateCocktail = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const answers = {
        sodas: searchParams.get('sodas') || '',
        first_sip: searchParams.get('first_sip') || '',
        week_feeling: searchParams.get('week_feeling') || '',
        spicy_reaction: searchParams.get('spicy_reaction') || '',
        evening_mood: searchParams.get('evening_mood') || '',
        drink_complexity: searchParams.get('drink_complexity') || ''
      }

      const response = await fetch('/api/generate-cocktail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate cocktail')
      }

      const data = await response.json()
      setCocktail(data)
    } catch (err) {
      setError('Failed to conjure your drink. Please try again.')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    generateCocktail()
  }, [generateCocktail])

  const handleContinue = () => {
    if (!cocktail) return

    const name = searchParams.get('name')
    const pin = searchParams.get('pin')
    
    const drinkData = {
      ...cocktail,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      rating: null,
      review: null,
      ordered: false
    }

    const queryParams = new URLSearchParams({
      drink: JSON.stringify(drinkData),
      ...(name && { name }),
      ...(pin && { pin })
    })

    window.location.href = `/drink?${queryParams.toString()}`
  }

  if (isLoading) {
    return (
      <div className="container fade-in">
        <div className="py-16 text-center space-y-8">
          <Logo />
          <div className="space-y-4">
            <div className="text-sm mono text-dim">CONJURING</div>
            <h1 className="text-3xl serif">Your libation awaits...</h1>
          </div>
          
          <div className="space-y-2">
            <div className="text-dim mono text-xs">Consulting the spirits</div>
            <div className="w-full bg-border h-px">
              <div className="h-full bg-white w-1/2 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container fade-in">
        <div className="py-16 text-center space-y-8">
          <Logo />
          <div className="space-y-4">
            <h1 className="text-3xl serif">The spirits are restless</h1>
            <p className="text-dim">{error}</p>
          </div>
          
          <div className="space-y-4">
            <button onClick={generateCocktail} className="ghost-button">
              Try Again
            </button>
            <div>
              <button 
                onClick={() => window.location.href = '/'}
                className="text-xs text-dim mono underline"
              >
                Return to the beginning
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cocktail) return null

  return (
    <div className="container fade-in">
      <div className="py-8 space-y-8">
        <Logo />
        <header className="text-center space-y-4">
          <div className="text-xs mono text-dim">YOUR LIBATION</div>
          <h1 className="text-4xl serif font-semibold">
            {cocktail.selectedName}
          </h1>
        </header>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-lg serif">Components</h3>
            <div className="space-y-1">
              {cocktail.ingredients.map((ingredient, index) => (
                <div key={index} className="mono text-sm text-dim">
                  {ingredient}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg serif text-center">Origin</h3>
            <p className="text-justify leading-relaxed">
              {cocktail.story}
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-xs mono text-dim">FOXBRIAR WHISPER</div>
            <p className="italic text-dim">
              {cocktail.whisper}
            </p>
          </div>

          {cocktail.flavorProfile && (
            <div className="text-center space-y-2">
              <div className="text-xs mono text-dim">ESSENCE</div>
              <p className="text-sm italic">
                {cocktail.flavorProfile}
              </p>
            </div>
          )}

          {cocktail.foodPairing && (
            <div className="text-center space-y-4 border-t border-border pt-8">
              <div className="text-xs mono text-dim">SUGGESTED PAIRING</div>
              <div className="space-y-2">
                <h4 className="text-lg serif">{cocktail.foodPairing.name}</h4>
                <p className="text-sm text-dim">{cocktail.foodPairing.description}</p>
                <p className="text-xs mono">${cocktail.foodPairing.price}</p>
                <p className="text-sm italic text-dim">
                  {cocktail.foodPairing.pairingReason}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center space-y-4">
          <button onClick={handleContinue} className="ghost-button">
            Experience This Drink
          </button>
          
          <div className="space-y-2">
            <button onClick={generateCocktail} className="pill-button">
              Conjure Another
            </button>
            
            <div>
              <button 
                onClick={() => window.location.href = '/'}
                className="text-xs text-dim mono underline"
              >
                Return to the beginning
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Generate() {
  return (
    <Suspense fallback={
      <div className="container fade-in">
        <div className="py-16 text-center">
          <div className="text-sm mono text-dim">Loading...</div>
        </div>
      </div>
    }>
      <GenerateContent />
    </Suspense>
  )
}