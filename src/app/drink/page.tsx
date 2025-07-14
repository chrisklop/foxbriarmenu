'use client'

import { useState, useEffect, Suspense } from 'react'
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

function DrinkContent() {
  const [drink, setDrink] = useState<Drink | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [review, setReview] = useState<string>('')
  const [ordered, setOrdered] = useState<boolean>(false)
  const [isSaved, setIsSaved] = useState<boolean>(false)
  const [showProfileForm, setShowProfileForm] = useState<boolean>(false)
  const [newUsername, setNewUsername] = useState<string>('')
  const [newPin, setNewPin] = useState<string>('')
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

    // If no user logged in, show profile creation form
    if (!name || !pin) {
      setShowProfileForm(true)
      return
    }

    saveDrinkToProfile(name, pin)
  }

  const saveDrinkToProfile = (name: string, pin: string) => {
    if (!drink) return

    const updatedDrink = {
      ...drink,
      rating,
      review: review.trim() || null,
      ordered
    }

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

    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleCreateProfile = () => {
    if (!newUsername.trim() || newPin.length !== 4) return
    
    saveDrinkToProfile(newUsername.trim(), newPin)
    setShowProfileForm(false)
    
    // Update URL to include the new user info
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('name', newUsername.trim())
    currentUrl.searchParams.set('pin', newPin)
    window.history.replaceState({}, '', currentUrl.toString())
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
          <Logo />
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
        <Logo />
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

            {showProfileForm && (
              <div className="space-y-4 p-4 border border-dim max-w-sm mx-auto fade-in">
                <div className="space-y-2">
                  <h3 className="serif text-lg">Create Your Profile</h3>
                  <p className="text-sm text-dim">Save this drink and unlock your personal libation history</p>
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Choose a username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full"
                  />
                  <input
                    type="text"
                    placeholder="4-digit PIN"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.slice(0, 4))}
                    className="w-full"
                    maxLength={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={handleCreateProfile}
                    disabled={!newUsername.trim() || newPin.length !== 4}
                    className="ghost-button w-full"
                  >
                    Create Profile & Save Drink
                  </button>
                  
                  <button
                    onClick={() => setShowProfileForm(false)}
                    className="text-xs text-dim mono underline"
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            )}

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

export default function DrinkPage() {
  return (
    <Suspense fallback={
      <div className="container fade-in">
        <div className="py-16 text-center">
          <div className="text-sm mono text-dim">Loading...</div>
        </div>
      </div>
    }>
      <DrinkContent />
    </Suspense>
  )
}