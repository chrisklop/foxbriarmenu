'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

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

export default function DrinkPage() {
  const [drink, setDrink] = useState<Drink | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [review, setReview] = useState<string>('')
  const [ordered, setOrdered] = useState<boolean>(false)
  const [isSaved, setIsSaved] = useState<boolean>(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const drinkData = searchParams.get('drink')
    if (drinkData) {
      try {
        const parsedDrink = JSON.parse(drinkData)
        setDrink(parsedDrink)
        setRating(parsedDrink.rating || 0)
        setReview(parsedDrink.review || '')
        setOrdered(parsedDrink.ordered || false)
      } catch (error) {
        console.error('Error parsing drink data:', error)
      }
    }
  }, [searchParams])

  const handleStarClick = (value: number) => {
    setRating(value)
  }

  const handleSaveDrink = () => {
    if (!drink) return

    const name = searchParams.get('name')
    const pin = searchParams.get('pin')

    const updatedDrink = {
      ...drink,
      rating,
      review: review.trim() || null,
      ordered
    }

    // Save to localStorage for MVP
    if (name && pin) {
      const userKey = `user_${name}_${pin}`
      const existingUser = localStorage.getItem(userKey)
      
      if (existingUser) {
        const userData = JSON.parse(existingUser)
        const existingDrinkIndex = userData.drinks.findIndex((d: Drink) => d.id === drink.id)
        
        if (existingDrinkIndex >= 0) {
          userData.drinks[existingDrinkIndex] = updatedDrink
        } else {
          userData.drinks.push(updatedDrink)
        }
        
        localStorage.setItem(userKey, JSON.stringify(userData))
      } else {
        // Create new user profile
        const newUser = {
          name,
          pin,
          createdAt: new Date().toISOString(),
          drinks: [updatedDrink]
        }
        localStorage.setItem(userKey, JSON.stringify(newUser))
      }
    } else {
      // Anonymous session - just save the drink
      const sessionDrinks = JSON.parse(localStorage.getItem('session_drinks') || '[]')
      const existingIndex = sessionDrinks.findIndex((d: Drink) => d.id === drink.id)
      
      if (existingIndex >= 0) {
        sessionDrinks[existingIndex] = updatedDrink
      } else {
        sessionDrinks.push(updatedDrink)
      }
      
      localStorage.setItem('session_drinks', JSON.stringify(sessionDrinks))
    }

    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const navigateToProfile = () => {
    const name = searchParams.get('name')
    const pin = searchParams.get('pin')
    
    if (name && pin) {
      window.location.href = `/profile?name=${encodeURIComponent(name)}&pin=${pin}`
    }
  }

  if (!drink) {
    return (
      <div className="container fade-in">
        <div className="py-16 text-center">
          <p className="text-dim">No drink found</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="ghost-button mt-4"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  const name = searchParams.get('name')
  const pin = searchParams.get('pin')

  return (
    <div className="container fade-in">
      <div className="py-8 space-y-8">
        <header className="text-center space-y-4">
          <div className="text-xs mono text-dim">YOUR LIBATION</div>
          <h1 className="text-4xl serif font-semibold">
            {drink.selectedName}
          </h1>
        </header>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-lg serif">Components</h3>
            <div className="space-y-1">
              {drink.ingredients.map((ingredient, index) => (
                <div key={index} className="mono text-sm text-dim">
                  {ingredient}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg serif text-center">Origin</h3>
            <p className="text-justify leading-relaxed">
              {drink.story}
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-xs mono text-dim">FOXBRIAR WHISPER</div>
            <p className="italic text-dim">
              {drink.whisper}
            </p>
          </div>

          {drink.flavorProfile && (
            <div className="text-center space-y-2">
              <div className="text-xs mono text-dim">ESSENCE</div>
              <p className="text-sm italic">
                {drink.flavorProfile}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6 border-t py-8">
          <div className="space-y-4">
            <label className="checkbox-container">
              <input
                type="checkbox"
                className="checkbox"
                checked={ordered}
                onChange={(e) => setOrdered(e.target.checked)}
              />
              <span className="mono text-sm">I ordered this</span>
            </label>

            <div className="space-y-2">
              <div className="text-sm serif text-center">Rate this experience</div>
              <div className="rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleStarClick(value)}
                    className={`star ${rating >= value ? 'active' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm serif">Describe this in three words</label>
              <input
                type="text"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="elegant, mysterious, perfect..."
                maxLength={50}
              />
            </div>
          </div>

          <div className="text-center space-y-4">
            <button
              onClick={handleSaveDrink}
              className="ghost-button"
              disabled={isSaved}
            >
              {isSaved ? 'Saved ✓' : 'Save This Drink'}
            </button>

            <div className="space-y-2">
              {name && pin && (
                <button onClick={navigateToProfile} className="pill-button">
                  View My Sips
                </button>
              )}
              
              <button 
                onClick={() => window.location.href = '/quiz'}
                className="pill-button"
              >
                Another Libation
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
    </div>
  )
}