'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Home() {
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [showLogin, setShowLogin] = useState(false)

  const handleReturningGuest = () => {
    if (name && pin.length === 4) {
      // In MVP, just redirect to quiz with user context
      window.location.href = `/quiz?name=${encodeURIComponent(name)}&pin=${pin}`
    }
  }

  return (
    <div className="container fade-in">
      <div className="py-16 space-y-8">
        <Logo />
        <header className="text-center space-y-4">
          <div className="text-sm mono text-dim">FOXBRIAR</div>
          <h1 className="text-4xl serif font-semibold">Sly Sips</h1>
        </header>

        <div className="text-center space-y-6">
          <p className="text-lg text-dim">
            Welcome to Foxbriar: Sly Sips
          </p>
          
          {!showLogin ? (
            <div className="space-y-4">
              <Link href="/quiz" className="ghost-button">
                Start Your Sip
              </Link>
              
              <div className="py-4">
                <button 
                  onClick={() => setShowLogin(true)}
                  className="text-sm text-dim mono underline"
                >
                  Returning guest?
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
                <input
                  type="text"
                  placeholder="4-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.slice(0, 4))}
                  className="w-full"
                  maxLength={4}
                />
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={handleReturningGuest}
                  disabled={!name || pin.length !== 4}
                  className="ghost-button w-full"
                >
                  Enter
                </button>
                
                <button 
                  onClick={() => setShowLogin(false)}
                  className="text-sm text-dim mono underline"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center pt-16 border-t text-xs text-dim mono">
          An experience in cocktail mythology
        </footer>
      </div>
    </div>
  )
}
