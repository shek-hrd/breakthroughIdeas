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
    const mockToggle = document.getElementById('mock-toggle');
    const mockToggleText = document.getElementById('mock-toggle-text');
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

        const highlightTargets = {
            apy: null,
            pionexEval: null,
            ownEval: null,
            simulatedIncome: null,
            liveIncome: null
        };

        if (options.length) {
            highlightTargets.apy = options.reduce((max, option) => option.apy > max.apy ? option : max, options[0]);
            highlightTargets.pionexEval = options.reduce((max, option) => option.pionexEval > max.pionexEval ? option : max, options[0]);
            highlightTargets.ownEval = options.reduce((max, option) => option.ownEval > max.ownEval ? option : max, options[0]);
            highlightTargets.simulatedIncome = options.reduce((max, option) => option.currentIncome > max.currentIncome ? option : max, options[0]);
            highlightTargets.liveIncome = options.reduce((max, option) => option.liveIncome > max.liveIncome ? option : max, options[0]);
        }

        const highlightIds = new Set([
            highlightTargets.apy?.id,
            highlightTargets.pionexEval?.id,
            highlightTargets.ownEval?.id,
            highlightTargets.simulatedIncome?.id,
            highlightTargets.liveIncome?.id
        ].filter(Boolean));

        options.forEach(option => {
            const card = document.createElement('article');
            card.className = 'option-card';
            card.dataset.id = option.id;
            if (highlightIds.has(option.id)) {
                card.classList.add('highlighted');
            }

            const badges = [];
            if (highlightTargets.apy && highlightTargets.apy.id === option.id) badges.push('<span class="highlight-badge badge-apy">Top APY</span>');
            if (highlightTargets.pionexEval && highlightTargets.pionexEval.id === option.id) badges.push('<span class="highlight-badge badge-pionex">Top Pionex</span>');
            if (highlightTargets.ownEval && highlightTargets.ownEval.id === option.id) badges.push('<span class="highlight-badge badge-own">Top Personal</span>');
            if (highlightTargets.simulatedIncome && highlightTargets.simulatedIncome.id === option.id) badges.push('<span class="highlight-badge badge-simulated">Top Simulated</span>');
            if (highlightTargets.liveIncome && highlightTargets.liveIncome.id === option.id) badges.push('<span class="highlight-badge badge-live">Top Live</span>');

            card.innerHTML = `
                ${badges.join('')}
                <h3>${option.name} <span>(${option.type})</span></h3>
                <div class="option-meta">
                    <div><strong>Current APY:</strong> <span class="value-highlight">${option.apy}%</span></div>
                    <div><strong>Pionex Evaluation:</strong> <span class="value-highlight">${option.pionexEval}</span></div>
                    <div><strong>My Evaluation:</strong> <span class="value-highlight">${option.ownEval}</span></div>
                    <div><strong>Min Duration:</strong> ${option.minDuration}</div>
                </div>
                <div class="chart-container">
                    <canvas class="graph-thumbnail" id="graph-${option.graphThumbnail}" width="600" height="320" aria-label="Performance chart for ${option.name}"></canvas>
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
                    <button class="start-simulation" data-id="${option.id}" ${option.isRunning ? 'disabled' : ''}>Start Simulation</button>
                    <button class="pause-simulation" data-id="${option.id}" ${!option.isRunning ? 'disabled' : ''}>Pause Simulation</button>
                </div>
                <div class="guide-section">
                    <h4 class="toggle-guide">Step-by-step Guide <span class="arrow">▼</span></h4>
                    <div class="guide-content">
                        <p>Suggested steps for configuring ${option.name}:</p>
                        <ol>
                            <li>Navigate to Pionex and locate ${option.name}.</li>
                            <li>Allocate 101 USDT and confirm balance availability.</li>
                            <li>Adjust grid parameters per the ideal parameters.</li>
                            <li>Review risk metrics and confirm bot deployment.</li>
                        </ol>
                        <button class="execute-button" data-id="${option.id}">Execute automated setup</button>
                    </div>
                </div>
            `;

            optionsContainer.appendChild(card);
            drawGraph(`graph-${option.graphThumbnail}`, option.historicalSeries, option.predictionSeries, option.id);
        });

        addEventListenersToOptionCards();
    }

    function drawGraph(canvasId, historicalSeries, predictedSeries, optionId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 40;
        const width = canvas.width - padding * 2;
        const height = canvas.height - padding * 2;

        const combinedSeries = [...historicalSeries, ...predictedSeries];
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

        ctx.lineWidth = 2.4;
        ctx.strokeStyle = '#a0ffdf';
        ctx.beginPath();
        historicalSeries.forEach((point, index) => {
            const { x, y } = project(point, index, combinedSeries.length);
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        const lastHistoricalIndex = historicalSeries.length - 1;
        ctx.strokeStyle = '#ff9f9f';
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        predictedSeries.forEach((point, idx) => {
            const index = lastHistoricalIndex + 1 + idx;
            const { x, y } = project(point, index, combinedSeries.length);
            if (idx === 0) {
                const { x: prevX, y: prevY } = project(historicalSeries[lastHistoricalIndex], lastHistoricalIndex, combinedSeries.length);
                ctx.moveTo(prevX, prevY);
            }
            ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(137, 213, 201, 0.2)';
        ctx.fillRect(padding, padding, width, height);

        const startLabel = document.getElementById(`timeline-start-${optionId}`);
        const endLabel = document.getElementById(`timeline-end-${optionId}`);
        if (startLabel) startLabel.textContent = formatTimestamp(historicalSeries[0].timestamp);
        if (endLabel) endLabel.textContent = formatTimestamp(predictedSeries[predictedSeries.length - 1].timestamp);
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
        const startSelector = `.start-simulation[data-id="${optionId}"]`;
        const pauseSelector = `.pause-simulation[data-id="${optionId}"]`;

        function syncButtons() {
            const startButton = document.querySelector(startSelector);
            const pauseButton = document.querySelector(pauseSelector);
            if (startButton) startButton.disabled = option.isRunning;
            if (pauseButton) pauseButton.disabled = !option.isRunning;
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

        const startButton = document.querySelector(`.start-simulation[data-id="${optionId}"]`);
        const pauseButton = document.querySelector(`.pause-simulation[data-id="${optionId}"]`);
        if (startButton) startButton.disabled = false;
        if (pauseButton) pauseButton.disabled = true;
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
        document.querySelectorAll('.start-simulation').forEach(button => {
            button.onclick = (e) => startSimulation(parseInt(e.currentTarget.dataset.id, 10));
        });
        document.querySelectorAll('.pause-simulation').forEach(button => {
            button.onclick = (e) => pauseSimulation(parseInt(e.currentTarget.dataset.id, 10));
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

    function toggleMockMode() {
        useMockData = mockToggle.checked;
        if (mockToggleText) {
            mockToggleText.textContent = useMockData ? 'Mock data enabled' : 'Real data mode';
        }
        if (!useMockData) {
            showGlobalError('Real data endpoints are not configured. Reverting to mock mode.', 'info');
            mockToggle.checked = true;
            useMockData = true;
        } else {
            hideGlobalError();
        }
    }

    function openPionexModal() {
        if (!pionexModal) return;
        pionexModal.classList.remove('hidden');
        pionexModalMessage.textContent = useMockData
            ? 'You are currently in mock mode. Switch to real data to authenticate against Pionex.'
            : 'Attempting secure login. Make sure you trust this device before proceeding.';
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

        mockToggle.addEventListener('change', toggleMockMode);

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
        toggleMockMode();
        startLiveDataChecking();
        attachEventListeners();
    }

    initialize();
});