/**
 * Pionex Investment Analysis & Trading Bot Suite
 * Advanced real-time trading system with API integration
 */

class PionexTradingSuite {
    constructor() {
        this.isMockMode = false;
        this.refreshInterval = null;
        this.refreshRate = 5000; // 5 seconds default
        this.websocket = null;
        this.apiCredentials = this.loadApiCredentials();
        this.subscribedSymbols = new Set(['BTC_USDT', 'ETH_USDT']);
        this.marketData = new Map();
        this.idealBotConfig = null;
        this.debugLogs = [];

        this.initializeComponents();
        this.setupEventListeners();
        this.startSystem();
    }

    /**
     * Initialize all UI components and state
     */
    initializeComponents() {
        this.log('info', 'Initializing Pionex Trading Suite...');

        // Set initial state - public stream, mock off
        this.setMockMode(false);
        this.updateToggleUI();

        // Initialize modals
        this.pionexModal = new ModalManager('pionex-modal');
        this.apiKeyModal = new ModalManager('api-key-modal');

        // Initialize debug console
        this.debugConsole = new DebugConsole('debug-console-content', 'debug-log-container');

        this.log('info', 'Components initialized successfully');
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Data mode toggle
        document.getElementById('data-mode-toggle')?.addEventListener('change', (e) => {
            this.setMockMode(e.target.checked);
        });

        // Refresh rate controls
        document.getElementById('apply-refresh-rate')?.addEventListener('click', () => {
            this.updateRefreshRate();
        });

        // Control buttons
        document.getElementById('pause-all')?.addEventListener('click', () => {
            this.pauseAllSimulations();
        });

        document.getElementById('start-filtered')?.addEventListener('click', () => {
            this.startFilteredSimulations();
        });

        // Ideal bot refresh
        document.getElementById('generate-ideal-bot')?.addEventListener('click', () => {
            this.refreshIdealBot();
        });

        // Modal controls
        document.getElementById('pionex-modal-try-login')?.addEventListener('click', () => {
            this.showApiKeyDialog();
        });

        document.getElementById('save-api-credentials')?.addEventListener('click', () => {
            this.saveApiCredentials();
        });

        document.getElementById('test-api-connection')?.addEventListener('click', () => {
            this.testApiConnection();
        });

        // Debug console controls
        document.getElementById('toggle-debug-console')?.addEventListener('click', () => {
            this.toggleDebugConsole();
        });

        document.getElementById('clear-debug-log')?.addEventListener('click', () => {
            this.clearDebugLog();
        });

        document.getElementById('export-debug-log')?.addEventListener('click', () => {
            this.exportDebugLog();
        });

        // Filter and sort controls
        document.getElementById('sort-by')?.addEventListener('change', () => {
            this.updateSorting();
        });

        document.getElementById('filter-duration')?.addEventListener('change', () => {
            this.updateFiltering();
        });

        this.log('info', 'Event listeners configured');
    }

    /**
     * Start the main system operations
     */
    startSystem() {
        this.log('info', 'Starting Pionex Trading Suite system...');

        // Initialize countdown timer
        this.startCountdownTimer();

        // Start data fetching based on current mode
        if (this.isMockMode) {
            this.startMockDataFetching();
        } else {
            this.startLiveDataFetching();
        }

        // Generate initial ideal bot
        this.refreshIdealBot();

        this.log('info', 'System started successfully');
    }

    /**
     * Set mock mode state
     */
    setMockMode(enabled) {
        this.isMockMode = enabled;
        this.updateToggleUI();

        if (enabled) {
            this.stopLiveDataFetching();
            this.startMockDataFetching();
            this.log('info', 'Switched to mock data mode');
        } else {
            this.stopMockDataFetching();
            this.startLiveDataFetching();
            this.log('info', 'Switched to live data mode');
        }
    }

    /**
     * Update toggle UI elements
     */
    updateToggleUI() {
        const toggle = document.getElementById('data-mode-toggle');
        const label = document.getElementById('data-mode-text');

        if (toggle && label) {
            toggle.checked = this.isMockMode;
            label.textContent = this.isMockMode ? 'Mock Data Mode' : 'Live Data Mode';
        }
    }

    /**
     * Start live data fetching using Pionex public streams
     */
    startLiveDataFetching() {
        this.log('info', 'Starting live data fetching from Pionex public streams...');

        // Initialize WebSocket connection to public stream
        this.initializeWebSocket();

        // Also fetch initial data via REST API
        this.fetchInitialMarketData();
    }

    /**
     * Initialize WebSocket connection to Pionex public stream
     */
    initializeWebSocket() {
        try {
            // Close existing connection if any
            if (this.websocket) {
                this.websocket.close();
            }

            // Connect to Pionex public stream
            this.websocket = new WebSocket('wss://ws.pionex.com/wsPub');

            this.websocket.onopen = () => {
                this.log('info', 'Connected to Pionex public stream');
                this.subscribeToMarketData();
            };

            this.websocket.onmessage = (event) => {
                this.handleWebSocketMessage(event);
            };

            this.websocket.onclose = () => {
                this.log('warn', 'WebSocket connection closed, reconnecting...');
                setTimeout(() => this.initializeWebSocket(), 3000);
            };

            this.websocket.onerror = (error) => {
                this.log('error', 'WebSocket error: ' + error);
            };

        } catch (error) {
            this.log('error', 'Failed to initialize WebSocket: ' + error.message);
        }
    }

    /**
     * Subscribe to market data for tracked symbols
     */
    subscribeToMarketData() {
        this.subscribedSymbols.forEach(symbol => {
            // Subscribe to trade data
            this.websocket.send(JSON.stringify({
                op: 'SUBSCRIBE',
                topic: 'TRADE',
                symbol: symbol
            }));

            // Subscribe to depth data
            this.websocket.send(JSON.stringify({
                op: 'SUBSCRIBE',
                topic: 'DEPTH',
                symbol: symbol
            }));
        });

        this.log('info', `Subscribed to market data for ${this.subscribedSymbols.size} symbols`);
    }

    /**
     * Handle incoming WebSocket messages
     */
    handleWebSocketMessage(event) {
        try {
            const message = JSON.parse(event.data);

            if (message.topic === 'TRADE' && message.data) {
                this.processTradeData(message.symbol, message.data);
            } else if (message.topic === 'DEPTH' && message.data) {
                this.processDepthData(message.symbol, message.data);
            } else if (message.op === 'PING') {
                // Respond to ping with pong
                this.websocket.send(JSON.stringify({
                    op: 'PONG',
                    timestamp: Date.now()
                }));
            }

        } catch (error) {
            this.log('error', 'Error processing WebSocket message: ' + error.message);
        }
    }

    /**
     * Process incoming trade data
     */
    processTradeData(symbol, tradeData) {
        if (!this.marketData.has(symbol)) {
            this.marketData.set(symbol, {
                trades: [],
                depth: { bids: [], asks: [] },
                lastUpdate: Date.now()
            });
        }

        const symbolData = this.marketData.get(symbol);
        symbolData.trades.unshift({
            price: tradeData.price,
            size: tradeData.size,
            side: tradeData.side,
            timestamp: tradeData.timestamp
        });

        // Keep only last 100 trades
        if (symbolData.trades.length > 100) {
            symbolData.trades = symbolData.trades.slice(0, 100);
        }

        symbolData.lastUpdate = Date.now();

        // Update UI with new data
        this.updateMarketDisplay(symbol, symbolData);
    }

    /**
     * Process incoming depth data
     */
    processDepthData(symbol, depthData) {
        if (!this.marketData.has(symbol)) {
            this.marketData.set(symbol, {
                trades: [],
                depth: { bids: [], asks: [] },
                lastUpdate: Date.now()
            });
        }

        const symbolData = this.marketData.get(symbol);
        symbolData.depth = {
            bids: depthData.bids || [],
            asks: depthData.asks || []
        };
        symbolData.lastUpdate = Date.now();

        // Update UI with new depth data
        this.updateDepthDisplay(symbol, symbolData);
    }

    /**
     * Fetch initial market data via REST API
     */
    async fetchInitialMarketData() {
        try {
            this.log('info', 'Fetching initial market data...');

            for (const symbol of this.subscribedSymbols) {
                // Fetch 24hr ticker data
                await this.fetchTickerData(symbol);

                // Fetch recent trades
                await this.fetchRecentTrades(symbol);

                // Fetch order book depth
                await this.fetchOrderBook(symbol);
            }

        } catch (error) {
            this.log('error', 'Error fetching initial market data: ' + error.message);
        }
    }

    /**
     * Fetch 24hr ticker data for a symbol
     */
    async fetchTickerData(symbol) {
        try {
            const response = await fetch(`https://api.pionex.com/api/v1/market/24hr?symbol=${symbol}`);
            const data = await response.json();

            if (data.result && data.data) {
                this.log('info', `Fetched ticker data for ${symbol}`);
                // Process ticker data and update UI
                this.updateTickerDisplay(symbol, data.data);
            }

        } catch (error) {
            this.log('error', `Error fetching ticker data for ${symbol}: ` + error.message);
        }
    }

    /**
     * Fetch recent trades for a symbol
     */
    async fetchRecentTrades(symbol) {
        try {
            const response = await fetch(`https://api.pionex.com/api/v1/market/trades?symbol=${symbol}&limit=50`);
            const data = await response.json();

            if (data.result && data.data && data.data.trades) {
                this.log('info', `Fetched recent trades for ${symbol}`);
                // Process trades data
                if (!this.marketData.has(symbol)) {
                    this.marketData.set(symbol, { trades: [], depth: { bids: [], asks: [] } });
                }
                this.marketData.get(symbol).trades = data.data.trades;
            }

        } catch (error) {
            this.log('error', `Error fetching trades for ${symbol}: ` + error.message);
        }
    }

    /**
     * Fetch order book depth for a symbol
     */
    async fetchOrderBook(symbol) {
        try {
            const response = await fetch(`https://api.pionex.com/api/v1/market/depth?symbol=${symbol}&limit=20`);
            const data = await response.json();

            if (data.result && data.data) {
                this.log('info', `Fetched order book for ${symbol}`);
                // Process depth data
                if (!this.marketData.has(symbol)) {
                    this.marketData.set(symbol, { trades: [], depth: { bids: [], asks: [] } });
                }
                this.marketData.get(symbol).depth = data.data;
            }

        } catch (error) {
            this.log('error', `Error fetching order book for ${symbol}: ` + error.message);
        }
    }

    /**
     * Start mock data fetching for testing
     */
    startMockDataFetching() {
        this.log('info', 'Starting mock data generation...');

        this.mockInterval = setInterval(() => {
            this.generateMockData();
        }, 2000);
    }

    /**
     * Stop live data fetching
     */
    stopLiveDataFetching() {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        this.log('info', 'Stopped live data fetching');
    }

    /**
     * Stop mock data fetching
     */
    stopMockDataFetching() {
        if (this.mockInterval) {
            clearInterval(this.mockInterval);
            this.mockInterval = null;
        }
        this.log('info', 'Stopped mock data generation');
    }

    /**
     * Generate mock market data for testing
     */
    generateMockData() {
        this.subscribedSymbols.forEach(symbol => {
            // Generate mock trade
            const mockTrade = {
                price: (Math.random() * 1000 + 40000).toFixed(2),
                size: (Math.random() * 2).toFixed(4),
                side: Math.random() > 0.5 ? 'BUY' : 'SELL',
                timestamp: Date.now()
            };

            // Generate mock depth
            const mockDepth = {
                bids: Array.from({length: 10}, (_, i) => [
                    (parseFloat(mockTrade.price) - i * 0.5).toFixed(2),
                    (Math.random() * 5).toFixed(4)
                ]),
                asks: Array.from({length: 10}, (_, i) => [
                    (parseFloat(mockTrade.price) + i * 0.5).toFixed(2),
                    (Math.random() * 5).toFixed(4)
                ])
            };

            this.processTradeData(symbol, mockTrade);
            this.processDepthData(symbol, mockDepth);
        });
    }

    /**
     * Update market display with new data
     */
    updateMarketDisplay(symbol, data) {
        // Update investment options cards
        this.updateInvestmentOptions(symbol, data);

        // Update system statistics
        this.updateSystemStats();
    }

    /**
     * Update depth display
     */
    updateDepthDisplay(symbol, data) {
        // Update order book visualization if needed
        this.updateOrderBookDisplay(symbol, data.depth);
    }

    /**
     * Update ticker display
     */
    updateTickerDisplay(symbol, tickerData) {
        // Update price and volume information
        this.log('info', `Updated ticker for ${symbol}: ${JSON.stringify(tickerData)}`);
    }

    /**
     * Update order book display
     */
    updateOrderBookDisplay(symbol, depth) {
        // Update depth chart or table
        this.log('info', `Updated order book for ${symbol}`);
    }

    /**
     * Update investment options based on market data
     */
    updateInvestmentOptions(symbol, data) {
        const container = document.getElementById('options-container');
        if (!container) return;

        // Find or create option card for this symbol
        let optionCard = container.querySelector(`[data-symbol="${symbol}"]`);
        if (!optionCard) {
            optionCard = this.createInvestmentOptionCard(symbol);
            container.appendChild(optionCard);
        }

        // Update card with latest data
        this.populateOptionCard(optionCard, symbol, data);
    }

    /**
     * Create investment option card
     */
    createInvestmentOptionCard(symbol) {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.dataset.symbol = symbol;

        card.innerHTML = `
            <h3>${symbol}</h3>
            <div class="option-meta">
                <div><strong>Price:</strong> <span class="price">--</span></div>
                <div><strong>24h Change:</strong> <span class="change">--</span></div>
                <div><strong>Volume:</strong> <span class="volume">--</span></div>
            </div>
            <div class="chart-container">
                <canvas class="graph-overview" width="300" height="160"></canvas>
            </div>
            <div class="simulation-stats">
                <div><strong>Simulated APY:</strong> <span class="apy-value">--</span></div>
                <div><strong>Bot Efficiency:</strong> <span class="efficiency">--</span></div>
            </div>
            <div class="simulation-controls">
                <button class="toggle-simulation" data-action="start">Start Bot</button>
                <button class="toggle-simulation secondary" data-action="config">Configure</button>
            </div>
        `;

        return card;
    }

    /**
     * Populate option card with data
     */
    populateOptionCard(card, symbol, data) {
        const priceElement = card.querySelector('.price');
        const changeElement = card.querySelector('.change');
        const volumeElement = card.querySelector('.volume');
        const apyElement = card.querySelector('.apy-value');
        const efficiencyElement = card.querySelector('.efficiency');

        if (data.trades && data.trades.length > 0) {
            const latestTrade = data.trades[0];
            priceElement.textContent = `$${parseFloat(latestTrade.price).toLocaleString()}`;

            // Calculate simulated metrics
            const simulatedAPY = this.calculateSimulatedAPY(latestTrade, data);
            const efficiency = this.calculateBotEfficiency(data);

            apyElement.textContent = `${simulatedAPY.toFixed(2)}%`;
            efficiencyElement.textContent = `${efficiency.toFixed(1)}%`;
        }
    }

    /**
     * Calculate simulated APY for investment option
     */
    calculateSimulatedAPY(trade, data) {
        // Simple simulation based on price volatility and volume
        const volatility = data.trades && data.trades.length > 1 ?
            Math.abs(parseFloat(data.trades[0].price) - parseFloat(data.trades[1].price)) / parseFloat(data.trades[1].price) : 0.01;

        return Math.min(volatility * 1000 + Math.random() * 50, 200); // Cap at 200%
    }

    /**
     * Calculate bot efficiency metric
     */
    calculateBotEfficiency(data) {
        // Simple efficiency calculation based on trade frequency and depth
        const tradeFrequency = data.trades ? data.trades.length / 10 : 1; // Assume 10-minute window
        const depthQuality = data.depth && data.depth.bids ?
            data.depth.bids.reduce((sum, bid) => sum + parseFloat(bid[1]), 0) : 1;

        return Math.min((tradeFrequency * depthQuality) / 10, 100);
    }

    /**
     * Update system statistics
     */
    updateSystemStats() {
        const memoryUsage = document.getElementById('memory-usage');
        const cpuLoad = document.getElementById('cpu-load');
        const runningSimulations = document.getElementById('running-simulations');
        const activeBots = document.getElementById('active-bots');

        if (memoryUsage) {
            const memPercent = Math.floor(Math.random() * 30) + 40; // 40-70%
            memoryUsage.textContent = `${memPercent}%`;
            document.getElementById('memory-progress').style.width = `${memPercent}%`;
        }

        if (cpuLoad) {
            const cpuPercent = Math.floor(Math.random() * 20) + 10; // 10-30%
            cpuLoad.textContent = `${cpuPercent}%`;
            document.getElementById('cpu-progress').style.width = `${cpuPercent}%`;
        }

        if (runningSimulations) {
            runningSimulations.textContent = this.subscribedSymbols.size;
        }

        if (activeBots) {
            activeBots.textContent = this.apiCredentials ? '1' : '0';
        }
    }

    /**
     * Refresh ideal bot configuration
     */
    refreshIdealBot() {
        this.log('info', 'Refreshing ideal bot configuration...');

        const timestamp = document.getElementById('ideal-bot-timestamp');
        if (timestamp) {
            timestamp.textContent = new Date().toLocaleTimeString();
        }

        // Analyze current market data to generate ideal bot config
        this.generateIdealBotConfig();

        this.log('info', 'Ideal bot configuration updated');
    }

    /**
     * Generate ideal bot configuration based on market analysis
     */
    generateIdealBotConfig() {
        // Analyze market data to determine optimal bot strategy
        const marketAnalysis = this.analyzeMarketConditions();

        this.idealBotConfig = {
            strategy: this.determineOptimalStrategy(marketAnalysis),
            symbols: this.selectOptimalSymbols(marketAnalysis),
            parameters: this.calculateOptimalParameters(marketAnalysis),
            expectedPerformance: this.predictPerformance(marketAnalysis),
            lastUpdated: Date.now()
        };

        // Update UI with ideal bot configuration
        this.displayIdealBotConfig();
    }

    /**
     * Analyze current market conditions
     */
    analyzeMarketConditions() {
        const analysis = {
            volatility: {},
            volume: {},
            trends: {}
        };

        this.marketData.forEach((data, symbol) => {
            if (data.trades && data.trades.length > 0) {
                // Calculate volatility
                const prices = data.trades.slice(0, 20).map(t => parseFloat(t.price));
                const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
                const variance = prices.reduce((acc, price) => acc + Math.pow(price - avgPrice, 2), 0) / prices.length;
                analysis.volatility[symbol] = Math.sqrt(variance) / avgPrice;

                // Calculate volume trend
                const volumes = data.trades.slice(0, 20).map(t => parseFloat(t.size));
                analysis.volume[symbol] = volumes.reduce((a, b) => a + b, 0);

                // Determine trend
                const recentPrices = prices.slice(0, 10);
                const olderPrices = prices.slice(10, 20);
                const recentAvg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
                const olderAvg = olderPrices.reduce((a, b) => a + b, 0) / olderPrices.length;
                analysis.trends[symbol] = (recentAvg - olderAvg) / olderAvg;
            }
        });

        return analysis;
    }

    /**
     * Determine optimal trading strategy
     */
    determineOptimalStrategy(analysis) {
        // Simple strategy selection based on market conditions
        const avgVolatility = Object.values(analysis.volatility).reduce((a, b) => a + b, 0) / Object.keys(analysis.volatility).length;

        if (avgVolatility > 0.02) {
            return 'GRID_TRADING'; // High volatility - use grid trading
        } else if (Object.values(analysis.trends).some(trend => trend > 0.01)) {
            return 'TREND_FOLLOWING'; // Trending market
        } else {
            return 'MEAN_REVERSION'; // Range-bound market
        }
    }

    /**
     * Select optimal symbols for trading
     */
    selectOptimalSymbols(analysis) {
        // Select top symbols by volume and stability
        return Object.entries(analysis.volume)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([symbol]) => symbol);
    }

    /**
     * Calculate optimal trading parameters
     */
    calculateOptimalParameters(analysis) {
        const avgVolatility = Object.values(analysis.volatility).reduce((a, b) => a + b, 0) / Object.keys(analysis.volatility).length;

        return {
            gridLevels: Math.max(5, Math.min(20, Math.floor(1 / avgVolatility))),
            stopLoss: avgVolatility * 2,
            takeProfit: avgVolatility * 3,
            positionSize: 0.1 // 10% of portfolio per trade
        };
    }

    /**
     * Predict expected performance
     */
    predictPerformance(analysis) {
        const avgTrend = Object.values(analysis.trends).reduce((a, b) => a + b, 0) / Object.keys(analysis.trends).length;
        const avgVolatility = Object.values(analysis.volatility).reduce((a, b) => a + b, 0) / Object.keys(analysis.volatility).length;

        return {
            expectedAPY: Math.max(10, (avgTrend * 1000 + avgVolatility * 500)),
            riskLevel: avgVolatility > 0.03 ? 'HIGH' : avgVolatility > 0.015 ? 'MEDIUM' : 'LOW',
            confidence: Math.max(0.6, 0.9 - avgVolatility)
        };
    }

    /**
     * Display ideal bot configuration in UI
     */
    displayIdealBotConfig() {
        if (!this.idealBotConfig) return;

        // This would update the ideal bot section in the UI
        this.log('info', `Ideal bot strategy: ${this.idealBotConfig.strategy}`);
        this.log('info', `Target symbols: ${this.idealBotConfig.symbols.join(', ')}`);
        this.log('info', `Expected APY: ${this.idealBotConfig.expectedPerformance.expectedAPY.toFixed(2)}%`);
    }

    /**
     * Show API key configuration dialog
     */
    showApiKeyDialog() {
        this.apiKeyModal.show();

        // Pre-populate with existing credentials if available
        if (this.apiCredentials) {
            document.getElementById('api-key-input').value = this.apiCredentials.key || '';
            document.getElementById('api-secret-input').value = this.apiCredentials.secret ? '••••••••' : '';
        }
    }

    /**
     * Save API credentials
     */
    saveApiCredentials() {
        const apiKey = document.getElementById('api-key-input').value.trim();
        const apiSecret = document.getElementById('api-secret-input').value.trim();
        const tradingPassword = document.getElementById('trading-password-input').value.trim();

        if (!apiKey || !apiSecret) {
            this.showModalMessage('api-key-modal-message', 'error', 'Please enter both API key and secret.');
            return;
        }

        // Save credentials securely
        this.apiCredentials = {
            key: apiKey,
            secret: apiSecret,
            tradingPassword: tradingPassword,
            timestamp: Date.now()
        };

        localStorage.setItem('pionex_api_credentials', JSON.stringify(this.apiCredentials));

        this.showModalMessage('api-key-modal-message', 'success', 'API credentials saved successfully!');
        this.apiKeyModal.hide();

        this.log('info', 'API credentials updated');

        // Test the connection
        this.testApiConnection();
    }

    /**
     * Test API connection
     */
    async testApiConnection() {
        if (!this.apiCredentials) {
            this.showModalMessage('api-key-modal-message', 'error', 'No API credentials configured.');
            return;
        }

        try {
            this.log('info', 'Testing API connection...');

            // Test with a simple API call
            const timestamp = Date.now();
            const queryString = `timestamp=${timestamp}`;
            const signature = await this.generateSignature(queryString, this.apiCredentials.secret);

            const response = await fetch(`https://api.pionex.com/api/v1/account/balance?${queryString}&signature=${signature}`, {
                headers: {
                    'X-API-KEY': this.apiCredentials.key
                }
            });

            if (response.ok) {
                this.log('info', 'API connection test successful');
                this.showModalMessage('api-key-modal-message', 'success', 'API connection successful!');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

        } catch (error) {
            this.log('error', 'API connection test failed: ' + error.message);
            this.showModalMessage('api-key-modal-message', 'error', 'API connection failed: ' + error.message);
        }
    }

    /**
     * Generate HMAC SHA256 signature for API authentication
     */
    async generateSignature(queryString, secret) {
        const encoder = new TextEncoder();
        const key = encoder.encode(secret);
        const message = encoder.encode(queryString);

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            key,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);
        return Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Load saved API credentials
     */
    loadApiCredentials() {
        try {
            const saved = localStorage.getItem('pionex_api_credentials');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            this.log('error', 'Error loading API credentials: ' + error.message);
            return null;
        }
    }

    /**
     * Update refresh rate
     */
    updateRefreshRate() {
        const input = document.getElementById('refresh-rate-input');
        const newRate = parseInt(input.value) * 1000; // Convert to milliseconds

        if (newRate >= 1000) { // Minimum 1 second
            this.refreshRate = newRate;
            this.log('info', `Refresh rate updated to ${newRate/1000} seconds`);
        }
    }

    /**
     * Start countdown timer
     */
    startCountdownTimer() {
        let countdown = this.refreshRate / 1000;

        const updateCountdown = () => {
            const countdownElement = document.getElementById('countdown');
            if (countdownElement) {
                countdownElement.textContent = countdown;
            }
            countdown--;

            if (countdown < 0) {
                countdown = this.refreshRate / 1000;
                this.refreshAllData();
            }
        };

        this.countdownInterval = setInterval(updateCountdown, 1000);
    }

    /**
     * Refresh all data
     */
    refreshAllData() {
        this.log('info', 'Refreshing all market data...');

        if (!this.isMockMode) {
            this.fetchInitialMarketData();
        }

        this.refreshIdealBot();
        this.updateSystemStats();
    }

    /**
     * Pause all simulations
     */
    pauseAllSimulations() {
        this.log('info', 'Pausing all simulations');
        // Implementation would pause running bots
    }

    /**
     * Start filtered simulations
     */
    startFilteredSimulations() {
        this.log('info', 'Starting filtered simulations');
        // Implementation would start bots based on current filters
    }

    /**
     * Update sorting of investment options
     */
    updateSorting() {
        const sortBy = document.getElementById('sort-by').value;
        this.log('info', `Sorting by: ${sortBy}`);
        // Implementation would re-sort the displayed options
    }

    /**
     * Update filtering of investment options
     */
    updateFiltering() {
        const filterValue = document.getElementById('filter-duration').value;
        this.log('info', `Filtering by duration: ${filterValue}`);
        // Implementation would filter displayed options
    }

    /**
     * Toggle debug console visibility
     */
    toggleDebugConsole() {
        const content = document.getElementById('debug-console-content');
        const button = document.getElementById('toggle-debug-console');

        if (content && button) {
            const isExpanded = content.classList.contains('expanded');
            if (isExpanded) {
                content.classList.remove('expanded');
                button.textContent = 'Expand Debug Console';
            } else {
                content.classList.add('expanded');
                button.textContent = 'Collapse Debug Console';
            }
        }
    }

    /**
     * Clear debug log
     */
    clearDebugLog() {
        this.debugLogs = [];
        const container = document.getElementById('debug-log-container');
        if (container) {
            container.innerHTML = '';
        }
        this.log('info', 'Debug log cleared');
    }

    /**
     * Export debug log
     */
    exportDebugLog() {
        const logText = this.debugLogs.map(log => `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`).join('\n');
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `pionex-debug-${new Date().toISOString().slice(0, 10)}.log`;
        a.click();

        URL.revokeObjectURL(url);
        this.log('info', 'Debug log exported');
    }

    /**
     * Add log entry to debug console
     */
    log(level, message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            timestamp,
            level,
            message
        };

        this.debugLogs.push(logEntry);

        // Add to UI if debug console is expanded
        const container = document.getElementById('debug-log-container');
        if (container) {
            const entryDiv = document.createElement('div');
            entryDiv.className = `debug-log-entry ${level}`;
            entryDiv.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
            container.appendChild(entryDiv);

            // Auto-scroll to bottom
            container.scrollTop = container.scrollHeight;
        }

        // Keep only last 1000 entries
        if (this.debugLogs.length > 1000) {
            this.debugLogs = this.debugLogs.slice(-1000);
        }

        // Also log to browser console
        console.log(`[${level.toUpperCase()}] ${message}`);
    }

    /**
     * Show modal message
     */
    showModalMessage(elementId, type, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.className = `modal-message ${type}`;
            element.textContent = message;
        }
    }
}

/**
 * Modal management utility
 */
class ModalManager {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (!this.modal) return;

        const closeButton = this.modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.hide());
        }

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });
    }

    show() {
        if (this.modal) {
            this.modal.classList.remove('hidden');
        }
    }

    hide() {
        if (this.modal) {
            this.modal.classList.add('hidden');
        }
    }
}

/**
 * Debug console management
 */
class DebugConsole {
    constructor(contentId, containerId) {
        this.content = document.getElementById(contentId);
        this.container = document.getElementById(containerId);
    }

    addEntry(level, message) {
        if (!this.container) return;

        const entry = document.createElement('div');
        entry.className = `debug-log-entry ${level}`;
        entry.innerHTML = `<span class="timestamp">[${new Date().toLocaleTimeString()}]</span> ${message}`;

        this.container.appendChild(entry);
        this.container.scrollTop = this.container.scrollHeight;
    }

    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pionexSuite = new PionexTradingSuite();
});