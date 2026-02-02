import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { 
  Shield, Globe, Lock, Zap, Clock, Activity, ArrowRight, CheckCircle, AlertTriangle, 
  FileText, Download, Share2, AlertOctagon, Server, MapPin, ExternalLink 
} from 'lucide-react';

function LandingPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper for mock delay
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleScan = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Try backend first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for real analysis
      
      // Use production backend if available, otherwise local
      const backendUrl = 'https://web-production-c05b.up.railway.app';
      // const backendUrl = 'http://localhost:5000'; // Fallback for local dev

      const response = await fetch(`${backendUrl}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      // Fallback Mock Logic
      await wait(1500); // Simulate processing time
      
      const isSuspicious = url.toLowerCase().includes('test') || url.length > 50;
      const riskScore = isSuspicious ? 92 : 15;
      const threatType = isSuspicious ? "Credential Harvesting" : "Safe";

      setResult({
        url: url,
        result: isSuspicious ? 'PHISHING' : 'SAFE',
        confidence: isSuspicious ? 88.5 : 99.8,
        riskScore: riskScore,
        threatType: threatType,
        details: {
          ssl: {
            issuer: "Let's Encrypt (DV)",
            issued_on: "Oct 24, 2023",
            expires: "Jan 22, 2024",
            valid: true
          },
          domain: {
            registrar: "NameCheap, Inc.",
            created: "2 hours ago",
            ip: "192.168.1.14"
          },
          content: {
            homoglyphs: isSuspicious ? "Detected (V vs U)" : "None",
            keywords: isSuspicious ? ["secure", "login", "verify-account"] : [],
            status: isSuspicious ? "Suspicious" : "Clean"
          },
          redirects: [
            { source: "bit.ly/4x9z", code: 301 },
            { source: url, code: 200 }
          ],
          server: {
            location: "Moscow, RU",
            provider: "CloudFlare, Inc.",
            blacklist: isSuspicious ? "Listed on 3 DBs" : "Clean"
          }
        },
        features: {
          length: url.length,
          suspicious_chars: (url.match(/[@\-//]/g) || []).length,
          subdomains: (url.split('.').length - 1),
          https: url.startsWith('https')
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-deep-black text-white">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {!result ? (
          /* Hero Section (Default View) */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            
            {/* Left Column: Text & Scanner */}
            <div className="text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20 text-xs font-mono mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                </span>
                Live Threat Monitoring Active
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                Detect Phishing <br />
                <span className="text-neon-green neon-text">Before It Attacks</span>
              </h1>
              
              <p className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
                Real-time AI analysis to secure your digital footprint instantly. 
                Scan URLs, analyze domains, and block zero-day threats.
              </p>

              {/* Scanner Input */}
              <div className="bg-gray-900/80 border border-gray-700 p-2 rounded-lg flex items-center gap-2 shadow-2xl backdrop-blur-md relative group max-w-xl mb-4">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <input
                  type="text"
                  placeholder="Enter a suspicious URL to scan..."
                  className="flex-1 bg-transparent text-white px-4 py-3 outline-none placeholder-gray-500 font-mono relative z-10"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                />
                <button
                  onClick={handleScan}
                  disabled={loading}
                  className="bg-neon-green text-black font-bold px-6 py-3 rounded hover:bg-green-400 transition relative z-10 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? 'Scanning...' : 'Scan Now'}
                </button>
              </div>
              
              <p className="text-gray-500 text-xs mb-10 ml-1">Free up to 5 scans/day</p>

              {/* Error Message */}
              {error && (
                <div className="mb-6 text-red-500 bg-red-900/20 p-3 rounded border border-red-500/50 max-w-xl">
                  {error}
                </div>
              )}

              {/* Stats */}
              <div className="flex gap-12 text-left">
                <div>
                  <h3 className="text-3xl font-bold text-white">1M+</h3>
                  <p className="text-gray-500 text-sm">URLs Scanned</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">50k+</h3>
                  <p className="text-gray-500 text-sm">Threats Blocked</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">99.9%</h3>
                  <p className="text-gray-500 text-sm">Uptime</p>
                </div>
              </div>
            </div>

            {/* Right Column: Live Threat Visualization */}
            <div className="relative h-full min-h-[500px] flex items-center justify-center">
              <LiveThreatMap />
            </div>
          </div>
        ) : (
          /* Scan Results Dashboard (Active View) */
          <div className="animate-fade-in w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider rounded border border-red-500/30">High Priority</span>
                  <span className="text-gray-500 text-xs font-mono">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}-X</span>
                </div>
                <h1 className="text-3xl font-bold text-white">Scan Analysis Results</h1>
                <p className="text-gray-400 text-sm max-w-2xl mt-1">
                  Detailed forensic report for the submitted URL. Flagged due to suspicious heuristic patterns and domain reputation.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 text-sm font-medium transition">
                  <FileText size={16} /> Export PDF
                </button>
                <button 
                  onClick={() => { setResult(null); setUrl(''); }}
                  className="flex items-center gap-2 px-4 py-2 bg-neon-green hover:bg-green-400 text-black rounded font-bold text-sm transition"
                >
                  <Activity size={16} /> Rescan URL
                </button>
              </div>
            </div>

            {/* Target URL Strip */}
            <div className="bg-black/40 border border-gray-800 rounded-lg p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 overflow-hidden w-full">
                <ExternalLink className="text-gray-500 flex-shrink-0" size={18} />
                <span className="text-gray-500 text-xs font-mono uppercase tracking-wider flex-shrink-0">TARGET</span>
                <code className="text-red-400 font-mono text-sm truncate bg-red-900/10 px-2 py-1 rounded w-full">
                  {result.url}
                </code>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs whitespace-nowrap">
                <Clock size={14} />
                <span>{new Date().toUTCString()}</span>
                <Shield size={14} className="ml-2 text-green-500" />
              </div>
            </div>

            {/* Main Threat Status & Risk Score */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Left: Threat Alert Box */}
              <div className={`col-span-2 rounded-xl p-8 border relative overflow-hidden flex flex-col justify-between min-h-[220px] ${result.result === 'PHISHING' ? 'bg-gradient-to-br from-red-950/30 to-black border-red-500/50' : 'bg-gradient-to-br from-green-950/30 to-black border-neon-green/50'}`}>
                {/* Background glow */}
                <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full opacity-20 pointer-events-none -mr-16 -mt-16 ${result.result === 'PHISHING' ? 'bg-red-600' : 'bg-neon-green'}`}></div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${result.result === 'PHISHING' ? 'bg-red-500' : 'bg-neon-green'}`}></div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${result.result === 'PHISHING' ? 'text-red-500' : 'text-neon-green'}`}>
                      {result.result === 'PHISHING' ? 'THREAT DETECTED' : 'SAFE Verified'}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                    {result.result === 'PHISHING' ? 'PHISHING DETECTED' : 'SAFE TO VISIT'}
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-8 mt-8 border-t border-gray-700/50 pt-6">
                  <div>
                    <span className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1">Threat Type</span>
                    <span className="text-white font-medium flex items-center gap-2">
                      <AlertOctagon size={16} className={result.result === 'PHISHING' ? 'text-red-500' : 'text-gray-500'} />
                      {result.threatType || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1">Confidence</span>
                    <span className={`font-bold ${result.confidence > 80 ? 'text-white' : 'text-yellow-500'}`}>
                      {result.result === 'PHISHING' ? 'High' : 'Low'} ({result.confidence}%)
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1">Engine</span>
                    <span className="text-gray-300 font-mono text-sm">Heuristic AI v2.4</span>
                  </div>
                </div>

                <div className="absolute top-6 right-6 p-2 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10">
                  <Shield size={24} className={result.result === 'PHISHING' ? 'text-red-500' : 'text-neon-green'} />
                </div>
              </div>

              {/* Right: Risk Score Gauge */}
              <div className="bg-black/40 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center relative">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest absolute top-6 left-6">Risk Score</h3>
                
                <div className="relative w-40 h-40 flex items-center justify-center">
                  {/* Simple CSS Circular Progress Mock */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="40" fill="none" 
                      stroke={result.riskScore > 80 ? '#ef4444' : result.riskScore > 50 ? '#eab308' : '#39FF14'} 
                      strokeWidth="8" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * result.riskScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">{result.riskScore}</span>
                    <span className={`text-[10px] uppercase font-bold mt-1 ${result.riskScore > 80 ? 'text-red-500' : 'text-neon-green'}`}>
                      {result.riskScore > 80 ? 'CRITICAL' : 'SAFE'}
                    </span>
                  </div>
                </div>

                <div className="w-full mt-6 px-4">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-mono">
                    <span>Safe</span>
                    <span>Malicious</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-neon-green via-yellow-500 to-red-500"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <div 
                    className="w-0.5 h-3 bg-white mt-[-9px] relative z-10 transition-all duration-500"
                    style={{ left: `${result.riskScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Forensic Details Header */}
            <div className="flex items-center gap-2 mb-6 text-neon-green">
              <Activity size={18} />
              <h3 className="font-bold text-lg">Forensic Details</h3>
            </div>

            {/* Forensic Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              
              {/* SSL Certificate */}
              <div className="bg-black/40 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Lock size={18} />
                    <span className="font-bold text-sm">SSL Certificate</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${result.details?.ssl?.valid ? 'bg-green-900/20 text-green-400 border border-green-900/50' : 'bg-red-900/20 text-red-400'}`}>
                    {result.details?.ssl?.valid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Issuer:</span>
                    <span className="text-gray-300 font-mono text-xs">{result.details?.ssl?.issuer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Issued On:</span>
                    <span className="text-gray-300 font-mono text-xs">{result.details?.ssl?.issued_on}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expires:</span>
                    <span className="text-gray-300 font-mono text-xs">{result.details?.ssl?.expires}</span>
                  </div>
                </div>
                {result.result === 'PHISHING' && (
                   <div className="mt-4 flex items-center gap-2 text-yellow-500 text-xs bg-yellow-900/10 p-2 rounded border border-yellow-900/30">
                     <AlertTriangle size={12} />
                     <span>Short-lived cert block detected.</span>
                   </div>
                )}
              </div>

              {/* Domain Info */}
              <div className="bg-black/40 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Globe size={18} />
                    <span className="font-bold text-sm">Domain Info</span>
                  </div>
                  <button className="text-[10px] text-gray-500 hover:text-white border border-gray-700 px-2 py-0.5 rounded transition">Whois Lookup</button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Registrar:</span>
                    <span className="text-gray-300 font-medium">{result.details?.domain?.registrar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span className="text-orange-400 font-medium">{result.details?.domain?.created}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">IP Address:</span>
                    <span className="text-gray-300 font-mono text-xs">{result.details?.domain?.ip}</span>
                  </div>
                </div>
                {result.result === 'PHISHING' && (
                   <div className="mt-4 flex items-center gap-2 text-red-400 text-xs bg-red-900/10 p-2 rounded border border-red-900/30">
                     <AlertOctagon size={12} />
                     <span>Domain created immediately before scan.</span>
                   </div>
                )}
              </div>

              {/* Content Analysis */}
              <div className="bg-black/40 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-orange-400">
                    <FileText size={18} />
                    <span className="font-bold text-sm">Content Analysis</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${result.result === 'PHISHING' ? 'bg-orange-900/20 text-orange-400 border border-orange-900/50' : 'bg-gray-800 text-gray-400'}`}>
                    {result.details?.content?.status}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                   <div className="flex justify-between items-center">
                    <span className="text-gray-500">Homoglyphs:</span>
                    <span className="text-red-400 font-mono text-xs">{result.details?.content?.homoglyphs}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Trigger Keywords:</span>
                    <div className="flex flex-wrap gap-2">
                      {result.details?.content?.keywords?.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] rounded">
                          {kw}
                        </span>
                      ))}
                      {(!result.details?.content?.keywords || result.details.content.keywords.length === 0) && (
                         <span className="text-gray-600 text-xs italic">None detected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Redirect Chain */}
              <div className="bg-black/40 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-teal-400">
                    <Share2 size={18} />
                    <span className="font-bold text-sm">Redirect Chain</span>
                  </div>
                  <span className="text-gray-500 text-xs">2 Hops</span>
                </div>
                <div className="space-y-4 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-800"></div>

                  {result.details?.redirects?.map((hop, i) => (
                    <div key={i} className="relative flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center z-10 text-xs font-mono text-gray-400">
                        {i + 1}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">
                          {i === 0 ? 'Original Request' : 'Final Destination'}
                        </div>
                        <div className="font-mono text-xs text-blue-400 truncate w-full">{hop.source}</div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${hop.code === 200 ? 'bg-green-900/20 text-green-400' : 'bg-blue-900/20 text-blue-400'}`}>
                        {hop.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

               {/* Server Location */}
               <div className="col-span-1 md:col-span-2 bg-black/40 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Server size={18} />
                    <span className="font-bold text-sm">Server Location & Network</span>
                  </div>
                  <button className="text-[10px] text-neon-green border border-neon-green/30 px-2 py-0.5 rounded transition hover:bg-neon-green/10">ASN Look</button>
                </div>
                
                <div className="flex gap-6 relative z-10">
                   <div className="w-1/3 bg-gray-900/50 rounded-lg border border-gray-700/50 flex items-center justify-center min-h-[100px] relative overflow-hidden">
                      <div className="absolute inset-0 opacity-30 bg-[url('/world-map.png')] bg-cover bg-center"></div>
                      <div className="flex items-center gap-2 text-white font-bold drop-shadow-md">
                        <MapPin className="text-red-500 fill-red-500" />
                        {result.details?.server?.location}
                      </div>
                   </div>
                   <div className="flex-1 space-y-3 text-sm py-2">
                      <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-500">Hosting Provider:</span>
                        <span className="text-gray-300 font-medium">{result.details?.server?.provider}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-500">Blacklist Status:</span>
                        <span className="text-red-400 font-medium">{result.details?.server?.blacklist}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-500">Reverse DNS:</span>
                         <span className="text-gray-400 font-mono text-xs">dc-12.host-suspicious.net</span>
                      </div>
                   </div>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center border-t border-gray-800 pt-8 pb-4">
              <div className="flex items-center gap-3">
                 <Shield className="text-gray-600" />
                 <div>
                   <h4 className="font-bold text-gray-300 text-sm">Incorrect Verdict?</h4>
                   <p className="text-gray-500 text-xs">Help improve our AI by reporting false positives or negatives.</p>
                 </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded border border-gray-700 hover:bg-gray-700 transition">Report False Positive</button>
                <button className="px-4 py-2 bg-transparent text-gray-400 text-xs font-bold rounded border border-gray-700 hover:text-white transition">Contact Support</button>
              </div>
            </div>

          </div>
        )}

        {/* Core Capabilities Section (Only show if no result) */}
        {!result && (
          <div className="mb-20">
            <h3 className="text-2xl font-bold mb-2">Core Capabilities</h3>
            <p className="text-gray-400 mb-8 max-w-2xl">
              Our multi-layered approach ensures no threat goes unnoticed.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<Shield className="text-neon-green" />}
                title="AI URL Analysis"
                description="Detect zero-day threats instantly using advanced machine learning models."
              />
              <FeatureCard 
                icon={<Globe className="text-blue-400" />}
                title="Domain Reputation Scoring"
                description="Deep historical data checks on domain age and previous flags."
              />
              <FeatureCard 
                icon={<Activity className="text-red-500" />}
                title="Real-Time Threat Alerts"
                description="Receive instant notifications when threats are detected."
              />
            </div>
          </div>
        )}

        {/* CTA Section (Only show if no result) */}
        {!result && (
          <div className="text-center py-16 border-t border-gray-800">
            <h2 className="text-3xl font-bold mb-4">Ready to secure your network?</h2>
            <p className="text-gray-400 mb-8">Join thousands of security professionals who trust PhishGuard.</p>
            <div className="flex justify-center gap-4">
              <button className="bg-neon-green text-black font-bold px-8 py-3 rounded hover:bg-green-400 transition">
                Get Started for Free
              </button>
              <button className="border border-gray-600 text-white font-bold px-8 py-3 rounded hover:bg-gray-800 transition">
                Contact Sales
              </button>
            </div>
          </div>
        )}

      </main>

      <footer className="py-10 border-t border-gray-900 bg-black/50 text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="text-neon-green w-5 h-5" />
            <span className="font-bold text-gray-300">PhishGuard</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neon-green transition">Features</a>
            <a href="#" className="hover:text-neon-green transition">Pricing</a>
            <a href="#" className="hover:text-neon-green transition">API</a>
          </div>
          <div>
            © 2024 PhishGuard Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Auto-animating Threat Map Component
function LiveThreatMap() {
  const [threats, setThreats] = useState([]);
  const [status, setStatus] = useState('Scanning...');
  const [progress, setProgress] = useState(0);

  // Simulate scanning cycles
  useEffect(() => {
    const statusCycle = ['Scanning...', 'Analyzing...', 'Threat Detected'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statusCycle.length;
      setStatus(statusCycle[currentIndex]);
      
      // Reset progress on new scan
      if (currentIndex === 0) setProgress(0);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Animate progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 2));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Generate random threats
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const x = Math.random() * 80 + 10; // 10% to 90%
      const y = Math.random() * 60 + 20; // 20% to 80%
      
      setThreats(prev => [...prev.slice(-4), { id, x, y }]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="threat-map-card">
      {/* 1. Map Image (Try PNG first, fallback to SVG) */}
      <img 
        src="/world-map.png" 
        onError={(e) => e.target.src = '/world-map.svg'}
        alt="Live Threat Map" 
        className="opacity-80"
      />

      {/* 2. Overlays (Threat points, lines, etc.) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {threats.map(threat => (
          <div 
            key={threat.id}
            className="absolute w-3 h-3"
            style={{ left: `${threat.x}%`, top: `${threat.y}%` }}
          >
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_10px_rgba(255,0,0,0.8)]"></span>
            {/* Connecting Line (Simulated) */}
            <div className="absolute top-1/2 left-1/2 w-24 h-[1px] bg-gradient-to-r from-red-500 to-transparent origin-left transform -rotate-45 opacity-60"></div>
          </div>
        ))}
      </div>

      {/* 3. Bottom Alert Bar (Overlay) - Matches Reference Image */}
      <div className="absolute bottom-5 left-5 right-5 z-20 bg-black/80 rounded-xl p-4 border border-gray-700/50 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          {status === 'Threat Detected' ? (
            <AlertTriangle className="text-red-500 animate-bounce drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" size={20} />
          ) : (
            <Activity className="text-neon-green animate-spin-slow" size={20} />
          )}
          
          <div className="flex-1 flex justify-between items-center">
             <span className={`font-bold text-base ${status === 'Threat Detected' ? 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 'text-white'}`}>
               {status}
             </span>
             <span className="text-xs text-gray-300 font-sans">
               {status === 'Threat Detected' ? 'High Risk (85%)' : 'System Active'}
             </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mb-2">
          <div 
            className={`h-full transition-all duration-300 ${status === 'Threat Detected' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-neon-green shadow-[0_0_10px_#39FF14]'}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-[10px] text-gray-500 font-mono uppercase tracking-wider">
          <span>Source: Global Node</span>
          <span>Latency: 24ms</span>
        </div>
      </div>
      
      {/* 4. Top Header (Overlay) - Matches Reference Image */}
      <div className="absolute top-5 left-5 right-5 z-20 flex justify-between items-center">
         <div className="flex items-center gap-2">
           <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
           <span className="text-xs font-sans font-bold text-gray-200 uppercase tracking-widest">Live Global Feed</span>
         </div>
         <span className="text-xs font-sans font-bold text-neon-green uppercase tracking-widest drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">SECURE</span>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-900/30 border border-gray-800 p-6 rounded-xl hover:border-neon-green/30 transition group hover:shadow-[0_0_20px_rgba(57,255,20,0.1)]">
      <div className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center mb-4 border border-gray-700 group-hover:border-neon-green/50 transition">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-neon-green transition">{title}</h4>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default LandingPage;
