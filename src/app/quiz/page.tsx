'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const questions = [
  {
    id: 'sodas',
    question: 'How many sodas do you drink per week?',
    options: [
      { value: 'none', label: 'None at all' },
      { value: 'few', label: 'One or two' },
      { value: 'some', label: 'Three to seven' },
      { value: 'many', label: 'More than I count' }
    ]
  },
  {
    id: 'first_sip',
    question: 'You want your first sip to feel like...',
    options: [
      { value: 'mystery', label: 'A whispered secret' },
      { value: 'comfort', label: 'Coming home' },
      { value: 'adventure', label: 'Stepping off a cliff' },
      { value: 'elegance', label: 'Silk against skin' }
    ]
  },
  {
    id: 'week_feeling',
    question: 'How would you describe this week?',
    options: [
      { value: 'chaotic', label: 'A storm in a teacup' },
      { value: 'steady', label: 'Measured and deliberate' },
      { value: 'surprising', label: 'Full of plot twists' },
      { value: 'contemplative', label: 'Lost in thought' }
    ]
  },
  {
    id: 'spicy_reaction',
    question: 'How do you react to spicy food?',
    options: [
      { value: 'avoid', label: 'I prefer gentle flavors' },
      { value: 'embrace', label: 'Bring on the heat' },
      { value: 'curious', label: 'I seek the perfect burn' },
      { value: 'respect', label: 'Spice should have purpose' }
    ]
  },
  {
    id: 'evening_mood',
    question: 'Tonight, you are drawn to...',
    options: [
      { value: 'shadows', label: 'Dark corners and low whispers' },
      { value: 'brightness', label: 'Sharp clarity and truth' },
      { value: 'warmth', label: 'Gentle embraces and stories' },
      { value: 'edge', label: 'Something that cuts through' }
    ]
  }
]

function QuizContent() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const searchParams = useSearchParams()
  
  const name = searchParams.get('name')
  const pin = searchParams.get('pin')

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)
    
    // Check if this completes the quiz
    const totalAnswered = Object.keys(newAnswers).length
    
    if (totalAnswered === questions.length) {
      // All questions answered - show completion
      setTimeout(() => {
        setShowCompletion(true)
      }, 300)
    } else if (currentQuestion < questions.length - 1) {
      // More questions to go - advance
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 300)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    // Create user profile if new
    if (name && pin) {
      const userProfile = {
        name,
        pin,
        createdAt: new Date().toISOString(),
        lastQuiz: answers,
        drinks: []
      }
      
      // In a real app, this would save to backend
      localStorage.setItem(`user_${name}_${pin}`, JSON.stringify(userProfile))
    }
    
    // Generate cocktail based on answers
    const queryParams = new URLSearchParams({
      ...answers,
      ...(name && { name }),
      ...(pin && { pin })
    })
    
    window.location.href = `/generate?${queryParams.toString()}`
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isComplete = showCompletion || Object.keys(answers).length === questions.length

  return (
    <div className="container fade-in">
      <div className="py-8 space-y-8">
        <header className="text-center space-y-2">
          <div className="text-xs mono text-dim">
            {currentQuestion + 1} of {questions.length}
          </div>
          <div className="w-full bg-border h-px">
            <div 
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <div className="space-y-8">
          {!isComplete ? (
            questions.map((q, index) => (
              <div
                key={q.id}
                className={`space-y-6 transition-all duration-500 ${
                  index === currentQuestion ? 'opacity-100' : 'opacity-0 absolute'
                }`}
              >
                <h2 className="text-2xl serif text-center">
                  {q.question}
                </h2>
                
                <div className="space-y-3">
                  {q.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(q.id, option.value)}
                      className={`pill-button w-full text-left ${
                        answers[q.id] === option.value ? 'active' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center space-y-6 fade-in">
              <div className="space-y-2">
                <p className="text-lg serif">
                  Your essence has been captured.
                </p>
                <p className="text-sm text-dim mono">
                  Preparing your libation...
                </p>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="ghost-button"
              >
                {isLoading ? 'Conjuring...' : 'Reveal My Drink'}
              </button>
            </div>
          )}
        </div>

        <footer className="text-center pt-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="text-xs text-dim mono underline"
          >
            Start over
          </button>
        </footer>
      </div>
    </div>
  )
}

export default function Quiz() {
  return (
    <Suspense fallback={
      <div className="container fade-in">
        <div className="py-16 text-center">
          <div className="text-sm mono text-dim">Loading...</div>
        </div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  )
}