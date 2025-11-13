export const mockCompanies = [
  {
    id: 1,
    ticker: "ABBV",
    name: "AbbVie Inc.",
    marketCap: 285000000000,
    sector: "Pharmaceuticals"
  },
  {
    id: 2,
    ticker: "MRNA",
    name: "Moderna Inc.",
    marketCap: 42000000000,
    sector: "Biotechnology"
  },
  {
    id: 3,
    ticker: "REGN",
    name: "Regeneron Pharmaceuticals Inc.",
    marketCap: 95000000000,
    sector: "Biotechnology"
  },
  {
    id: 4,
    ticker: "VRTX",
    name: "Vertex Pharmaceuticals Inc.",
    marketCap: 115000000000,
    sector: "Biotechnology"
  },
  {
    id: 5,
    ticker: "BIIB",
    name: "Biogen Inc.",
    marketCap: 32000000000,
    sector: "Biotechnology"
  }
];

export const mockTrials = [
  {
    id: 1,
    companyId: 1,
    nctId: "NCT05678901",
    phase: "Phase 3",
    indication: "Rheumatoid Arthritis",
    design: "Randomized, Double-Blind, Placebo-Controlled",
    primaryEndpoint: "ACR50 Response at Week 24",
    enrollment: 800
  },
  {
    id: 2,
    companyId: 2,
    nctId: "NCT05789012",
    phase: "Phase 2",
    indication: "Melanoma",
    design: "Open-Label, Single-Arm",
    primaryEndpoint: "Objective Response Rate",
    enrollment: 150
  },
  {
    id: 3,
    companyId: 3,
    nctId: "NCT05890123",
    phase: "Phase 3",
    indication: "Age-Related Macular Degeneration",
    design: "Randomized, Double-Blind, Active-Controlled",
    primaryEndpoint: "Mean Change in BCVA at Month 12",
    enrollment: 950
  },
  {
    id: 4,
    companyId: 4,
    nctId: "NCT05901234",
    phase: "Phase 2",
    indication: "Cystic Fibrosis",
    design: "Randomized, Double-Blind, Placebo-Controlled",
    primaryEndpoint: "Absolute Change in ppFEV1 at Week 24",
    enrollment: 200
  },
  {
    id: 5,
    companyId: 5,
    nctId: "NCT06012345",
    phase: "Phase 3",
    indication: "Alzheimer's Disease",
    design: "Randomized, Double-Blind, Placebo-Controlled",
    primaryEndpoint: "CDR-SB Score Change at Week 78",
    enrollment: 1500
  }
];

export const mockEvents = [
  {
    id: 1,
    trialId: 1,
    companyId: 1,
    eventType: "PDUFA",
    eventDate: new Date("2025-03-15").toISOString(),
    description: "FDA PDUFA date for new RA treatment",
    status: "Upcoming"
  },
  {
    id: 2,
    trialId: 2,
    companyId: 2,
    eventType: "Data Readout",
    eventDate: new Date("2025-02-28").toISOString(),
    description: "Phase 2 melanoma trial interim analysis",
    status: "Upcoming"
  },
  {
    id: 3,
    trialId: 3,
    companyId: 3,
    eventType: "Advisory Committee",
    eventDate: new Date("2025-04-10").toISOString(),
    description: "FDA advisory committee meeting for AMD treatment",
    status: "Upcoming"
  },
  {
    id: 4,
    trialId: 4,
    companyId: 4,
    eventType: "Data Readout",
    eventDate: new Date("2025-05-20").toISOString(),
    description: "Phase 2 CF trial topline results",
    status: "Upcoming"
  },
  {
    id: 5,
    trialId: 5,
    companyId: 5,
    eventType: "Data Readout",
    eventDate: new Date("2025-06-30").toISOString(),
    description: "Phase 3 Alzheimer's trial primary endpoint data",
    status: "Upcoming"
  },
  {
    id: 6,
    trialId: 1,
    companyId: 1,
    eventType: "Data Readout",
    eventDate: new Date("2025-01-15").toISOString(),
    description: "Phase 3 RA trial final results presented",
    status: "Completed"
  }
];

export const mockAiAnalyses = [
  {
    id: 1,
    eventId: 1,
    summary: "AbbVie's PDUFA date for their novel JAK inhibitor in rheumatoid arthritis presents a significant catalyst. The Phase 3 trial met its primary endpoint with a 65% ACR50 response rate vs 40% placebo. Safety profile appears manageable with no new signals.",
    keyFactors: [
      "Strong Phase 3 efficacy data (65% ACR50 vs 40% placebo)",
      "Clean safety profile with no unexpected adverse events",
      "Large market opportunity in RA ($25B+ globally)",
      "Competitive landscape includes established JAK inhibitors",
      "FDA generally favorable toward RA therapies with proven efficacy"
    ],
    bullScenario: {
      probability: 70,
      priceTarget: 185,
      rationale: "FDA approval on PDUFA date with broad label, leading to strong market uptake",
      pricePath: [175, 176, 178, 180, 182, 184, 185, 185, 185, 185, 184, 183, 182, 182, 183, 184, 185, 186, 187, 187, 186, 185, 185, 185, 184, 183, 184, 185, 185, 185]
    },
    baseScenario: {
      probability: 25,
      priceTarget: 172,
      rationale: "Approval with some label restrictions or delayed by 1-2 months for additional data review",
      pricePath: [175, 174, 173, 172, 171, 170, 169, 170, 171, 172, 172, 173, 173, 172, 171, 171, 172, 173, 173, 172, 172, 172, 171, 171, 172, 172, 172, 172, 172, 172]
    },
    bearScenario: {
      probability: 5,
      priceTarget: 160,
      rationale: "Complete Response Letter (CRL) requiring additional trials or data",
      pricePath: [175, 172, 168, 165, 162, 160, 159, 160, 161, 162, 163, 164, 164, 163, 162, 161, 160, 160, 161, 162, 163, 163, 162, 161, 160, 160, 161, 161, 160, 160]
    },
    confidenceLevel: 85,
    generatedAt: new Date("2025-01-10").toISOString()
  },
  {
    id: 2,
    eventId: 2,
    summary: "Moderna's Phase 2 melanoma data readout could validate their personalized cancer vaccine platform. Early signals suggest promising ORR in combination with checkpoint inhibitors. This represents a potential paradigm shift in melanoma treatment.",
    keyFactors: [
      "Novel mRNA cancer vaccine mechanism",
      "Combination therapy with anti-PD-1 shows synergy in preclinical models",
      "Small sample size (n=150) limits statistical power",
      "Personalized approach may face manufacturing scalability challenges",
      "High unmet need in melanoma despite checkpoint inhibitor success"
    ],
    bullScenario: {
      probability: 40,
      priceTarget: 125,
      rationale: "ORR exceeds 60% in combination arm, strong durability signals, rapid Phase 3 initiation",
      pricePath: [95, 98, 102, 108, 115, 120, 125, 126, 125, 124, 123, 122, 123, 124, 125, 126, 125, 124, 123, 124, 125, 126, 125, 124, 123, 124, 125, 125, 125, 125]
    },
    baseScenario: {
      probability: 45,
      priceTarget: 100,
      rationale: "Modest ORR improvement (45-55%), requires additional optimization before Phase 3",
      pricePath: [95, 96, 97, 98, 99, 100, 101, 102, 102, 101, 100, 99, 99, 100, 101, 102, 102, 101, 100, 99, 99, 100, 101, 101, 100, 99, 100, 100, 100, 100]
    },
    bearScenario: {
      probability: 15,
      priceTarget: 75,
      rationale: "No meaningful benefit over standard checkpoint inhibitor monotherapy",
      pricePath: [95, 92, 88, 84, 80, 77, 75, 76, 77, 78, 79, 78, 77, 76, 75, 75, 76, 77, 78, 78, 77, 76, 75, 75, 76, 77, 76, 75, 75, 75]
    },
    confidenceLevel: 60,
    generatedAt: new Date("2025-01-11").toISOString()
  }
];

export const mockWatchlist = [
  {
    id: 1,
    userId: "demo-user",
    eventId: 1,
    addedAt: new Date("2025-01-05").toISOString()
  },
  {
    id: 2,
    userId: "demo-user",
    eventId: 2,
    addedAt: new Date("2025-01-08").toISOString()
  }
];

// Helper functions to simulate API responses
export const getCompanyById = (id: number) => {
  return mockCompanies.find(c => c.id === id);
};

export const getTrialById = (id: number) => {
  return mockTrials.find(t => t.id === id);
};

export const getEventById = (id: number) => {
  return mockEvents.find(e => e.id === id);
};

export const getEventsWithDetails = () => {
  return mockEvents.map(event => ({
    ...event,
    company: getCompanyById(event.companyId),
    trial: getTrialById(event.trialId),
    aiAnalysis: mockAiAnalyses.find(a => a.eventId === event.id)
  }));
};

export const getEventWithFullDetails = (id: number) => {
  const event = getEventById(id);
  if (!event) return null;
  
  return {
    ...event,
    company: getCompanyById(event.companyId),
    trial: getTrialById(event.trialId),
    aiAnalysis: mockAiAnalyses.find(a => a.eventId === event.id)
  };
};
