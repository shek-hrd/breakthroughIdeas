const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ============================================================
   IDEAS SPHERE — universal ball mindmap engine
   dataset schema: { meta, themes:[{id,name,color}], nodes:[{id,th,kind,t,s,o,repo,path,f,tags,g,p,h,conf}], edges:[[a,b,rel,why]] }
   ============================================================ */

const GH = "https://github.com/shek-hrd";
const PG = "https://shek-hrd.github.io/";

const HUB = {
  meta: {
    title: "shek-hrd — GitHub Ideas Sphere",
    subtitle: "37 public repos · ideas extracted and interconnected · idea-sphere/v1",
    source: GH,
    generated: "2026-11-19",
  },
  themes: [
    { id: "ai", name: "AI & Agents", color: "#8b5cf6" },
    { id: "mining", name: "Compute & Mining", color: "#f59e0b" },
    { id: "trade", name: "Trading & Markets", color: "#f97316" },
    { id: "p2p", name: "P2P, Chat & Dating", color: "#3b82f6" },
    { id: "games", name: "Games & 3D", color: "#10b981" },
    { id: "web", name: "Web Tools & Capture", color: "#06b6d4" },
    { id: "data", name: "Data, Encoding & Vision", color: "#ec4899" },
    { id: "sys", name: "Systems & Hardware", color: "#ef4444" },
    { id: "fin", name: "Finance & Collecting", color: "#a3e635" },
    { id: "meta", name: "Meta & Archives", color: "#94a3b8" },
  ],
  nodes: [
    /* --- AI & Agents --- */
    { id: "peacefulLLM", th: "ai", kind: "repo", t: "Peaceful LLM", s: "AI proxy & testing hub with a 5-provider fallback chain (Groq, OpenAI, Together, Hugging Face, Ollama), email session links and XOR-encrypted client data.", o: "One-stop resilient AI access with no backend and no registration.", repo: "peacefulLLM", f: ["index.html", "app.js", "admin.html", "README.md", "API.md", "DEPLOYMENT.md"], tags: ["llm", "proxy", "fallback", "auth"], g: GH + "/peacefulLLM", p: PG + "peacefulLLM/", h: "https://peaceful-llm.vercel.app", conf: "high" },
    { id: "peaceful-pionbot", th: "ai", kind: "sub", t: "pionbot — trading bot prompts", s: "Prompt/rules folder inside peacefulLLM holding Pionex bot instructions and user prompts.", o: "Feed AI-generated trading-bot instructions toward the Pionex repos.", repo: "peacefulLLM", path: "pionbot", f: ["pionbot/user-prompts.md", "pionbot/.zencoder/rules/repo.md"], tags: ["prompts", "pionex"], g: GH + "/peacefulLLM/blob/main/pionbot/user-prompts.md", conf: "high" },
    { id: "aiconclave", th: "ai", kind: "repo", t: "AI Conclave", s: "Multi-model AI conclave console: parallel models (Puter, Pollinations, OpenAI, Anthropic, Gemini...) with a CORS-bridged fetch chain (puter.net.fetch → Pollinations → simulated) and SVG orchestration grid.", o: "Run many AI models in one keyless browser page.", repo: "AIConclavebyMeta-", f: ["index.html (pages site, 7.5k)"], tags: ["puter", "cors", "multi-model"], g: GH + "/AIConclavebyMeta-", p: PG + "AIConclavebyMeta-/", conf: "high" },
    { id: "kilo-ai", th: "ai", kind: "repo", t: "Kilo Code Instructions (Lite)", s: "Installable VSCode extension (.vsix) that packages 1M-token-optimized instructions for Kilo Code with Code Supernova.", o: "Turn AI instruction sets into a one-click IDE extension.", repo: "kilo-code-AI-instructions", f: ["EXTENSION_README.md", "src/ai-instructions.md", "kilo-code-instructions-lite-1.0.0.vsix"], tags: ["vscode", "instructions"], g: GH + "/kilo-code-AI-instructions", p: PG + "kilo-code-AI-instructions/", conf: "high" },
    /* --- Compute & Mining --- */
    { id: "mineAI", th: "mining", kind: "repo", t: "Fair-Trade AI Mining", s: "Browser mining simulation that runs only while the AI processes a request; processing time is inversely tied to hashrate. Web Workers + hardware detection.", o: "Prove a fair-exchange model: computational contribution pays for AI answers.", repo: "mineAI", f: ["index.html", "script.js", "README.md"], tags: ["fair-trade", "webrtc-free", "workers"], g: GH + "/mineAI", p: PG + "mineAI/", conf: "high" },
    { id: "minepoolie", th: "mining", kind: "repo", t: "Minepoolie — Monero mining platform", s: "Autonomous Monero mining dashboard, miner, runner orchestration, per-runner deploy packages, diagnostics and test suites; real xmrig verified at ~410–450 H/s on AMD EPYC. Built from long AI-agent session logs kept in the repo.", o: "Self-deploying multi-runner mining infrastructure driven entirely by conversation workflows.", repo: "minepoolie", f: ["AIinstructions.md", "history.md", "NEXT_CHAT_TESTING.md", "TESTING_BENCHMARKING_SUMMARY.md", "src/runner.js"], tags: ["monero", "xmrig", "agents"], g: GH + "/minepoolie", conf: "high" },
    /* --- Trading & Markets --- */
    { id: "pioneer", th: "trade", kind: "repo", t: "Pionex Grid (pioneer branch line)", s: "Pionex Grid control UI plus pionex_local.py and agent.html — an AI agent layer for Pionex bot automation. Default branch: kilo/firm-matrix-42p.", o: "Automate Pionex grid-bot creation locally and through an agent.", repo: "pioneer", f: ["index.html", "agent.html", "pionex_local.py"], tags: ["pionex", "grid-bot", "agent"], g: GH + "/pioneer/tree/kilo/firm-matrix-42p", conf: "high" },
    { id: "pionier", th: "trade", kind: "repo", t: "Pionier", s: "\"Pionex bot creation automation\" — the live Pionex Grid page, sibling/variant of the pioneer repo.", o: "Publish the Pionex automation front-end.", repo: "pionier", f: ["index.html", "_worker.js"], tags: ["pionex", "variant"], g: GH + "/pionier", p: PG + "pionier/", conf: "high" },
    { id: "magicarpet", th: "trade", kind: "repo", t: "BTC Streaming Curves", s: "Family of demos streaming BTC price into progressive multi-resolution curved-line rendering (qwen/chatgpt/claude variants, qvid).", o: "Emulate server-side progressive streaming and multiresolution encoding for live market data.", repo: "magicarpet", f: ["qwen-btc-streaming-curve.html", "qstream.htm", "chatgpt.htm", "claude.htm"], tags: ["btc", "streaming", "canvas"], g: GH + "/magicarpet", p: PG + "magicarpet/", conf: "high" },
    /* --- P2P, Chat & Dating --- */
    { id: "chatter", th: "p2p", kind: "repo", t: "Decentralized Chatter", s: "Browser-only decentralized chat: memorable 14-char identity stamps, simulated WebRTC mesh, blockchain-structured message integrity, LRU cache, admin console.", o: "Serverless resilient messaging where each node contributes to the network.", repo: "chatter", f: ["README.md", "decentralized-chat.html", "bin/admin-console.html"], tags: ["webrtc", "blockchain", "stamps"], g: GH + "/chatter", p: PG + "chatter/", conf: "high" },
    { id: "ciphp2pchat", th: "p2p", kind: "repo", t: "P2P Encrypted Chat", s: "Lightweight end-to-end P2P-encrypted chat; ECDH keys persisted in IndexedDB, minimal relay and ping helpers.", o: "Smallest possible privacy-first chat between two browsers.", repo: "ciphp2pchat", f: ["index.html", "crystal-chat.html", "relay"], tags: ["ecdh", "indexeddb"], g: GH + "/ciphp2pchat", p: PG + "ciphp2pchat/", conf: "high" },
    { id: "dateherenow", th: "p2p", kind: "repo", t: "Network Dating", s: "WebRTC dating app: discover and connect with people on your network, profile cards, match notifications, signaling-server status light.", o: "Dating over direct peer connections instead of a platform.", repo: "dateherenow", f: ["index.html", "app.js", "server/"], tags: ["webrtc", "dating"], g: GH + "/dateherenow", p: PG + "dateherenow/", conf: "high" },
    { id: "datehere", th: "p2p", kind: "repo", t: "Dating Signaling Server", s: "\"network-dating-signaler\" — Socket.IO switchboard that only introduces two WebRTC clients, forwards offers/answers/candidates, stores no user data, with health endpoint for Render hosting.", o: "Companion backend that makes dateherenow run; disappears from the conversation after intro.", repo: "datehere", f: ["server/server.js", "server/package.json"], tags: ["socket.io", "signaling"], g: GH + "/datehere", conf: "high" },
    /* --- Games & 3D --- */
    { id: "tarotdungeon", th: "games", kind: "repo", t: "Dragon's Nest — Tarot Dungeon", s: "3D multiplayer dungeon (Three.js + Socket.IO) where a 62-card tarot deck reshapes rooms by symbolism, with grandma-voice narration (Web Speech API). v2 iteration included.", o: "Educational tarot immersion through gameplay.", repo: "tarotdungeon", f: ["README.md", "v2/README.md", "index.html"], tags: ["threejs", "tarot", "multiplayer"], g: GH + "/tarotdungeon", p: PG + "tarotdungeon/", conf: "high" },
    { id: "littleskies", th: "games", kind: "repo", t: "Little Prince Skies", s: "Planet-hopping canvas platformer: walk, jump, sword-pointing, teleport to other planets.", o: "A contemplative micro-planet world you traverse like the book.", repo: "littleprinceskies", f: ["index.html", "js/planet.js", "js/prince.js"], tags: ["canvas", "platformer"], g: GH + "/littleprinceskies", p: PG + "littleprinceskies/", conf: "high" },
    { id: "chessboat", th: "games", kind: "repo", t: "ChessBoat — 3D Chess", s: "Full-rule 3D/2D browser chess: castling, en passant, promotion, drag/click/keyboard input, undo/redo, auto-save, FPS monitor.", o: "One-file polished chess across input methods and touch.", repo: "chessboat", f: ["README.md", "chess-engine.js", "chess-ui.js"], tags: ["chess", "3d"], g: GH + "/chessboat", p: PG + "chessboat/", conf: "high" },
    { id: "rocketz", th: "games", kind: "repo", t: "Rocketz", s: "Rocket arcade game with a live GitHub Pages page (source bundle hosted on the Pages deployment, default tree not readable).", o: "Arcade fun published directly.", repo: "rocketz", tags: ["arcade"], g: GH + "/rocketz", p: PG + "rocketz/", conf: "unread-page-live" },
    { id: "ballbounce", th: "games", kind: "repo", t: "Ball Bounce Multiplayer", s: "Multiplayer ball-bounce page live on GitHub Pages; default branch listing is empty, content served via Pages.", o: "Quick multiplayer physics toy.", repo: "ballbouncemultiplayer", tags: ["multiplayer", "physics"], g: GH + "/ballbouncemultiplayer", p: PG + "ballbouncemultiplayer/", conf: "unread-page-live" },
    { id: "gomultiplayer", th: "games", kind: "repo", t: "Go Multiplayer", s: "Sparse multiplayer game page, live on GitHub Pages; repo tree not readable.", o: "Multiplayer board/arcade experiment.", repo: "gomultiplayer", tags: ["multiplayer"], g: GH + "/gomultiplayer", p: PG + "gomultiplayer/", conf: "unread-page-live" },
    { id: "gameplatform", th: "games", kind: "repo", t: "Game Platform", s: "3 MB JavaScript game-platform bundle; contents not read in this pass (flag medium confidence).", o: "Shared hub/foundation for games.", repo: "gameplatform", tags: ["platform"], g: GH + "/gameplatform", conf: "med" },
    { id: "gamedesk", th: "games", kind: "repo", t: "Game Desk (placeholder)", s: "Empty scaffold — only .github workflow files.", o: "Reserved slot.", repo: "gamedesk", tags: ["placeholder"], g: GH + "/gamedesk", conf: "high" },
    { id: "presentstrae", th: "games", kind: "repo", t: "3D Professional Studio", s: "Presentation studio in 3D, four model-generated implementations kept separate (deeps.htm, grox.htm, mistral.htm, ms.htm).", o: "Compare AI-built 3D presentation studios side by side.", repo: "presentstrae", f: ["deeps.htm", "grox.htm", "mistral.htm", "ms.htm"], tags: ["3d", "presentation"], g: GH + "/presentstrae", p: PG + "presentstrae/", conf: "high" },
    /* --- Web Tools & Capture --- */
    { id: "rap", th: "web", kind: "repo", t: "Rapture — Capture & AI Analysis", s: "Screen capture and recording tool with AI analysis (Gemini/OpenAI/Claude providers, Puter), TTS readout, local + cloud storage, gallery. Repo description verbatim: \"toužjevono\".", o: "Explain anything on your screen by capturing then asking AI.", repo: "rap", f: ["index.html", "4blind/", "crypto-donation-widget.html", "oldone/README.md"], tags: ["screencapture", "puter", "ai"], g: GH + "/rap", p: PG + "rap/", conf: "high" },
    { id: "rap4blind", th: "web", kind: "sub", t: "Rapture Accessible (for blind users)", s: "Independent sub-app in rap/4blind: screen capture driven by voice commands with ARIA/screen-reader support.", o: "Make screen-capture + AI usable without vision.", repo: "rap", path: "4blind", f: ["4blind/index.html"], tags: ["a11y", "voice"], g: GH + "/rap/blob/main/4blind/index.html", conf: "high" },
    { id: "rapdonation", th: "web", kind: "sub", t: "Crypto Donation Widget", s: "Embeddable collapsible donation widget (one include before </html>).", o: "Monetize free side tools without a backend.", repo: "rap", path: "crypto-donation-widget.html", f: ["crypto-donation-widget.html"], tags: ["widget", "crypto"], g: GH + "/rap/blob/main/crypto-donation-widget.html", conf: "high" },
    { id: "instweb", th: "web", kind: "repo", t: "Instweb — AI Builder Hub", s: "Hub of many no-code AI-builder app iterations (aibuild*.html family) plus deployed-domains/deployed-urls logs.", o: "Generate and host small web apps from AI prompts instantly.", repo: "instweb", f: ["aibuild.html", "aibuild/aibuild_final.html", "deployed-domains.txt"], tags: ["no-code", "ai-build"], g: GH + "/instweb", p: PG + "instweb/", conf: "high" },
    { id: "textweb", th: "web", kind: "repo", t: "Smart HTML Fetcher (textweb)", s: "PHP proxy emulating text browsers (lynx, w3m, elinks, browsh, carbonyl) with real-time renderer switching and clickable numbered links.", o: "Read the modern web as clean text.", repo: "textweb", f: ["ver9claude.htm"], tags: ["proxy", "php", "textmode"], g: GH + "/textweb", p: PG + "textweb/", conf: "high" },
    { id: "dlvideosaudio", th: "web", kind: "repo", t: "Download Videos/Audio", s: "Extract audio from any video file completely in the browser.", o: "Local-first media conversion without uploads.", repo: "downloadVideosAudio", f: ["index.html"], tags: ["media", "offline-first"], g: GH + "/downloadVideosAudio", p: PG + "downloadVideosAudio/", conf: "high" },
    { id: "litmap", th: "web", kind: "repo", t: "Litmap", s: "Small JavaScript app; contents not read in this pass (flag medium confidence).", o: "Unclear — pending extraction.", repo: "litmap", tags: ["extraction-pending"], g: GH + "/litmap", conf: "med" },
    /* --- Data, Encoding & Vision --- */
    { id: "pistorage", th: "data", kind: "repo", t: "Pi Storage", s: "Concept: π (or e) as ultimate storage — every numeric sequence exists in π, so a payload is encoded as (numeric base, constant, start offset, length) plus encoder/decoder UIs. Subfolder also hosts solver pages.", o: "Represent arbitrary data by position, not by storing it.", repo: "pistorage", f: ["pistorage descr.html", "index.html"], tags: ["pi", "encoding"], g: GH + "/pistorage", p: PG + "pistorage/", conf: "high" },
    { id: "pistorage-math", th: "data", kind: "sub", t: "Math Solver Suite", s: "Separate solver experiments inside pistorage: fremsol, fremathsolver, mathgpt, mymathsolver, qwenarchim.", o: "Compare AI-built math solvers (Archimedes-style).", repo: "pistorage", path: "fremsol.htm", f: ["fremsol.htm", "mathgpt.htm", "mymathsolver.htm", "qwenarchim.htm"], tags: ["solvers", "ai-variants"], g: GH + "/pistorage/blob/main/fremsol.htm", conf: "high" },
    { id: "unitoken", th: "data", kind: "repo", t: "Unicode Token Database", s: "Searchable database assigning translations/tokens to Unicode characters (unicodeData.json).", o: "Address meaning with minimal token space.", repo: "unitoken", f: ["index.html", "script.js", "unicodeData.json"], tags: ["unicode", "tokens"], g: GH + "/unitoken", p: PG + "unitoken/", conf: "high" },
    { id: "hexaimage", th: "data", kind: "repo", t: "HexaImage", s: "Reinterprets CCD orthogonal sensor pixels into hexagonal grid format via 3×3 sampling windows; multiple AI-built variants kept apart (claude, calude, clauhexmage, hexamage).", o: "Explore hexagonal image formats for better sampling.", repo: "hexaimage", f: ["index.html", "hexaimage.js"], tags: ["ccd", "hex-grid", "image"], g: GH + "/hexaimage", p: PG + "hexaimage/", conf: "high" },
    { id: "extractmap", th: "data", kind: "repo", t: "Extractmap", s: "Large (18 MB) extraction-to-map experiment with a live Pages page; full contents not read in this pass.", o: "Extract structure from content and render it as a navigable map.", repo: "extractmap", tags: ["extraction", "map"], g: GH + "/extractmap", p: PG + "extractmap/", conf: "unread-page-live" },
    /* --- Systems & Hardware --- */
    { id: "gxos0", th: "sys", kind: "repo", t: "GxOS — graphics-chip OS", s: "Real-mode MBR bootloader → 32-bit VGA Mode 13h kernel with a windowing system and a bytecode GPU-emulation layer; USB MBR deployment script; research into PTX/SASS/GCN and flashable-NIC-BIOS translation.", o: "An OS for graphic chips and controllers, portable via USB.", repo: "gxos0", f: ["README.md", "next.md", "deploy.ps1", "src/boot", "src/kernel", "src/apps"], tags: ["bootloader", "gpu", "osdev"], g: GH + "/gxos0", conf: "high" },
    { id: "ennea", th: "sys", kind: "repo", t: "Enneapyrochronon", s: "Implementation concept of a 9-atom quantum reservoir computing system, inspired by Chen et al. (PRL 2026, \"nine atoms outperform a thousands-node network\"). Empty placeholder repo.", o: "Quantum reservoir computing in few atoms.", repo: "Enneapyrochronon", tags: ["quantum", "reservoir"], g: GH + "/Enneapyrochronon", conf: "high" },
    /* --- Finance & Collecting --- */
    { id: "savemyars", th: "fin", kind: "repo", t: "Save My Ass", s: "React demo that triages a difficult financial situation step by step (\"tool to help solve financial situation\").", o: "Guided financial rescue checklist.", repo: "savemyars", f: ["index.html", "savemyass_improved.js"], tags: ["finance", "guide"], g: GH + "/savemyars", p: PG + "savemyars/", conf: "high" },
    { id: "coinoresent", th: "fin", kind: "repo", t: "Coin Collection Manager", s: "Numismatics manager: coin cards, obverse/reverse images, draggable annotations, MS-70 grading, multi-scenario valuation, JSON/CSV/PDF export.", o: "Professional-grade collection cataloguing on GitHub Pages.", repo: "coinoresent", f: ["README.md", "index.html", "script.js"], tags: ["coins", "catalog"], g: GH + "/coinoresent", p: PG + "coinoresent/", conf: "high" },
    /* --- Meta & Archives --- */
    { id: "breakthrough", th: "meta", kind: "repo", t: "Breakthrough Ideas", s: "\"shekhrd's projects - breakthrough Ideas\" portfolio page plus archives; repo motto: \"Let's make it all easier - invent, innovate, and share freely\".", o: "Showcase and archive of all ideas in one place.", repo: "breakthroughIdeas", f: ["index.html", "old/", "zen/"], tags: ["portfolio", "archive"], g: GH + "/breakthroughIdeas", p: PG + "breakthroughIdeas/", conf: "high" },
    { id: "meta-zen", th: "meta", kind: "sub", t: "Zen Portfolio (optimized)", s: "Optimized portfolio version in breakthroughIdeas/zen with user stamps, nicknames and an expandable session/access log.", o: "Portfolio that records who touched it.", repo: "breakthroughIdeas", path: "zen/claude_portfolio.html", f: ["zen/claude_portfolio.html"], tags: ["portfolio", "logging"], g: GH + "/breakthroughIdeas/blob/main/zen/claude_portfolio.html", conf: "high" },
    { id: "meta-archives", th: "meta", kind: "sub", t: "Conversation Export Archive", s: "Raw AI chat exports kept in breakthroughIdeas/old (claude.htm, claudelast.htm, zenkimi.htm, ContKimik2b.htm, index snapshots).", o: "Preserve the conversations that produced the projects.", repo: "breakthroughIdeas", path: "old", f: ["old/claude.htm", "old/claude_portfolio.html", "old/zenkimi.htm", "old/ContKimik2b.htm"], tags: ["chat-exports"], g: GH + "/breakthroughIdeas/blob/main/old/claude.htm", conf: "high" },
    { id: "meta-stamp", th: "meta", kind: "sub", t: "Stamp + Session Logging idea", s: "Written instruction (old/uprav.txt): user enters nickname + stamp, comments aligned nick-left/stamp-right, and each session logs precise trace: location, pathway, latency, cookies.", o: "Identity + forensic-grade access log for portfolio projects.", repo: "breakthroughIdeas", path: "old/uprav.txt", f: ["old/uprav.txt"], tags: ["identity", "logging"], g: GH + "/breakthroughIdeas/blob/main/old/uprav.txt", conf: "high" },
    { id: "projects", th: "meta", kind: "repo", t: "Projects (placeholder)", s: "Empty placeholder repo.", o: "Reserved.", repo: "projects", tags: ["placeholder"], g: GH + "/projects", conf: "high" },
    { id: "sensei", th: "meta", kind: "repo", t: "Sensei (fresh)", s: "Created 2026-11-18, no content yet.", o: "Reserved / incoming.", repo: "sensei", tags: ["placeholder"], g: GH + "/sensei", conf: "high" },
    /* --- Concepts (clever interconnections) --- */
    { id: "concept-faircompute", th: "mining", kind: "concept", t: "Concept: Fair-trade compute", s: "One reciprocity principle: users contribute CPU cycles proportional to AI service, from simulated fair-trade mining up to real xmrig runners.", o: "A shared-compute economy across your AI tools.", tags: ["concept"], conf: "high" },
    { id: "concept-switchboard", th: "p2p", kind: "concept", t: "Concept: Disappearing switchboard", s: "Servers exist only to introduce peers and hold no data — dating signaler, chat relay, game lobbies, dungeon multiplayer.", o: "Minimum-server architecture for every P2P app.", tags: ["concept", "webrtc"], conf: "high" },
    { id: "concept-encode", th: "data", kind: "concept", t: "Concept: Position-as-data", s: "Data addressed by where it lies, not stored: π offsets, unicode tokens, hex grids, extracted maps.", o: "One encoding philosophy behind apparently unrelated repos.", tags: ["concept", "encoding"], conf: "high" },
    { id: "concept-keyless", th: "ai", kind: "concept", t: "Concept: Keyless AI chains", s: "Fallback chains that keep AI usable in a browser with no API keys: puter.net.fetch → Pollinations → local; provider rotation in peacefulLLM; Puter in Rapture.", o: "Never let a missing key block AI usage.", tags: ["concept", "puter"], conf: "high" },
  ],
  edges: [
    ["peacefulLLM", "aiconclave", "shares", "keyless multi-model access + fallback chains"],
    ["peacefulLLM", "peaceful-pionbot", "contains", "pionbot folder lives inside peacefulLLM"],
    ["peaceful-pionbot", "pioneer", "guides", "bot prompts feed the Pionex automation layer"],
    ["pioneer", "pionier", "variant", "same Pionex Grid app, two repos"],
    ["pionier", "magicarpet", "shares", "live crypto data UIs"],
    ["kilo-ai", "aiconclave", "shares", "AI instructions / orchestration infrastructure"],
    ["mineAI", "minepoolie", "extends", "simulation → real xmrig runners"],
    ["concept-faircompute", "mineAI", "unifies", ""],
    ["concept-faircompute", "minepoolie", "unifies", ""],
    ["concept-switchboard", "datehere", "unifies", ""],
    ["concept-switchboard", "dateherenow", "unifies", ""],
    ["concept-switchboard", "ciphp2pchat", "unifies", ""],
    ["concept-switchboard", "chatter", "unifies", ""],
    ["datehere", "dateherenow", "companion", "dedicated signaling server for Network Dating"],
    ["chatter", "ciphp2pchat", "shares", "browser-only encrypted chat, two takes"],
    ["chatter", "dateherenow", "shares", "WebRTC peer discovery"],
    ["tarotdungeon", "littleskies", "shares", "narrative 3D worlds"],
    ["tarotdungeon", "chatter", "shares", "Socket.IO multiplayer layer"],
    ["chessboat", "presentstrae", "shares", "interactive 3D interfaces"],
    ["gomultiplayer", "ballbounce", "shares", "multiplayer page demos"],
    ["gameplatform", "gamedesk", "sibling", "platform hub vs reserved desk"],
    ["rap", "dlvideosaudio", "shares", "browser-only media capture/conversion"],
    ["rap", "rap4blind", "contains", "accessible variant kept separate"],
    ["rap", "rapdonation", "contains", "donation widget kept separate"],
    ["aiconclave", "rap", "shares", "Puter.js bridging"],
    ["concept-keyless", "aiconclave", "unifies", ""],
    ["concept-keyless", "peacefulLLM", "unifies", ""],
    ["concept-keyless", "rap", "unifies", ""],
    ["textweb", "aiconclave", "related", "text-mode readability of AI-heavy pages"],
    ["instweb", "kilo-ai", "related", "AI-generated tooling pipelines"],
    ["concept-encode", "pistorage", "unifies", ""],
    ["concept-encode", "unitoken", "unifies", ""],
    ["concept-encode", "hexaimage", "unifies", ""],
    ["concept-encode", "extractmap", "unifies", ""],
    ["pistorage", "unitoken", "related", "token-addressed representations of data"],
    ["hexaimage", "unitoken", "related", "alternative spatial encodings"],
    ["pistorage", "pistorage-math", "contains", "solver suite kept separate from storage concept"],
    ["gxos0", "ennea", "extremes", "bare-metal GPU OS ↔ 9-atom quantum compute"],
    ["coinoresent", "savemyars", "shares", "money organization under pressure"],
    ["breakthrough", "meta-zen", "contains", "optimized portfolio"],
    ["breakthrough", "meta-archives", "contains", "chat-export archive"],
    ["meta-stamp", "meta-zen", "specifies", "stamp + session log written for the portfolio"],
    ["meta-stamp", "chatter", "resonates", "the same stamp identity idea used for chat"],
    ["meta-archives", "minepoolie", "feeds", "session logs → AIinstructions.md workflow"],
  ],
};

function layout(nodes, edges, themes) {
  // hierarchical globe: themes are continents, ideas are states/cities on circular discs
  // near-related ideas pull together, less-related ones drift apart
  const N = nodes.length;
  if (!N) return {};
  const rest = Math.sqrt((4 * Math.PI) / Math.max(6, N)) * 0.95; // natural spacing between "cities"
  const GOLD = 2.399963229728653;
  const tidList = ((themes || []).map((t) => t.id)).concat(["__orphan"]);
  const A = {}; // continent anchor directions
  const T = tidList.length;
  tidList.forEach((tid, i) => {
    const y = 1 - (2 * (i + 0.5)) / T;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = i * GOLD;
    A[tid] = [Math.cos(t) * r, y, Math.sin(t) * r];
  });
  const discBasis = {};
  tidList.forEach((tid) => {
    const a = A[tid];
    const up = Math.abs(a[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
    let e1 = [a[1] * up[2] - a[2] * up[1], a[2] * up[0] - a[0] * up[2], a[0] * up[1] - a[1] * up[0]];
    const L1 = Math.max(1e-6, Math.hypot(e1[0], e1[1], e1[2]));
    e1 = [e1[0] / L1, e1[1] / L1, e1[2] / L1];
    const e2 = [a[1] * e1[2] - a[2] * e1[1], a[2] * e1[0] - a[0] * e1[2], a[0] * e1[1] - a[1] * e1[0]];
    discBasis[tid] = [e1, e2];
  });
  const groups = {};
  nodes.forEach((n) => { const k = A[n.th] ? n.th : "__orphan"; (groups[k] = groups[k] || []).push(n); });
  const P = []; const ids = []; const TOF = {};
  tidList.forEach((tid) => {
    const list = groups[tid]; if (!list || !list.length) return;
    const [e1, e2] = discBasis[tid]; const a = A[tid];
    list.forEach((n, j) => {
      // one-line hash: same idea always lands on the same scattered spot (stars, not lattice)
      let hs = 2166136261;
      for (let q = 0; q < n.id.length; q++) { hs ^= n.id.charCodeAt(q); hs = Math.imul(hs, 16777619) >>> 0; }
      const jr = ((hs % 1000) / 1000) - 0.5;
      const rho = rest * 1.35 * Math.sqrt((j + 0.5) / list.length) * (1 + jr * 0.26);
      const th = j * GOLD + jr * 0.6;
      const ox = (e1[0] * Math.cos(th) + e2[0] * Math.sin(th)) * rho;
      const oy = (e1[1] * Math.cos(th) + e2[1] * Math.sin(th)) * rho;
      const oz = (e1[2] * Math.cos(th) + e2[2] * Math.sin(th)) * rho;
      const L = Math.max(1e-6, Math.hypot(a[0] + ox, a[1] + oy, a[2] + oz));
      P.push([(a[0] + ox) / L, (a[1] + oy) / L, (a[2] + oz) / L]);
      ids.push(n.id); TOF[n.id] = tid;
    });
  });
  const idx = {}; ids.forEach((id, i) => idx[id] = i);
  const links = [];
  (edges || []).forEach((e) => {
    if (!Array.isArray(e)) return;
    const a = idx[e[0]], b = idx[e[1]];
    if (a === undefined || b === undefined || a === b) return;
    links.push([a, b]);
  });
  const closer = (p, q, f, F, i, j) => {
    const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2];
    F[i][0] += dx * f; F[i][1] += dy * f; F[i][2] += dz * f;
    F[j][0] -= dx * f; F[j][1] -= dy * f; F[j][2] -= dz * f;
  };
  for (let it = 0; it < 110; it++) {
    const damp = 0.5 * (1 - it / 110) + 0.05;
    const F = P.map(() => [0, 0, 0]);
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const dx = P[i][0] - P[j][0], dy = P[i][1] - P[j][1], dz = P[i][2] - P[j][2];
      const chord = Math.max(1e-4, Math.hypot(dx, dy, dz));
      if (chord < rest * 0.82) {
        const f = ((rest * 0.82 - chord) / chord) * 0.45 * damp;
        closer(P[i], P[j], -f, F, i, j);
      }
    }
    links.forEach(([i, j]) => {
      const dx = P[j][0] - P[i][0], dy = P[j][1] - P[i][1], dz = P[j][2] - P[i][2];
      const chord = Math.max(1e-4, Math.hypot(dx, dy, dz));
      if (chord > rest * 1.25) closer(P[i], P[j], Math.min(0.5, ((chord - rest * 1.25) / chord) * 0.8 * damp), F, i, j);
    });
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      if (TOF[ids[i]] === TOF[ids[j]]) {
        const dx = P[j][0] - P[i][0], dy = P[j][1] - P[i][1], dz = P[j][2] - P[i][2];
        const chord = Math.max(1e-4, Math.hypot(dx, dy, dz));
        if (chord > rest * 1.8) closer(P[i], P[j], 0.10 * damp, F, i, j);
      }
    }
    for (let i = 0; i < N; i++) {
      const nx = P[i][0] + F[i][0] * damp, ny = P[i][1] + F[i][1] * damp, nz = P[i][2] + F[i][2] * damp;
      const L = Math.max(1e-6, Math.hypot(nx, ny, nz));
      P[i] = [nx / L, ny / L, nz / L];
    }
  }
  const out = {};
  ids.forEach((id, i) => {
    out[id] = { x: P[i][0], y: P[i][1], z: P[i][2], lon: Math.atan2(P[i][0], P[i][2]) };
  });
  return out;
}

/* ---------- breakthroughIdeas styling layer ---------- */

const BI_CSS = `
@keyframes bi-gradient {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes bi-fade {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes bi-twinkle {from{opacity:.7}to{opacity:1}}
@keyframes bi-ghost {0%,100%{opacity:.14}50%{opacity:.34}}
.bi-node{transition:box-shadow .55s ease, opacity .4s ease}
.bi-title{background:linear-gradient(45deg,#bfe9d4,#6ee7b7,#9be3c3);background-size:200% 200%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:bi-gradient 4s ease infinite;font-weight:300}
.bi-serif{font-family:Georgia,'Iowan Old Style','Palatino Linotype','Book Antiqua',serif;letter-spacing:.02em}
.bi-tabfont{font-family:Candara,Optima,'Trebuchet MS','Segoe UI',sans-serif;letter-spacing:.035em;font-style:normal}
.bi-fade{animation:bi-fade .5s ease both}
html,body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}
input[type=range]{accent-color:#34d399}
`;

const DEFAULT_CONFIG = {
  nodeScale: 0.55,
  linkAlpha: 0.16,
  keywordLines: true,
  nodeLabels: true,
  miniDesc: true,
  backNodes: false,
  autoSpin: 0.0016,
  idleMs: 3200,
  inertia: 0.93,
};

/* ---------- Config panel ---------- */

function Slider({ label, value, min, max, step, onChange, fmt }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-[10px] text-white/50">
        {label}<span className="font-mono text-white/40">{fmt ? fmt(value) : value}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full" />
    </label>
  );
}

function Switch({ label, value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} className="flex items-center gap-1.5 text-[11px] text-white/60 hover:text-white">
      <span className={"inline-flex h-3.5 w-6 items-center rounded-full px-0.5 transition " + (value ? "bg-emerald-500/60" : "bg-white/15")}>
        <span className={"h-2.5 w-2.5 rounded-full bg-white transition-transform " + (value ? "translate-x-2.5" : "")} />
      </span>
      {label}
    </button>
  );
}

function ConfigPanel({ config, setConfig }) {
  const set = (k, v) => setConfig((c) => ({ ...c, [k]: v }));
  return (
    <div className="space-y-2 rounded-xl border border-white/20 bg-black/75 p-3 backdrop-blur">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">ball configuration</p>
      <Slider label="node size" value={config.nodeScale} min={0.4} max={1.8} step={0.05} onChange={(v) => set("nodeScale", v)} />
      <Slider label="line faintness" value={config.linkAlpha} min={0.05} max={0.8} step={0.01} onChange={(v) => set("linkAlpha", v)} />
      <Slider label="auto-spin speed" value={config.autoSpin * 1000} min={0} max={6} step={0.2} onChange={(v) => set("autoSpin", v / 1000)} />
      <Slider label="drag inertia" value={config.inertia} min={0.7} max={0.99} step={0.01} onChange={(v) => set("inertia", v)} />
      <Slider label="idle auto-expand (ms)" value={config.idleMs} min={800} max={8000} step={200} onChange={(v) => set("idleMs", v)} />
      <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
        <Switch label="keywords on lines (active edge)" value={config.keywordLines} onChange={(v) => set("keywordLines", v)} />
        <Switch label="node names visible" value={config.nodeLabels !== false} onChange={(v) => set("nodeLabels", v)} />
        <Switch label="descriptions under names" value={config.miniDesc} onChange={(v) => set("miniDesc", v)} />
        <Switch label="back-side nodes" value={config.backNodes} onChange={(v) => set("backNodes", v)} />
      </div>
    </div>
  );
}

/* ---------- Ball ---------- */

function rotateToTarget(rx, ry, target) {  const dRy = Math.atan2(Math.sin(target.ry - ry), Math.cos(target.ry - ry));
  const dRx = target.rx !== undefined ? target.rx - rx : 0;
  return { ry: ry + dRy * 0.06, rx: rx + dRx * 0.06, done: Math.abs(dRy) < 0.012 && Math.abs(dRx) < 0.012 };
}

function Ball({ dataset, config, focusId, hoverId, setHover, setFocus, apiRef, muted, pinned, centerLift }) {
  const { nodes, edges, themes } = dataset;
  const themeMap = useMemo(() => { const m = {}; themes.forEach((t) => m[t.id] = t); return m; }, [themes]);
  const nodesById = useMemo(() => { const m = {}; nodes.forEach((n) => m[n.id] = n); return m; }, [nodes]);
  const edgeList = useMemo(() => edges.filter((e) => Array.isArray(e) && nodesById[e[0]] && nodesById[e[1]]), [edges, nodesById]);
  const coord = useMemo(() => layout(nodes, edgeList, themes), [nodes, edgeList, themes]);

  const [rot, setRot] = useState({ rx: -0.3, ry: 0.4 });
  const rotRef = useRef(rot); rotRef.current = rot;
  const [zoom, setZoom] = useState(1.05);
  const [dims, setDims] = useState({ w: 800, h: 560 });
  const vel = useRef({ x: 0, y: config.autoSpin });
  const target = useRef(null);
  const dragRef = useRef(null);
  const dragDelta = useRef({ x: 0, y: 0 });
  const pointers = useRef(new Map());
  const pinchBase = useRef(null);
  const lastMove = useRef({ dx: 0, dy: 0, t: 0 });
  const lastAct = useRef(Date.now());
  const holdUntil = useRef(0);
  const pinnedRef = useRef(pinned); pinnedRef.current = pinned;
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const cfgRef = useRef(config); cfgRef.current = config;
  const focusRef = useRef(focusId); focusRef.current = focusId;
  const nodesRef = useRef(nodes); nodesRef.current = nodes;
  const coordRef = useRef(coord); coordRef.current = coord;
  const dimsRef = useRef(dims); dimsRef.current = dims;
  const zoomRef = useRef(zoom); zoomRef.current = zoom;
  // vertical centre offset: with the panel docked below, the sphere rides higher to reduce overlap
  const cs = Math.max(0, Math.min(130, (centerLift || 0) * dims.h));
  const csRef = useRef(0); csRef.current = cs;

  const act = useCallback(() => { lastAct.current = Date.now(); }, []);

  // expose api: rotateTo(nodeId), rotateToTheme(themeId)
  useEffect(() => {
    if (!apiRef) return;
    const aim = (x, y, z, tilt) => {
      const L = Math.max(1e-6, Math.hypot(x, y, z));
      const nx = x / L, ny = y / L, nz = z / L;
      const ry = Math.atan2(-nx, nz);
      const z1 = -nx * Math.sin(ry) + nz * Math.cos(ry);
      target.current = { ry, rx: Math.max(-1.45, Math.min(1.45, Math.atan2(ny, Math.max(0.05, z1)) * (tilt || 1))) };
      vel.current = { x: 0, y: 0 };
    };
    apiRef.current = {
      rotateTo: (id) => { const c = coord[id]; if (c) aim(c.x, c.y, c.z, 1); },
      rotateToTheme: (thid) => {
        let sx = 0, sy = 0, sz = 0, k = 0;
        nodesRef.current.forEach((n) => { const c = coord[n.id]; if (c && n.th === thid) { sx += c.x; sy += c.y; sz += c.z; k++; } });
        if (k) aim(sx, sy, sz, 0.55);
      },
      // screen position of a node right now (for the floating panel's gentle avoidance)
      nodeScreenPos: (id) => {
        const c = coordRef.current[id]; if (!c) return null;
        const d = dimsRef.current; const R = Math.min(d.w * 0.5, d.h * 0.78) * zoomRef.current;
        const { rx, ry } = rotRef.current;
        const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
        const x = c.x * cy + c.z * sy;
        const z1 = -c.x * sy + c.z * cy;
        const y = c.y * cx - z1 * sx;
        const z = c.y * sx + z1 * cx;
        return { x: d.w / 2 + x * R, y: d.h / 2 - csRef.current + y * R, z };
      },
    };
  }, [coord, apiRef]);

  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const ro = new ResizeObserver(() => setDims({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setDims({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf, prev = performance.now();
    const loop = (now) => {
      const dt = Math.min(50, now - prev); prev = now;
      const f = Math.min(2.5, Math.max(0.2, dt / 16.7));
      const dd = dragDelta.current;
      if ((dd.x || dd.y) && dragRef.current) {
        const mx = dd.x, my = dd.y;
        dd.x = 0; dd.y = 0;
        setRot((r) => ({ rx: Math.max(-1.45, Math.min(1.45, r.rx - my * 0.0045)), ry: r.ry + mx * 0.0045 }));
      }
      if (!dragRef.current) {
        if (target.current) {
          setRot((r) => {
            const n = rotateToTarget(r.rx, r.ry, target.current);
            if (n.done) { target.current = null; vel.current.y = cfgRef.current.autoSpin * 0.4; vel.current.x = 0; }
            return { rx: Math.max(-1.45, Math.min(1.45, n.rx)), ry: n.ry };
          });
        } else {
          const v = vel.current;
          v.x *= Math.pow(cfgRef.current.inertia, f);
          if (Date.now() > holdUntil.current) v.y += (cfgRef.current.autoSpin - v.y) * 0.008 * f;
          v.y *= Math.pow(0.985, f);
          if (Math.abs(v.x) < 0.0004) v.x = 0;
          setRot((r) => ({ rx: Math.max(-1.45, Math.min(1.45, r.rx + v.x * f)), ry: r.ry + v.y * f }));
        }
      }
      if (!dragRef.current) {
        // one node always shows its details: the frontmost, live while the ball turns
        let best = null, bz = -2;
        const { rx, ry } = rotRef.current;
        const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
        nodesRef.current.forEach((n) => {
          const c = coordRef.current[n.id]; if (!c) return;
          const x = c.x * cy + c.z * sy;
          const z1 = -c.x * sy + c.z * cy;
          const y = c.y * cx - z1 * sx;
          const z = c.y * sx + z1 * cx;
          if (z > bz) { bz = z; best = n.id; }
        });
        if (best && !pinnedRef.current && best !== focusRef.current) setFocus(best, true);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [coord, setFocus]);

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const { w, h } = dims;
    if (!w) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = w * dpr; cv.height = h * dpr;
    const ctx = cv.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    const R = Math.min(w * 0.5, h * 0.78) * zoom;
    const cxp = w / 2, cyp = h / 2 - Math.max(0, Math.min(130, (centerLift || 0) * h));
    const { rx, ry } = rot;
    const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
    const proj = (pt) => {
      const x = pt.x * cy + pt.z * sy;
      const z1 = -pt.x * sy + pt.z * cy;
      const y = pt.y * cx - z1 * sx;
      const z = pt.y * sx + z1 * cx;
      return { sx: cxp + x * R, sy: cyp + y * R, z };
    };
    const drawEdge = (a, b, rel, hot) => {
      if (!coord[a] || !coord[b]) return;
      const pa = proj(coord[a]), pb = proj(coord[b]);
      const vis = Math.min(pa.z, pb.z) > -0.1 || config.backNodes;
      if (!vis && !hot) return;
      const ta = themeMap[nodesById[a].th];
      const col = (ta && ta.color) || "#94a3b8";
      // great-circle sampling: the arc is a stable circle on the sphere, no kinks while rotating
      const ca = coord[a], cb = coord[b];
      const om = Math.max(0.02, Math.acos(Math.min(1, Math.max(-1, ca.x * cb.x + ca.y * cb.y + ca.z * cb.z))));
      const so = Math.sin(om);
      const lift = hot ? 1.02 : 1.01;
      ctx.beginPath();
      ctx.moveTo(pa.sx, pa.sy);
      const STEPS = 8;
      for (let i = 1; i < STEPS; i++) {
        const t = i / STEPS, s1 = Math.sin((1 - t) * om) / so, s2 = Math.sin(t * om) / so;
        const p = proj({ x: (ca.x * s1 + cb.x * s2) * lift, y: (ca.y * s1 + cb.y * s2) * lift, z: (ca.z * s1 + cb.z * s2) * lift });
        ctx.lineTo(p.sx, p.sy);
      }
      ctx.lineTo(pb.sx, pb.sy);
      const base = Math.max(0.02, ((pa.z + pb.z) / 2 + 0.5) * config.linkAlpha * (hot ? 2.4 : 1));
      ctx.strokeStyle = col;
      ctx.globalAlpha = base;
      ctx.lineWidth = hot ? 0.8 : 0.4;
      ctx.stroke();
      if (config.keywordLines && rel && hot) { // relation words stay secondary: only on the active edge
        ctx.font = "italic 9px 'Segoe UI', sans-serif";
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.4 * Math.min(1, base * 2.2);
        const s1 = Math.sin(om / 2) / so, s2 = Math.sin(om / 2) / so;
        const pm = proj({ x: (ca.x * s1 + cb.x * s2) * lift, y: (ca.y * s1 + cb.y * s2) * lift, z: (ca.z * s1 + cb.z * s2) * lift });
        ctx.fillText(rel, pm.sx - ctx.measureText(rel).width / 2, pm.sy - 3);
      }
      ctx.globalAlpha = 1;
    };
    const edgeHot = ([a, b]) => focusId === a || focusId === b || hoverId === a || hoverId === b;
    edgeList.forEach((e) => { if (!edgeHot(e)) drawEdge(e[0], e[1], e[2], false); }); // faint web first
    edgeList.forEach((e) => { if (edgeHot(e)) drawEdge(e[0], e[1], e[2], true); });  // highlighted edges on top
  }, [dims, rot, zoom, edgeList, coord, focusId, hoverId, nodesById, themeMap, config, centerLift]);

  const onPointerDown = (e) => {
    act();
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [p1, p2] = [...pointers.current.values()];
      pinchBase.current = { d: Math.hypot(p1.x - p2.x, p1.y - p2.y), z: zoom };
    }
    dragRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    lastMove.current = { dx: 0, dy: 0, t: performance.now() };
    target.current = null;
    vel.current = { x: 0, y: 0 }; // grabbing the ball stops it dead
    holdUntil.current = 0;
    if (wrapRef.current.setPointerCapture) { try { wrapRef.current.setPointerCapture(e.pointerId); } catch (err) {} }
  };
  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    act();
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const prev = dragRef.current;
    if (pointers.current.size === 2 && pinchBase.current) {
      const [p1, p2] = [...pointers.current.values()];
      const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      setZoom(Math.max(0.45, Math.min(2.4, pinchBase.current.z * (d / pinchBase.current.d))));
      return;
    }
    if (prev) {
      const now = performance.now();
      const dxm = e.clientX - prev.x, dym = e.clientY - prev.y;
      const dt = Math.max(8, now - prev.t);
      dragDelta.current.x += dxm;
      dragDelta.current.y += dym;
      lastMove.current = { dx: dxm * (16.7 / dt), dy: dym * (16.7 / dt), t: now };
      dragRef.current = { x: e.clientX, y: e.clientY, t: now };
    }
  };
  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchBase.current = null;
    if (pointers.current.size === 0 && dragRef.current) {
      dragRef.current = null;
      const m = lastMove.current;
      if (performance.now() - m.t < 130 && (Math.abs(m.dx) > 0.4 || Math.abs(m.dy) > 0.4)) {
        vel.current.y = Math.max(-0.05, Math.min(0.05, m.dx * 0.0045));
        vel.current.x = Math.max(-0.03, Math.min(0.03, -m.dy * 0.003));
      } else {
        vel.current = { x: 0, y: 0 }; // released without a flick: the globe stays still
      }
      holdUntil.current = Date.now() + 4000; // the idle spin stays paused a while after every touch
    }
    lastAct.current = Date.now();
  };
  const onWheel = (e) => { e.preventDefault(); act(); setZoom((z) => Math.max(0.45, Math.min(2.4, z - e.deltaY * 0.0012))); };

  const R = Math.min(dims.w * 0.5, dims.h * 0.78) * zoom;
  const { rx, ry } = rot;
  const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full cursor-grab touch-none select-none overflow-hidden active:cursor-grabbing"
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
      onWheel={onWheel}
    >
      <canvas ref={canvasRef} style={{ width: dims.w, height: dims.h }} className="pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute rounded-full border border-white/5" style={{ width: R * 2, height: R * 2, left: dims.w / 2 - R, top: dims.h / 2 - cs - R, boxShadow: "inset 0 0 140px rgba(120,180,150,0.16)" }} />
      {nodes.map((n) => {
        const c = coord[n.id]; if (!c) return null;
        const x = c.x * cy + c.z * sy;
        const z1 = -c.x * sy + c.z * cy;
        const y = c.y * cx - z1 * sx;
        const z = c.y * sx + z1 * cx;
        if (z < -0.15 && !config.backNodes) return null;
        const th = themeMap[n.th] || { color: "#94a3b8" };
        const hot = focusId === n.id || hoverId === n.id;
        const tipId = hoverId || (muted ? null : focusId); // exactly one description layer at a time
        const showTip = n.id === tipId;
        const d = (3.6 + 5 * (z + 1) / 2) * config.nodeScale * (hot ? 1.35 : 1);
        const tw = 2.6 + (d % 3.7); // per-node twinkle period, feels alive without distracting
        return (
          <button
            key={n.id}
            className="bi-node absolute left-0 top-0 rounded-full"
            style={{
              width: d, height: d,
              transform: "translate3d(" + (dims.w / 2 + x * R - d / 2) + "px," + (dims.h / 2 - cs + y * R - d / 2) + "px,0)",
              willChange: "transform",
              zIndex: Math.round(100 + z * 100),
              background: "radial-gradient(circle at 38% 35%, #fff 0%, " + th.color + " 62%, " + th.color + "00 100%)",
              opacity: 0.3 + 0.7 * (z + 0.15) / 1.15,
              animation: hot ? "none" : "bi-twinkle " + tw + "s ease-in-out " + (-(d % 2.8)) + "s infinite alternate",
              boxShadow: "0 0 " + (7 + z * 9) + "px " + th.color + (hot ? "ee" : "77") + (hot ? ", 0 0 0 3px " + th.color + "55, 0 0 30px " + th.color + "aa" : ""),
            }}
            onMouseEnter={() => { lastAct.current = Date.now(); setHover(n.id); }}
            onMouseLeave={() => setHover(null)}
            onClick={() => { lastAct.current = Date.now(); setFocus(n.id, false); }}
            aria-label={n.t}
          >
            {config.nodeLabels !== false && z > 0.18 && (
              <span
                className="bi-tabfont pointer-events-none absolute left-full top-1/2 z-40 ml-1.5 -translate-y-1/2 whitespace-nowrap rounded text-[10px] font-medium text-white"
                style={{ opacity: hot ? 1 : Math.min(0.9, Math.max(0.2, (z - 0.15) * 0.95)), textShadow: "0 1px 3px rgba(0,0,0,0.95), 0 0 7px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,1)" }}
              >
                {n.t.length > 30 ? n.t.slice(0, 28) + "…" : n.t}
              </span>
            )}
            {showTip && (
              <span className="bi-fade pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-max max-w-[240px] -translate-x-1/2 rounded-lg border border-white/20 bg-black/85 px-2.5 py-1.5 text-left shadow-xl backdrop-blur">
                <span className="block text-[12px] font-semibold text-white">{n.t}</span>
                {config.miniDesc && n.s && <span className="mt-0.5 block text-[10px] leading-snug text-white/60">{n.s.length > 90 ? n.s.slice(0, 88) + "…" : n.s}</span>}
              </span>
            )}
          </button>
        );
      })}
      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-white/40">
          <div>
            <div className="text-4xl">◌</div>
            <p className="mt-2 text-xs">Empty ball — search the internet, hook a GitHub profile, or paste a dataset in the panel</p>
          </div>
        </div>
      )}
    </div>
  );
}
/* ---------- Detail panel ---------- */

/* live page thumbnail: self-sufficient ladder —
   1) WordPress mshots capture (re-asks quietly while the shot is being generated),
   2) thum.io capture,
   3) direct iframe render of the page itself (GitHub Pages allows framing).
   No key, no configuration, always shows something. */
function Thumb({ url, title }) {
  const [stage, setStage] = useState("mshots");
  const [attempt, setAttempt] = useState(0);
  const retryRef = useRef(0);
  useEffect(() => { setStage("mshots"); setAttempt(0); retryRef.current = 0; }, [url]);
  const bump = () => { setStage("mshots"); setAttempt(0); retryRef.current = 0; };
  const thumio = "https://image.thum.io/get/width/640/crop/460/noanimate/" + url;
  const shot = "https://s0.wp.com/mshots/v1/" + encodeURIComponent(url) + "?w=640&h=420&vpw=1280&vph=780" + (attempt ? "&r=" + attempt : "");
  const onErr = () => {
    if (stage === "mshots") { setStage("thumio"); }
    else if (stage === "thumio") { setStage("iframe"); }
  };
  const onLoaded = (e) => {
    // mshots serves a grey placeholder (400x300) while the real capture is generated: re-request, then move on
    if (stage === "mshots" && (e.target.naturalWidth || 0) < 640) {
      if (retryRef.current < 3) {
        retryRef.current += 1;
        const my = retryRef.current;
        setTimeout(() => { if (retryRef.current === my) setAttempt((a) => a + 1); }, 2200 * my);
      } else {
        setStage("thumio"); // three greys in a row: the provider is stuck, try the next one
      }
    }
  };
  // watchdog: capture providers sometimes never answer (queued render), so never hang on one stage
  useEffect(() => {
    if (stage !== "mshots" && stage !== "thumio") return;
    const t = setTimeout(() => {
      if (stage === "mshots") setAttempt((a) => a + 1);
      else setStage("iframe");
    }, stage === "mshots" ? 14000 : 9000);
    return () => clearTimeout(t);
  }, [stage, attempt]);
  if (stage === "shotless" || (!url)) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-lg border border-white/10 bg-black/40 text-[10px] text-white/40">no preview available — use “open live” above</div>
    );
  }
  if (stage === "mshots" || stage === "thumio") {
    return (
      <div className="relative h-40 w-full overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0e1a14] to-[#0a0f14]">
        <img
          key={stage + "-" + attempt}
          src={stage === "mshots" ? shot : thumio}
          alt={title + " thumbnail"}
          onLoad={onLoaded}
          onError={onErr}
          className="h-full w-full object-cover object-top"
        />
        <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white/50">{stage === "mshots" ? "capture" : "capture 2"} · click to unfold live</span>
        <button onClick={() => setStage("iframe")} title="unfold the live page inside this frame" className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label="unfold live page" />
      </div>
    );
  }
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-lg border border-white/10 bg-black/50">
      <iframe src={url} title={title + " preview"} sandbox="allow-scripts allow-same-origin" className="pointer-events-none absolute left-0 top-0 origin-top-left border-0" style={{ width: 960, height: 720, transform: "scale(0.4)" }} />
      <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white/50">live frame · capture unavailable</span>
      <button onClick={bump} className="absolute right-1 top-1 z-10 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white/70 hover:text-white" title="try the capture providers again">⟳ capture</button>
    </div>
  );
}

function Detail({ node, dataset, nodesById, pinned, setFocus }) {
  const themeMap = {}; (dataset.themes || []).forEach((t) => themeMap[t.id] = t);
  if (!node) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-white/40">
        <div className="text-3xl">◍</div>
        <p className="text-xs">Hover an idea, or let the ball idle: the frontmost spot expands here automatically.</p>
      </div>
    );
  }
  const th = themeMap[node.th] || { color: "#94a3b8", name: "?" };
  const repo = node.repo ? `${GH}/${node.repo}${node.path ? "/blob/main/" + node.path : ""}` : null;
  const connections = (dataset.edges || []).filter((e) => Array.isArray(e) && (e[0] === node.id || e[1] === node.id)).map(([a, b, rel, why]) => ({ other: a === node.id ? b : a, rel, why }));
  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 text-white">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider" style={{ background: th.color + "33", color: th.color, border: `1px solid ${th.color}66` }}>{th.name}</span>
        <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/60">{node.kind || "node"}</span>
        {pinned ? <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300">pinned</span> : <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">frontmost</span>}
      </div>
      <h2 className="text-xl font-light">{node.t}</h2>
      {node.conf && node.conf !== "high" && <p className="mt-1 text-[11px] text-amber-400/80">confidence: {node.conf === "unread-page-live" ? "page live, sources not read" : node.conf === "med" ? "medium — not fully extracted yet" : node.conf}</p>}
      <p className="mt-2 text-sm leading-relaxed text-white/80">{node.s}</p>
      {node.o && (
        <div className="mt-3">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Objective</p>
          <p className="text-sm text-white/70">{node.o}</p>
        </div>
      )}
      {(repo || node.p || node.h) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {repo && <a href={repo} target="_blank" rel="noreferrer" className="rounded bg-white/10 px-2.5 py-1 text-xs text-white/80 hover:bg-white/20">open in repo →</a>}
          {node.p && <a href={node.p} target="_blank" rel="noreferrer" className="rounded bg-sky-500/20 px-2.5 py-1 text-xs text-sky-300 hover:bg-sky-500/30">GitHub.io page ↗</a>}
          {node.h && <a href={node.h} target="_blank" rel="noreferrer" className="rounded bg-violet-500/20 px-2.5 py-1 text-xs text-violet-300 hover:bg-violet-500/30">site ↗</a>}
        </div>
      )}
      {node.p && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-white/40">Page thumbnail (live capture)</p>
            <span className="flex items-center gap-2">
              <a href={node.p} target="_blank" rel="noreferrer" className="text-[10px] text-sky-300/80 hover:text-sky-200">open live ↗</a>
            </span>
          </div>
          <Thumb url={node.p} title={node.t} />
        </div>
      )}
      {node.f && node.f.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-[10px] uppercase tracking-wider text-white/40">Key files / sources</p>
          <ul className="space-y-0.5">{node.f.map((f) => (<li key={f} className="font-mono text-[11px] text-white/60">{f}</li>))}</ul>
        </div>
      )}
      {node.tags && (
        <div className="mt-3 flex flex-wrap gap-1">
          {node.tags.map((t) => (<span key={t} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/50">#{t}</span>))}
        </div>
      )}
      {connections.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-[10px] uppercase tracking-wider text-white/40">Interconnections ({connections.length})</p>
          <ul className="space-y-1">
            {connections.map((c, i) => (
              <li key={i} className="text-[11px]">
                <button className="text-left text-white/80 underline decoration-white/20 decoration-dotted underline-offset-2 hover:text-white" onClick={() => setFocus(c.other, false)}>
                  {nodesById[c.other] ? nodesById[c.other].t : c.other}
                </button>
                <span className="text-white/40"> · <em>{c.rel}</em>{c.why ? ` — ${c.why}` : ""}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------- A-section (hidden data hook under the letter A) ---------- */

function ASection({ open, onToggle, dataset, config, onSendToHook }) {
  const [copied, setCopied] = useState(false);
  const json = useMemo(() => JSON.stringify({ ...dataset, config }, null, 1), [dataset, config]);
  const copy = () => {
    try { navigator.clipboard.writeText(json).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); } catch (e) {}
  };
  const download = () => {
    try {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "idea-sphere-dataset.json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) {}
  };
  return (
    <div className="relative border-t border-white/10 bg-black/30 p-2">
      {open && (
        <div className="bi-fade absolute bottom-9 left-2 right-2 z-[220] max-h-[70%] overflow-y-auto rounded-xl border border-white/20 bg-[#0d1117]/97 p-3 shadow-2xl backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">A_ data hook — unified description form</p>
          <p className="mt-1 text-[10px] text-white/60">Every idea node carries {`{ id · theme · kind · title · summary · objective · key files · tags · links · confidence }`}, edges interconnect them, config travels with the dataset. Commit this JSON into any repo (e.g. /mindmap/dataset.json) and the ball can load it from there — no keys, no authentication.</p>
          <textarea readOnly value={json} className="mt-2 h-40 w-full rounded-lg border border-white/10 bg-black/50 p-2 font-mono text-[10px] text-white/75" onFocus={(e) => e.target.select()} />
          <div className="mt-2 flex flex-wrap gap-2">
            <button onClick={copy} className="rounded bg-white/10 px-2 py-1 text-[11px] text-white/85 hover:bg-white/20">{copied ? "copied" : "copy JSON"}</button>
            <button onClick={download} className="rounded bg-white/10 px-2 py-1 text-[11px] text-white/85 hover:bg-white/20">download dataset.json</button>
            <button onClick={onSendToHook} className="rounded bg-emerald-500/25 px-2 py-1 text-[11px] text-emerald-300 hover:bg-emerald-500/35">add as new map tab →</button>
          </div>
        </div>
      )}
      <button
        onClick={onToggle}
        className="group mx-auto flex items-center font-mono text-[10px] text-white/[0.13] transition hover:text-white/70"
        title="A_ data hook"
        aria-expanded={open}
      >
        <span>A</span><span className="-ml-px">_</span><span className="ml-0.5 transition-transform duration-200 group-hover:translate-y-px">{open ? "↑" : "↓"}</span>
      </button>
    </div>
  );
}

/* ---------- online hooks (published endpoints, no authentication) ---------- */

const EDGE_STOP = new Set("this that with from have will your when what where which their there these those then than them they been were also into about above after again under over only just each other more most some such because while during before between through both fewer few very can could should would might must shall using used uses make made makes take takes given page site link view read show shown like also into".split(" "));

function keywordEdges(nodes, min, cap) {
  // weighted token overlap: title words count double, stopwords never join, strongest links first and a degree cap per node
  const nodesL = nodes || [];
  const toks = nodesL.map((n) => {
    const m = {};
    const add = (txt, w) => String(txt || "").toLowerCase().match(/[a-z0-9][a-z0-9-]{3,}/g)?.forEach((k) => { if (!EDGE_STOP.has(k)) m[k] = (m[k] || 0) + w; });
    add(n.t, 2); add(n.s, 1); add((n.tags || []).join(" "), 2);
    return m;
  });
  const scored = [];
  for (let i = 0; i < nodesL.length; i++) for (let j = i + 1; j < nodesL.length; j++) {
    let wgt = 0, shared = 0;
    for (const k in toks[i]) { const tv = toks[j][k]; if (tv) { wgt += Math.min(tv, toks[i][k]); shared++; } }
    if (shared >= min) {
      const best = Object.keys(toks[i]).filter((k) => toks[j][k]).sort((a, b) => (toks[j][b] + toks[i][b]) - (toks[j][a] + toks[i][a]))[0];
      scored.push({ a: nodesL[i].id, b: nodesL[j].id, rel: best || "shares", w: wgt * (shared / (1 + 0.3 * shared)) });
    }
  }
  scored.sort((a, b) => b.w - a.w);
  const deg = {};
  const out = [];
  for (const e of scored) {
    if ((deg[e.a] || 0) >= 6 || (deg[e.b] || 0) >= 6) continue;
    deg[e.a] = (deg[e.a] || 0) + 1; deg[e.b] = (deg[e.b] || 0) + 1;
    out.push([e.a, e.b, e.rel, "shared context: " + e.rel]);
    if (out.length >= (cap || 60)) break;
  }
  return out;
}

function makeMeta(title, source) {
  return { title, source, generated: new Date().toISOString().slice(0, 10), schema: "idea-sphere/v1" };
}

async function hookGithubUser(user, log) {
  log("fetching api.github.com/users/" + user + "/repos (public, no auth)…");
  const res = await fetch("https://api.github.com/users/" + user + "/repos?per_page=60&sort=updated");
  const repos = await res.json();
  if (!Array.isArray(repos)) throw new Error("GitHub API answered with an error (likely rate limit) — retry later.");
  const langs = [...new Set(repos.map((r) => r.language || "unspoken"))];
  const palette = ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#a3e635", "#94a3b8"];
  const themes = langs.map((l, i) => ({ id: "lang_" + l, name: l, color: palette[i % palette.length] }));
  const nodes = repos.map((r) => ({
    id: "r_" + r.name.replace(/[^a-z0-9-_]/gi, "_"), th: "lang_" + (r.language || "unspoken"), kind: "repo",
    t: r.name, s: r.description || (r.language ? "written in " + r.language : "repository"), o: "objective from GitHub metadata",
    g: r.html_url, p: r.has_pages ? ("https://" + user + ".github.io/" + r.name + "/") : null, tags: [r.language].filter(Boolean),
  }));
  return { meta: makeMeta("GitHub context map — " + user, "https://github.com/" + user), themes, nodes, edges: keywordEdges(nodes, 1) };
}

async function hookWikipedia(term, log) {
  log("searching Wikipedia (CORS-open API)…");
  const res = await fetch("https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=12&srsearch=" + encodeURIComponent(term));
  const j = await res.json();
  const hits = (j.query && j.query.search) || [];
  if (!hits.length) throw new Error("no Wikipedia hits for that term");
  const themes = [{ id: "topic", name: "Search results", color: "#06b6d4" }, { id: "term", name: "The term", color: "#8b5cf6" }];
  const nodes = hits.map((h) => ({
    id: "w_" + h.pageid, th: "topic", kind: "source", t: h.title.replace(/<[^>]+>/g, ""),
    s: (h.snippet || "").replace(/<[^>]+>/g, ""), o: "found via " + term, h: "https://en.wikipedia.org/?curid=" + h.pageid, tags: ["wikipedia"],
  }));
  nodes.push({ id: "w_term", th: "term", kind: "concept", t: term, s: "center of this context net", h: "https://en.wikipedia.org/wiki/Special:Search?search=" + encodeURIComponent(term), tags: ["term"] });
  const edges = nodes.slice(0, -1).map((n) => ["w_term", n.id, "relates", term]).concat(keywordEdges(nodes, 3));
  return { meta: makeMeta("Wikipedia context map — " + term, "https://en.wikipedia.org"), themes, nodes, edges };
}

async function hookJsonPlaceholder(arg, log) {
  log("loading jsonplaceholder users + posts…");
  const [users, posts] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users").then((r) => r.json()),
    fetch("https://jsonplaceholder.typicode.com/posts").then((r) => r.json()),
  ]);
  const themes = [{ id: "people", name: "People", color: "#a3e635" }, { id: "posts", name: "Posts", color: "#06b6d4" }];
  const nodes = users.map((u) => ({ id: "u_" + u.id, th: "people", kind: "person", t: u.name, s: u.company.catchPhrase, o: "contact: " + u.email, h: "https://jsonplaceholder.typicode.com/users/" + u.id, tags: [u.username] }));
  posts.slice(0, 20).forEach((p) => nodes.push({ id: "p_" + p.id, th: "posts", kind: "post", t: p.title.slice(0, 40), s: p.body.slice(0, 120), o: "post #" + p.id, h: "https://jsonplaceholder.typicode.com/posts/" + p.id, tags: [] }));
  const edges = posts.slice(0, 20).map((p) => ["u_" + p.userId, "p_" + p.id, "authored", ""]);
  return { meta: makeMeta("JSONPlaceholder live context map", "https://jsonplaceholder.typicode.com"), themes, nodes, edges: edges.concat(keywordEdges(nodes, 3)) };
}

async function hookPokeapi(arg, log) {
  log("loading PokéAPI types + samples…");
  const types = await fetch("https://pokeapi.co/api/v2/type/?limit=6").then((r) => r.json());
  const palette = ["#ef4444", "#3b82f6", "#10b981", "#a3e635", "#f59e0b", "#ec4899"];
  const themes = [], nodes = [], edges = [];
  for (let i = 0; i < Math.min(5, types.results.length); i++) {
    const t = types.results[i];
    themes.push({ id: "ty_" + t.name, name: t.name, color: palette[i] });
    const detail = await fetch(t.url).then((r) => r.json());
    detail.pokemon.slice(0, 4).forEach((pk, k) => nodes.push({ id: "pk_" + pk.pokemon.name, th: "ty_" + t.name, kind: "entry", t: pk.pokemon.name, s: t.name + "-type", o: "crawled from pokeapi.co", h: "https://pokeapi.co/", tags: [t.name] }));
    if (detail.pokemon[1]) edges.unshift(["pk_" + detail.pokemon[0].pokemon.name, "pk_" + detail.pokemon[1].pokemon.name, "shares", t.name]);
  }
  return { meta: makeMeta("PokeAPI live context map", "https://pokeapi.co"), themes, nodes, edges };
}

/* free AI helper — Pollinations, no key, CORS-open */
const DEFAULT_AI_PROMPT = "You enrich an idea-sphere/v1 context-map dataset. For EVERY node write one crisp objective sentence in English. Reply ONLY with JSON, no prose: [{\"id\":\"..\",\"o\":\"..\"}].";

async function aiEnrich(dataset, log, customPrompt) {
  if (!dataset || !dataset.nodes || !dataset.nodes.length) throw new Error("nothing to enrich — load a dataset first");
  log("built-in pass done; asking the free AI helper to write objectives…");
  const sample = dataset.nodes.slice(0, 16).map((n) => ({ id: n.id, title: n.t, summary: n.s }));
  const prompt = (customPrompt && customPrompt.trim() ? customPrompt.trim() : "You enrich an idea-sphere/v1 context-map dataset. For EVERY node write one crisp objective sentence in English. Reply ONLY with JSON, no prose: [{\"id\":\"..\",\"o\":\"..\"}].") + " Nodes: " + JSON.stringify(sample);
  let txt = null;
  try {
    const res = await fetch("https://text.pollinations.ai/openai", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "openai", messages: [{ role: "user", content: prompt }] }),
    });
    const j = await res.json();
    txt = j.choices && j.choices[0] && j.choices[0].message.content || null;
  } catch (e) { /* fall through to GET endpoint */ }
  if (!txt) {
    const res = await fetch("https://text.pollinations.ai/" + encodeURIComponent(prompt.slice(0, 1600)));
    txt = await res.text();
  }
  const start = txt.indexOf("[");
  if (start < 0) throw new Error("AI reply contained no JSON");
  const arr = JSON.parse(txt.slice(start, txt.lastIndexOf("]") + 1));
  const byId = {}; dataset.nodes.forEach((n) => byId[n.id] = n);
  let applied = 0;
  (Array.isArray(arr) ? arr : []).forEach((item) => { if (byId[item.id] && item.o) { byId[item.id].o = item.o; applied++; } });
  return applied;
}

function HookCard({ hook, onLoaded }) {
  const [arg, setArg] = useState(hook.defaultArg || "");
  const [status, setStatus] = useState({ s: "idle", line: "" });
  const [ds, setDs] = useState(null);
  const log = (line) => setStatus({ s: "busy", line });
  const run = async () => {
    try {
      const built = await hook.run(arg, log);
      setDs(built); onLoaded(built);
      setStatus({ s: "ok", line: built.nodes.length + " nodes · " + built.edges.filter((e) => Array.isArray(e)).length + " links — loaded on the ball" });
    } catch (e) {
      let msg = String(e.message || e).slice(0, 120);
      if (e.name === "TypeError") msg = "network unreachable from this preview — every source is public and CORS-open; try again from the deployed page";
      setStatus({ s: "err", line: msg });
    }
  };
  const [showPrompt, setShowPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState(DEFAULT_AI_PROMPT);
  const ai = async () => {
    try {
      setStatus({ s: "busy", line: "AI pass running…" });
      const n = await aiEnrich(ds, log, aiPrompt);
      setStatus({ s: "ok", line: "AI helper refreshed " + n + " objectives (Pollinations, no key)" });
      onLoaded(ds);
    } catch (e) {
      let msg = String(e.message || e).slice(0, 120);
      if (e.name === "TypeError") msg = "AI helper unreachable in this preview sandbox — open the canvas outside the sandbox for live enrichment; the built-in dataset stays loaded.";
      setStatus({ s: "err", line: msg });
    }
  };
  const col = status.s === "err" ? "text-red-400" : status.s === "ok" ? "text-emerald-400" : "text-white/60";
  return (
    <div className="rounded-xl border border-emerald-300/25 bg-[#0f2018]/70 p-3">
      <div className="flex items-baseline gap-2">
        <p className="text-xs font-semibold text-white">{hook.name}</p>
        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-white/60">{hook.badge}</span>
      </div>
      <p className="mt-0.5 text-[10px] text-white/60">{hook.desc}</p>
      {hook.argLabel && (
        <input value={arg} onChange={(e) => setArg(e.target.value)} placeholder={hook.argLabel} className="mt-2 w-full rounded border border-white/15 bg-black/50 px-2 py-1 text-[11px] text-white/85 placeholder-white/25 outline-none focus:border-emerald-300/50" />
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        <button onClick={run} className="rounded bg-emerald-600/40 px-2.5 py-1 text-[11px] text-white hover:bg-emerald-600/60">generate dataset</button>
        {ds && <button onClick={ai} className="rounded bg-violet-500/30 px-2.5 py-1 text-[11px] text-violet-200 hover:bg-violet-500/50">AI pass (free helper)</button>}
        {ds && <button onClick={() => setShowPrompt((s) => !s)} className={"rounded border px-2 py-1 text-[11px] " + (showPrompt ? "border-violet-300/60 text-violet-100" : "border-white/20 text-white/50 hover:text-white")} title="write your own instruction for the AI pass">✎ prompt</button>}
      </div>
      {showPrompt && ds && (
        <div className="mt-2">
          <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
            className="h-24 w-full rounded-lg border border-violet-300/25 bg-black/50 p-2 font-mono text-[10px] leading-snug text-violet-100/85 outline-none focus:border-violet-300/60"
            placeholder="instruction for the AI pass — it runs on top of the loaded dataset" />
          <p className="mt-1 text-[9px] text-white/35">applied on the next AI pass · node data is appended automatically · reset by clearing the text</p>
        </div>
      )}
      {status.line && <p className={"mt-1.5 text-[10px] " + col}>{status.line}</p>}
    </div>
  );
}

const HOOKS = [
  { id: "gh", name: "GitHub Live context map", badge: "no auth", desc: "Any public GitHub profile becomes the ball: repos are idea nodes, languages are groups, shared keywords create links.", defaultArg: "shek-hrd", argLabel: "github username", run: hookGithubUser },
  { id: "wiki", name: "Wikipedia search net", badge: "no auth", desc: "Searches Wikipedia for any term and spreads the hits into an interconnected context net.", defaultArg: "knowledge mapping", argLabel: "search term", run: hookWikipedia },
  { id: "jsonph", name: "JSONPlaceholder map", badge: "no auth", desc: "Classic open test API: people and their posts as a small living context map.", run: hookJsonPlaceholder },
  { id: "poke", name: "PokeAPI sample", badge: "no auth", desc: "Open dataset playground: themed groups pulled from the public PokeAPI.", run: hookPokeapi },
];

/* ---------- demo context map displayed immediately on the hook tab ---------- */

const CONTEXT_DEMO = {
  meta: makeMeta("Context Map — demo canvas", "replace via the hooks below"),
  themes: [
    { id: "work", name: "Work Streams", color: "#8b5cf6" },
    { id: "self", name: "Personal Systems", color: "#10b981" },
    { id: "sources", name: "Signals & Sources", color: "#06b6d4" },
    { id: "dreams", name: "Ambitions", color: "#f59e0b" },
  ],
  nodes: [
    { id: "intake", th: "work", kind: "practice", t: "Idea Intake", s: "Capture every idea at the moment it appears.", tags: ["inbox"] },
    { id: "pipeline", th: "work", kind: "practice", t: "Project Pipeline", s: "From captured idea to committed project.", tags: ["flow"] },
    { id: "publish", th: "work", kind: "practice", t: "Publishing Loop", s: "Ship small, publish often, collect feedback.", tags: ["ship"] },
    { id: "finances", th: "self", kind: "system", t: "Money Dashboard", s: "One place where the financial state stays visible.", tags: ["finance"] },
    { id: "routines", th: "self", kind: "system", t: "Health Routines", s: "Sleep, movement and light, tracked lightly.", tags: ["health"] },
    { id: "home", th: "self", kind: "system", t: "Home Systems", s: "The maintenance world that keeps everything running.", tags: ["home"] },
    { id: "people", th: "sources", kind: "source", t: "People & Mentors", s: "The humans who sharpen the map.", tags: ["network"] },
    { id: "reading", th: "sources", kind: "source", t: "Reading Stack", s: "Books and papers queued for digestion.", tags: ["reading"] },
    { id: "feeds", th: "sources", kind: "source", t: "Live Feeds", s: "Repos, lists and datasets arriving daily.", tags: ["feeds"] },
    { id: "lab", th: "dreams", kind: "ambition", t: "Experiment Lab", s: "A protected space for weird prototypes.", tags: ["lab"] },
    { id: "learning", th: "dreams", kind: "ambition", t: "Learning Tracks", s: "Long arcs of skill: graphics, agents, systems.", tags: ["depth"] },
    { id: "bets", th: "dreams", kind: "ambition", t: "Long Bets", s: "Positions held for years, not weeks.", tags: ["conviction"] },
  ],
  edges: [
    ["intake", "pipeline", "feeds", "captured ideas enter the flow"],
    ["pipeline", "publish", "ushers", "projects ship through the loop"],
    ["publish", "feeds", "returns", "feedback arrives as new signals"],
    ["reading", "intake", "seeds", "input becomes captured ideas"],
    ["people", "reading", "curates", "pointers from mentors"],
    ["finances", "lab", "funds", "quiet money sustains experiments"],
    ["routines", "learning", "carries", "repetition moves long arcs"],
    ["home", "routines", "anchors", "stability enables discipline"],
    ["bets", "lab", "compounds", "conviction directs experiments"],
    ["feeds", "bets", "tests", "signals challenge positions"],
  ],
};

/* ---------- hook-tab controls ---------- */

function stripHtml(h) { return String(h || "").replace(/<[^>]*>/g, ""); }

async function webSearch(query, source, log) {
  if (source === "hn") {
    log("searching Hacker News stories for '" + query + "'…");
    const res = await fetch("https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=8&query=" + encodeURIComponent(query));
    const j = await res.json();
    const hits = (((j || {}).hits || [])).filter((h) => h.title).map((h) => ({
      title: h.title,
      snippet: (h.points || 0) + " points · " + (h.num_comments || 0) + " comments · by " + (h.author || "?"),
      url: h.url || ("https://news.ycombinator.com/item?id=" + h.objectID),
    }));
    if (!hits.length) throw new Error("no results — try another wording");
    return hits;
  }
  log("searching the open internet for '" + query + "'…");
  try {
    const r1 = await fetch("https://en.wikipedia.org/w/rest.php/v1/search/page?q=" + encodeURIComponent(query) + "&limit=8");
    if (r1.ok) {
      const j1 = await r1.json();
      const hits1 = ((j1 || {}).pages || []).map((p) => ({
        title: p.title,
        snippet: stripHtml(p.excerpt || p.description || "").replace(/\s+/g, " ").slice(0, 140),
        url: "https://en.wikipedia.org/wiki/" + encodeURIComponent((p.key || p.title).replace(/ /g, "_")),
      }));
      if (hits1.length) return hits1;
    }
  } catch (e) { /* fall through to the action API */ }
  const res = await fetch("https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=8&format=json&origin=*&srsearch=" + encodeURIComponent(query));
  let hits = [];
  try {
    const j = await res.json();
    hits = (((j || {}).query || {}).search || []).map((h) => ({
      title: h.title,
      snippet: stripHtml(h.snippet || "").replace(/\s+/g, " ").slice(0, 140),
      url: "https://en.wikipedia.org/wiki/" + encodeURIComponent(h.title.replace(/ /g, "_")),
    }));
  } catch (e) { /* fall through */ }
  if (hits.length) return hits;
  // verified fallback route: the action API answered through the reader proxy when blocked directly
  try {
    const r3 = await fetch("https://r.jina.ai/https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=8&format=json&srsearch=" + encodeURIComponent(query));
    if (r3.ok) {
      const t3 = await r3.text();
      const s3 = t3.indexOf("{");
      if (s3 >= 0) {
        const j3 = JSON.parse(t3.slice(s3, t3.lastIndexOf("}") + 1));
        hits = (((j3 || {}).query || {}).search || []).map((h) => ({
          title: h.title,
          snippet: stripHtml(h.snippet || "").replace(/\s+/g, " ").slice(0, 140),
          url: "https://en.wikipedia.org/wiki/" + encodeURIComponent(h.title.replace(/ /g, "_")),
        }));
      }
    }
  } catch (e) { /* fall through */ }
  if (!hits.length) throw new Error("no results — try another wording");
  return hits;
}

function chunksFromText(text) {
  const parts = [];
  const hsplit = String(text || "").split(/\n(?=#{1,4}\s)/);
  if (hsplit.length >= 3) {
    hsplit.forEach((sec, i) => {
      const nl = sec.indexOf("\n");
      const head = i === 0 ? null : sec.slice(0, nl < 0 ? 90 : nl).replace(/^#+\s*/, "").slice(0, 80);
      const body = i === 0 ? sec : sec.slice(nl + 1);
      parts.push({ t: head || "overview", body });
    });
  } else {
    const paras = String(text || "").split(/\n{2,}/).map((s) => s.trim()).filter((p) => p.length > 80);
    for (let i = 0; i < paras.length; i += 2) parts.push({ t: null, body: paras.slice(i, i + 2).join("\n\n") });
  }
  return parts.filter((p) => p.body && p.body.replace(/\s+/g, " ").length > 60).slice(0, 14);
}

function datasetFromText(title, url, text) {
  const parts = chunksFromText(text);
  const palette = ["#34d399", "#60a5fa", "#f59e0b", "#f472b6", "#a78bfa", "#22d3ee", "#fb923c", "#4ade80"];
  const themes = [{ id: "core", name: "source", color: "#94a3b8" }];
  const nodes = [{ id: "src", th: "core", kind: "source", t: title, s: String(text).replace(/\s+/g, " ").slice(0, 200), g: url }];
  parts.forEach((p, i) => {
    const tid = "sec_" + i;
    themes.push({ id: tid, name: p.t || "section " + (i + 1), color: palette[i % palette.length] });
    nodes.push({ id: "n_" + i, th: tid, kind: "section", t: p.t || "section " + (i + 1), s: p.body.replace(/\s+/g, " ").slice(0, 180), g: url });
  });
  const seq = [];
  for (let i = 1; i < nodes.length; i++) seq.push([nodes[i - 1].id, nodes[i].id, "follows", "next section in the source"]);
  return { meta: makeMeta(title, url), themes, nodes, edges: nodes.slice(1).map((n) => ["src", n.id, "expands", "from the source"]).concat(seq, keywordEdges(nodes, 2, 40)) };
}

function datasetFromResults(query, hits) {
  const focus = { id: "q", th: "tq", kind: "query", t: query, s: "internet search focus: " + hits.length + " sources found", tags: ["search"] };
  const nodes = [focus].concat(hits.map((h, i) => ({ id: "res_" + i, th: "tres", kind: "source", t: h.title, s: h.snippet, g: h.url, tags: [(h.url || "").replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "") || "web"] })));
  const themes = [
    { id: "tq", name: "search focus", color: "#f59e0b" },
    { id: "tres", name: "results", color: "#34d399" },
  ];
  const sameSite = [];
  const host = (u) => (u || "").replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "");
  for (let i = 0; i < hits.length; i++) for (let j = i + 1; j < hits.length; j++)
    if (host(hits[i].url) && host(hits[i].url) === host(hits[j].url)) sameSite.push(["res_" + i, "res_" + j, "same site", "both from " + host(hits[i].url)]);
  return { meta: makeMeta("Internet search — " + query, "web search"), themes, nodes, edges: hits.map((h, i) => ["q", "res_" + i, "found", "search hit"]).concat(sameSite, keywordEdges(nodes, 2, 30)) };
}

function WebSearchHook({ onLoaded }) {
  const [q, setQ] = useState("");
  const [src, setSrc] = useState("wiki");
  const [url, setUrl] = useState("");
  const [hits, setHits] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({ s: "idle", line: "search the open web, pick a result, edit its URL — or fetch any address directly" });
  const ok = (ds, line) => { onLoaded(ds); setStatus({ s: "ok", line }); };
  const run = async () => {
    if (!q.trim() || busy) return;
    setBusy(true); setStatus({ s: "busy", line: "searching…" });
    try {
      const h = await webSearch(q, src, (l) => setStatus({ s: "busy", line: l }));
      setHits(h);
      setStatus({ s: "ok", line: h.length + " sources found — select one below, or map them all" });
    } catch (e) { setStatus({ s: "err", line: String(e.message || e).slice(0, 140) }); }
    setBusy(false);
  };
  const mapResults = () => { if (hits && hits.length && !busy) ok(datasetFromResults(q.trim(), hits), hits.length + " search results mapped as sources"); };
  const fetchUrl = async () => {
    let u = url.trim();
    if (!u || busy) return;
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    setBusy(true); setStatus({ s: "busy", line: "reading " + u + " …" });
    let txt = null;
    try { const r = await fetch("https://r.jina.ai/" + u); if (r.ok) { const t = await r.text(); if (t && t.length > 80) txt = t; } } catch (e) {}
    if (!txt) {
      try {
        const r = await fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(u));
        if (r.ok) {
          txt = stripHtml((await r.text()).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]*>/g, "\n"));
        }
      } catch (e) {}
    }
    if (!txt || txt.length < 80) { setStatus({ s: "err", line: "could not read that URL (the site may block readers) — try another address" }); }
    else {
      const host = u.replace(/^https?:\/\//, "").split("/")[0];
      const title = ((txt.split("\n").find((l) => l.trim().length > 3) || host) + "").slice(0, 70);
      ok(datasetFromText(title + " — " + host, u, txt), "page mapped into section nodes");
    }
    setBusy(false);
  };
  const col = status.s === "err" ? "text-red-400" : status.s === "ok" ? "text-emerald-400" : "text-white/55";
  return (
    <div className="rounded-xl border border-sky-300/30 bg-[#0c1a24]/70 p-3">
      <div className="flex items-baseline gap-2">
        <p className="text-xs font-semibold text-white">Internet search &amp; URL source</p>
        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-white/60">no auth</span>
      </div>
      <p className="mt-0.5 text-[10px] text-white/60">Data sources are pulled straight from the web: search, pick a result, edit its URL, and the page itself becomes the map.</p>
      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-[10px] text-white/40">source:</span>
        {[["wiki", "wikipedia"], ["hn", "hacker news"]].map(([k, lab]) => (
          <button key={k} onClick={() => setSrc(k)} className={"rounded-full border px-2 py-0.5 text-[10px] transition " + (src === k ? "border-sky-300/60 bg-sky-500/20 text-sky-100" : "border-white/15 bg-black/30 text-white/50 hover:text-white/80")}>{lab}</button>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") run(); }} placeholder={"search " + (src === "hn" ? "Hacker News" : "the internet") + " for data sources…"}
          className="min-w-0 flex-1 rounded border border-white/15 bg-black/50 px-2 py-1 text-[11px] text-white/85 placeholder-white/25 outline-none focus:border-sky-300/60" />
        <button onClick={run} disabled={busy} className="shrink-0 rounded bg-sky-600/40 px-3 py-1 text-[11px] text-white hover:bg-sky-600/60 disabled:opacity-50">{busy ? "…" : "search"}</button>
      </div>
      {hits && hits.length > 0 && (
        <div className="mt-2 max-h-40 space-y-1 overflow-y-auto pr-1">
          {hits.map((h, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-white/10 bg-black/30 p-1.5">
              <button onClick={() => setUrl(h.url)} title="put this result's URL into the field below (editable)"
                className={"shrink-0 rounded px-1.5 py-0.5 text-[10px] " + (url === h.url ? "bg-sky-500/40 text-white" : "bg-white/10 text-white/70 hover:bg-white/20")}>{url === h.url ? "selected" : "select"}</button>
              <div className="min-w-0">
                <p className="truncate text-[11px] text-white/85">{h.title}</p>
                <p className="truncate text-[9px] text-white/45">{h.snippet}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-2 flex gap-2">
        <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") fetchUrl(); }} placeholder="https://… (editable, any address)"
          className="min-w-0 flex-1 rounded border border-white/15 bg-black/50 px-2 py-1 text-[11px] text-white/85 placeholder-white/25 outline-none focus:border-sky-300/60" />
        <button onClick={fetchUrl} disabled={busy || !url.trim()} className="shrink-0 rounded bg-sky-600/40 px-3 py-1 text-[11px] text-white hover:bg-sky-600/60 disabled:opacity-50">fetch page</button>
      </div>
      {hits && hits.length > 0 && (
        <button onClick={mapResults} disabled={busy} className="mt-2 rounded border border-sky-300/40 px-2.5 py-1 text-[10px] text-sky-200 hover:bg-sky-500/20 disabled:opacity-50">map all {hits.length} results onto the ball</button>
      )}
      {status.line && <p className={"mt-1.5 text-[10px] " + col}>{status.line}</p>}
    </div>
  );
}

function HookControls({ dataset, onApply, onPullHub }) {
  const [txt, setTxt] = useState("");
  const [err, setErr] = useState(null);
  const apply = () => {
    try {
      const d = JSON.parse(txt);
      if (!d.nodes || !d.themes) throw new Error("dataset must contain 'themes' and 'nodes' arrays");
      d.edges = Array.isArray(d.edges) ? d.edges : [];
      d.meta = d.meta || makeMeta("Pasted context map", "pasted JSON");
      onApply(d); setErr(null);
    } catch (e) { setErr(String(e.message || e)); }
  };
  return (
    <div className="space-y-2 border-b border-white/15 p-3">
      <EaseGhHook onLoaded={onApply} />
      <WebSearchHook onLoaded={onApply} />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {HOOKS.filter((h) => h.id !== "gh").map((h) => (<HookCard key={h.id} hook={h} onLoaded={onApply} />))}
      </div>
      <details className="rounded-xl border border-white/20 bg-black/40 p-3">
        <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-wider text-white/50">paste raw dataset JSON (universal, any source)</summary>
        <textarea value={txt} onChange={(e) => setTxt(e.target.value)}
          placeholder={"{\n  \"meta\": { \"title\": \"…\" },\n  \"themes\": [{ \"id\": \"t1\", \"name\": \"Theme\", \"color\": \"#8b5cf6\" }],\n  \"nodes\": [{ \"id\": \"n1\", \"th\": \"t1\", \"kind\": \"repo\", \"t\": \"Idea\", \"s\": \"summary\", \"g\": \"https://…\" }],\n  \"edges\": [[\"n1\", \"n2\", \"shares\", \"why\"]]\n}"}
          className="mt-2 h-32 w-full rounded-lg border border-white/10 bg-black/60 p-2 font-mono text-[10px] text-white/70" />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button onClick={apply} className="rounded bg-emerald-500/25 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-500/35">load onto ball</button>
          <button onClick={onPullHub} className="rounded bg-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/20">pull current GitHub dataset</button>
          <button onClick={() => onApply(CONTEXT_DEMO)} className="rounded bg-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/20">load demo map</button>
          <button onClick={() => onApply(EMPTY_DS)} className="rounded bg-red-500/20 px-3 py-1 text-xs text-red-300 hover:bg-red-500/30">empty the ball</button>
        </div>
        {err && <p className="mt-2 text-[11px] text-red-400">{"✗ " + err}</p>}
      </details>
      {dataset && <p className="text-[10px] text-white/40">{dataset.nodes.length} nodes on the ball · {(dataset.edges || []).filter((e) => Array.isArray(e)).length} links · {dataset.themes.length} groups</p>}
    </div>
  );
}

/* one-click GitHub hooking: no typing, no token */
function EaseGhHook({ onLoaded }) {
  const [user, setUser] = useState("shek-hrd");
  const [status, setStatus] = useState({ s: "idle", line: "public profile, no login needed" });
  const run = async (u) => {
    setStatus({ s: "busy", line: "reading github.com/" + u + " …" });
    try {
      const built = await hookGithubUser(u, (l) => setStatus({ s: "busy", line: l }));
      onLoaded(built);
      setStatus({ s: "ok", line: built.nodes.length + " idea nodes · " + built.edges.filter((e) => Array.isArray(e)).length + " links — on the ball" });
    } catch (e) { setStatus({ s: "err", line: String(e.message || e).slice(0, 140) }); }
  };
  return (
    <div className="rounded-xl border border-emerald-300/40 bg-emerald-500/10 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-emerald-100">GitHub hook — one click</p>
          <p className="text-[10px] text-white/55">Any public profile becomes a ball: repos are idea nodes, shared keywords are links. Change the name for other users.</p>
        </div>
        <button onClick={() => run(user)} className={"shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold " + (status.s === "busy" ? "bg-emerald-500/40 text-white/60" : "bg-emerald-500/35 text-white hover:bg-emerald-500/55")}>{status.s === "busy" ? "pulling…" : "pull my GitHub"}</button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[10px] text-white/40">github.com/</span>
        <input value={user} onChange={(e) => setUser(e.target.value.trim())} className="w-40 rounded border border-white/15 bg-black/50 px-2 py-1 text-[11px] text-white/85 outline-none focus:border-emerald-300/50" />
      </div>
      {status.line && <p className={"mt-1.5 text-[10px] " + (status.s === "err" ? "text-red-400" : status.s === "ok" ? "text-emerald-400" : "text-white/55")}>{status.line}</p>}
    </div>
  );
}

/* ---------- "?" documentation overlay: full functionality, data format, extraction logic, embedding ---------- */

const DOC_FORMAT = `{
  "meta": { "title": "My context map", "subtitle": "one-line description",
            "source": "https://where-it-came-from", "schema": "idea-sphere/v1",
            "generated": "2026-11-21", "verified": "optional live-test record, shown green" },
  "themes": [                                  // mandatory groups (“continents”)
    { "id": "ai", "name": "AI & Agents", "color": "#8b5cf6" }
  ],
  "nodes": [
    { "id": "unique-stable-id",  // required; seeds its fixed star position; used in edges
      "th": "ai",               // required; theme id
      "kind": "repo",           // free badge label (repo / section / source / person …)
      "t": "Node title",        // required, shown on the sphere
      "s": "One summary sentence (panel + hover tooltip).",
      "o": "Objective sentence (fillable by the AI pass).",
      "repo": "repo-name", "path": "optional subfolder",   // GitHub: builds “open in repo”
      "p": "https://…GitHub-Pages-url…",  // enables live page thumbnail + “open live”
      "h": "https://…any-other-url…",     // secondary “site” link
      "f": ["key/file.js", "README.md"],  // key files or sources
      "tags": ["keyword", "context"],     // drawn as chips, weighted in link building
      "g": "https://…generic-url…", "conf": "high | med | unread-page-live" }
  ],
  "edges": [
    [ "id-a", "id-b", "relation word", "why this relation exists" ]  // why shows on the active line
  ]
}`;

const DOC_EMBED_STATIC = `<!-- 1 · the mount point, anywhere on any page -->
<div id="ideas-sphere" style="height:100vh;width:100%"></div>

<!-- 2 · React runtime + JSX compiler (no build step) -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>

<!-- 3 · save the whole component file as ideas-sphere.jsx and append at its end:
       ReactDOM.createRoot(document.getElementById("ideas-sphere")).render(React.createElement(App));
     then include it: -->
<script src="ideas-sphere.jsx" type="text/babel" data-presets="react"></script>`;

const DOC_EMBED_REACT = `import App from "./ideas-sphere";
import myData from "./my-map.json";

// bare embed (GitHub sphere only, hooks on the “+” tab):
root.render(<App />);

// embed with one or more of your own datasets preloaded as tabs:
root.render(<App datasets={[myData]} />);`;

const DOC_EMBED_DATA = `// your own source needs no widget changes — build the dataset anywhere
// (script, CI job, server) and load it at runtime:
fetch("https://example.com/my-map.json")
  .then((r) => r.json())
  .then((ds) => root.render(React.createElement(App, { datasets: [ds] })));

// or paste the same JSON at runtime: “+” tab → “paste raw dataset JSON”.
// export any state of the ball from the A_ hook (JSON: dataset + config).`;

function DocsPanel({ open, onClose }) {
  if (!open) return null;
  const H = ({ children }) => <h3 className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-emerald-300/80">{children}</h3>;
  const Pre = ({ children }) => <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-black/60 p-2.5 font-mono text-[10px] leading-snug text-white/75">{children}</pre>;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/75 p-2 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-emerald-300/25 bg-[#0b1210]/97 shadow-2xl backdrop-blur" onClick={(e) => e.stopPropagation()}>
        <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-4 py-2">
          <span className="bi-tabfont min-w-0 flex-1 truncate text-[12px] text-white/70">Ideas Sphere — reference documentation</span>
          <button onClick={onClose} className="text-[12px] text-white/40 hover:text-white" title="close the documentation">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 text-[11px] leading-relaxed text-white/70">
          <H>What this is</H>
          <p className="mt-1">An interactive 3D sphere mind-map of interconnected ideas, rendered as dispersing stars with great-circle relation lines. One self-contained React component, no build step, no authentication: every data request goes to public endpoints with cross-origin allowed. Embeddable on any page by script or as a React component.</p>

          <H>Interaction</H>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            <li>Drag the sphere to rotate; a quick flick leaves it spinning with inertia; grabbing it stops it dead; it resumes a slow idle spin a few seconds after you let go.</li>
            <li>Mouse wheel or pinch zooms (0.45–2.4). Two fingers or click-drag never scroll the host page.</li>
            <li>The frontmost idea is always expanded in the floating panel; hover any star for a tooltip; clicking a star pins it until you click elsewhere.</li>
            <li>With the panel docked, the sphere rides higher in its area, so stars and panel overlap minimally; the legend sits in the ball area's top-left corner and lists every group with its live star count.</li>
            <li>The floating panel drags by its handle bar, resizes from the corner, minimizes to a strip, and glides (never jumps) out of the way of the focused node about once a second; the dance pauses while your pointer is on the panel.</li>
            <li>Theme chips: click spins the sphere to a group, shift-click hides or shows it. Search belongs to the active tab (clears on switch) and filters stars live; Enter spins to the first match. ⚙ opens size, line faintness, spin, inertia, labels switches.</li>
            <li>Tabs: the fixed “GitHub sphere” tab holds the curated map. “+” opens a fresh tab with all data hooks; loaded tabs close with ✕; other loaded tabs appear as faint breathing ghost balls at the edge — one tap refocuses them.</li>
            <li>The A_ hook under the sphere exports the current dataset and configuration as JSON (copy, download, or spawn as a new map tab).</li>
          </ul>

          <H>Data extraction logic</H>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            <li>GitHub hook: lists a public profile's repos (api.github.com, no token, 60 req/h), one idea node per repo with its description, one theme per language; GitHub Pages sites are detected and get live thumbnails. Wikipedia/HN hooks: search APIs return top hits that radiate from a query node; each falls through a chain of fallback mirrors when a direct call is blocked.</li>
            <li>URL reader: any address is fetched through r.jina.ai (reader proxy) or an HTML-stripping mirror; Markdown headings split the page into section nodes (plain pages fall back to paragraph pairs). Edges: “expands” from the source, “follows” along reading order.</li>
            <li>Search-result maps additionally group hits from the same hostname with “same site” edges.</li>
            <li>Relation builder (all hooks): tokens of 4+ characters, stop-words excluded, title and tag words weighted 2, summary 1; pairs score by weighted overlap, ranked strongest-first, each node capped at 6 links; the relation word shown on the line is the most significant shared term.</li>
            <li>Layout: themes sit as continents on a Fibonacci-sphere lattice; each theme's nodes fill a golden-angle sunflower disc on its continent; 110 iterations of force relaxation keep stars at least one rest-length apart, pull linked stars together and hold groups cohesive, re-projecting every point back onto the sphere surface. A per-id hash jitters each star's radius and angle, so every map loads identically but never looks like a lattice.</li>
            <li>AI pass (optional, free Pollinations helper): writes one objective sentence per node on top of any loaded dataset; an editable prompt ships along.</li>
          </ul>

          <H>Data format — idea-sphere/v1</H>
          <p className="mt-1">Hand-write it, generate it, or export it from A_. Edges may exist before any auto-relation is built; both merge. Unlinked files, unknown fields and missing optionals are tolerated.</p>
          <Pre>{DOC_FORMAT}</Pre>
          <p className="mt-2">Loading routes: paste the JSON under “+” (paste raw dataset); fetch it from your own server with the snippet below; or edit the HUB constant at the top of the file to re-curator the default sphere.</p>

          <H>Embedding — any static page, no build</H>
          <Pre>{DOC_EMBED_STATIC}</Pre>

          <H>Embedding — inside an existing React app</H>
          <Pre>{DOC_EMBED_REACT}</Pre>

          <H>Embedding — your own data source</H>
          <Pre>{DOC_EMBED_DATA}</Pre>
          <p className="mt-2">For a hook that builds datasets in the browser, write one async function <span className="font-mono text-white/85">run(arg, log)</span> that returns a complete idea-sphere/v1 object and register it in the HOOKS list — it gets a card with an input, a generate button, an AI pass and its own logged status line.</p>
          <p className="mb-2 mt-4 text-[10px] text-white/35">No keys, no tracking: all requests go to api.github.com, wikipedia.org, hn.algolia.com, r.jina.ai, s0.wp.com, image.thum.io and text.pollinations.ai over plain public CORS-open endpoints.</p>
        </div>
      </div>
    </div>
  );
}



/* ---------- floating description panel: drag, resize, minimize, scroll, and a slow "royal dance" that glides it out of the focused node's way ---------- */

function FloatPanel({ title, onClose, children, ballApi, focusId, defaultW, onMini }) {
  const ref = useRef(null);
  const [shift, setShift] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: defaultW || 340, h: 420 });
  const [mini, setMini] = useState(false);
  const [dragging, setDragging] = useState(false);
  const pausedRef = useRef(false);
  const dragR = useRef(null);

  /* dock into the corner on first mount: cap the panel to the host so it hugs the lower screen */
  useEffect(() => {
    const el = ref.current; if (!el || !el.offsetParent) return;
    const host = el.offsetParent;
    setSize((s) => ({ w: Math.max(210, Math.min(s.w, host.clientWidth - 28)), h: Math.max(150, Math.min(s.h, host.clientHeight - 60)) }));
  }, []);
  useEffect(() => { if (onMini) onMini(mini); }, [mini, onMini]);

  const hadFocus = useRef(false);
  // re-home only when focus is first acquired, not on every frontmost-node change while spinning
  useEffect(() => {
    if (focusId && !hadFocus.current) { pausedRef.current = false; setShift({ x: 0, y: 0 }); setOffset({ x: 0, y: 0 }); }
    hadFocus.current = !!focusId;
  }, [focusId]);
  const focusRefP = useRef(null); focusRefP.current = focusId;
  useEffect(() => {
    const iv = setInterval(() => {
      const fid = focusRefP.current;
      if (pausedRef.current || mini || !fid || !ballApi || !ballApi.current || !ballApi.current.nodeScreenPos) return;
      const el = ref.current; if (!el || !el.offsetParent) return;
      const host = el.offsetParent;
      const r = el.getBoundingClientRect(), hr = host.getBoundingClientRect();
      const px = r.left - hr.left, py = r.top - hr.top, pw = r.width, ph = r.height;
      const p = ballApi.current.nodeScreenPos(fid);
      if (!p) return;
      const pad = 26, nr = 66;
      const hit = (x, y) => p.x + nr > x - pad && p.x - nr < x + pw + pad && p.y + nr > y - pad && p.y - nr < y + ph + pad;
      if (!hit(px, py)) { setShift((s) => (s.x || s.y) ? { x: 0, y: 0 } : s); return; }
      const cands = [];
      for (let k = 1; k <= 5; k++) [[-k, 0], [k, 0], [0, -k], [0, k], [-k, k], [k, k], [-k, -k], [k, -k]].forEach(([a, b]) => cands.push({ x: a * 44, y: b * 38 }));
      cands.sort((a, b) => (a.x * a.x + a.y * a.y) - (b.x * b.x + b.y * b.y));
      for (const c of cands) {
        const nx = px + c.x, ny = py + c.y;
        if (nx < 6 || ny < 40 || nx + pw > host.clientWidth - 6 || ny + ph > host.clientHeight - 6) continue;
        if (!hit(nx, ny)) { setShift((s) => (s.x === c.x && s.y === c.y) ? s : { x: c.x, y: c.y }); return; }
      }
    }, 1100);
    return () => clearInterval(iv);
  }, [mini, ballApi]);

  const onDragStart = (e) => {
    if (e.target.closest("button")) return;
    dragR.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y };
    pausedRef.current = true; setDragging(true);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
  };
  const onDragMove = (e) => {
    if (!dragR.current) return;
    const el = ref.current, host = el && el.offsetParent;
    if (!host) return;
    const r = el.getBoundingClientRect(), hr = host.getBoundingClientRect();
    const baseL = r.left - hr.left - shift.x - offset.x; // anchor point without any offsets
    const baseT = r.top - hr.top - shift.y - offset.y;
    const dx = e.clientX - dragR.current.sx, dy = e.clientY - dragR.current.sy;
    const nl = Math.max(-(baseL + r.width - 90), Math.min(baseL + dx, host.clientWidth - 90)) - baseL;
    const nt = Math.max(-(baseT + r.height - 44), Math.min(baseT + dy, host.clientHeight - 44)) - baseT;
    setOffset({ x: nl, y: nt });
  };
  const endDrag = () => { dragR.current = null; setDragging(false); pausedRef.current = false; };
  const onResizeStart = (e) => {
    e.stopPropagation();
    dragR.current = { sx: e.clientX, sy: e.clientY, w: size.w, h: size.h };
    pausedRef.current = true; setDragging(true);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
  };
  const onResizeMove = (e) => {
    if (!dragR.current || dragR.current.w === undefined) return;
    const host = ref.current && ref.current.offsetParent;
    const maxW = host ? host.clientWidth - 24 : 560, maxH = host ? host.clientHeight - 60 : 640;
    setSize({
      w: Math.max(210, Math.min(maxW, dragR.current.w + (e.clientX - dragR.current.sx))),
      h: Math.max(120, Math.min(maxH, dragR.current.h + (e.clientY - dragR.current.sy))),
    });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { if (!dragR.current) pausedRef.current = false; }}
      onPointerDown={() => { pausedRef.current = true; }}
      onPointerUp={() => { if (!dragR.current) pausedRef.current = false; }}
      onPointerCancel={() => { if (!dragR.current) pausedRef.current = false; }}
      className="absolute bottom-3 right-3 z-[210] flex flex-col overflow-hidden rounded-xl border border-emerald-300/30 bg-[#0b1210]/95 shadow-2xl backdrop-blur-md"
      style={{
        width: Math.min(size.w, 380), height: mini ? 40 : size.h,
        maxHeight: "calc(100% - 12px)", maxWidth: "88vw",
        transform: `translate(${shift.x + offset.x}px, ${shift.y + offset.y}px)`,
        transition: dragging ? "none" : "transform 1.5s cubic-bezier(0.32, 0, 0.18, 1), width 0.4s ease, height 0.4s ease",
      }}>
      <div onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={endDrag} onPointerCancel={endDrag}
        className="flex shrink-0 cursor-grab items-center gap-2 border-b border-white/10 px-3 py-1.5 active:cursor-grabbing" title="drag to move the panel">
        <span className="text-[10px] text-white/30">⠿</span>
        <span className="min-w-0 flex-1 truncate text-[11px] text-white/60">{title || ""}</span>
        <button onClick={() => setMini((m) => !m)} className="text-[11px] text-white/40 hover:text-white" title={mini ? "expand the panel" : "minimize the panel"}>{mini ? "□" : "–"}</button>
        <button onClick={onClose} className="text-[11px] text-white/40 hover:text-white" title="hide the description panel">✕</button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto" style={mini ? { display: "none" } : null}>
        {children}
      </div>
      {!mini && (
        <div onPointerDown={onResizeStart} onPointerMove={onResizeMove} onPointerUp={endDrag} onPointerCancel={endDrag}
          className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize"
          title="drag to resize" style={{ touchAction: "none" }}>
          <div className="absolute bottom-1 right-1 h-2.5 w-2.5 border-b border-r border-white/25" />
        </div>
      )}
    </div>
  );
}

function Screen({ dataset, chrome, hookControls, aSection, config, setConfig, tabs, activeTab, onSelectTab, onCloseTab, onRequestNewTab }) {
  const [focusId, setFocusIdRaw] = useState(null);
  const [autoMode, setAutoMode] = useState(true);
  const [hoverId, setHoverId] = useState(null);
  const [query, setQuery] = useState("");
  const [showCfg, setShowCfg] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [hiddenThemes, setHiddenThemes] = useState({});
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelMini, setPanelMini] = useState(false);
  const handleMini = useCallback((m) => setPanelMini(m), []);
  const [visible, setVisible] = useState({ nodes: [], edges: [], themes: [] });
  const ballApi = useRef(null);

  useEffect(() => {
    if (!dataset) { setVisible({ nodes: [], edges: [], themes: [] }); return; }
    const q = query.trim().toLowerCase();
    const match = (n) => !q || (n.t + " " + (n.s || "") + " " + (n.tags || []).join(" ") + " " + (n.repo || "")).toLowerCase().includes(q);
    setVisible({
      meta: dataset.meta,
      themes: dataset.themes.filter((t) => !hiddenThemes[t.id]),
      nodes: dataset.nodes.filter((n) => !hiddenThemes[n.th] && match(n)),
      edges: dataset.edges,
    });
  }, [dataset, query, hiddenThemes]);

  useEffect(() => { setFocusIdRaw(null); setAutoMode(true); }, [dataset]);
  /* search and hidden groups belong to the tab they were made on: switching tabs starts clean */
  useEffect(() => { setQuery(""); setHiddenThemes({}); }, [activeTab, dataset]);
  const searchJump = () => {
    const first = visible.nodes[0];
    if (first && ballApi.current) { setFocus(first.id, false); ballApi.current.rotateTo(first.id); }
  };

  const setFocus = useCallback((id, isAuto) => { setFocusIdRaw(id); setAutoMode(!!isAuto); }, []);
  useEffect(() => { if (focusId && ballApi.current && !autoMode) ballApi.current.rotateTo(focusId); }, [focusId, autoMode]);

  const nodesById = useMemo(() => { const m = {}; (dataset ? dataset.nodes : []).forEach((n) => m[n.id] = n); return m; }, [dataset]);
  const themeCounts = useMemo(() => { const m = {}; (visible.nodes || []).forEach((n) => { m[n.th] = (m[n.th] || 0) + 1; }); return m; }, [visible.nodes]);
  const focusNode = focusId && nodesById[focusId] ? nodesById[focusId] : null;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-emerald-200/20 bg-[#0b1210]/70 shadow-[0_10px_40px_rgba(0,80,50,0.35)]">
      <div className="bi-serif flex items-center gap-1 overflow-x-auto border-b border-white/10 px-3 py-2">
        {(tabs || []).map((tb) => (
          <span key={tb.id} className={"flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 transition " + (tb.id === activeTab ? "bg-white/10" : "hover:bg-white/5")}>
            {tb.waiting ? (
              <button onClick={() => { if (tb.id === activeTab) onRequestNewTab && onRequestNewTab(tb.id); else onSelectTab(tb.id); }} title={(tb.hint || tb.label) + (tb.id === activeTab ? " · click again to open another new tab" : "")} className="flex items-baseline gap-1.5">
                <span className="text-[19px] font-light leading-none text-white/30 transition hover:text-white/60" style={{ textShadow: "0 1px 1px rgba(0,0,0,0.9), 0 -1px 0 rgba(255,255,255,0.12)" }}>+</span>
                <span className="bi-tabfont hidden whitespace-nowrap text-[13px] text-white/25 transition hover:text-white/50 sm:inline">{tb.sub || "new mindmap"}</span>
              </button>
            ) : (
              <button onClick={() => onSelectTab(tb.id)} title={tb.hint || tb.label}>
                <span className={"bi-tabfont whitespace-nowrap text-[15px] transition " + (tb.id === activeTab ? "text-white" : "text-white/45 hover:text-white/80")}>{tb.label}</span>
              </button>
            )}
            {(!tb.fixed && !tb.waiting) && (
              <button onClick={(e) => { e.stopPropagation(); onCloseTab && onCloseTab(tb.id); }} className="text-[11px] text-white/25 hover:text-white/80" title="close this tab">✕</button>
            )}
          </span>
        ))}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 pl-2">
          <button onClick={() => setPanelOpen((o) => !o)} className={"rounded-lg border px-2.5 py-1 text-xs transition " + (panelOpen ? "border-emerald-300/60 text-white" : "border-white/25 bg-black/40 text-white/70 hover:text-white")} title="show / hide the floating description panel">◧</button>
          <button onClick={() => setShowCfg((s) => !s)} className={"rounded-lg border px-2.5 py-1 text-xs transition " + (showCfg ? "border-emerald-300/60 text-white" : "border-white/25 bg-black/40 text-white/70 hover:text-white")} title="ball configuration">⚙</button>
          <button onClick={() => setShowDocs(true)} className="rounded-lg border border-white/25 bg-black/40 px-2.5 py-1 text-xs text-white/70 transition hover:text-white" title="what this is · how it works · data format · how to embed it">?</button>
          <DocsPanel open={showDocs} onClose={() => setShowDocs(false)} />
        </div>
      </div>
      <div className="flex items-center gap-2 border-b border-white/5 px-3 py-1.5">
        <span className="text-[10px] text-white/35">⌕</span>
        <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") searchJump(); }}
          placeholder={"search ideas in “" + ((dataset && dataset.meta && dataset.meta.title) || "this map").slice(0, 28) + "” · Enter jumps to the best match"}
          className="min-w-0 flex-1 rounded-lg border border-white/15 bg-black/40 px-3 py-1 text-xs text-white/85 placeholder-white/30 outline-none focus:border-white/40" />
        {query && <button onClick={searchJump} className="shrink-0 rounded-lg border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] text-white/60 hover:text-white" title="spin to the first match">→ {visible.nodes.length}</button>}
      </div>
      <div className="relative min-h-[300px] flex-1 sm:min-h-[430px]">
        <Ball dataset={visible} config={config} focusId={focusId} hoverId={hoverId} setHover={setHoverId} setFocus={setFocus} apiRef={ballApi} muted={showCfg} pinned={!autoMode} centerLift={panelOpen && !panelMini || showCfg ? 0.14 : 0} />
        {dataset && dataset.themes && dataset.themes.length > 0 && themeCounts && (
          <div className="pointer-events-auto absolute left-2 top-2 z-[5] max-h-[56%] max-w-[60%] overflow-y-auto rounded-xl border border-white/10 bg-black/40 p-1.5 backdrop-blur-sm sm:max-w-[44%]" title="legend of the sphere's groups">
            {dataset.themes.map((t) => {
              const off = !!hiddenThemes[t.id];
              return (
                <button key={t.id} title="click: spin to this group · shift-click: hide/show"
                  onClick={(e) => { if (e.shiftKey) { setHiddenThemes((h) => ({ ...h, [t.id]: !h[t.id] })); } else if (!off && ballApi.current) { setFocusIdRaw(null); ballApi.current.rotateToTheme(t.id); } }}
                  className="flex w-full items-center justify-between gap-2 rounded-full px-2 py-0.5 text-[10px] transition hover:bg-white/5"
                  style={{ borderColor: t.color + (off ? "22" : "88"), color: off ? "rgba(255,255,255,.3)" : t.color, border: "1px solid " + t.color + (off ? "22" : "66"), background: off ? "transparent" : t.color + "10" }}>
                  <span className="flex min-w-0 items-center gap-1.5"><span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: t.color, opacity: off ? 0.3 : 1 }} /><span className="truncate">{t.name}</span></span>
                  <span className="shrink-0 font-mono text-white/35">{themeCounts[t.id] || 0}</span>
                </button>
              );
            })}
          </div>
        )}
        {showCfg && (
          <div className="absolute bottom-3 left-3 z-[220] w-64 max-w-[78vw]"><ConfigPanel config={config} setConfig={setConfig} /></div>
        )}
        {panelOpen && (
          <FloatPanel title={(dataset && dataset.meta && dataset.meta.title) || ""} onClose={() => setPanelOpen(false)} ballApi={ballApi} focusId={focusId} defaultW={340} onMini={handleMini}>
            {dataset && dataset.meta && dataset.meta.verified && (
              <p className="bi-tabfont border-b border-emerald-300/10 px-4 py-1.5 text-[9px] leading-snug text-emerald-200/45" title="live test record for this dataset">{dataset.meta.verified}</p>
            )}
            {chrome}
            {hookControls}
            <Detail node={focusNode} dataset={dataset || visible} nodesById={dataset ? nodesById : {}} pinned={!autoMode} setFocus={setFocus} />
          </FloatPanel>
        )}
        {(tabs || []).filter((t) => t.id !== activeTab && !t.waiting && t.dataset).map((tb, i) => (
          <button key={tb.id} onClick={() => onSelectTab(tb.id)} title={tb.hint || tb.label + " — tap to bring this sphere into focus"}
            className="pointer-events-auto absolute z-[3] hidden items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-center shadow-[0_0_20px_rgba(255,255,255,0.04)] transition hover:border-white/40 hover:bg-white/[0.07] sm:flex"
            style={{
              width: 54 + (i % 3) * 14, height: 54 + (i % 3) * 14,
              left: 14 + (i % 4) * 21 + "%", top: 16 + ((i * 27) % 55) + "%",
              opacity: 0.22, transitionProperty: "opacity, border-color, background",
              animation: "bi-ghost " + (4.5 + (i % 5) * 1.3) + "s ease-in-out infinite",
              animationDelay: (i * 0.8) + "s",
            }}>
            <span className="text-[10px] leading-tight text-white/70">{tb.label.slice(0, 12)}</span>
          </button>
        ))}
      </div>
      {aSection && (
        <div className="border-t border-white/5 px-4 pt-0.5">
          {aSection}
        </div>
      )}
      <p className="hidden px-4 pb-3 text-center text-[10px] text-white/40 sm:block">drag / flick the sphere · ? explains everything, including embedding</p>
    </div>
  );
}

/* ---------- App ---------- */

const EMPTY_DS = { meta: { title: "New mindmap — waiting for a data source", source: "", schema: "idea-sphere/v1" }, themes: [], nodes: [], edges: [] };

/* datasets: optional array of idea-sphere/v1 datasets preloaded as extra tabs when embedding */
function App({ datasets }) {
  const preloaded = (datasets || []).filter((d) => d && d.meta && d.nodes).map((d, i) => ({
    id: "pre-" + i + "-" + String(d.meta.title || "map").replace(/[^a-z0-9]+/gi, "-").slice(0, 24),
    label: String(d.meta.title || "map " + (i + 1)).slice(0, 26),
    kind: "loaded", dataset: d, hint: d.meta.subtitle || "",
  }));
  const [tabs, setTabs] = useState([
    { id: "hub", label: "GitHub sphere", fixed: true, dataset: HUB, kind: "github" },
    ...preloaded,
    { id: "plus0", label: "+", kind: "plus", waiting: true, hint: "new mindmap — pick a data source" },
  ]);
  const [activeTab, setActiveTab] = useState("hub");
  const [aOpen, setAOpen] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const tabsRef = useRef(tabs); tabsRef.current = tabs;

  const tab = tabs.find((t) => t.id === activeTab) || tabs[0];
  const dataset = tab.waiting ? EMPTY_DS : tab.dataset;

  /* loading a dataset fills the nearest waiting "+" tab and always leaves a fresh one ready */
  const applyDataset = useCallback((d) => {
    if (!d || !d.meta) return;
    const label = d.meta.title || "Loaded map";
    const cur = tabsRef.current;
    const i = cur.findIndex((t) => t.waiting);
    const uid = "map-" + Math.floor(100000 + Math.random() * 899999).toString(36);
    const filled = { id: i >= 0 ? cur[i].id : uid, label, kind: "loaded", dataset: d, hint: d.meta.subtitle || label, waiting: false };
    const base = i >= 0 ? cur.map((t, k) => (k === i ? filled : t)) : cur.concat([filled]);
    const next = base.some((t) => t.waiting)
      ? base
      : base.concat([{ id: "plus-" + uid, label: "+", kind: "plus", waiting: true, hint: "new mindmap — pick a data source" }]);
    setTabs(next);
    setActiveTab(filled.id);
  }, []);

  const closeTab = useCallback((id) => {
    if (id === "hub") return;
    const cur = tabsRef.current;
    const next = cur.filter((t) => t.id !== id);
    const withPlus = next.some((t) => t.waiting)
      ? next
      : next.concat([{ id: "plus-" + Math.floor(100000 + Math.random() * 899999).toString(36), label: "+", kind: "plus", waiting: true, hint: "new mindmap — pick a data source" }]);
    setTabs(withPlus);
    setActiveTab((a) => (a === id ? "hub" : a));
  }, []);

  /* a brand-new waiting tab is always possible — inserted right after the one clicked */
  const newTab = useCallback((fromId) => {
    const uid = "plus-" + Math.floor(100000 + Math.random() * 899999).toString(36);
    const t = { id: uid, label: "+", kind: "plus", waiting: true, hint: "new mindmap — pick a data source" };
    const cur = tabsRef.current;
    const i = cur.findIndex((x) => x.id === fromId);
    const next = i >= 0 ? cur.slice(0, i + 1).concat([t], cur.slice(i + 1)) : cur.concat([t]);
    setTabs(next);
    setActiveTab(uid);
  }, []);

  const aSection = (
    <ASection open={aOpen} onToggle={() => setAOpen((o) => !o)} dataset={HUB} config={config}
      onSendToHook={() => { applyDataset(HUB); setAOpen(false); }} />
  );

  return (
    <div className="relative flex h-screen w-full flex-col text-white" style={{ background: "#0a100e" }}>
      <style>{BI_CSS}</style>
      <div className="min-h-0 flex-1">
        <Screen
          dataset={dataset}
          config={config} setConfig={setConfig}
          tabs={tabs} activeTab={activeTab}
          onSelectTab={setActiveTab} onCloseTab={closeTab} onRequestNewTab={newTab}
          chrome={tab.id === "hub" ? (
            <div className="truncate">
              <a href={HUB.meta.source} target="_blank" rel="noreferrer" className="text-sm font-semibold text-white hover:underline">github.com/shek-hrd</a>
              <span className="ml-2 text-[11px] text-white/50">{HUB.meta.subtitle}</span>
            </div>
          ) : null}
          aSection={tab.id === "hub" ? aSection : null}
          hookControls={tab.id === "hub" ? null : <HookControls dataset={dataset} onApply={(d) => applyDataset(d)} onPullHub={() => applyDataset(HUB)} />}
        />
      </div>
    </div>
  );
}
// auto-mount when loaded as a standalone page script
if (typeof document !== "undefined") {
  const root = document.getElementById("ideas-sphere");
  if (root) ReactDOM.createRoot(root).render(React.createElement(App));
}
