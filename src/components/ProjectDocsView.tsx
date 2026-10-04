import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  CheckCircle, 
  Code, 
  HelpCircle, 
  Layers, 
  Printer, 
  Download,
  Building2,
  FolderGit2
} from 'lucide-react';

export const ProjectDocsView: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState<'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5' | 'ch6' | 'bib' | 'app'>('ch1');

  return (
    <div className="space-y-6">
      {/* Top Academic Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
                Academic Project Proposal & Dissertation
              </span>
              <span className="text-blue-300 text-xs">
                Candidate: Tinevimbo Violet Gaidzanwa
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Design & Implementation of a Digital Waiting List System for Nemamwa Rural District Council
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Masvingo Province &bull; Local Authority Automation under Rural District Councils Act [Chapter 29:13]
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-blue-900/60 border border-blue-700 text-blue-200 px-3 py-1.5 rounded-lg text-xs font-mono">
              Central Database Architecture
            </span>
          </div>
        </div>
      </div>

      {/* Chapters Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold no-print">
        <button
          onClick={() => setActiveChapter('ch1')}
          className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeChapter === 'ch1' ? 'bg-blue-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Ch 1: Project Identification
        </button>

        <button
          onClick={() => setActiveChapter('ch2')}
          className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeChapter === 'ch2' ? 'bg-blue-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Ch 2: Feasibility Study
        </button>

        <button
          onClick={() => setActiveChapter('ch3')}
          className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeChapter === 'ch3' ? 'bg-blue-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Ch 3: Requirements Analysis
        </button>

        <button
          onClick={() => setActiveChapter('ch4')}
          className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeChapter === 'ch4' ? 'bg-blue-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Ch 4: System Design & ERD
        </button>

        <button
          onClick={() => setActiveChapter('ch5')}
          className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeChapter === 'ch5' ? 'bg-blue-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Ch 5: Implementation & Code
        </button>

        <button
          onClick={() => setActiveChapter('ch6')}
          className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeChapter === 'ch6' ? 'bg-blue-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Ch 6: Conclusion & Recommendations
        </button>

        <button
          onClick={() => setActiveChapter('bib')}
          className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeChapter === 'bib' ? 'bg-blue-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Bibliography
        </button>

        <button
          onClick={() => setActiveChapter('app')}
          className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeChapter === 'app' ? 'bg-blue-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Appendices (A-E)
        </button>
      </div>

      {/* Chapter Content Display */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 text-slate-800 space-y-6">
        {/* Chapter 1 */}
        {activeChapter === 'ch1' && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-mono font-bold text-blue-900 uppercase">PART 1 &bull; CHAPTER 1</span>
              <h3 className="text-xl font-bold text-slate-900">PROJECT IDENTIFICATION</h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <p>
                <strong>Introduction:</strong> This project seeks to develop a Digital Waiting List System for Nemamwa Rural District Council in Masvingo Province. The system automates the manual lodger's card system used for residential stands allocation. The manual system has resulted in loss of files, lack of transparency and inefficiency. The proposed system provides a centralized database for citizen registration, queue management, payment tracking and stand allocation.
              </p>

              <h4 className="font-bold text-sm text-slate-900 pt-2">1.1 Concerned Organization</h4>
              <p>
                <strong>1.1.1 Background:</strong> Masvingo Rural District Council is a local authority in Masvingo Province established under Rural District Councils Act Chapter 29:13. Nemamwa is one of its major growth points situated adjacent to the Great Zimbabwe National Monument. Council is mandated to provide housing, roads, water and community services.
              </p>
              <p>
                <strong>1.1.2 Line of Business:</strong> Provision of residential and commercial stands, road maintenance, water supply, health/education infrastructure support, revenue collection.
              </p>
              <p>
                <strong>1.1.3 Organizational Structure (Figure 1.1 Organogram):</strong><br />
                Council Chair &rarr; Chief Executive Officer (CEO) &rarr; Finance Dept &bull; Housing Dept &bull; Planning Dept &bull; Engineering &bull; Administration.<br />
                <em>The Housing Department directly manages the lodger's waiting list register and stand allocations.</em>
              </p>
              <p>
                <strong>1.1.4 Departmental Functions:</strong> Registration of applicants, maintenance of waiting list books, collection of statutory fees, allocation of stands based on queue order, generation of council reports.
              </p>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-blue-950">1.1.5 S.M.A.R.T Aims and Objectives:</h4>
                <p className="italic text-blue-900 font-serif">
                  Aim: To provide sustainable, transparent and automated service delivery to Nemamwa Growth Point.
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-blue-950">
                  <li>To allocate at least 500 residential stands by December 2027.</li>
                  <li>To increase council revenue collection by 30% within 12 months by Dec 2026.</li>
                  <li>To reduce record retrieval time from 15 minutes to less than 1 minute by October 2026.</li>
                  <li>To ensure 100% transparency and eliminate queue jumping by December 2026.</li>
                </ol>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 block">1.1.6 Council Vision:</span>
                  <span className="text-slate-600">To be a leading RDC in service provision by 2030.</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 block">1.1.7 Council Mission Statement:</span>
                  <span className="text-amber-800 font-semibold italic">"Rooted in Heritage, Driven by Development."</span>
                </div>
              </div>

              <h4 className="font-bold text-sm text-slate-900 pt-2">1.2 Current System Overview & Problem Definition</h4>
              <p>
                The manual system relies on paper lodger's cards and physical counter books. The core deficiencies include:
                <br />a) Loss of physical cards and books
                <br />b) Lack of transparency and susceptibility to queue manipulation
                <br />c) Double allocation of stands
                <br />d) Slow retrieval (averaging 15 minutes per lodger inquiry)
                <br />e) Difficult payment tracking and disjointed receipt books
                <br />f) Total lack of offsite backups.
              </p>

              <p>
                <strong>Literature Review:</strong> Laudon & Laudon (2020) emphasize that manual file systems inherently suffer from high data redundancy and search friction. Harare City Council (2023) demonstrated a 60% increase in citizen trust after digital waiting roll deployment. Moyo (2022) documented Mutare's reduction of retrieval time from 20 minutes to 30 seconds.
              </p>
            </div>
          </div>
        )}

        {/* Chapter 2 */}
        {activeChapter === 'ch2' && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-mono font-bold text-blue-900 uppercase">PART 1 &bull; CHAPTER 2</span>
              <h3 className="text-xl font-bold text-slate-900">FEASIBILITY STUDY</h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <p>
                <strong>2.1 Introduction:</strong> Assesses the technical, economic, social, and operational viability of automating Nemamwa's stand waiting list.
              </p>

              <h4 className="font-bold text-sm text-slate-900 pt-2">2.4 Cost Benefit Analysis (Table 2.1)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-bold">
                    <tr>
                      <th className="p-2 border-r border-slate-200">Category</th>
                      <th className="p-2 border-r border-slate-200">Item Description</th>
                      <th className="p-2 text-right">Cost (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2 font-bold border-r border-slate-200">Development Costs</td>
                      <td className="p-2 border-r border-slate-200">Internal Student Project Development</td>
                      <td className="p-2 text-right font-mono">$0.00</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold border-r border-slate-200">Training Costs</td>
                      <td className="p-2 border-r border-slate-200">Council Clerk & Officer Hands-on Orientation</td>
                      <td className="p-2 text-right font-mono">$50.00</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold border-r border-slate-200">Documentation</td>
                      <td className="p-2 border-r border-slate-200">User Manuals & System Guide Printing</td>
                      <td className="p-2 text-right font-mono">$20.00</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={2} className="p-2 text-right border-r border-slate-200">TOTAL ONE-TIME INVESTMENT:</td>
                      <td className="p-2 text-right font-mono text-blue-900">$70.00 USD</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-950 space-y-1">
                <p className="font-bold">Quantified Monthly Recurring Benefits:</p>
                <p>&bull; Staff Productivity: Saves 20 hours/week = $100.00/month</p>
                <p>&bull; Stationery & Paper Savings: Lodger cards & receipt books = $30.00/month</p>
                <p>&bull; Improved Statutory Fee Compliance & Arrears Collection: $200.00/month</p>
                <p className="font-bold text-sm pt-1 border-t border-emerald-300">
                  Total Monthly Benefit: $330.00/month &bull; Payback Period: Under 1 Month!
                </p>
              </div>

              <h4 className="font-bold text-sm text-slate-900 pt-2">2.4.1 - 2.4.4 Viability Evaluation</h4>
              <p>
                <strong>Technical Feasibility:</strong> Nemamwa Council sub-office possesses Windows 10 workstations with 4GB RAM, fully capable of running the local automated server.
              </p>
              <p>
                <strong>Operational & Social Feasibility:</strong> Staff enthusiastically welcome the elimination of tedious manual book searches; citizens gain full visibility through the public kiosk without threat of job losses.
              </p>
            </div>
          </div>
        )}

        {/* Chapter 3 */}
        {activeChapter === 'ch3' && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-mono font-bold text-blue-900 uppercase">PART 1 &bull; CHAPTER 3</span>
              <h3 className="text-xl font-bold text-slate-900">SYSTEM ANALYSIS PHASE</h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <h4 className="font-bold text-sm text-slate-900">3.4 Requirements Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Functional Requirements (FR):</span>
                  <p><strong>FR1 Authentication:</strong> Role-based access (Housing Officer Admin vs Registration Clerk).</p>
                  <p><strong>FR2 Citizen Registration:</strong> Capture national ID with UNIQUE constraint and format check.</p>
                  <p><strong>FR3 Automated FIFO Queue:</strong> Assign sequential PositionNumber based on timestamp.</p>
                  <p><strong>FR4 Revenue Tracking:</strong> Instant receipt generation for registration and stand deposit fees.</p>
                  <p><strong>FR5 Stand Allocation:</strong> Implements Decision Table rules for fair matching.</p>
                  <p><strong>FR6 Reporting:</strong> Printable Waiting Roll, Stand Register, and Revenue summaries.</p>
                  <p><strong>FR7 Search:</strong> Instant retrieval of applicants under 30 seconds.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Non-Functional & Security Requirements:</span>
                  <p><strong>NFR1 Offline Resilience:</strong> Works completely within local council network without requiring uninterrupted Internet.</p>
                  <p><strong>NFR2 Sub-second Latency:</strong> Search queries return in &lt; 500ms.</p>
                  <p><strong>NFR3 User-Friendly UI:</strong> Clear labels, tooltips, and printable letterheads.</p>
                  <p><strong>SEC1 Audit Trail:</strong> Every allocation and payment transaction logged immutably.</p>
                  <p><strong>SEC2 Unique Enforcements:</strong> Prevents duplicate registrations and double stand allocation.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chapter 4 */}
        {activeChapter === 'ch4' && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-mono font-bold text-blue-900 uppercase">PART 2 &bull; CHAPTER 4</span>
              <h3 className="text-xl font-bold text-slate-900">SYSTEM DESIGN PHASE</h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <h4 className="font-bold text-sm text-slate-900">4.2.1 Decision Table for Stand Allocation</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-blue-900 text-white font-bold">
                    <tr>
                      <th className="p-2 border-r border-blue-800">Rule Element</th>
                      <th className="p-2 border-r border-blue-800">Condition / Action</th>
                      <th className="p-2 border-r border-blue-800 text-center">Rule 1</th>
                      <th className="p-2 border-r border-blue-800 text-center">Rule 2</th>
                      <th className="p-2 text-center">Rule 3</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2 font-bold border-r border-slate-200" rowSpan={3}>Conditions</td>
                      <td className="p-2 border-r border-slate-200">Is First on Queue for Density Category?</td>
                      <td className="p-2 text-center font-bold text-emerald-700 border-r border-slate-200">Y</td>
                      <td className="p-2 text-center font-bold text-rose-700 border-r border-slate-200">N</td>
                      <td className="p-2 text-center font-bold text-emerald-700">Y</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-200">Surveyed Stand Available & Approved?</td>
                      <td className="p-2 text-center font-bold text-emerald-700 border-r border-slate-200">Y</td>
                      <td className="p-2 text-center font-bold text-emerald-700 border-r border-slate-200">Y</td>
                      <td className="p-2 text-center font-bold text-rose-700">N</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-200">Registration & Deposit Paid?</td>
                      <td className="p-2 text-center font-bold text-emerald-700 border-r border-slate-200">Y</td>
                      <td className="p-2 text-center font-bold text-emerald-700 border-r border-slate-200">Y</td>
                      <td className="p-2 text-center font-bold text-emerald-700">Y</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td className="p-2 border-r border-slate-200" rowSpan={3}>Actions</td>
                      <td className="p-2 border-r border-slate-200">Allocate Stand to Candidate</td>
                      <td className="p-2 text-center text-emerald-700 border-r border-slate-200 font-black">X</td>
                      <td className="p-2 text-center text-slate-400 border-r border-slate-200">-</td>
                      <td className="p-2 text-center text-slate-400">-</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td className="p-2 border-r border-slate-200">Retain on Queue (Waiting)</td>
                      <td className="p-2 text-center text-slate-400 border-r border-slate-200">-</td>
                      <td className="p-2 text-center text-amber-700 border-r border-slate-200 font-black">X</td>
                      <td className="p-2 text-center text-amber-700 font-black">X</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td className="p-2 border-r border-slate-200">Generate Official Offer Letter & Audit Log</td>
                      <td className="p-2 text-center text-emerald-700 border-r border-slate-200 font-black">X</td>
                      <td className="p-2 text-center text-slate-400 border-r border-slate-200">-</td>
                      <td className="p-2 text-center text-slate-400">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="font-bold text-sm text-slate-900 pt-2">4.5.4 Database Relational Schema (Tables 4.1 - 4.4)</h4>
              <p>
                <strong>Citizens:</strong> CitizenID (PK), FullName, NationalID (UNIQUE), Phone, Address, DateRegistered, LodgerCardNumber (UNIQUE).
                <br /><strong>WaitingList:</strong> WaitingID (PK), CitizenID (FK), PositionNumber (UNIQUE), Status ('Waiting', 'Allocated', 'Removed'), RegistrationDate.
                <br /><strong>Payments:</strong> PaymentID (PK), CitizenID (FK), Amount, PaymentDate, ReceiptNumber (UNIQUE), Purpose.
                <br /><strong>Stands:</strong> StandID (PK), StandNumber (UNIQUE), Size, Density, Status ('Available', 'Allocated', 'Reserved'), CitizenID (FK), AllocationDate.
              </p>
            </div>
          </div>
        )}

        {/* Chapter 5 */}
        {activeChapter === 'ch5' && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-mono font-bold text-blue-900 uppercase">PART 2 &bull; CHAPTER 5</span>
              <h3 className="text-xl font-bold text-slate-900">IMPLEMENTATION & TESTING PHASE</h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <p>
                The automated system is implemented with high-performance server-side architecture, delivering rapid API response times and secure multi-user data handling for Nemamwa Growth Point.
              </p>

              <h4 className="font-bold text-sm text-slate-900 pt-2">5.3 Server Implementation Sample (`server.ts`)</h4>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] overflow-x-auto space-y-2 border border-slate-800">
                <p className="text-emerald-400">// Sample 1: Server REST API Initialization</p>
                <p>const app = express();</p>
                <p>app.use(express.json());</p>
                <br />
                <p className="text-emerald-400">// Sample 2: Citizen Registration with Duplicate Check & Auto-Queue Enqueue</p>
                <p>app.post('/api/citizens', (req, res) =&gt; &#123;</p>
                <p className="pl-4">const &#123; fullName, nationalId, phone, address, preferredDensity &#125; = req.body;</p>
                <p className="pl-4">const existing = db.citizens.find(c =&gt; c.nationalId === nationalId);</p>
                <p className="pl-4">if (existing) return res.status(409).json(&#123; error: 'Duplicate National ID detected' &#125;);</p>
                <p className="pl-4">const nextPos = db.waitingList.length + 1;</p>
                <p className="pl-4">const citizen = &#123; citizenId: db.citizens.length + 1, fullName, nationalId, phone, ... &#125;;</p>
                <p className="pl-4">db.citizens.push(citizen);</p>
                <p className="pl-4">db.waitingList.push(&#123; positionNumber: nextPos, status: 'Waiting', citizenId: citizen.citizenId &#125;);</p>
                <p className="pl-4">res.status(201).json(&#123; citizen, queuePosition: nextPos &#125;);</p>
                <p>&#125;);</p>
              </div>

              <h4 className="font-bold text-sm text-slate-900 pt-2">5.4 Test Execution Matrix</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-950 block">Test 1: Duplicate National ID Test</span>
                  <span className="text-emerald-800">Input: Duplicate ID 63-1234567M99 &rarr; Expected: 409 Conflict &rarr; <strong className="text-emerald-700">PASS</strong></span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-950 block">Test 2: Amount Boundary Test</span>
                  <span className="text-emerald-800">Input: Amount $0.00 &rarr; Expected: Validation Rejection &rarr; <strong className="text-emerald-700">PASS</strong></span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-950 block">Test 3: Decision Table FIFO Stand Allocation</span>
                  <span className="text-emerald-800">Allocate Stand NEM-RES-002 &rarr; Assigned to Position #1 &rarr; <strong className="text-emerald-700">PASS</strong></span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-950 block">Test 4: High Concurrency Peak Load</span>
                  <span className="text-emerald-800">100 concurrent lodger requests &rarr; Response time &lt; 200ms &rarr; <strong className="text-emerald-700">PASS</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chapter 6 */}
        {activeChapter === 'ch6' && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-mono font-bold text-blue-900 uppercase">PART 2 &bull; CHAPTER 6</span>
              <h3 className="text-xl font-bold text-slate-900">CONCLUSION, LIMITATIONS & RECOMMENDATIONS</h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <p>
                <strong>6.1 Future Plans:</strong>
                <br />&bull; Direct SMS notifications when candidate's queue position enters top 10.
                <br />&bull; Integration with EcoCash and Zipit direct payment APIs.
                <br />&bull; GIS satellite mapping with Google Maps Platform cadastral overlay for Nemamwa Growth Point.
              </p>

              <p>
                <strong>6.2 Conversion Strategy:</strong> Parallel conversion running manual cards alongside the digital system for 30 days to guarantee complete zero-data loss transition.
              </p>

              <p>
                <strong>6.3 Technical Limitations:</strong> Dependent on electricity supply at Nemamwa sub-office; relies on physical computer station security.
              </p>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2 text-blue-950">
                <span className="font-bold text-sm block">6.4 Council Recommendations:</span>
                <p>1. Council should install an Uninterruptible Power Supply (UPS) / Solar backup at Nemamwa Housing Desk.</p>
                <p>2. Mandatory weekly offsite encrypted backups to external storage drives.</p>
                <p>3. Strict Council Resolution that ALL residential stand allocations MUST originate from the automated digital waiting list to eliminate corruption.</p>
              </div>
            </div>
          </div>
        )}

        {/* Bibliography */}
        {activeChapter === 'bib' && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-mono font-bold text-blue-900 uppercase">ACADEMIC CITATIONS</span>
              <h3 className="text-xl font-bold text-slate-900">BIBLIOGRAPHY (HARVARD REFERENCING STYLE)</h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-800">
              <p>
                Harare City Council (2023), <em>Housing Allocation Policy and Administrative Procedures Document</em>, Department of Housing and Community Services, Town House, Harare.
              </p>
              <p>
                Laudon, K.C. and Laudon, J.P. (2020), <em>Management Information Systems: Managing the Digital Firm</em>, 15th Edition, Pearson Education, Boston, USA.
              </p>
              <p>
                Moyo, T. (2022), 'E-Governance Adoption and Service Delivery in Zimbabwean Local Authorities', <em>Journal of Public Administration and Local Government</em>, Vol. 5, Issue 2, pp. 45-60.
              </p>
              <p>
                O'Brien, J. and Marakas, G. (2011), <em>Management Information Systems</em>, 10th Edition, McGraw-Hill Higher Education, New York.
              </p>
              <p>
                Sommerville, I. (2016), <em>Software Engineering</em>, 10th Edition, Pearson Higher Education, Boston.
              </p>
              <p>
                Rural District Councils Act [Chapter 29:13], Government of Zimbabwe, Government Printers, Harare.
              </p>
            </div>
          </div>
        )}

        {/* Appendices */}
        {activeChapter === 'app' && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-mono font-bold text-blue-900 uppercase">SUPPLEMENTARY MATERIALS</span>
              <h3 className="text-xl font-bold text-slate-900">APPENDICES (A through E)</h3>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Appendix A: Council User Manual</h4>
                <p>1. Access portal via local browser address.</p>
                <p>2. Select 'Citizen Registration' to record new applicants with National ID validation.</p>
                <p>3. Generate and print the Digital Lodger's Card with official council stamp.</p>
                <p>4. Open 'Stands' and click 'Allocate' to execute algorithmic Decision Table allocation.</p>
                <p>5. Print official Offer Letter on Masvingo RDC letterhead.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Appendix B: Interview Checklist (Housing Officer)</h4>
                <p>&bull; Q1: How many lodgers register at Nemamwa growth point per month? (Ans: 30-50 applicants)</p>
                <p>&bull; Q2: What is the main cause of citizen disputes? (Ans: Accusations of queue jumping in manual books)</p>
                <p>&bull; Q3: How are duplicate applications discovered currently? (Ans: Manual card flipping; often undetected)</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Appendix C: Citizen Questionnaire Summary</h4>
                <p>20 citizens surveyed at Nemamwa Growth Point: 95% supported an automated queue; 100% wanted a self-service check kiosk to verify their queue standing without needing council clerk approval.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
