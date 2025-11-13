import { storage } from "./storage";
import type { InsertCompany, InsertEvent } from "@shared/schema";

export async function seedDatabase() {
  console.log("Seeding database with sample biotech data...");

  // Sample Companies
  const companies: InsertCompany[] = [
    {
      name: "BioNova Therapeutics",
      tickers: ["BNOV"],
      marketCap: "$2.4B",
      sector: "Oncology",
      website: "https://bionova.example.com",
    },
    {
      name: "GeneTech Solutions",
      tickers: ["GTSOL"],
      marketCap: "$5.8B",
      sector: "Gene Therapy",
      website: "https://genetech.example.com",
    },
    {
      name: "NeuroPharm Inc",
      tickers: ["NPHM"],
      marketCap: "$1.2B",
      sector: "Neurology",
      website: "https://neuropharm.example.com",
    },
    {
      name: "CardioLife Biotech",
      tickers: ["CLBT"],
      marketCap: "$3.6B",
      sector: "Cardiovascular",
      website: "https://cardiolife.example.com",
    },
    {
      name: "ImmunoCure Pharma",
      tickers: ["ICPH"],
      marketCap: "$4.2B",
      sector: "Immunology",
      website: "https://immunocure.example.com",
    },
  ];

  const createdCompanies = [];
  for (const company of companies) {
    const created = await storage.createCompany(company);
    createdCompanies.push(created);
  }

  console.log(`Created ${createdCompanies.length} companies`);

  // Sample Events
  const baseDate = new Date();
  const events: Omit<InsertEvent, 'companyId'>[] = [
    {
      title: "FDA Advisory Committee Meeting: BNV-401 for Advanced Melanoma",
      type: "advisory_committee",
      dateUtc: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      nctId: "NCT05234567",
      relatedTickers: ["BNOV"],
      status: "upcoming",
      therapeuticArea: "Oncology",
      description: "FDA Oncologic Drugs Advisory Committee will review BioNova's BNV-401, a novel checkpoint inhibitor for advanced melanoma treatment. Phase 3 trial showed 42% objective response rate.",
      sourceLinks: ["https://fda.gov/advisorycommittee/2025/melanoma"],
    },
    {
      title: "PDUFA Date: GeneTech's GT-2890 Gene Therapy for SMA",
      type: "pdufa",
      dateUtc: new Date(baseDate.getTime() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      nctId: "NCT05123456",
      relatedTickers: ["GTSOL"],
      status: "upcoming",
      therapeuticArea: "Rare Genetic Diseases",
      description: "FDA decision deadline for GT-2890, a one-time gene therapy for spinal muscular atrophy. Breakthrough therapy designation granted.",
      sourceLinks: ["https://fda.gov/pdufa/2025/sma-therapy"],
    },
    {
      title: "Phase 3 Data Readout: NP-5501 for Alzheimer's Disease",
      type: "readout",
      dateUtc: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      nctId: "NCT05345678",
      relatedTickers: ["NPHM"],
      status: "upcoming",
      therapeuticArea: "Neurology",
      description: "Top-line results from Phase 3 CLARITY trial evaluating NP-5501 in early Alzheimer's disease. Primary endpoint: cognitive decline measured by CDR-SB score.",
      sourceLinks: ["https://clinicaltrials.gov/NCT05345678"],
    },
    {
      title: "NDA Submission: CardioLife's CL-788 for Heart Failure",
      type: "nda_bla",
      dateUtc: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      nctId: "NCT05456789",
      relatedTickers: ["CLBT"],
      status: "upcoming",
      therapeuticArea: "Cardiovascular",
      description: "New Drug Application submission for CL-788, a novel SGLT2 inhibitor for chronic heart failure with reduced ejection fraction.",
      sourceLinks: ["https://cardiolife.example.com/press/nda-submission"],
    },
    {
      title: "Phase 2 Results: IC-2200 for Rheumatoid Arthritis",
      type: "phase_result",
      dateUtc: new Date(baseDate.getTime() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
      nctId: "NCT05567890",
      relatedTickers: ["ICPH"],
      status: "upcoming",
      therapeuticArea: "Immunology",
      description: "Interim Phase 2 data for IC-2200, a bi-specific antibody targeting IL-6 and TNF-alpha in moderate-to-severe rheumatoid arthritis patients.",
      sourceLinks: ["https://clinicaltrials.gov/NCT05567890"],
    },
    {
      title: "FDA Advisory Committee: BNV-305 Breast Cancer Therapy",
      type: "advisory_committee",
      dateUtc: new Date(baseDate.getTime() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
      nctId: "NCT05678901",
      relatedTickers: ["BNOV"],
      status: "upcoming",
      therapeuticArea: "Oncology",
      description: "Advisory committee review of BNV-305 antibody-drug conjugate for HER2-positive metastatic breast cancer. Fast track designation received.",
      sourceLinks: ["https://fda.gov/advisorycommittee/2025/breast-cancer"],
    },
    {
      title: "PDUFA Date: NeuroPharm's NP-4401 Parkinson's Treatment",
      type: "pdufa",
      dateUtc: new Date(baseDate.getTime() + 42 * 24 * 60 * 60 * 1000), // 42 days from now
      nctId: "NCT05789012",
      relatedTickers: ["NPHM"],
      status: "upcoming",
      therapeuticArea: "Neurology",
      description: "FDA action date for NP-4401, an oral dopamine agonist for early-stage Parkinson's disease. Priority review granted.",
      sourceLinks: ["https://fda.gov/pdufa/2025/parkinsons"],
    },
    {
      title: "Phase 3 Readout: GT-3100 Hemophilia B Gene Therapy",
      type: "readout",
      dateUtc: new Date(baseDate.getTime() + 49 * 24 * 60 * 60 * 1000), // 49 days from now
      nctId: "NCT05890123",
      relatedTickers: ["GTSOL"],
      status: "upcoming",
      therapeuticArea: "Rare Genetic Diseases",
      description: "Phase 3 HOPE-B trial results for GT-3100, a single-dose AAV gene therapy for hemophilia B. Primary endpoint: Factor IX activity levels.",
      sourceLinks: ["https://clinicaltrials.gov/NCT05890123"],
    },
  ];

  let eventCount = 0;
  for (let i = 0; i < events.length; i++) {
    const companyIndex = i % createdCompanies.length;
    const event = await storage.createEvent({
      ...events[i],
      companyId: createdCompanies[companyIndex].id,
    });
    eventCount++;
  }

  console.log(`Created ${eventCount} events`);
  console.log("Database seeding complete!");
}
