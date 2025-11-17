window.CityPulseData = {
  city: {
    name: "Delhi NCR",
    country: "India",
    coordinates: "28.6139°N, 77.2090°E",
    timezone: "IST (UTC+5:30)",
    population: "32 million",
    area: "1,484 km²"
  },
  weather: {
    temperature: 34,
    condition: "Hazy sunshine",
    realFeel: 36,
    aqi: 158,
    humidity: 45,
    wind: 9,
    uvIndex: 9,
    visibility: 5,
    sunrise: "05:58",
    sunset: "18:32",
    hourly: [30, 32, 33, 34, 35, 33]
  },
  traffic: [
    { corridor: "NH-48 Gurgaon Expressway", density: 0.76, trend: "up" },
    { corridor: "Ring Road East", density: 0.58, trend: "steady" },
    { corridor: "DND Flyway", density: 0.41, trend: "down" }
  ],
  kpis: [
    { label: "Air monitoring uptime", value: 86, target: 95 },
    { label: "Citizen response", value: 62, target: 80 },
    { label: "Metro punctuality", value: 91, target: 96 }
  ],
  timeline: [
    {
      day: "Mon",
      events: [
        { time: "09:00", label: "Connaught Place briefing", type: "event" },
        { time: "15:10", label: "Yamuna floodplain alert", type: "alert" }
      ]
    },
    {
      day: "Tue",
      events: [{ time: "11:00", label: "Lodhi Garden sanitation drive", type: "event" }]
    },
    {
      day: "Wed",
      events: [
        { time: "10:30", label: "Noida onboarding session", type: "event" },
        { time: "18:00", label: "Dust mitigation advisory", type: "alert" }
      ]
    },
    {
      day: "Thu",
      events: [{ time: "08:45", label: "Dwarka metro maintenance", type: "alert" }]
    },
    {
      day: "Fri",
      events: [{ time: "16:00", label: "Cyberhub water audit", type: "event" }]
    },
    { day: "Sat", events: [] },
    { day: "Sun", events: [] }
  ],
  checklist: [
    { label: "Connaught onboarding", done: true, detail: "Sep 18 · 08:30" },
    { label: "Team sync @ Secretariat", done: true, detail: "Sep 18 · 13:00" },
    { label: "Dwarka mobility update", done: false, detail: "Sep 18 · 15:00" },
    { label: "Clean air taskforce", done: false, detail: "Sep 18 · 16:45" },
    { label: "Ring Road signage review", done: false, detail: "Sep 18 · 17:30" }
  ],
  devices: [
    { name: "AQI Pod · Connaught", meta: "Sensor #18", status: "online" },
    { name: "Weather Node · Gurgaon", meta: "Sector 29", status: "maintenance" },
    { name: "Transit Cam · ITO", meta: "Live feed", status: "online" },
    { name: "Flood Beacon · Yamuna", meta: "Gate 4", status: "offline" }
  ],
  alertsTicker: [
    { type: "Weather", message: "Heavy rainfall expected this evening across North Loop." },
    { type: "Traffic", message: "Road closed near Central Park for resurfacing." },
    { type: "Health", message: "AQI rising: sensitive groups limit outdoor activity." },
    { type: "Utilities", message: "Planned water maintenance in Sector 18 · 11pm-2am." }
  ],
  transportStatus: {
    bus: "On time",
    metro: "Minor delay on Blue line",
    bikes: 128,
    parking: 62
  },
  energy: {
    demand: "High",
    renewable: 64,
    outageRisk: "Low",
    waterReserve: 82
  },
  miniMapZones: [
    { code: "CP", name: "Connaught Core", population: "1.2M", cleanliness: "A", facilities: 24 },
    { code: "SZ", name: "South Zone", population: "1.8M", cleanliness: "B+", facilities: 31 },
    { code: "EZ", name: "East Tech Park", population: "0.9M", cleanliness: "A-", facilities: 19 },
    { code: "NW", name: "North Waterfront", population: "0.7M", cleanliness: "B", facilities: 14 }
  ],
  trendAqi: [
    { hour: "00", value: 88 },
    { hour: "04", value: 95 },
    { hour: "08", value: 120 },
    { hour: "12", value: 135 },
    { hour: "16", value: 110 },
    { hour: "20", value: 92 },
    { hour: "24", value: 86 }
  ],
  news: [
    { title: "New solar canopy activated in Dwarka depot", tag: "Energy" },
    { title: "Smart traffic signals go live along Ring Road", tag: "Mobility" },
    { title: "Biofilter park opens in South Ridge", tag: "Environment" }
  ],
  dailyFacts: [
    "City Metro now serves 2.1M riders daily.",
    "52% of Delhi NCR waste is processed for recycling.",
    "New solar farm at Bawana feeds 30MW to the grid."
  ],
  emergencyContacts: [
    { label: "Ambulance", number: "102", icon: "🚑" },
    { label: "Fire Services", number: "101", icon: "🚒" },
    { label: "Police", number: "112", icon: "🚓" }
  ],
  alerts: [
    {
      category: "traffic",
      title: "NH-48 lane restriction",
      time: "15 min ago",
      body: "Two lanes closed near Rajiv Chowk flyover for resurfacing. Avg delay 18 min.",
      badge: "High"
    },
    {
      category: "health",
      title: "AIIMS mobile clinic",
      time: "1 hr ago",
      body: "Tele-health vans deployed across South Delhi till 8 pm.",
      badge: "Info"
    },
    {
      category: "weather",
      title: "Heat + AQI advisory",
      time: "Today · 12:00",
      body: "PM2.5 at 158 (Moderate). Schools advised to curtail outdoor sports post-lunch.",
      badge: "Alert"
    },
    {
      category: "public",
      title: "Kartavya Path innovation fair",
      time: "Tomorrow",
      body: "Citizen co-create lab at Central Vista, 10 am onwards.",
      badge: "Event"
    },
    {
      category: "traffic",
      title: "Noida Metro night block",
      time: "Sep 19",
      body: "Blue Line services paused 11 pm-4 am for signal upgrade between Rajiv Chowk and Yamuna Bank.",
      badge: "Notice"
    }
  ],
  zones: [
    {
      id: "park",
      name: "Lodhi Garden",
      type: "Parks",
      description: "Heritage garden with canopy walks, yoga decks, hydration kiosks.",
      position: { x: 30, y: 40 },
      address: "Lodhi Estate, New Delhi",
      contacts: [
        { label: "Duty manager", value: "+91 11 2464 7002" },
        { label: "Emergency", value: "112" }
      ]
    },
    {
      id: "health",
      name: "AIIMS Delhi",
      type: "Health",
      description: "24/7 tertiary care, telemedicine pods, city blood bank.",
      position: { x: 65, y: 35 },
      address: "Sri Aurobindo Marg, Ansari Nagar",
      contacts: [
        { label: "Front desk", value: "+91 11 2658 8500" },
        { label: "Ambulance", value: "102" }
      ]
    },
    {
      id: "edu",
      name: "DPS R.K. Puram",
      type: "Education",
      description: "K-12 campus with innovation labs and civic auditorium.",
      position: { x: 40, y: 70 },
      address: "Sector XII, R.K. Puram",
      contacts: [{ label: "Admin", value: "+91 11 4911 8800" }]
    },
    {
      id: "mall",
      name: "Select Citywalk",
      type: "Commerce",
      description: "Lifestyle mall with EV bays and last-mile pickup lockers.",
      position: { x: 70, y: 60 },
      address: "A-3, Saket District Centre",
      contacts: [{ label: "Security", value: "+91 11 4211 4200" }]
    }
  ],
  socials: [
    { label: "Instagram", handle: "@CityPulseDelhi" },
    { label: "Twitter", handle: "@CityPulseNCR" },
    { label: "LinkedIn", handle: "CityPulse India" }
  ]
};