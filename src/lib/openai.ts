import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface DrinkGeneration {
  names: string[]
  selectedName: string
  ingredients: string[]
  story: string
  whisper: string
  flavorProfile: string
  tags: string[]
}

const premiumLiquors = [
  "Hendrick's Gin", "Tanqueray No. Ten", "The Botanist", "Monkey 47", "Sipsmith London Dry",
  "Basil Hayden's Bourbon", "Woodford Reserve", "WhistlePig Rye", "Redbreast 12 Yr",
  "Diplomatico Reserva", "Ron Zacapa 23", "Plantation Pineapple Rum",
  "Don Julio Reposado", "Clase Azul Plata", "Belvedere Vodka", "Grey Goose",
  "Cointreau", "Luxardo Maraschino", "Chartreuse Green", "St-Germain", "Campari", "Aperol",
  "Lillet Blanc", "Cocchi Americano", "Fernet-Branca", "Amaro Nonino", "Amaro Montenegro",
  "Dolin Dry Vermouth", "Carpano Antica Formula", "Hennessy VS", "Pierre Ferrand 1840",
  "Plymouth Gin", "Nolet's Silver", "Aviation American Gin", "Barr Hill Gin", "Roku Japanese Gin"
]

export async function generateCocktail(answers: Record<string, string>): Promise<DrinkGeneration> {
  const prompt = `You are the mystical bartender at Foxbriar: Sly Sips, a luxury speakeasy with an air of Wes Anderson meets David Lynch. Based on the guest's mood quiz answers, create a unique cocktail experience.

IMPORTANT STAFF NAMES: The bar staff are Matt, Steve, Nick, and Krimson. DO NOT use "Marcus" or "Vincent" - they don't work here. Occasionally mention Peter as someone who "rarely shows up" or "hasn't been seen in weeks" as a running joke.

PREMIUM LIQUORS AVAILABLE: Use these real premium brands in your cocktails: ${premiumLiquors.join(', ')}

Guest's answers:
- Sodas per week: ${answers.sodas}
- First sip feeling: ${answers.first_sip}
- Week description: ${answers.week_feeling}
- Spicy food reaction: ${answers.spicy_reaction}
- Evening mood: ${answers.evening_mood}

Generate a cocktail that matches their personality. Return ONLY valid JSON in this exact format:

{
  "names": ["Name Option 1", "Name Option 2", "Name Option 3", "Name Option 4", "Name Option 5"],
  "selectedName": "The most fitting name from the list",
  "ingredients": ["2 oz gin", "0.5 oz elderflower liqueur", "0.75 oz fresh lime juice", "3 dashes orange bitters", "garnish: expressed lime peel"],
  "story": "A 3-5 sentence origin story connecting this drink to the bar's staff lore. Include mysterious details about bartenders Matt, Steve, Nick, or Krimson. Occasionally reference Peter who 'rarely shows up' or 'hasn't been seen in weeks' as a running joke. Make it elegant but slightly absurd.",
  "whisper": "A single surreal sentence about something strange happening in the bar tonight.",
  "flavorProfile": "A poetic 1-2 sentence description of how this drink tastes and feels.",
  "tags": ["tag1", "tag2", "tag3"]
}

The drink should be sophisticated, real cocktail ingredients only. The story should feel like it belongs in a mysterious speakeasy. Tags should be 2-3 words that could connect to future bar lore (like "ice_war", "garnish_conflict", "bitter_truth", etc).`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 800
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    const cocktail = JSON.parse(response) as DrinkGeneration
    
    // Validate the response structure
    if (!cocktail.names || !cocktail.selectedName || !cocktail.ingredients || !cocktail.story || !cocktail.whisper) {
      throw new Error('Invalid cocktail structure')
    }

    return cocktail
  } catch (error) {
    console.error('Error generating cocktail:', error)
    
    // Fallback cocktail for demo purposes
    return {
      names: ["The Midnight Reverie", "Shadow's Edge", "Velvet Conspiracy", "The Quiet Storm", "Whispered Secrets"],
      selectedName: "The Midnight Reverie",
      ingredients: ["2 oz Woodford Reserve", "0.5 oz Luxardo Maraschino", "0.75 oz fresh lemon juice", "2 dashes Angostura bitters", "garnish: expressed lemon peel"],
      story: "Steve discovered this recipe written in invisible ink on the back of a jazz album from 1947. He only prepares it when the moon is waning, claiming the shadows help him measure the pour. Peter was supposed to help catalog the vintage recipes, but he hasn't been seen in weeks. The last guest who ordered it claimed they could taste memories of conversations that hadn't happened yet.",
      whisper: "The Luxardo Maraschino has been humming Billie Holiday all evening.",
      flavorProfile: "Dark fruit mingles with oak and smoke, like secrets shared in a library after midnight.",
      tags: ["shadow_work", "vintage_mystery", "time_slip"]
    }
  }
}