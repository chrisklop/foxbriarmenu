'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Logo from '@/components/Logo'

interface Drink {
  id: string
  selectedName: string
  ingredients: string[]
  story: string
  whisper: string
  flavorProfile: string
  tags: string[]
  createdAt: string
  rating: number | null
  review: string | null
  ordered: boolean
}

interface UserProfile {
  name: string
  pin: string
  createdAt: string
  drinks: Drink[]
  lastQuiz?: Record<string, string>
}

function ProfileContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [whispers, setWhispers] = useState<string[]>([])
  const searchParams = useSearchParams()

  const loadProfile = useCallback(() => {
    const name = searchParams.get('name')
    const pin = searchParams.get('pin')
    
    if (name && pin) {
      const userKey = `user_${name}_${pin}`
      const userData = localStorage.getItem(userKey)
      
      if (userData) {
        setProfile(JSON.parse(userData))
      }
    }
  }, [searchParams])

  const loadWhispers = async () => {
    try {
      const response = await fetch('/data/lore_tags.json')
      const data = await response.json()
      setWhispers(data.whispers || [])
    } catch (error) {
      console.error('Error loading whispers:', error)
    }
  }

  useEffect(() => {
    loadProfile()
    loadWhispers()
  }, [loadProfile])

  const getRandomWhisper = () => {
    if (whispers.length === 0) return "The bar holds its secrets tonight."
    return whispers[Math.floor(Math.random() * whispers.length)]
  }

  const getAllTags = () => {
    if (!profile) return []
    return profile.drinks.flatMap(drink => drink.tags || [])
  }

  const getUniqueTagsCount = () => {
    const tags = getAllTags()
    return new Set(tags).size
  }

  const getTotalRating = () => {
    if (!profile) return 0
    const ratings = profile.drinks.filter(d => d.rating).map(d => d.rating!)
    if (ratings.length === 0) return 0
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
  }

  const viewDrink = (drink: Drink) => {
    const name = searchParams.get('name')
    const pin = searchParams.get('pin')
    
    const queryParams = new URLSearchParams({
      drink: JSON.stringify(drink),
      ...(name && { name }),
      ...(pin && { pin })
    })

    window.location.href = `/drink?${queryParams.toString()}`
  }

  if (!profile) {
    return (
      <div className="container fade-in">
        <div className="py-16 text-center space-y-8">
          <Logo />
          <div className="space-y-4">
            <h1 className="text-3xl serif">Profile not found</h1>
            <p className="text-dim">Perhaps you entered the wrong name or PIN?</p>
          </div>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="ghost-button"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container fade-in">
      <div className="py-8 space-y-8">
        <Logo />
        <header className="text-center space-y-4">
          <div className="text-xs mono text-dim">GUEST PROFILE</div>
          <h1 className="text-4xl serif font-semibold">
            {profile.name}
          </h1>
          <div className="text-sm text-dim mono">
            Member since {new Date(profile.createdAt).toLocaleDateString()}
          </div>
        </header>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-xl serif">My Sip Statistics</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl serif">{profile.drinks.length}</div>
                <div className="text-xs mono text-dim">LIBATIONS</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl serif">{getTotalRating().toFixed(1)}</div>
                <div className="text-xs mono text-dim">AVG RATING</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl serif">{getUniqueTagsCount()}</div>
                <div className="text-xs mono text-dim">LORE TAGS</div>
              </div>
            </div>
          </div>

          {profile.drinks.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl serif text-center">My Sips</h2>
              <div className="space-y-4">
                {profile.drinks
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((drink) => (
                    <div 
                      key={drink.id}
                      onClick={() => viewDrink(drink)}
                      className="border border-dim p-4 space-y-2 cursor-pointer hover:border-white transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="serif text-lg">{drink.selectedName}</h3>
                        <div className="text-xs mono text-dim">
                          {new Date(drink.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {drink.rating && (
                        <div className="flex items-center gap-2">
                          <div className="rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span 
                                key={star}
                                className={`star ${drink.rating! >= star ? 'active' : ''}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          {drink.review && (
                            <span className="text-sm italic text-dim">
                              &ldquo;{drink.review}&rdquo;
                            </span>
                          )}
                        </div>
                      )}
                      
                      {drink.ordered && (
                        <div className="text-xs mono text-dim">✓ ORDERED</div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="text-center space-y-4 border-t py-8">
            <div className="space-y-2">
              <div className="text-xs mono text-dim">TONIGHT&apos;S WHISPER</div>
              <p className="italic text-dim text-sm">
                {getRandomWhisper()}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <button 
            onClick={() => window.location.href = '/quiz'}
            className="ghost-button"
          >
            Another Libation
          </button>
          
          <div className="space-y-2">
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

export default function Profile() {
  return (
    <Suspense fallback={
      <div className="container fade-in">
        <div className="py-16 text-center">
          <div className="text-sm mono text-dim">Loading...</div>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
}