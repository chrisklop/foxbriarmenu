import Image from 'next/image'

interface LogoProps {
  scale?: number
}

export default function Logo({ scale = 0.25 }: LogoProps) {
  return (
    <div className="flex justify-center mb-6">
      <div 
        className="relative"
        style={{ 
          width: `${400 * scale}px`, 
          height: `${300 * scale}px` 
        }}
      >
        <Image
          src="/foxbriar-logo.png"
          alt="The Foxbriar"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
}