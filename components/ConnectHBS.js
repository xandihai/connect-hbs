"use client";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "../lib/supabase";

const CITIES_BY_COUNTRY = {
  "United States": [
    "New York, NY", "San Francisco, CA", "Los Angeles, CA", "Boston, MA",
    "Chicago, IL", "Washington, DC", "Houston, TX", "Dallas, TX",
    "Austin, TX", "Miami, FL", "Atlanta, GA", "Seattle, WA",
    "Denver, CO", "Philadelphia, PA", "San Diego, CA", "Nashville, TN",
    "Charlotte, NC", "Minneapolis, MN", "Detroit, MI", "Portland, OR",
  ],
  "Brazil": ["São Paulo", "Rio de Janeiro", "Brasília"],
  "India": ["Mumbai", "New Delhi", "Bangalore"],
  "China": ["Shanghai", "Beijing", "Shenzhen"],
  "United Kingdom": ["London", "Manchester", "Edinburgh"],
  "Canada": ["Toronto", "Vancouver", "Montreal"],
  "Mexico": ["Mexico City", "Monterrey", "Guadalajara"],
  "Colombia": ["Bogotá", "Medellín", "Cali"],
  "Argentina": ["Buenos Aires", "Córdoba", "Rosario"],
  "Chile": ["Santiago", "Valparaíso", "Concepción"],
  "Peru": ["Lima", "Arequipa", "Cusco"],
  "Germany": ["Berlin", "Munich", "Frankfurt"],
  "France": ["Paris", "Lyon", "Marseille"],
  "Spain": ["Madrid", "Barcelona", "Valencia"],
  "Italy": ["Milan", "Rome", "Florence"],
  "Portugal": ["Lisbon", "Porto", "Braga"],
  "Netherlands": ["Amsterdam", "Rotterdam", "The Hague"],
  "Sweden": ["Stockholm", "Gothenburg", "Malmö"],
  "Switzerland": ["Zurich", "Geneva", "Basel"],
  "Japan": ["Tokyo", "Osaka", "Kyoto"],
  "South Korea": ["Seoul", "Busan", "Incheon"],
  "Singapore": ["Singapore"],
  "Australia": ["Sydney", "Melbourne", "Brisbane"],
  "Israel": ["Tel Aviv", "Jerusalem", "Haifa"],
  "UAE": ["Dubai", "Abu Dhabi", "Sharjah"],
  "Nigeria": ["Lagos", "Abuja", "Port Harcourt"],
  "Kenya": ["Nairobi", "Mombasa", "Kisumu"],
  "South Africa": ["Johannesburg", "Cape Town", "Durban"],
  "Turkey": ["Istanbul", "Ankara", "Izmir"],
  "Russia": ["Moscow", "St. Petersburg", "Novosibirsk"],
  "Philippines": ["Manila", "Cebu", "Davao"],
  "Thailand": ["Bangkok", "Chiang Mai", "Phuket"],
  "Vietnam": ["Ho Chi Minh City", "Hanoi", "Da Nang"],
  "Indonesia": ["Jakarta", "Surabaya", "Bali"],
  "Taiwan": ["Taipei", "Kaohsiung", "Taichung"],
  "Hong Kong": ["Hong Kong"],
  "Pakistan": ["Karachi", "Lahore", "Islamabad"],
  "Bangladesh": ["Dhaka", "Chittagong", "Sylhet"],
  "Egypt": ["Cairo", "Alexandria", "Giza"],
  "Ghana": ["Accra", "Kumasi", "Tamale"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Dammam"],
};

const COUNTRIES = Object.keys(CITIES_BY_COUNTRY).concat(["Other"]);

const NEIGHBORHOODS_BY_CITY = {
  "New York, NY": [
    "Midtown", "Upper East Side", "Upper West Side", "Downtown / FiDi",
    "Chelsea", "West Village", "East Village", "Lower East Side",
    "SoHo / Tribeca", "Harlem", "Hell's Kitchen", "Murray Hill / Gramercy",
    "Williamsburg", "DUMBO / Brooklyn Heights", "Park Slope", "Bed-Stuy",
    "Bushwick", "Greenpoint", "Crown Heights", "Cobble Hill / Carroll Gardens",
    "Astoria", "Long Island City", "Jersey City", "Hoboken",
  ],
  "San Francisco, CA": [
    "SOMA", "Mission", "Marina", "Pacific Heights", "Castro",
    "Hayes Valley", "Nob Hill", "Financial District", "Richmond",
    "Sunset", "North Beach", "Haight-Ashbury",
  ],
  "Los Angeles, CA": [
    "Santa Monica", "Venice", "West Hollywood", "Beverly Hills",
    "Silver Lake", "Echo Park", "Downtown LA", "Brentwood",
    "Culver City", "Koreatown", "Hollywood", "Pasadena",
  ],
  "Boston, MA": [
    "Back Bay", "Beacon Hill", "South End", "Cambridge",
    "Somerville", "Allston / Brighton", "Brookline", "Seaport",
    "North End", "Fenway / Kenmore", "Jamaica Plain",
  ],
  "Chicago, IL": [
    "Lincoln Park", "Wicker Park", "River North", "Gold Coast",
    "Lakeview / Boystown", "West Loop", "Logan Square", "Old Town",
    "South Loop", "Hyde Park", "Bucktown",
  ],
  "Washington, DC": [
    "Georgetown", "Dupont Circle", "Capitol Hill", "Adams Morgan",
    "Navy Yard", "U Street / Shaw", "Foggy Bottom", "Columbia Heights",
    "Arlington", "Bethesda", "Logan Circle",
  ],
  "Houston, TX": [
    "Montrose", "Heights", "Midtown", "River Oaks",
    "Downtown", "Museum District", "West University", "Galleria",
    "Memorial", "EaDo",
  ],
  "Dallas, TX": [
    "Uptown", "Deep Ellum", "Highland Park", "Bishop Arts",
    "Downtown", "Knox / Henderson", "Oak Lawn", "Lakewood",
    "Design District", "Preston Hollow",
  ],
  "Austin, TX": [
    "Downtown", "South Congress", "East Austin", "Zilker",
    "Clarksville", "Mueller", "Rainey Street", "West Lake Hills",
    "Hyde Park", "Travis Heights",
  ],
  "Miami, FL": [
    "Brickell", "Wynwood", "South Beach", "Coconut Grove",
    "Coral Gables", "Design District", "Downtown", "Edgewater",
    "Little Havana", "Key Biscayne",
  ],
  "Atlanta, GA": [
    "Midtown", "Buckhead", "Virginia-Highland", "Inman Park",
    "Old Fourth Ward", "West Midtown", "Decatur", "Poncey-Highland",
    "Downtown", "Grant Park",
  ],
  "Seattle, WA": [
    "Capitol Hill", "Ballard", "Queen Anne", "Fremont",
    "South Lake Union", "Downtown", "Wallingford", "Green Lake",
    "University District", "West Seattle",
  ],
  "Denver, CO": [
    "LoDo", "RiNo", "Cherry Creek", "Capitol Hill",
    "Highlands", "Wash Park", "Baker", "Congress Park",
    "Downtown", "Sloan's Lake",
  ],
  "Philadelphia, PA": [
    "Center City", "Rittenhouse", "Old City", "Fishtown",
    "University City", "Northern Liberties", "South Philly",
    "Manayunk", "Fairmount", "Graduate Hospital",
  ],
  "San Diego, CA": [
    "Gaslamp Quarter", "North Park", "Hillcrest", "La Jolla",
    "Pacific Beach", "Little Italy", "Bankers Hill", "Mission Hills",
    "Ocean Beach", "Downtown",
  ],
  "Nashville, TN": [
    "The Gulch", "East Nashville", "Germantown", "12 South",
    "Downtown", "Midtown", "Hillsboro Village", "Sylvan Park",
    "Marathon Village", "Berry Hill",
  ],
  "Charlotte, NC": [
    "Uptown", "South End", "NoDa", "Plaza Midwood",
    "Dilworth", "Myers Park", "Ballantyne", "Elizabeth",
    "Montford", "Cherry",
  ],
  "Minneapolis, MN": [
    "North Loop", "Uptown", "Northeast", "Downtown",
    "Loring Park", "Mill District", "Whittier", "Linden Hills",
    "Southwest", "St. Paul — Summit Hill",
  ],
  "Portland, OR": [
    "Pearl District", "Alberta Arts", "Hawthorne", "Division",
    "Northwest / Nob Hill", "Sellwood", "Mississippi", "Downtown",
    "St. Johns", "Buckman",
  ],
};

const INDUSTRIES = [
  "Private Equity / VC",
  "Investment Banking",
  "Investment Management / Asset Management",
  "Consulting",
  "Tech / Software",
  "Energy / Infrastructure",
  "Healthcare / Biotech / Pharma",
  "Real Estate",
  "Consumer / Retail / CPG",
  "Media / Entertainment",
  "Financial Services / Insurance",
  "Aerospace / Defense",
  "Manufacturing / Industrials",
  "Nonprofit / Impact / NGO",
  "Government / Policy / Public Sector",
  "Education",
  "Legal",
  "Startup (own)",
  "Family Business",
  "Military",
  "Other",
];

const POST_MBA = [
  "Private Equity",
  "Venture Capital",
  "Investment Banking",
  "Investment Management / Hedge Funds",
  "Consulting (MBB / Strategy)",
  "Consulting (Boutique / Specialized)",
  "Tech — Product Management",
  "Tech — Strategy & Operations",
  "Tech — Engineering / AI",
  "Tech — Big Tech (FAANG)",
  "Tech — Growth Stage Startup",
  "Startup — Founding my own",
  "Startup — Joining early stage",
  "Corporate Strategy / Corporate Development",
  "Corporate Finance / CFO track",
  "General Management / Leadership Program",
  "Brand Management / Marketing (CPG)",
  "Energy / Climate / Sustainability",
  "Healthcare / Biotech / Pharma",
  "Real Estate / RE Private Equity",
  "Impact / Social Enterprise / Nonprofit",
  "Media / Entertainment / Sports",
  "Family Business / Family Office",
  "Government / Policy / Public Sector",
  "Entrepreneurship through Acquisition (ETA / Search Fund)",
  "Education / EdTech",
  "Not sure yet — exploring",
  "Other",
];

const FOOD_INTERESTS = [
  "Trying new restaurants",
  "Cooking / hosting dinners",
  "Wine / natural wine",
  "Cocktails / speakeasy bars",
  "Coffee snob",
  "Food markets / street food",
  "Healthy eating / meal prep",
];

const ACTIVITIES = [
  "Running",
  "CrossFit / gym",
  "Yoga / pilates",
  "Tennis / padel / pickleball",
  "Golf",
  "Hiking / outdoors",
  "Cycling",
  "Basketball / pickup sports",
  "Swimming",
  "Skiing / snowboarding",
  "Martial arts / boxing",
  "Dance (salsa, etc.)",
];

const SOCIAL_CULTURE = [
  "Nightlife / going out",
  "Live music / concerts",
  "Art galleries / museums",
  "Theater / Broadway",
  "Sports (watching / going to games)",
  "Book club / reading",
  "Podcasts",
  "Travel planning",
  "Photography",
  "Film / cinema",
  "Board games / poker",
  "Volunteering",
];

const LEARNING = [
  "Coding / AI / tech",
  "Investing / markets",
  "Languages",
  "Public speaking",
  "Writing",
  "Design / creative",
  "Crypto / web3",
  "Biohacking / wellness",
  "Side projects / building",
  "Real estate investing",
  "Golf",
  "Cooking / culinary",
  "Music / instruments",
  "Photography / videography",
  "Negotiation / sales",
  "Data science / analytics",
  "Personal finance / tax strategy",
  "Wine / spirits",
  "Meditation / mindfulness",
];

const EVENT_TYPES = [
  "Casual drinks / happy hour",
  "Small dinners (6-8 people)",
  "Lunch",
  "Dinner",
  "Workout groups",
  "Weekend trips",
  "Speaker / panel events",
  "Cultural outings",
  "Brunch",
];

const RELATIONSHIP_STATUS = ["Single", "In a relationship", "Married"];

const POST_MBA_REGIONS = [
  "United States",
  "Latin America",
  "Europe",
  "Asia",
  "Middle East / Africa",
  "Canada",
  "Global / Open to anywhere",
  "Not sure yet",
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  instagram: "",
  linkedin: "",
  from: "",
  countryLiveIn: "",
  city: "",
  neighborhood: "",
  relationshipStatus: "",
  pin: "",
  company: "",
  previousIndustry: "",
  industry: "",
  postMba: [],
  postMbaRegion: [],
  foodInterests: [],
  favRestaurants: "",
  activities: [],
  socialCulture: [],
  learning: [],
  eventTypes: [],
  funFact: "",
  beforeMba: "",
  sideProject: "",
};

// --- Chip / Tag components ---
const Tag = ({ label, color = "default", small = false }) => {
  const colors = {
    default: { bg: "rgba(100,100,120,0.08)", text: "#555", border: "rgba(100,100,120,0.13)" },
    crimson: { bg: "rgba(163,31,52,0.07)", text: "#a31f34", border: "rgba(163,31,52,0.13)" },
    blue: { bg: "rgba(37,99,235,0.07)", text: "#2563eb", border: "rgba(37,99,235,0.12)" },
    green: { bg: "rgba(22,163,74,0.07)", text: "#16a34a", border: "rgba(22,163,74,0.12)" },
    orange: { bg: "rgba(234,88,12,0.07)", text: "#ea580c", border: "rgba(234,88,12,0.12)" },
    purple: { bg: "rgba(124,58,237,0.07)", text: "#7c3aed", border: "rgba(124,58,237,0.12)" },
    pink: { bg: "rgba(219,39,119,0.07)", text: "#db2777", border: "rgba(219,39,119,0.12)" },
  };
  const c = colors[color] || colors.default;
  return (
    <span
      style={{
        display: "inline-block",
        padding: small ? "2px 8px" : "3px 10px",
        borderRadius: 20,
        fontSize: small ? 11 : 12,
        fontWeight: 500,
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        lineHeight: 1.5,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
};

// --- Multi-select pill input ---
const MultiSelect = ({ options, selected, onChange, accent = "#a31f34" }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
    {options.map((opt) => {
      const active = selected.includes(opt);
      return (
        <button
          key={opt}
          type="button"
          onClick={() =>
            onChange(active ? selected.filter((s) => s !== opt) : [...selected, opt])
          }
          style={{
            padding: "5px 13px",
            borderRadius: 20,
            border: active ? `1.5px solid ${accent}` : "1.5px solid #ddd",
            background: active ? `${accent}11` : "#fafafa",
            color: active ? accent : "#555",
            fontSize: 13,
            fontWeight: active ? 600 : 400,
            cursor: "pointer",
            transition: "all .15s",
            fontFamily: "inherit",
          }}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

const SectionLabel = ({ children }) => (
  <label
    style={{
      display: "block",
      fontSize: 13,
      fontWeight: 700,
      color: "#1a1a2e",
      marginBottom: 6,
      letterSpacing: 0.2,
      textTransform: "uppercase",
    }}
  >
    {children}
  </label>
);

const TextInput = ({ value, onChange, placeholder, textarea = false }) => {
  const shared = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1.5px solid #e0e0e0",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    background: "#fafafa",
    color: "#1a1a2e",
    outline: "none",
    transition: "border .2s",
    boxSizing: "border-box",
  };
  if (textarea)
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        style={{ ...shared, resize: "vertical" }}
        onFocus={(e) => (e.target.style.borderColor = "#a31f34")}
        onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
      />
    );
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={shared}
      onFocus={(e) => (e.target.style.borderColor = "#a31f34")}
      onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
    />
  );
};

const SelectInput = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      width: "100%",
      padding: "10px 14px",
      borderRadius: 10,
      border: "1.5px solid #e0e0e0",
      fontSize: 14,
      fontFamily: "'DM Sans', sans-serif",
      background: "#fafafa",
      color: value ? "#1a1a2e" : "#999",
      outline: "none",
      cursor: "pointer",
      boxSizing: "border-box",
    }}
  >
    <option value="">
      {placeholder}
    </option>
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);

const SelectWithOther = ({ value, onChange, options, placeholder }) => {
  const isOther = value && !options.includes(value) && value !== "Other";
  const [showCustom, setShowCustom] = useState(isOther);
  const [customValue, setCustomValue] = useState(isOther ? value : "");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <select
        value={showCustom ? "Other" : value}
        onChange={(e) => {
          if (e.target.value === "Other") {
            setShowCustom(true);
            onChange(customValue || "");
          } else {
            setShowCustom(false);
            setCustomValue("");
            onChange(e.target.value);
          }
        }}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 10,
          border: "1.5px solid #e0e0e0",
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          background: "#fafafa",
          color: value || showCustom ? "#1a1a2e" : "#999",
          outline: "none",
          cursor: "pointer",
          boxSizing: "border-box",
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {showCustom && (
        <TextInput
          value={customValue}
          onChange={(v) => {
            setCustomValue(v);
            onChange(v);
          }}
          placeholder="Type your answer..."
        />
      )}
    </div>
  );
};

// --- Person card ---
const PersonCard = ({ person, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: "#fff",
      borderRadius: 14,
      border: "1px solid #eee",
      padding: "18px 20px",
      cursor: "pointer",
      transition: "all .2s",
      position: "relative",
      overflow: "hidden",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
      e.currentTarget.style.borderColor = "#a31f34";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "#eee";
    }}
  >
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #a31f34, #c75b3a)" }} />
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #a31f34, #c75b3a)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 700,
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {person.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {person.name}
        </div>
        <div style={{ fontSize: 12, color: "#888", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {person.company} · {person.industry}
        </div>
      </div>
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
      {(person.city || person.neighborhood) && <Tag label={`📍 ${[person.city, person.neighborhood].filter(Boolean).join(" · ")}`} small />}
      {person.from && <Tag label={`🌍 ${person.from}`} small />}
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {person.postMba.slice(0, 2).map((p) => (
        <Tag key={p} label={p} color="crimson" small />
      ))}
    </div>
    {person.funFact && (
      <div style={{ marginTop: 10, fontSize: 12, color: "#666", fontStyle: "italic", lineHeight: 1.4 }}>
        ✨ {person.funFact}
      </div>
    )}
  </div>
);

// --- Person detail modal ---
const PersonModal = ({ person, onClose, onEdit, onDelete }) => {
  if (!person) return null;
  const Section = ({ title, items, color }) =>
    items && items.length > 0 ? (
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#999", marginBottom: 6, letterSpacing: 0.5 }}>
          {title}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {items.map((i) => (
            <Tag key={i} label={i} color={color} />
          ))}
        </div>
      </div>
    ) : null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 18,
          maxWidth: 520,
          width: "100%",
          maxHeight: "85vh",
          overflow: "auto",
          padding: "28px 28px 20px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "#f5f5f5",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            cursor: "pointer",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #a31f34, #c75b3a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {person.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#1a1a2e" }}>{person.name}</div>
            <div style={{ fontSize: 13, color: "#888" }}>
              {person.company} · {person.industry}
            </div>
            {person.linkedin && (
              <a
                href={person.linkedin.startsWith("http") ? person.linkedin : `https://${person.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", marginRight: 10 }}
              >
                LinkedIn ↗
              </a>
            )}
            {person.email && (
              <a href={`mailto:${person.email}`} style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", marginRight: 10 }}>
                ✉ {person.email}
              </a>
            )}
            {person.phone && (
              <a href={`tel:${person.phone}`} style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", marginRight: 10 }}>
                📱 {person.phone}
              </a>
            )}
            {person.instagram && (
              <a
                href={`https://instagram.com/${person.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, color: "#2563eb", textDecoration: "none" }}
              >
                📸 {person.instagram}
              </a>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {(person.city || person.neighborhood) && <Tag label={`📍 ${[person.city, person.neighborhood].filter(Boolean).join(" · ")}`} />}
          {person.from && <Tag label={`🌍 From: ${person.from}`} />}
          {person.relationshipStatus && <Tag label={`💛 ${person.relationshipStatus}`} />}
          {person.previousIndustry && <Tag label={`⏪ Prev: ${person.previousIndustry}`} />}
        </div>

        <Section title="Post-MBA Goals" items={person.postMba} color="crimson" />
        <Section title="🌎 Post-MBA Region" items={person.postMbaRegion} color="crimson" />
        <Section title="🍽 Food & Drink" items={person.foodInterests} color="orange" />
        {person.favRestaurants && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#999", marginBottom: 4, letterSpacing: 0.5 }}>
              ⭐ Favorite Restaurants & Bars
            </div>
            <div style={{ fontSize: 14, color: "#333" }}>{person.favRestaurants}</div>
          </div>
        )}
        <Section title="🏃 Activities & Sports" items={person.activities} color="green" />
        <Section title="🎭 Social & Culture" items={person.socialCulture} color="purple" />
        <Section title="🧠 Want to Learn / Explore" items={person.learning} color="blue" />
        <Section title="🎉 Event Preferences" items={person.eventTypes} color="pink" />

        {person.funFact && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#999", marginBottom: 4, letterSpacing: 0.5 }}>
              ✨ Fun Fact
            </div>
            <div style={{ fontSize: 14, color: "#333" }}>{person.funFact}</div>
          </div>
        )}
        {person.beforeMba && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#999", marginBottom: 4, letterSpacing: 0.5 }}>
              📚 Before the MBA
            </div>
            <div style={{ fontSize: 14, color: "#333" }}>{person.beforeMba}</div>
          </div>
        )}
        {person.sideProject && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#999", marginBottom: 4, letterSpacing: 0.5 }}>
              🚀 Side Project / Idea
            </div>
            <div style={{ fontSize: 14, color: "#333" }}>{person.sideProject}</div>
          </div>
        )}

        {/* Edit / Delete actions */}
        <div style={{ display: "flex", gap: 8, marginTop: 20, paddingTop: 16, borderTop: "1px solid #eee" }}>
          <button
            onClick={() => onEdit(person)}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: 10,
              border: "1.5px solid #a31f34",
              background: "#fff",
              color: "#a31f34",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ✏️ Edit Profile
          </button>
          <button
            onClick={() => onDelete(person)}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1.5px solid #e0e0e0",
              background: "#fff",
              color: "#999",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN APP ============
export default function App() {
  const [view, setView] = useState("directory"); // "directory" | "form"
  const [people, setPeople] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [search, setSearch] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterPostMba, setFilterPostMba] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterCategory, setFilterCategory] = useState(""); // food, activities, social, learning
  const [filterInterest, setFilterInterest] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeletePerson, setConfirmDeletePerson] = useState(null);
  const [pinPrompt, setPinPrompt] = useState(null); // { person, action: "edit" | "delete" }
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Load from Supabase
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: true });
        if (!error && data) {
          setPeople(data.map((row) => ({ ...row.data, _dbId: row.id })));
        }
      } catch (e) {
        console.log("Error loading profiles", e);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.pin || form.pin.length < 4) return;
    try {
      if (editingId) {
        const person = people.find((p) => p.id === editingId);
        const dbId = person?._dbId;
        if (dbId) {
          const { id, _dbId, ...formData } = form;
          await supabase.from("profiles").update({ data: formData }).eq("id", dbId);
        }
      } else {
        const { id, _dbId, ...formData } = form;
        await supabase.from("profiles").insert({ data: formData });
      }
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: true });
      if (data) setPeople(data.map((row) => ({ ...row.data, _dbId: row.id, id: row.id })));
    } catch (e) {
      console.error("Save error", e);
    }
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setSubmitted(true);
    setFormStep(0);
    setTimeout(() => {
      setSubmitted(false);
      setView("directory");
    }, 1800);
  };

  // Pin-protected edit: show pin prompt first
  const requestEdit = (person) => {
    setPinPrompt({ person, action: "edit" });
    setPinInput("");
    setPinError(false);
  };

  // Pin-protected delete: show pin prompt first
  const requestDelete = (person) => {
    setPinPrompt({ person, action: "delete" });
    setPinInput("");
    setPinError(false);
  };

  const handlePinSubmit = () => {
    if (!pinPrompt) return;
    const { person, action } = pinPrompt;
    if (pinInput !== person.pin) {
      setPinError(true);
      return;
    }
    setPinPrompt(null);
    setPinInput("");
    setPinError(false);
    if (action === "edit") {
      // Merge with EMPTY_FORM to ensure all fields exist
      const copy = { ...EMPTY_FORM };
      Object.keys(person).forEach((k) => {
        copy[k] = Array.isArray(person[k]) ? [...person[k]] : person[k];
      });
      setForm(copy);
      setEditingId(person.id || person._dbId);
      setSelectedPerson(null);
      setFormStep(0);
      setView("form");
    } else if (action === "delete") {
      setSelectedPerson(null);
      setConfirmDeletePerson(person);
    }
  };

  const confirmDelete = async () => {
    if (!confirmDeletePerson) return;
    try {
      const dbId = confirmDeletePerson._dbId;
      if (dbId) {
        await supabase.from("profiles").delete().eq("id", dbId);
      }
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: true });
      if (data) setPeople(data.map((row) => ({ ...row.data, _dbId: row.id, id: row.id })));
    } catch (e) {
      console.error("Delete error", e);
    }
    setConfirmDeletePerson(null);
    setSelectedPerson(null);
  };

  const updateForm = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // Build interest filter options
  const interestOptions = useMemo(() => {
    if (filterCategory === "food") return FOOD_INTERESTS;
    if (filterCategory === "activities") return ACTIVITIES;
    if (filterCategory === "social") return SOCIAL_CULTURE;
    if (filterCategory === "learning") return LEARNING;
    return [];
  }, [filterCategory]);

  // Build city filter options from submitted data
  const usedCities = useMemo(() => {
    const cities = people.map((p) => p.city).filter(Boolean);
    return [...new Set(cities)].sort();
  }, [people]);

  // Filtered people
  const filtered = useMemo(() => {
    return people.filter((p) => {
      if (search && !JSON.stringify(p).toLowerCase().includes(search.toLowerCase())) return false;
      if (filterIndustry && p.industry !== filterIndustry) return false;
      if (filterPostMba && !p.postMba.includes(filterPostMba)) return false;
      if (filterCity && p.city !== filterCity) return false;
      if (filterInterest) {
        const all = [...(p.foodInterests || []), ...(p.activities || []), ...(p.socialCulture || []), ...(p.learning || [])];
        if (!all.includes(filterInterest)) return false;
      }
      return true;
    });
  }, [people, search, filterIndustry, filterPostMba, filterCity, filterInterest]);

  const activeFilters = [filterIndustry, filterPostMba, filterCity, filterInterest].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setFilterIndustry("");
    setFilterPostMba("");
    setFilterCity("");
    setFilterCategory("");
    setFilterInterest("");
  };

  const FORM_STEPS = [
    { title: "About You", icon: "👤" },
    { title: "Career", icon: "💼" },
    { title: "Food & Drink", icon: "🍽" },
    { title: "Activities", icon: "🏃" },
    { title: "Social & Culture", icon: "🎭" },
    { title: "Learning", icon: "🧠" },
    { title: "The Fun Stuff", icon: "✨" },
  ];

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh",
        background: "#f8f7f4",
        color: "#1a1a2e",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b3d 50%, #3d1f1f 100%)",
          padding: "32px 24px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(163,31,52,0.15)" }} />
        <div style={{ position: "absolute", bottom: -20, left: "30%", width: 120, height: 120, borderRadius: "50%", background: "rgba(199,91,58,0.1)" }} />
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ background: "#a31f34", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: 1, textTransform: "uppercase" }}>
              HBS 2028
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Class Directory</div>
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 32,
              fontWeight: 900,
              color: "#fff",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Connect HBS
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: "8px 0 16px", maxWidth: 400 }}>
            Find your people before campus.
          </p>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setView("directory")}
              style={{
                padding: "9px 20px",
                borderRadius: 10,
                border: "none",
                background: view === "directory" ? "#fff" : "rgba(255,255,255,0.12)",
                color: view === "directory" ? "#1a1a2e" : "#fff",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all .2s",
              }}
            >
              🔍 Directory ({people.length})
            </button>
            <button
              onClick={() => { setView("form"); setSubmitted(false); setEditingId(null); setForm({ ...EMPTY_FORM }); setFormStep(0); }}
              style={{
                padding: "9px 20px",
                borderRadius: 10,
                border: "none",
                background: view === "form" ? "#fff" : "rgba(255,255,255,0.12)",
                color: view === "form" ? "#1a1a2e" : "#fff",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all .2s",
              }}
            >
              ➕ Add Yourself
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px 40px" }}>
        {/* ===== DIRECTORY VIEW ===== */}
        {view === "directory" && (
          <>
            {/* Search & Filters */}
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, company, interest, anything..."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1.5px solid #e0e0e0",
                  fontSize: 14,
                  fontFamily: "inherit",
                  background: "#fff",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              <SelectInput value={filterIndustry} onChange={setFilterIndustry} options={INDUSTRIES} placeholder="Industry" />
              <SelectInput value={filterPostMba} onChange={setFilterPostMba} options={POST_MBA} placeholder="Post-MBA Goal" />
              <SelectInput value={filterCity} onChange={setFilterCity} options={usedCities} placeholder="City" />
              <div style={{ display: "flex", gap: 8, width: "100%" }}>
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setFilterInterest("");
                  }}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1.5px solid #e0e0e0",
                    fontSize: 14,
                    fontFamily: "inherit",
                    background: "#fafafa",
                    color: filterCategory ? "#1a1a2e" : "#999",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Interest Category</option>
                  <option value="food">🍽 Food & Drink</option>
                  <option value="activities">🏃 Activities & Sports</option>
                  <option value="social">🎭 Social & Culture</option>
                  <option value="learning">🧠 Learning</option>
                </select>
                {filterCategory && (
                  <select
                    value={filterInterest}
                    onChange={(e) => setFilterInterest(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1.5px solid #e0e0e0",
                      fontSize: 14,
                      fontFamily: "inherit",
                      background: "#fafafa",
                      color: filterInterest ? "#1a1a2e" : "#999",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">Select interest...</option>
                    {interestOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {activeFilters > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: "#888" }}>
                  {filtered.length} of {people.length} people
                </span>
                <button
                  onClick={clearFilters}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    background: "#fff",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    color: "#a31f34",
                    fontWeight: 600,
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* People Grid */}
            {filtered.length === 0 && people.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#555", marginBottom: 8 }}>No one here yet</div>
                <div style={{ fontSize: 14, marginBottom: 20 }}>Be the first to add your profile!</div>
                <button
                  onClick={() => setView("form")}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 10,
                    border: "none",
                    background: "#a31f34",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Add Yourself →
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#999" }}>
                <div style={{ fontSize: 14 }}>No matches for your filters. Try adjusting.</div>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 12,
                }}
              >
                {filtered.map((p) => (
                  <PersonCard key={p.id} person={p} onClick={() => setSelectedPerson(p)} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ===== FORM VIEW ===== */}
        {view === "form" && (
          <>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>{editingId ? "Profile updated!" : "You're in!"}</div>
                <div style={{ fontSize: 14, color: "#888", marginTop: 8 }}>Redirecting to directory...</div>
              </div>
            ) : (
              <div style={{ maxWidth: 560, margin: "0 auto" }}>
                {/* Editing banner */}
                {editingId && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                    borderRadius: 10,
                    background: "#a31f3410",
                    border: "1.5px solid #a31f34",
                    marginBottom: 16,
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#a31f34" }}>
                      ✏️ Editing {form.name || "profile"}
                    </span>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setForm({ ...EMPTY_FORM });
                        setFormStep(0);
                        setView("directory");
                      }}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 8,
                        border: "1px solid #a31f34",
                        background: "#fff",
                        color: "#a31f34",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {/* Step indicators */}
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
                  {FORM_STEPS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setFormStep(i)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 20,
                        border: formStep === i ? "1.5px solid #a31f34" : "1.5px solid #e0e0e0",
                        background: formStep === i ? "#a31f3410" : "#fff",
                        color: formStep === i ? "#a31f34" : "#888",
                        fontSize: 12,
                        fontWeight: formStep === i ? 700 : 400,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {s.icon} {s.title}
                    </button>
                  ))}
                </div>

                <div style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid #eee" }}>
                  {/* Step 0: About You */}
                  {formStep === 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <SectionLabel>Full Name *</SectionLabel>
                        <TextInput value={form.name} onChange={(v) => updateForm("name", v)} placeholder="Your name" />
                      </div>
                      <div>
                        <SectionLabel>4-digit PIN * <span style={{ fontWeight: 400, textTransform: "none", fontSize: 11, color: "#999" }}>— you'll need this to edit or delete your profile later</span></SectionLabel>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          value={form.pin}
                          onChange={(e) => updateForm("pin", e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="e.g. 1234"
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: 10,
                            border: "1.5px solid #e0e0e0",
                            fontSize: 18,
                            fontFamily: "'DM Sans', sans-serif",
                            background: "#fafafa",
                            color: "#1a1a2e",
                            outline: "none",
                            letterSpacing: 8,
                            textAlign: "center",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                      <div>
                        <SectionLabel>Email</SectionLabel>
                        <TextInput value={form.email} onChange={(v) => updateForm("email", v)} placeholder="your@email.com" />
                      </div>
                      <div>
                        <SectionLabel>Phone Number</SectionLabel>
                        <TextInput value={form.phone} onChange={(v) => updateForm("phone", v)} placeholder="+1 (555) 123-4567" />
                      </div>
                      <div>
                        <SectionLabel>Relationship Status</SectionLabel>
                        <SelectInput value={form.relationshipStatus} onChange={(v) => updateForm("relationshipStatus", v)} options={RELATIONSHIP_STATUS} placeholder="Select status" />
                      </div>
                      <div>
                        <SectionLabel>LinkedIn URL</SectionLabel>
                        <TextInput value={form.linkedin} onChange={(v) => updateForm("linkedin", v)} placeholder="linkedin.com/in/..." />
                      </div>
                      <div>
                        <SectionLabel>Instagram</SectionLabel>
                        <TextInput value={form.instagram} onChange={(v) => updateForm("instagram", v)} placeholder="@yourhandle" />
                      </div>
                      <div>
                        <SectionLabel>Where are you from? (country)</SectionLabel>
                        <SelectWithOther value={form.from} onChange={(v) => updateForm("from", v)} options={COUNTRIES} placeholder="Select country" />
                      </div>
                      <div>
                        <SectionLabel>Country you live in now</SectionLabel>
                        <SelectWithOther
                          value={form.countryLiveIn}
                          onChange={(v) => {
                            updateForm("countryLiveIn", v);
                            updateForm("city", "");
                          }}
                          options={COUNTRIES}
                          placeholder="Select country"
                        />
                      </div>
                      <div>
                        <SectionLabel>City you live in now</SectionLabel>
                        {form.countryLiveIn && form.countryLiveIn !== "Other" && CITIES_BY_COUNTRY[form.countryLiveIn] ? (
                          <SelectWithOther
                            value={form.city}
                            onChange={(v) => { updateForm("city", v); updateForm("neighborhood", ""); }}
                            options={[...CITIES_BY_COUNTRY[form.countryLiveIn], "Other"]}
                            placeholder="Select city"
                          />
                        ) : (
                          <TextInput value={form.city} onChange={(v) => { updateForm("city", v); updateForm("neighborhood", ""); }} placeholder="Type your city" />
                        )}
                      </div>
                      <div>
                        <SectionLabel>Neighborhood</SectionLabel>
                        {form.city && NEIGHBORHOODS_BY_CITY[form.city] ? (
                          <SelectWithOther
                            value={form.neighborhood}
                            onChange={(v) => updateForm("neighborhood", v)}
                            options={[...NEIGHBORHOODS_BY_CITY[form.city], "Other"]}
                            placeholder="Select neighborhood"
                          />
                        ) : (
                          <TextInput value={form.neighborhood} onChange={(v) => updateForm("neighborhood", v)} placeholder="e.g. West Village, Jardins, Shoreditch" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 1: Career */}
                  {formStep === 1 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <SectionLabel>Current Company</SectionLabel>
                        <TextInput value={form.company} onChange={(v) => updateForm("company", v)} placeholder="Company name" />
                      </div>
                      <div>
                        <SectionLabel>Current Industry</SectionLabel>
                        <SelectInput value={form.industry} onChange={(v) => updateForm("industry", v)} options={INDUSTRIES} placeholder="Select industry" />
                      </div>
                      <div>
                        <SectionLabel>Previous Industry</SectionLabel>
                        <SelectInput value={form.previousIndustry} onChange={(v) => updateForm("previousIndustry", v)} options={INDUSTRIES} placeholder="Select previous industry (if different)" />
                      </div>
                      <div>
                        <SectionLabel>Post-MBA Goals (select all that apply)</SectionLabel>
                        <MultiSelect options={POST_MBA} selected={form.postMba} onChange={(v) => updateForm("postMba", v)} />
                      </div>
                      <div>
                        <SectionLabel>Where do you want to be post-MBA? (region)</SectionLabel>
                        <MultiSelect options={POST_MBA_REGIONS} selected={form.postMbaRegion} onChange={(v) => updateForm("postMbaRegion", v)} />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Food */}
                  {formStep === 2 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <SectionLabel>Food & Drink Interests</SectionLabel>
                        <p style={{ fontSize: 13, color: "#888", marginTop: 0, marginBottom: 12 }}>What's your vibe?</p>
                        <MultiSelect options={FOOD_INTERESTS} selected={form.foodInterests} onChange={(v) => updateForm("foodInterests", v)} accent="#ea580c" />
                      </div>
                      <div>
                        <SectionLabel>Favorite restaurants & bars in your city</SectionLabel>
                        <TextInput value={form.favRestaurants} onChange={(v) => updateForm("favRestaurants", v)} placeholder="e.g. Carbone, Dante, Aska..." textarea />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Activities */}
                  {formStep === 3 && (
                    <div>
                      <SectionLabel>Activities & Sports</SectionLabel>
                      <p style={{ fontSize: 13, color: "#888", marginTop: 0, marginBottom: 12 }}>What do you do to stay active?</p>
                      <MultiSelect options={ACTIVITIES} selected={form.activities} onChange={(v) => updateForm("activities", v)} accent="#16a34a" />
                    </div>
                  )}

                  {/* Step 4: Social */}
                  {formStep === 4 && (
                    <div>
                      <SectionLabel>Social & Culture</SectionLabel>
                      <p style={{ fontSize: 13, color: "#888", marginTop: 0, marginBottom: 12 }}>How do you like to spend your free time?</p>
                      <MultiSelect options={SOCIAL_CULTURE} selected={form.socialCulture} onChange={(v) => updateForm("socialCulture", v)} accent="#7c3aed" />
                    </div>
                  )}

                  {/* Step 5: Learning */}
                  {formStep === 5 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <SectionLabel>Want to Learn / Explore</SectionLabel>
                        <MultiSelect options={LEARNING} selected={form.learning} onChange={(v) => updateForm("learning", v)} accent="#2563eb" />
                      </div>
                      <div>
                        <SectionLabel>Preferred Event Types</SectionLabel>
                        <MultiSelect options={EVENT_TYPES} selected={form.eventTypes} onChange={(v) => updateForm("eventTypes", v)} accent="#db2777" />
                      </div>
                    </div>
                  )}

                  {/* Step 6: Fun */}
                  {formStep === 6 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <SectionLabel>✨ Fun Fact about you</SectionLabel>
                        <TextInput value={form.funFact} onChange={(v) => updateForm("funFact", v)} placeholder="Something unexpected..." textarea />
                      </div>
                      <div>
                        <SectionLabel>📚 What do you want to do / try before the MBA?</SectionLabel>
                        <TextInput value={form.beforeMba} onChange={(v) => updateForm("beforeMba", v)} placeholder="Travel somewhere? Run a marathon? Launch something?" textarea />
                      </div>
                      <div>
                        <SectionLabel>🚀 Side Project or Business Idea</SectionLabel>
                        <TextInput value={form.sideProject} onChange={(v) => updateForm("sideProject", v)} placeholder="Anything you're building or exploring?" textarea />
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                    <button
                      onClick={() => setFormStep(Math.max(0, formStep - 1))}
                      disabled={formStep === 0}
                      style={{
                        padding: "10px 20px",
                        borderRadius: 10,
                        border: "1.5px solid #ddd",
                        background: "#fff",
                        color: formStep === 0 ? "#ccc" : "#555",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: formStep === 0 ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      ← Back
                    </button>
                    {formStep < FORM_STEPS.length - 1 ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        {editingId && (
                          <button
                            onClick={handleSubmit}
                            disabled={!form.name.trim() || !form.pin || form.pin.length < 4}
                            style={{
                              padding: "10px 20px",
                              borderRadius: 10,
                              border: "none",
                              background: (form.name.trim() && form.pin && form.pin.length >= 4) ? "#a31f34" : "#ccc",
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: 13,
                              cursor: (form.name.trim() && form.pin && form.pin.length >= 4) ? "pointer" : "not-allowed",
                              fontFamily: "inherit",
                            }}
                          >
                            Save ✓
                          </button>
                        )}
                        <button
                          onClick={() => setFormStep(formStep + 1)}
                          style={{
                            padding: "10px 20px",
                            borderRadius: 10,
                            border: "none",
                            background: "#1a1a2e",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          Next →
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={!form.name.trim() || !form.pin || form.pin.length < 4}
                        style={{
                          padding: "10px 24px",
                          borderRadius: 10,
                          border: "none",
                          background: (form.name.trim() && form.pin && form.pin.length >= 4) ? "#a31f34" : "#ccc",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: (form.name.trim() && form.pin && form.pin.length >= 4) ? "pointer" : "not-allowed",
                          fontFamily: "inherit",
                        }}
                      >
                        {editingId ? "Save Changes ✓" : "Submit Profile 🎉"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <PersonModal person={selectedPerson} onClose={() => setSelectedPerson(null)} onEdit={requestEdit} onDelete={requestDelete} />

      {/* PIN Prompt Modal */}
      {pinPrompt && (
        <div
          onClick={() => { setPinPrompt(null); setPinInput(""); setPinError(false); }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "28px 24px",
              maxWidth: 340,
              width: "100%",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>
              Enter your 4-digit PIN
            </div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
              To {pinPrompt.action} {pinPrompt.person.name}'s profile
            </div>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pinInput}
              onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4)); setPinError(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") handlePinSubmit(); }}
              autoFocus
              placeholder="• • • •"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: `1.5px solid ${pinError ? "#dc2626" : "#e0e0e0"}`,
                fontSize: 24,
                fontFamily: "'DM Sans', sans-serif",
                textAlign: "center",
                letterSpacing: 12,
                outline: "none",
                marginBottom: pinError ? 8 : 16,
                boxSizing: "border-box",
              }}
            />
            {pinError && (
              <div style={{ fontSize: 13, color: "#dc2626", marginBottom: 12, fontWeight: 600 }}>
                Wrong PIN. Try again.
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setPinPrompt(null); setPinInput(""); setPinError(false); }}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "1.5px solid #ddd",
                  background: "#fff",
                  color: "#555",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePinSubmit}
                disabled={pinInput.length < 4}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "none",
                  background: pinInput.length >= 4 ? "#a31f34" : "#ccc",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: pinInput.length >= 4 ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeletePerson && (
        <div
          onClick={() => setConfirmDeletePerson(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "28px 24px",
              maxWidth: 380,
              width: "100%",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
              Delete {confirmDeletePerson.name}'s profile?
            </div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
              This can't be undone.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setConfirmDeletePerson(null)}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "1.5px solid #ddd",
                  background: "#fff",
                  color: "#555",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #e8e8e8",
          padding: "24px 20px 32px",
          textAlign: "center",
          background: "#f8f7f4",
        }}
      >
        <div style={{ fontSize: 13, color: "#999", marginBottom: 6 }}>
          Built with ☕ by{" "}
          <span style={{ fontWeight: 700, color: "#1a1a2e" }}>Alexandre Haimenis</span>
        </div>
        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 10 }}>
          Spotted a bug? Have a suggestion? Hit me up 👇
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <a
            href="https://instagram.com/ahaimenis"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "inherit",
            }}
          >
            📸 @ahaimenis
          </a>
          <a
            href="https://www.linkedin.com/in/alexandre-haimenis/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              background: "#0A66C2",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "inherit",
            }}
          >
            💼 LinkedIn
          </a>
          <a
            href="sms:+13322695367"
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              background: "#333",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "inherit",
            }}
          >
            📱 +1 (332) 269-5367
          </a>
        </div>
      </div>
    </div>
  );
}
