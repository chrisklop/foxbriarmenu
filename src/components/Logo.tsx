import Image from 'next/image'
import { useState } from 'react'

interface LogoProps {
  scale?: number
}

export default function Logo({ scale = 0.25 }: LogoProps) {
  const [imgSrc, setImgSrc] = useState('/foxbriar-logo.png')
  
  const handleError = () => {
    setImgSrc('/foxbriarwhiteonblacklogo.png')
  }

  return (
    <div className="flex justify-center mb-6">
      <div 
        className="relative"
        style={{ 
          width: `${300 * scale}px`, 
          height: `${200 * scale}px` 
        }}
      >
        <Image
          src={imgSrc}
          alt="The Foxbriar"
          fill
          className="object-contain"
          priority
          onError={handleError}
        />
      </div>
    </div>
  )
}