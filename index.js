import { process } from '/env'
import { Configuration, OpenAIApi } from 'openai'

const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

document.getElementById("send-btn").addEventListener("click", () => {
  const setupTextarea = document.getElementById('setup-textarea')
  if (setupTextarea.value) {
    const userInput = setupTextarea.value
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
    movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`
    fetchBotReply(userInput)
    fetchSynopsis(userInput)
  }
})

async function fetchBotReply(outline) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate a short message to enthusiastically say an outline sounds interesting and that you need some minutes to think about it.
    ###
    outline: Two dogs fall in love and move to Hawaii to learn to surf.
    message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
    ###
    outline:A plane crashes in the jungle and the passengers have to walk 1000km to safety.
    message: I'll spend a few moments considering that. But I love your idea!! A disaster movie in the jungle!
    ###
    outline: A group of corrupt lawyers try to send an innocent woman to jail.
    message: Wow that is awesome! Corrupt lawyers, huh? Give me a few moments to think!
    ###
    outline: ${outline}
    message: 
    `,
    max_tokens: 60 
  })
  movieBossText.innerText = response.data.choices[0].text.trim()
} 

async function fetchSynopsis(outline) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate an engaging, professional and marketable movie synopsis based on an outline. The synopsis should include actors names in brackets after each character. Choose actors that would be ideal for this role. 
    ###
    outline:A self-assured and audacious fighter pilot finds himself back in school, only to be thrust into a perilous mission.

    Synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When charismatic and fearless pilot Kabir (Shah Rukh Khan) is sent to the school, his daring demeanor and confident attitude create friction with the other pilots, particularly the calm and collected Arjun (Ranbir Kapoor). However, Kabir's pursuit is not limited to becoming the top fighter pilot; he also seeks the attention of his captivating flight instructor, Aishwarya (Priyanka Chopra). Gradually, Kabir earns the respect of his mentors and peers, while also falling in love with Aishwarya. Nonetheless, he struggles to find equilibrium between his personal and professional life. As the pilots gear up for a mission against a foreign adversary, Kabir must confront his inner demons and overcome the tragic events of his past in order to rise as the finest fighter pilot and successfully return from the mission.  
    ###
    outline: ${outline}
    synopsis: 
    `,
    max_tokens: 700
  })
  const synopsis = response.data.choices[0].text.trim()
  document.getElementById('output-text').innerText = synopsis
  fetchTitle(synopsis)
  fetchStars(synopsis)
}

async function fetchTitle(synopsis) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate a catchy movie title for this synopsis: ${synopsis}`,
    max_tokens: 25,
    temperature: 0.7
  })
  const title = response.data.choices[0].text.trim()
  document.getElementById('output-title').innerText = title
  fetchImagePromt(title, synopsis)
}

async function fetchStars(synopsis){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Extract the names in brackets from the synopsis.
    ###
    synopsis: When talented fighter pilot Arjun(Hrithik Roshan) is sent to the Top Gun Naval Fighter Weapons School, his daring attitude and confident demeanor put him at odds with the other pilots, especially the composed and collected Raj(Shah Rukh Khan). But Arjun isn't only striving to become the top fighter pilot, he's also competing for the affection of his captivating flight instructor, Pooja(Priyanka Chopra). Arjun gradually earns the respect of his mentors and comrades - and also the love of Pooja, but struggles to maintain a balance between his personal and professional life. As the pilots prepare for a mission against a foreign adversary, Arjun must confront his inner demons and overcome the deep-rooted tragedies from his past in order to emerge as the finest fighter pilot and triumphantly return from the mission.
    names: Hrithik Roshan,Shah Rukh Khan, Priyanka Chopra
    ###
    synopsis: ${synopsis}
    names:   
    `,
    max_tokens: 30
  })
  document.getElementById('output-stars').innerText = response.data.choices[0].text.trim()
}

async function fetchImagePromt(title, synopsis){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Give a short description of an image which could be used to advertise a movie based on a title and synopsis. The description should be rich in visual detail but contain no names.
    ###
    title: Love's Time Warp
    synopsis: When scientist and time traveller Wendy (Shah Rukh Khan) is sent back to the 1920s to assassinate a future dictator, she never expected to fall in love with them. As Wendy infiltrates the dictator's inner circle, she soon finds herself torn between her mission and her growing feelings for the leader (Brie Larson). With the help of a mysterious stranger from the future (Priyanka Chopra), Wendy must decide whether to carry out her mission or follow her heart. But the choices she makes in the 1920s will have far-reaching consequences that reverberate through the ages.
    image description: A silhouetted figure stands in the shadows of a 1920s speakeasy, her face turned away from the camera. In the background, two people are dancing in the dim light, one wearing a flapper-style dress and the other wearing a dapper suit. A semi-transparent image of war is super-imposed over the scene.
    ###
    title: zero Earth
    synopsis: When the protector Veer (Shahid Kapoor) is recruited by the United Nations to safeguard planet Earth from the nefarious Ravan (Nawazuddin Siddiqui), an extraterrestrial overlord with a malevolent plan to conquer the world, he reluctantly embraces the mission. Assisted by his faithful and resourceful sidekick, a courageous hamster named Chintu (Tiger Shroff), Veer embarks on a treacherous quest to vanquish Ravan. Along the way, he unearths newfound bravery and resilience while confronting Ravan's ruthless army. With the destiny of the world hanging in the balance, Veer must discover a way to defeat the alien lord and rescue the planet.
    image Description: A weary and wounded Veer and Chintu stand atop a towering skyscraper, overlooking a vibrant cityscape, with a rainbow adorning the sky above them.
    ###
    title: ${title}
    synopsis: ${synopsis}
    image description: 
    `,
    temperature: 0.8,
    max_tokens: 100
  })
  console.log(response.data.choices[0].text.trim())
}
