
export interface Campaign {
  id: string;
  name: string;
  brand: string;
  year: number;
  industry: string;
  targetAudience: string[];
  objectives: string[];
  keyMessage: string;
  strategy: string;
  features: string[];
  emotionalAppeal: string[];
  outcomes: string[];
}

export const campaignData: Campaign[] = [
  {
    id: "1",
    name: "Like a Girl",
    brand: "Always",
    year: 2014,
    industry: "Personal Care",
    targetAudience: ["Women", "Teenage Girls", "Young Adults"],
    objectives: ["Brand Awareness", "Societal Change", "Emotional Connection"],
    keyMessage: "Redefine what it means to do something 'like a girl'",
    strategy: "Challenge negative stereotypes about female capability through powerful social experiment video",
    features: ["Social Media Campaign", "Emotional Video Content", "Documentary Style"],
    emotionalAppeal: ["Empowerment", "Pride", "Social Justice"],
    outcomes: ["Increased Brand Awareness", "Cultural Impact", "Sales Growth"]
  },
  {
    id: "2",
    name: "Share a Coke",
    brand: "Coca-Cola",
    year: 2011,
    industry: "Beverages",
    targetAudience: ["Millennials", "General Public", "Families"],
    objectives: ["Increase Consumption", "Brand Connection", "Social Media Engagement"],
    keyMessage: "Share happiness with someone special in your life",
    strategy: "Replace Coca-Cola logo with popular names on bottles to create personal connections",
    features: ["Personalized Packaging", "User-Generated Content", "Social Sharing"],
    emotionalAppeal: ["Nostalgia", "Friendship", "Happiness"],
    outcomes: ["Sales Increase", "Social Media Engagement", "Brand Affinity"]
  },
  {
    id: "3",
    name: "Fearless Girl",
    brand: "State Street Global Advisors",
    year: 2017,
    industry: "Finance",
    targetAudience: ["Investors", "Business Leaders", "Working Women"],
    objectives: ["Brand Awareness", "Social Statement", "Investment Product Promotion"],
    keyMessage: "Advocate for gender diversity in corporate leadership",
    strategy: "Place statue of a young girl facing Wall Street's Charging Bull to symbolize female empowerment",
    features: ["Public Art Installation", "Symbolic Imagery", "Media Relations"],
    emotionalAppeal: ["Courage", "Defiance", "Empowerment"],
    outcomes: ["28 Billion Media Impressions", "Industry Recognition", "Cultural Impact"]
  },
  {
    id: "4",
    name: "Real Beauty Sketches",
    brand: "Dove",
    year: 2013,
    industry: "Personal Care",
    targetAudience: ["Women", "Young Adults"],
    objectives: ["Brand Values Communication", "Emotional Connection", "Social Media Sharing"],
    keyMessage: "You are more beautiful than you think",
    strategy: "Create a social experiment where women describe themselves to a forensic artist who draws them unseen",
    features: ["Documentary Style Video", "Emotional Storytelling", "Social Experiment"],
    emotionalAppeal: ["Self-Acceptance", "Empathy", "Reflection"],
    outcomes: ["114 Million Views", "Media Coverage", "Brand Perception Improvement"]
  },
  {
    id: "5",
    name: "Dream Crazy",
    brand: "Nike",
    year: 2018,
    industry: "Sportswear",
    targetAudience: ["Athletes", "Social Justice Supporters", "Youth"],
    objectives: ["Brand Positioning", "Social Statement", "Emotional Connection"],
    keyMessage: "Believe in something, even if it means sacrificing everything",
    strategy: "Feature Colin Kaepernick and other athletes who overcame obstacles to achieve greatness",
    features: ["Celebrity Endorsement", "Inspirational Storytelling", "Social Commentary"],
    emotionalAppeal: ["Inspiration", "Determination", "Justice"],
    outcomes: ["Brand Value Increase", "Cultural Impact", "Sales Growth"]
  },
  {
    id: "6",
    name: "Spotify Wrapped",
    brand: "Spotify",
    year: 2016,
    industry: "Music Streaming",
    targetAudience: ["Music Lovers", "Digital Natives", "Social Media Users"],
    objectives: ["User Engagement", "Brand Loyalty", "Social Media Sharing"],
    keyMessage: "Celebrate your unique music taste and year in review",
    strategy: "Create personalized data stories for users showcasing their listening habits",
    features: ["Personalized Content", "Data Visualization", "Shareable Format"],
    emotionalAppeal: ["Nostalgia", "Identity", "Connection"],
    outcomes: ["Massive Social Sharing", "User Retention", "Brand Differentiation"]
  },
  {
    id: "7",
    name: "The Truth Is Worth It",
    brand: "The New York Times",
    year: 2019,
    industry: "Media",
    targetAudience: ["News Readers", "Educated Professionals", "Truth Seekers"],
    objectives: ["Subscription Growth", "Brand Positioning", "Editorial Value"],
    keyMessage: "The pursuit of truth requires resources and determination",
    strategy: "Showcase the challenging process journalists go through to uncover important stories",
    features: ["Documentary Style", "Intense Visuals", "Emotional Soundtrack"],
    emotionalAppeal: ["Truth", "Integrity", "Determination"],
    outcomes: ["Subscription Increase", "Award Recognition", "Brand Perception"]
  },
  {
    id: "8",
    name: "Thank You Mom",
    brand: "P&G",
    year: 2012,
    industry: "Consumer Goods",
    targetAudience: ["Mothers", "Families", "Olympic Viewers"],
    objectives: ["Brand Association", "Emotional Connection", "Olympic Sponsorship Leverage"],
    keyMessage: "Behind every Olympic athlete is a supportive mother",
    strategy: "Connect P&G products to mothers' support of their children's Olympic dreams",
    features: ["Olympic Tie-in", "Emotional Storytelling", "Multi-brand Approach"],
    emotionalAppeal: ["Gratitude", "Family", "Pride"],
    outcomes: ["$500M in Sales", "Brand Association", "Positive Sentiment"]
  },
  {
    id: "9",
    name: "The Man Your Man Could Smell Like",
    brand: "Old Spice",
    year: 2010,
    industry: "Personal Care",
    targetAudience: ["Women", "Young Men"],
    objectives: ["Brand Rejuvenation", "New Customer Acquisition", "Social Media Engagement"],
    keyMessage: "Anything is possible with Old Spice",
    strategy: "Use absurd humor and a charismatic spokesperson to appeal to women who purchase for men",
    features: ["Humor", "Unique Character", "One-Take Video"],
    emotionalAppeal: ["Humor", "Attraction", "Confidence"],
    outcomes: ["107% Sales Increase", "Cultural Phenomenon", "Brand Repositioning"]
  },
  {
    id: "10",
    name: "Dumb Ways to Die",
    brand: "Metro Trains Melbourne",
    year: 2012,
    industry: "Public Safety",
    targetAudience: ["Young Adults", "Teenagers", "Commuters"],
    objectives: ["Safety Awareness", "Behavior Change", "Engagement with Serious Message"],
    keyMessage: "Be safe around trains - a serious message delivered in an engaging way",
    strategy: "Use cute characters and catchy music to communicate train safety in a memorable way",
    features: ["Animated Characters", "Catchy Song", "Mobile Game"],
    emotionalAppeal: ["Humor", "Surprise", "Memorability"],
    outcomes: ["200 Million Views", "21% Reduction in Accidents", "Global Recognition"]
  }
];

export const industries = [
  "Automotive", 
  "Beverages", 
  "Consumer Electronics", 
  "Consumer Goods", 
  "Entertainment", 
  "Fashion", 
  "Finance", 
  "Food", 
  "Healthcare", 
  "Hospitality", 
  "Media", 
  "Music Streaming", 
  "Personal Care", 
  "Public Safety", 
  "Retail", 
  "Social Media", 
  "Sportswear", 
  "Technology", 
  "Telecommunications", 
  "Travel"
];

export const emotionalAppeals = [
  "Adventure", 
  "Ambition", 
  "Amusement", 
  "Attraction", 
  "Belonging", 
  "Comfort", 
  "Confidence", 
  "Connection", 
  "Courage", 
  "Defiance", 
  "Determination", 
  "Empathy", 
  "Empowerment", 
  "Excitement", 
  "Family", 
  "Friendship", 
  "Gratitude", 
  "Happiness", 
  "Hope", 
  "Humor", 
  "Identity", 
  "Inspiration", 
  "Integrity", 
  "Joy", 
  "Justice", 
  "Love", 
  "Memorability", 
  "Nostalgia", 
  "Optimism", 
  "Pride", 
  "Reflection", 
  "Self-Acceptance", 
  "Social Justice", 
  "Surprise", 
  "Trust", 
  "Truth"
];

export const objectives = [
  "Behavior Change", 
  "Brand Association", 
  "Brand Awareness", 
  "Brand Connection", 
  "Brand Differentiation", 
  "Brand Loyalty", 
  "Brand Perception Improvement", 
  "Brand Positioning", 
  "Brand Rejuvenation", 
  "Brand Values Communication", 
  "Cultural Impact", 
  "Editorial Value", 
  "Emotional Connection", 
  "Engagement with Serious Message", 
  "Increase Consumption", 
  "Investment Product Promotion", 
  "Media Coverage", 
  "New Customer Acquisition", 
  "Olympic Sponsorship Leverage", 
  "Safety Awareness", 
  "Sales Growth", 
  "Social Media Engagement", 
  "Social Media Sharing", 
  "Social Statement", 
  "Societal Change", 
  "Subscription Growth", 
  "User Engagement", 
  "User Retention"
];

export const targetAudiences = [
  "Athletes", 
  "Business Leaders", 
  "Commuters", 
  "Digital Natives", 
  "Educated Professionals", 
  "Families", 
  "General Public", 
  "Investors", 
  "Millennials", 
  "Mothers", 
  "Music Lovers", 
  "News Readers", 
  "Olympic Viewers", 
  "Social Justice Supporters", 
  "Social Media Users", 
  "Teenage Girls", 
  "Teenagers", 
  "Truth Seekers", 
  "Women", 
  "Working Women", 
  "Young Adults", 
  "Young Men", 
  "Youth",
  "Gen Z"
];
