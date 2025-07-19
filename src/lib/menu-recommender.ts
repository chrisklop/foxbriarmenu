interface MenuItem {
  name: string
  price: number
  ingredients?: string[]
  description?: string
}

interface MenuData {
  'Exotic & Exciting': MenuItem[]
  'Creature Features': MenuItem[]
  'Feats of Strength': MenuItem[]
  'Beers': MenuItem[]
  'Wines': MenuItem[]
  'Concession Stand': MenuItem[]
}

interface DrinkRecommendation {
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

export function recommendDrink(answers: Record<string, string>, menuData: MenuData): DrinkRecommendation {
  // Determine drink category based on answers
  const category = determineDrinkCategory(answers)
  
  // Get drinks from the determined category
  const categoryDrinks = menuData[category] || []
  
  // Select specific drink based on personality
  const selectedDrink = selectDrinkFromCategory(categoryDrinks, answers)
  
  // Generate story and atmosphere
  const atmosphere = generateAtmosphere(selectedDrink, answers)
  
  // Select food pairing
  const foodPairing = selectFoodPairing(menuData['Concession Stand'], selectedDrink, answers)
  
  return {
    names: generateAlternativeNames(selectedDrink.name),
    selectedName: selectedDrink.name,
    ingredients: selectedDrink.ingredients || [],
    story: atmosphere.story,
    whisper: atmosphere.whisper,
    flavorProfile: atmosphere.flavorProfile,
    tags: generateTags(selectedDrink, answers),
    foodPairing
  }
}

function determineDrinkCategory(answers: Record<string, string>): keyof MenuData {
  const { first_sip, week_feeling, evening_mood, spicy_reaction, drink_complexity } = answers
  
  // Exotic & Exciting - for adventurous, surprising personalities
  if (first_sip === 'adventure' || week_feeling === 'surprising' || spicy_reaction === 'embrace' || drink_complexity === 'bold') {
    return 'Exotic & Exciting'
  }
  
  // Creature Features - for mysterious, chaotic personalities
  if (evening_mood === 'shadows' || week_feeling === 'chaotic' || first_sip === 'mystery' || drink_complexity === 'mysterious') {
    return 'Creature Features'
  }
  
  // Feats of Strength - for elegant, contemplative personalities
  if (first_sip === 'elegance' || week_feeling === 'contemplative' || evening_mood === 'brightness' || drink_complexity === 'refined' || drink_complexity === 'theatrical') {
    return 'Feats of Strength'
  }
  
  // Default to Exotic & Exciting for variety
  return 'Exotic & Exciting'
}

function selectDrinkFromCategory(drinks: MenuItem[], answers: Record<string, string>): MenuItem {
  if (drinks.length === 0) {
    // Fallback drink
    return {
      name: "The Archivist's Lament",
      price: 14,
      ingredients: ["2 oz Woodford Reserve", "0.5 oz Luxardo Maraschino", "0.75 oz fresh lemon juice"]
    }
  }
  
  const { sodas, spicy_reaction, evening_mood } = answers
  
  // More sophisticated selection logic based on personality
  let preferredIndex = 0
  
  if (sodas === 'none' || sodas === 'few') {
    // Prefer more complex drinks (first in each category tends to be more complex)
    preferredIndex = 0
  } else if (spicy_reaction === 'embrace' || evening_mood === 'edge') {
    // Prefer bold drinks (middle options)
    preferredIndex = Math.min(1, drinks.length - 1)
  } else {
    // Prefer approachable drinks (last options)
    preferredIndex = drinks.length - 1
  }
  
  return drinks[preferredIndex]
}

function generateAlternativeNames(drinkName: string): string[] {
  // Generate atmospheric alternative names while keeping the original
  const baseNames = [
    "The Velvet Confession",
    "Midnight's Borrowed Truth", 
    "The Curator's Last Dance",
    "Shadow Between Raindrops",
    "The Archivist's Secret"
  ]
  
  // Always include the actual drink name
  return [drinkName, ...baseNames.slice(0, 4)]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateAtmosphere(_drink: MenuItem, _answers: Record<string, string>) {
  const staff = ['Matt', 'Steve', 'Nick', 'Krimson']
  const selectedStaff = staff[Math.floor(Math.random() * staff.length)]
  
  const stories = [
    `${selectedStaff} discovered this recipe scrawled on a napkin left behind by a circus performer who claimed to know the future. They only make it when the moon is waning, insisting the shadows help them measure each pour. Peter was supposed to help document these mysterious recipes, but they haven't been seen in weeks.`,
    
    `This drink emerged from ${selectedStaff}'s experiments with ingredients found in a trunk beneath the bar. The previous owner left cryptic notes about its preparation, warning that it should only be served to those who understand the weight of secrets. Peter once claimed they could taste tomorrow in it, but that was before they disappeared.`,
    
    `${selectedStaff} crafted this libation after finding an old photograph tucked inside a vintage cocktail book. The person in the picture bore an uncanny resemblance to tonight's first customer. They swear the drink tastes different depending on who's watching them prepare it. Peter used to say the ingredients whispered their own names, but no one's heard from them lately.`
  ]
  
  const whispers = [
    "The ice cubes have been humming old circus melodies all evening.",
    "Someone left a fortune from a cookie that never existed on the bar tonight.",
    "The garnish keeps rearranging itself when no one's looking.",
    "A patron from 1952 just ordered the same drink at table seven."
  ]
  
  const flavorProfiles = [
    "Complex layers unfold like secrets shared in hushed tones, each sip revealing another mystery.",
    "Bold and unapologetic, this drink cuts through pretense with surprising depth.",
    "Delicate and nuanced, like overhearing a conversation meant for someone else.",
    "Rich and contemplative, inviting you to lose yourself in its depths."
  ]
  
  return {
    story: stories[Math.floor(Math.random() * stories.length)],
    whisper: whispers[Math.floor(Math.random() * whispers.length)],
    flavorProfile: flavorProfiles[Math.floor(Math.random() * flavorProfiles.length)]
  }
}

function selectFoodPairing(concessionItems: MenuItem[], drink: MenuItem, answers: Record<string, string>) {
  if (concessionItems.length === 0) return undefined
  
  const { first_sip, spicy_reaction, week_feeling } = answers
  
  // Smart pairing logic based on drink and personality
  let selectedFood = concessionItems[0] // Default to first item
  
  // Sophisticated pairings
  if (first_sip === 'elegance') {
    // Look for popcorn with truffle salt for elegant personalities
    selectedFood = concessionItems.find(item => item.name.toLowerCase().includes('popcorn')) || concessionItems[0]
  } else if (spicy_reaction === 'embrace' || first_sip === 'adventure') {
    // Peanuts for adventurous types
    selectedFood = concessionItems.find(item => item.name.toLowerCase().includes('peanuts')) || concessionItems[0]
  } else if (week_feeling === 'contemplative' || first_sip === 'mystery') {
    // Cotton candy for mysterious/contemplative
    selectedFood = concessionItems.find(item => item.name.toLowerCase().includes('cotton candy')) || concessionItems[0]
  } else {
    // Random selection for variety
    selectedFood = concessionItems[Math.floor(Math.random() * concessionItems.length)]
  }
  
  const pairingReasons = [
    "The salt crystals enhance the drink's mysterious undertones.",
    "The sweetness creates a perfect counterpoint to the cocktail's complexity.",
    "This classic pairing elevates both elements to theatrical heights.",
    "The textures play against each other like performers in a surreal dance."
  ]
  
  return {
    name: selectedFood.name,
    price: selectedFood.price,
    description: selectedFood.description || '',
    pairingReason: pairingReasons[Math.floor(Math.random() * pairingReasons.length)]
  }
}

function generateTags(drink: MenuItem, answers: Record<string, string>): string[] {
  const baseTags = ['circus_mystery', 'atmospheric', 'crafted']
  
  // Add personality-based tags
  if (answers.first_sip === 'elegance') baseTags.push('refined')
  if (answers.evening_mood === 'shadows') baseTags.push('mysterious') 
  if (answers.spicy_reaction === 'embrace') baseTags.push('bold')
  if (answers.week_feeling === 'contemplative') baseTags.push('thoughtful')
  
  return baseTags.slice(0, 3)
}