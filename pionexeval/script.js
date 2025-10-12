document.addEventListener('DOMContentLoaded', () => {
    const optionsContainer = document.getElementById('options-container');
    const sortBySelect = document.getElementById('sort-by');
    const filterDurationSelect = document.getElementById('filter-duration');
    const pauseAllButton = document.getElementById('pause-all');
    const startFilteredButton = document.getElementById('start-filtered');
    const idealBotResult = document.getElementById('ideal-bot-result');
    const idealBotTimestamp = document.getElementById('ideal-bot-timestamp');
    const idealBotButton = document.getElementById('generate-ideal-bot');
    const countdownElement = document.getElementById('countdown');
    const refreshRateInput = document.getElementById('refresh-rate-input');
    const applyRefreshRateButton = document.getElementById('apply-refresh-rate');
    const dataModeToggle = document.getElementById('data-mode-toggle');
    const dataModeText = document.getElementById('data-mode-text');
    const globalError = document.getElementById('global-error');
    const pionexLoginButton = document.getElementById('pionex-login');
    const pionexModal = document.getElementById('pionex-modal');
    const pionexModalClose = document.getElementById('pionex-modal-close');
    const pionexModalTryLogin = document.getElementById('pionex-modal-try-login');
    const pionexModalMockLogin = document.getElementById('pionex-modal-mock-login');
    const pionexModalMessage = document.getElementById('pionex-modal-message');

    let investmentOptions = [];
    let simulationIntervals = {};
    let isPaused = false;
    let liveDataCheckingInterval = null;
    let liveDataCheckRate = 5000; // Default to 5 seconds
    let useMockData = true;
    let idealAnalysisCache = null;
    let systemStatsInterval = null;

    const minDurationMap = { '10m': 10, '15m': 15, '1h': 60, '3h': 180, '16h': 960, '24h': 1440, '7d': 10080 };

    function showGlobalError(message, type = 'error') {
        if (!globalError) return;
        globalError.textContent = message;
        globalError.classList.remove('hidden', 'success', 'info', 'error');
        globalError.classList.add(type);
    }

    function hideGlobalError() {
        if (!globalError) return;
        globalError.classList.add('hidden');
        globalError.classList.remove('success', 'info', 'error');
        globalError.textContent = '';
    }

    function formatTimestamp(date) {
        return date.toLocaleString(undefined, {
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    function updateSystemStats() {
        // Simulate memory usage (random but trending)
        const memoryUsage = Math.floor(Math.random() * 30) + 45; // 45-75%
        const memoryElement = document.getElementById('memory-usage');
        const memoryProgress = document.getElementById('memory-progress');
        if (memoryElement) memoryElement.textContent = `${memoryUsage}%`;
        if (memoryProgress) memoryProgress.style.width = `${memoryUsage}%`;

        // Simulate CPU load (random but trending)
        const cpuLoad = Math.floor(Math.random() * 20) + 15; // 15-35%
        const cpuElement = document.getElementById('cpu-load');
        const cpuProgress = document.getElementById('cpu-progress');
        if (cpuElement) cpuElement.textContent = `${cpuLoad}%`;
        if (cpuProgress) cpuProgress.style.width = `${cpuLoad}%`;

        // Count running simulations
        const runningCount = Object.keys(simulationIntervals).length;
        const runningElement = document.getElementById('running-simulations');
        if (runningElement) runningElement.textContent = runningCount.toString();

        // Count active bots (simulated)
        const activeBots = investmentOptions.filter(opt => opt.isRunning).length;
        const activeBotsElement = document.getElementById('active-bots');
        if (activeBotsElement) activeBotsElement.textContent = activeBots.toString();
    }

    function startSystemStats() {
        stopSystemStats();
        updateSystemStats(); // Initial update
        systemStatsInterval = setInterval(updateSystemStats, 2000);
    }

    function stopSystemStats() {
        if (systemStatsInterval) {
            clearInterval(systemStatsInterval);
            systemStatsInterval = null;
        }
    }

    function generateHistoricalSeries(baseValue) {
        const now = Date.now();
        const interval = 60 * 1000; // 1 minute
        const points = [];
        for (let i = 19; i >= 0; i--) {
            const timestamp = new Date(now - i * interval);
            const variance = (Math.random() - 0.5) * 0.15 * baseValue;
            const value = Math.max(baseValue + variance, 0.1);
            points.push({ timestamp, value: parseFloat(value.toFixed(2)) });
        }
        return points;
    }

    function generatePredictionSeries(lastPoint) {
        const interval = 60 * 1000; // 1 minute
        const points = [];
        for (let i = 1; i <= 5; i++) {
            const timestamp = new Date(lastPoint.timestamp.getTime() + i * interval);
            const drift = (Math.random() - 0.3) * 0.1 * lastPoint.value;
            const value = Math.max(lastPoint.value + drift, 0.1);
            points.push({ timestamp, value: parseFloat(value.toFixed(2)) });
        }
        return points;
    }

    function calculatePredictionAccuracy(historical, predicted) {
        const baseline = historical[historical.length - 1].value;
        const variation = predicted.map(p => Math.abs(p.value - baseline));
        const maxVariation = Math.max(...variation);
        const normalized = Math.max(0, 1 - maxVariation / (baseline || 1));
        return Math.round(normalized * 100);
    }

    function generateInvestmentOptions() {
        const names = ['BTC/USDT Grid Bot', 'ETH/USDT Arbitrage Bot', 'DOGE/USDT Spot Grid', 'BNB/USDT Rebalancing Bot', 'ADA/USDT Smart Trade', 'ZEREBRO/USDT Meme Bot', 'AVAX2P/USDT Leveraged Bot', 'SHIB/USDT Futures Grid'];
        const minDurations = Object.keys(minDurationMap);
        const types = ['standard', 'bot', 'meme'];
        const predictionTechniques = ['ARIMA', 'LSTM', 'Exponential Smoothing', 'Prophet'];

        investmentOptions = Array.from({ length: 25 }).map((_, i) => {
            const type = types[Math.floor(Math.random() * types.length)];
            const apy = type === 'meme'
                ? parseFloat((Math.random() * 500 + 100).toFixed(2))
                : parseFloat((Math.random() * 100 + 10).toFixed(2));
            const pionexEval = parseFloat((Math.random() * 5 + 1).toFixed(1));
            const ownEval = parseFloat((Math.random() * 5 + 1).toFixed(1));
            const minDuration = minDurations[Math.floor(Math.random() * minDurations.length)];

            const baseIncome = Math.random() * (type === 'meme' ? 600 : 120) + 20;
            const historicalSeries = generateHistoricalSeries(Math.max(baseIncome, 10));
            const predictedSeries = generatePredictionSeries(historicalSeries[historicalSeries.length - 1]);
            const predictionAccuracy = calculatePredictionAccuracy(historicalSeries, predictedSeries);
            const predictionValue = predictedSeries[predictedSeries.length - 1].value;

            return {
                id: i,
                name: `${names[Math.floor(Math.random() * names.length)]} ${i + 1}`,
                type,
                apy,
                pionexEval,
                ownEval,
                minDuration,
                currentIncome: 0,
                progress: 0,
                isRunning: false,
                simulationData: {
                    '10m': { income: parseFloat((Math.random() * 5 * (type === 'meme' ? 5 : 1)).toFixed(2)), progress: 0 },
                    '15m': { income: parseFloat((Math.random() * 7 * (type === 'meme' ? 5 : 1)).toFixed(2)), progress: 0 },
                    '1h': { income: parseFloat((Math.random() * 10 * (type === 'meme' ? 5 : 1)).toFixed(2)), progress: 0 },
                    '3h': { income: parseFloat((Math.random() * 20 * (type === 'meme' ? 5 : 1)).toFixed(2)), progress: 0 },
                    '16h': { income: parseFloat((Math.random() * 50 * (type === 'meme' ? 5 : 1)).toFixed(2)), progress: 0 },
                    '24h': { income: parseFloat((Math.random() * 70 * (type === 'meme' ? 5 : 1)).toFixed(2)), progress: 0 },
                    '7d': { income: parseFloat((Math.random() * 150 * (type === 'meme' ? 5 : 1)).toFixed(2)), progress: 0 }
                },
                graphThumbnail: `graph-thumbnail-${i}`,
                liveIncome: predictionValue,
                prediction: predictionValue,
                predictionSeries: predictedSeries,
                historicalSeries,
                predictionAccuracy,
                predictionParameters: {
                    volatility: parseFloat((Math.random() * 0.8 + 0.2).toFixed(2)),
                    volume: parseInt((Math.random() * 1000 + 500).toFixed(0), 10),
                    trend: Math.random() > 0.5 ? 'bullish' : 'bearish'
                },
                predictionTechnique: predictionTechniques[Math.floor(Math.random() * predictionTechniques.length)],
                idealParameters: {
                    minVolatility: parseFloat((Math.random() * 0.3 + 0.1).toFixed(2)),
                    maxDrawdown: `${(Math.random() * 5 + 2).toFixed(1)}%`,
                    targetVolume: parseInt((Math.random() * 800 + 300).toFixed(0), 10)
                }
            };
        });
    }

    function renderOptions(options) {
        optionsContainer.innerHTML = '';


        options.forEach(option => {
            const card = document.createElement('article');
            card.className = 'option-card';
            card.dataset.id = option.id;

            card.innerHTML = `
                <h3>${option.name} <span>(${option.type})</span></h3>
                <div class="option-meta">
                    <div><strong>Current APY:</strong> <span class="value-highlight">${option.apy}%</span></div>
                    <div><strong>Pionex Evaluation:</strong> <span class="value-highlight">${option.pionexEval}</span></div>
                    <div><strong>My Evaluation:</strong> <span class="value-highlight">${option.ownEval}</span></div>
                    <div><strong>Min Duration:</strong> ${option.minDuration}</div>
                </div>
                <div class="chart-container">
                    <div class="chart-tabs">
                        <button class="chart-tab active" data-chart="overview" data-id="${option.id}">Overview (1h)</button>
                        <button class="chart-tab" data-chart="detailed" data-id="${option.id}">Detailed (24h)</button>
                    </div>
                    <div class="chart-wrapper">
                        <canvas class="graph-overview" id="graph-overview-${option.id}" width="600" height="320" aria-label="Overview chart for ${option.name}"></canvas>
                        <canvas class="graph-detailed hidden" id="graph-detailed-${option.id}" width="600" height="320" aria-label="Detailed chart for ${option.name}"></canvas>
                    </div>
                    <div class="timeline-labels">
                        <span id="timeline-start-${option.id}">--</span>
                        <span id="timeline-end-${option.id}">--</span>
                    </div>
                    <div class="prediction-summary">
                        <span>Prediction accuracy: <span class="accuracy" id="prediction-accuracy-${option.id}">${option.predictionAccuracy}%</span></span>
                        <span>Prediction (mock): <span class="value-highlight" id="prediction-${option.id}">${option.prediction.toFixed(2)}</span> USDT</span>
                    </div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" id="progress-${option.id}" style="width: ${option.progress}%"></div>
                </div>
                <div class="simulation-stats">
                    <div>Simulated Income: <span class="value-highlight" id="income-${option.id}">${option.currentIncome.toFixed(2)}</span> USDT</div>
                    <div>Live Income (mock): <span class="value-highlight" id="live-income-${option.id}">${option.liveIncome.toFixed(2)}</span> USDT</div>
                    <div>Refresh countdown: <span id="live-countdown-${option.id}">--</span></div>
                </div>
                <div class="prediction-details">
                    <h4 class="toggle-details">Prediction Details <span class="arrow">▼</span></h4>
                    <div class="details-content">
                        <p><strong>Technique:</strong> ${option.predictionTechnique}</p>
                        <p><strong>Parameters:</strong> Volatility ${option.predictionParameters.volatility}, Volume ${option.predictionParameters.volume}, Trend ${option.predictionParameters.trend}</p>
                        <p><strong>Ideal Parameters:</strong> Min Volatility ${option.idealParameters.minVolatility}, Max Drawdown ${option.idealParameters.maxDrawdown}, Target Volume ${option.idealParameters.targetVolume}</p>
                    </div>
                </div>
                <div class="simulation-controls">
                    <button class="toggle-simulation" data-id="${option.id}">
                        ${option.isRunning ? 'Pause Simulation' : 'Start Simulation'}
                    </button>
                </div>
                <div class="guide-section">
                    <h4 class="toggle-guide">Step-by-step Guide <span class="arrow">▼</span></h4>
                    <div class="guide-content">
                        <p>Suggested steps for configuring ${option.name}:</p>
                        <ol>
                            <li>Navigate to Pionex and locate ${option.name}.</li>
                            <li>Allocate 101 USDT and confirm balance availability.</li>
                            <li>Set grid parameters: Min Volatility ${option.idealParameters.minVolatility}, Max Drawdown ${option.idealParameters.maxDrawdown}, Target Volume ${option.idealParameters.targetVolume}.</li>
                            <li>Configure ${option.predictionTechnique} model with volatility ${option.predictionParameters.volatility} and ${option.predictionParameters.trend} trend bias.</li>
                            <li>Review risk metrics and confirm bot deployment.</li>
                        </ol>
                        <div class="specific-settings">
                            <h5>Specific Settings for ${option.name}:</h5>
                            <div class="settings-grid">
                                <div class="setting-item">
                                    <strong>Grid Spacing:</strong> ${(Math.random() * 0.02 + 0.005).toFixed(4)}
                                </div>
                                <div class="setting-item">
                                    <strong>Stop Loss:</strong> ${(Math.random() * 5 + 2).toFixed(2)}%
                                </div>
                                <div class="setting-item">
                                    <strong>Take Profit:</strong> ${(Math.random() * 3 + 1).toFixed(2)}%
                                </div>
                                <div class="setting-item">
                                    <strong>Rebalance Threshold:</strong> ${(Math.random() * 0.1 + 0.02).toFixed(3)}
                                </div>
                                <div class="setting-item">
                                    <strong>Min Order Size:</strong> ${(Math.random() * 5 + 1).toFixed(2)} USDT
                                </div>
                                <div class="setting-item">
                                    <strong>Max Positions:</strong> ${Math.floor(Math.random() * 10) + 5}
                                </div>
                            </div>
                        </div>
                        <button class="execute-button" data-id="${option.id}">Execute automated setup</button>
                    </div>
                </div>
            `;

            optionsContainer.appendChild(card);
            drawGraph(`graph-overview-${option.id}`, option.historicalSeries, option.predictionSeries, option.id, 'overview');
            drawGraph(`graph-detailed-${option.id}`, option.historicalSeries, option.predictionSeries, option.id, 'detailed');
        });

        addEventListenersToOptionCards();
    }

    function drawGraph(canvasId, historicalSeries, predictedSeries, optionId, chartType = 'overview') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 40;
        const width = canvas.width - padding * 2;
        const height = canvas.height - padding * 2;

        // Generate different data based on chart type
        let displayHistorical = historicalSeries;
        let displayPredicted = predictedSeries;

        if (chartType === 'detailed') {
            // For detailed view, create a longer historical series (simulate 24h data)
            const extendedHistorical = [];
            const now = Date.now();
            const interval = 60 * 1000; // 1 minute
            const extendedLength = 1440; // 24 hours * 60 minutes

            for (let i = extendedLength - 1; i >= 0; i--) {
                const timestamp = new Date(now - i * interval);
                const baseValue = historicalSeries.length > 0 ?
                    historicalSeries[historicalSeries.length - 1].value : 100;
                const variance = (Math.random() - 0.5) * 0.3 * baseValue;
                const value = Math.max(baseValue + variance, 0.1);
                extendedHistorical.push({ timestamp, value: parseFloat(value.toFixed(2)) });
            }
            displayHistorical = extendedHistorical.slice(-60); // Show last 60 points for detailed view
        }

        const combinedSeries = [...displayHistorical, ...displayPredicted];
        const values = combinedSeries.map(point => point.value);
        const minY = Math.min(...values);
        const maxY = Math.max(...values);
        const rangeY = maxY - minY || 1;

        function project(point, index, totalPoints) {
            const ratio = index / (totalPoints - 1);
            const x = padding + ratio * width;
            const normalizedY = (point.value - minY) / rangeY;
            const y = padding + (1 - normalizedY) * height;
            return { x, y };
        }

        // Draw historical data (solid line)
        ctx.lineWidth = 2.4;
        ctx.strokeStyle = '#a0ffdf';
        ctx.beginPath();
        displayHistorical.forEach((point, index) => {
            const { x, y } = project(point, index, combinedSeries.length);
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw current prediction (dashed line, more visible)
        const lastHistoricalIndex = displayHistorical.length - 1;
        ctx.strokeStyle = '#ff9f9f';
        ctx.lineWidth = 2.0;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        displayPredicted.forEach((point, idx) => {
            const index = lastHistoricalIndex + 1 + idx;
            const { x, y } = project(point, index, combinedSeries.length);
            if (idx === 0) {
                const { x: prevX, y: prevY } = project(displayHistorical[lastHistoricalIndex], lastHistoricalIndex, combinedSeries.length);
                ctx.moveTo(prevX, prevY);
            }
            ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw past prediction as fainter dashed line (simulate previous predictions)
        if (chartType === 'detailed' && displayHistorical.length > 20) {
            const pastPredictionData = [];
            const midPoint = Math.floor(displayHistorical.length * 0.7);
            const pastBaseValue = displayHistorical[midPoint].value;

            for (let i = 1; i <= 5; i++) {
                const timestamp = new Date(displayHistorical[midPoint].timestamp.getTime() + i * interval);
                const drift = (Math.random() - 0.5) * 0.05 * pastBaseValue;
                const value = Math.max(pastBaseValue + drift, 0.1);
                pastPredictionData.push({ timestamp, value: parseFloat(value.toFixed(2)) });
            }

            ctx.strokeStyle = 'rgba(255, 159, 159, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 8]);
            ctx.beginPath();

            const startIndex = midPoint;
            pastPredictionData.forEach((point, idx) => {
                const index = startIndex + 1 + idx;
                const { x, y } = project(point, index, combinedSeries.length);
                if (idx === 0) {
                    const { x: prevX, y: prevY } = project(displayHistorical[startIndex], startIndex, combinedSeries.length);
                    ctx.moveTo(prevX, prevY);
                }
                ctx.lineTo(x, y);
            });
            ctx.stroke();
            ctx.setLineDash([]);
        }

        ctx.fillStyle = 'rgba(137, 213, 201, 0.2)';
        ctx.fillRect(padding, padding, width, height);

        const startLabel = document.getElementById(`timeline-start-${optionId}`);
        const endLabel = document.getElementById(`timeline-end-${optionId}`);
        if (startLabel) {
            const startTime = chartType === 'detailed' ?
                displayHistorical[0].timestamp :
                displayHistorical[0].timestamp;
            startLabel.textContent = formatTimestamp(startTime);
        }
        if (endLabel) {
            const endTime = displayPredicted.length > 0 ?
                displayPredicted[displayPredicted.length - 1].timestamp :
                displayHistorical[displayHistorical.length - 1].timestamp;
            endLabel.textContent = formatTimestamp(endTime);
        }
    }

    function updateOptionCard(option) {
        const progressBar = document.getElementById(`progress-${option.id}`);
        const incomeSpan = document.getElementById(`income-${option.id}`);
        const liveIncomeSpan = document.getElementById(`live-income-${option.id}`);
        const predictionSpan = document.getElementById(`prediction-${option.id}`);
        const accuracySpan = document.getElementById(`prediction-accuracy-${option.id}`);

        if (progressBar) progressBar.style.width = `${option.progress}%`;
        if (incomeSpan) incomeSpan.textContent = option.currentIncome.toFixed(2);
        if (liveIncomeSpan) liveIncomeSpan.textContent = option.liveIncome.toFixed(2);
        if (predictionSpan) predictionSpan.textContent = option.prediction.toFixed(2);
        if (accuracySpan) accuracySpan.textContent = `${option.predictionAccuracy}%`;
    }

    function startSimulation(optionId) {
        const option = investmentOptions.find(opt => opt.id === optionId);
        if (!option || option.isRunning) return;

        option.isRunning = true;
        const toggleSelector = `.toggle-simulation[data-id="${optionId}"]`;

        function syncButtons() {
            const toggleButton = document.querySelector(toggleSelector);
            if (toggleButton) toggleButton.textContent = 'Pause Simulation';
        }

        syncButtons();

        let currentProgress = option.progress;
        let currentIncome = option.currentIncome;
        const targetIncome = option.simulationData['7d'].income;
        const durationSteps = 100;

        simulationIntervals[optionId] = setInterval(() => {
            if (isPaused) return;

            currentProgress += (100 / durationSteps);
            currentIncome += (targetIncome / durationSteps);

            if (currentProgress >= 100) {
                currentProgress = 100;
                currentIncome = targetIncome;
                clearInterval(simulationIntervals[optionId]);
                delete simulationIntervals[optionId];
                option.isRunning = false;
                option.progress = currentProgress;
                option.currentIncome = currentIncome;
                syncButtons();
                updateOptionCard(option);
                return;
            }

            option.progress = currentProgress;
            option.currentIncome = currentIncome;

            updateOptionCard(option);
        }, 120);
    }

    function pauseSimulation(optionId) {
        const option = investmentOptions.find(opt => opt.id === optionId);
        if (!option) return;

        clearInterval(simulationIntervals[optionId]);
        delete simulationIntervals[optionId];
        option.isRunning = false;

        const toggleButton = document.querySelector(`.toggle-simulation[data-id="${optionId}"]`);
        if (toggleButton) toggleButton.textContent = 'Start Simulation';
    }

    function applyFiltersAndSort() {
        let filteredOptions = [...investmentOptions];

        const filterDuration = filterDurationSelect.value;
        if (filterDuration !== 'all') {
            filteredOptions = filteredOptions.filter(option => minDurationMap[option.minDuration] <= minDurationMap[filterDuration]);
        }

        const sortBy = sortBySelect.value;
        filteredOptions.sort((a, b) => {
            if (sortBy === 'apy') return b.apy - a.apy;
            if (sortBy === 'pionex-eval') return b.pionexEval - a.pionexEval;
            if (sortBy === 'own-eval') return b.ownEval - a.ownEval;
            if (sortBy === 'simulation-income') return b.currentIncome - a.currentIncome;
            if (sortBy === 'min-duration') return minDurationMap[a.minDuration] - minDurationMap[b.minDuration];
            return 0;
        });

        renderOptions(filteredOptions);
    }

    function addEventListenersToOptionCards() {
        document.querySelectorAll('.toggle-simulation').forEach(button => {
            button.onclick = (e) => {
                const optionId = parseInt(e.currentTarget.dataset.id, 10);
                const option = investmentOptions.find(opt => opt.id === optionId);
                if (option.isRunning) {
                    pauseSimulation(optionId);
                } else {
                    startSimulation(optionId);
                }
            };
        });

        // Chart tab switching
        document.querySelectorAll('.chart-tab').forEach(tab => {
            tab.onclick = (e) => {
                const chartType = e.currentTarget.dataset.chart;
                const optionId = e.currentTarget.dataset.id;

                // Update active tab
                document.querySelectorAll(`.chart-tab[data-id="${optionId}"]`).forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');

                // Show/hide graphs
                const overviewGraph = document.getElementById(`graph-overview-${optionId}`);
                const detailedGraph = document.getElementById(`graph-detailed-${optionId}`);

                if (chartType === 'overview') {
                    if (overviewGraph) overviewGraph.classList.remove('hidden');
                    if (detailedGraph) detailedGraph.classList.add('hidden');
                } else {
                    if (overviewGraph) overviewGraph.classList.add('hidden');
                    if (detailedGraph) detailedGraph.classList.remove('hidden');
                }
            };
        });
        document.querySelectorAll('.toggle-details').forEach(toggle => {
            toggle.onclick = (e) => {
                const detailsContent = e.currentTarget.nextElementSibling;
                detailsContent.classList.toggle('expanded');
                const arrow = e.currentTarget.querySelector('.arrow');
                if (arrow) arrow.textContent = detailsContent.classList.contains('expanded') ? '▲' : '▼';
            };
        });
        document.querySelectorAll('.toggle-guide').forEach(toggle => {
            toggle.onclick = (e) => {
                const guideContent = e.currentTarget.nextElementSibling;
                guideContent.classList.toggle('expanded');
                const arrow = e.currentTarget.querySelector('.arrow');
                if (arrow) arrow.textContent = guideContent.classList.contains('expanded') ? '▲' : '▼';
            };
        });
    }

    function simulateLiveDataUpdate() {
        try {
            if (!useMockData) {
                throw new Error('Real data endpoint not configured. Re-enable mock mode or provide credentials.');
            }

            investmentOptions.forEach(option => {
                const fluctuation = (Math.random() - 0.5) * 0.08 * (option.currentIncome + 5);
                option.liveIncome = Math.max(option.currentIncome + fluctuation, 0.1);
                option.prediction = option.liveIncome * (1 + (Math.random() - 0.5) * 0.06);

                const updatedHistorical = [...option.historicalSeries, { timestamp: new Date(), value: option.liveIncome }].slice(-20);
                const updatedPredicted = generatePredictionSeries(updatedHistorical[updatedHistorical.length - 1]);
                option.historicalSeries = updatedHistorical;
                option.predictionSeries = updatedPredicted;
                option.predictionAccuracy = calculatePredictionAccuracy(updatedHistorical, updatedPredicted);
            });

            applyFiltersAndSort();
        } catch (error) {
            showGlobalError(error.message, 'error');
        }
    }

    function startLiveDataChecking() {
        stopLiveDataChecking();
        hideGlobalError();

        let countdown = liveDataCheckRate / 1000;
        if (countdownElement) countdownElement.textContent = countdown.toString();

        liveDataCheckingInterval = setInterval(() => {
            if (isPaused) return;
            countdown -= 1;
            if (countdownElement) countdownElement.textContent = Math.max(countdown, 0).toString();
            if (countdown <= 0) {
                simulateLiveDataUpdate();
                countdown = liveDataCheckRate / 1000;
            }
        }, 1000);
    }

    function stopLiveDataChecking() {
        if (liveDataCheckingInterval) {
            clearInterval(liveDataCheckingInterval);
            liveDataCheckingInterval = null;
        }
        if (countdownElement) countdownElement.textContent = '--';
    }

    function toggleDataMode() {
        useMockData = dataModeToggle.checked;
        if (dataModeText) {
            dataModeText.textContent = useMockData ? 'Mock Data Mode' : 'Live Data Mode';
        }
        if (!useMockData) {
            // Try to authenticate with Pionex
            attemptPionexAuthentication();
        } else {
            hideGlobalError();
        }
    }

    async function attemptPionexAuthentication() {
        try {
            showGlobalError('Attempting to connect to Pionex...', 'info');
            // Simulate authentication delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            // For now, revert to mock mode since we don't have real Pionex API
            throw new Error('Pionex API not configured. Please configure API credentials or use Mock Data Mode.');
        } catch (error) {
            showGlobalError(error.message, 'error');
            dataModeToggle.checked = true;
            useMockData = true;
            dataModeText.textContent = 'Mock Data Mode';
        }
    }

    function openPionexModal() {
        if (!pionexModal) return;
        pionexModal.classList.remove('hidden');
        pionexModalMessage.textContent = useMockData
            ? 'You are currently in mock data mode. Switch to live data mode to authenticate against Pionex.'
            : 'Live data mode is active. Configure your Pionex API credentials to enable real trading data.';
        pionexModalMessage.className = `modal-message ${useMockData ? 'info' : 'info'}`;
    }

    function closePionexModal() {
        if (!pionexModal) return;
        pionexModal.classList.add('hidden');
    }

    async function attemptPionexLogin() {
        try {
            if (useMockData) {
                throw new Error('Switch to real data mode to initiate live login.');
            }
            pionexModalMessage.textContent = 'Attempting secure login…';
            pionexModalMessage.className = 'modal-message info';
            await new Promise(resolve => setTimeout(resolve, 1500));
            throw new Error('Live Pionex authentication is not yet connected. Please configure API credentials.');
        } catch (error) {
            pionexModalMessage.textContent = error.message;
            pionexModalMessage.className = 'modal-message error';
        }
    }

    function useMockSession() {
        useMockData = true;
        mockToggle.checked = true;
        toggleMockMode();
        pionexModalMessage.textContent = 'Mock Pionex session activated. Live trading data will remain simulated.';
        pionexModalMessage.className = 'modal-message info';
        setTimeout(closePionexModal, 1200);
    }

    async function performIdealBotAnalysis(force = false) {
        if (idealAnalysisCache && !force) {
            updateIdealBotSection(idealAnalysisCache);
            return;
        }

        idealBotResult.innerHTML = '<p class="loading">Synthesizing optimal configurations with Monte Carlo sampling…</p>';
        idealBotTimestamp.textContent = 'Analyzing…';

        try {
            await new Promise(resolve => setTimeout(resolve, 900));
            const enrichedOptions = [...investmentOptions]
                .sort((a, b) => (b.apy + b.pionexEval * 8 + b.ownEval * 6) - (a.apy + a.pionexEval * 8 + a.ownEval * 6))
                .slice(0, 3)
                .map(option => ({
                    id: option.id,
                    name: option.name,
                    apy: option.apy,
                    pionexEval: option.pionexEval,
                    ownEval: option.ownEval,
                    minDuration: option.minDuration,
                    accuracy: option.predictionAccuracy,
                    recommendation: option.predictionTechnique,
                    idealParameters: option.idealParameters
                }));

            const recommendation = {
                generatedAt: new Date(),
                options: enrichedOptions,
                summary: `Highlighting ${enrichedOptions.length} configurations with the best blended scores. APY weighting favors stability while leveraging prediction accuracy and dual evaluations.`
            };

            idealAnalysisCache = recommendation;
            updateIdealBotSection(recommendation);
        } catch (error) {
            idealBotResult.innerHTML = `<p class="loading">Unable to compute ideal bot right now: ${error.message}</p>`;
        }
    }

    function updateIdealBotSection(analysis) {
        idealBotTimestamp.textContent = formatTimestamp(analysis.generatedAt);
        idealBotResult.innerHTML = `
            <p>${analysis.summary}</p>
            <div class="ideal-bot-candidates">
                ${analysis.options.map(option => `
                    <article class="option-card">
                        <h3>${option.name}</h3>
                        <div class="option-meta">
                            <div><strong>APY:</strong> ${option.apy}%</div>
                            <div><strong>Pionex Eval:</strong> ${option.pionexEval}</div>
                            <div><strong>My Eval:</strong> ${option.ownEval}</div>
                            <div><strong>Duration:</strong> ${option.minDuration}</div>
                        </div>
                        <p><strong>Model Technique:</strong> ${option.recommendation}</p>
                        <p><strong>Prediction Accuracy:</strong> ${option.accuracy}%</p>
                        <p><strong>Ideal Parameters:</strong> Min Volatility ${option.idealParameters.minVolatility}, Max Drawdown ${option.idealParameters.maxDrawdown}, Target Volume ${option.idealParameters.targetVolume}</p>
                    </article>
                `).join('')}
            </div>
        `;
    }

    function attachEventListeners() {
        sortBySelect.addEventListener('change', applyFiltersAndSort);
        filterDurationSelect.addEventListener('change', applyFiltersAndSort);

        pauseAllButton.addEventListener('click', () => {
            isPaused = !isPaused;
            pauseAllButton.textContent = isPaused ? 'Resume All Simulations' : 'Pause All Simulations';
            if (!isPaused) {
                Object.keys(simulationIntervals).forEach(id => {
                    clearInterval(simulationIntervals[id]);
                    delete simulationIntervals[id];
                });
                investmentOptions.forEach(option => {
                    if (option.isRunning) startSimulation(option.id);
                });
                startLiveDataChecking();
            } else {
                Object.keys(simulationIntervals).forEach(id => {
                    clearInterval(simulationIntervals[id]);
                    delete simulationIntervals[id];
                });
                stopLiveDataChecking();
            }
        });

        startFilteredButton.addEventListener('click', () => {
            const currentlyDisplayedOptions = Array.from(optionsContainer.children).map(card => investmentOptions.find(opt => opt.id === parseInt(card.dataset.id, 10)));
            currentlyDisplayedOptions.forEach(option => {
                if (option && !option.isRunning) startSimulation(option.id);
            });
        });

        applyRefreshRateButton.addEventListener('click', () => {
            const newRate = parseInt(refreshRateInput.value, 10);
            if (Number.isNaN(newRate) || newRate < 1) {
                showGlobalError('Please provide a valid refresh rate (>= 1 second).', 'error');
                return;
            }
            liveDataCheckRate = newRate * 1000;
            startLiveDataChecking();
        });

        dataModeToggle.addEventListener('change', toggleDataMode);

        idealBotButton.addEventListener('click', () => {
            performIdealBotAnalysis(true);
        });

        pionexLoginButton.addEventListener('click', openPionexModal);
        if (pionexModalClose) pionexModalClose.addEventListener('click', closePionexModal);
        if (pionexModalTryLogin) pionexModalTryLogin.addEventListener('click', attemptPionexLogin);
        if (pionexModalMockLogin) pionexModalMockLogin.addEventListener('click', useMockSession);

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closePionexModal();
        });

        pionexModal?.addEventListener('click', (event) => {
            if (event.target === pionexModal) closePionexModal();
        });
    }

    function initialize() {
        generateInvestmentOptions();
        investmentOptions.sort((a, b) => b.apy - a.apy);
        applyFiltersAndSort();

        investmentOptions.slice(0, 10).forEach(option => {
            startSimulation(option.id);
        });

        performIdealBotAnalysis();
        toggleDataMode();
        startLiveDataChecking();
        startSystemStats();
        attachEventListeners();
    }

    initialize();
});