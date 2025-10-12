document.addEventListener('DOMContentLoaded', () => {
    const optionsContainer = document.getElementById('options-container');
    const topVariantsContainer = document.getElementById('top-variants-container');
    const sortBySelect = document.getElementById('sort-by');
    const filterDurationSelect = document.getElementById('filter-duration');
    const pauseAllButton = document.getElementById('pause-all');
    const startFilteredButton = document.getElementById('start-filtered');

    let investmentOptions = [];
    let simulationIntervals = {};
    let isPaused = false;
    let liveDataCheckingInterval = null;
    let isLiveDataCheckingEnabled = false;
    let liveDataCheckRate = 5000; // Default to 5 seconds

    // --- Data Generation (Mock Data) ---
    function generateInvestmentOptions() {
        const names = ['BTC/USDT Grid Bot', 'ETH/USDT Arbitrage Bot', 'DOGE/USDT Spot Grid', 'BNB/USDT Rebalancing Bot', 'ADA/USDT Smart Trade', 'ZEREBRO/USDT Meme Bot', 'AVAX2P/USDT Leveraged Bot', 'SHIB/USDT Futures Grid'];
        const minDurations = ['10m', '1h', '3h', '16h', '24h', '7d'];
        const types = ['standard', 'bot', 'meme'];
        const predictionTechniques = ['ARIMA', 'LSTM', 'Exponential Smoothing', 'Prophet'];

        for (let i = 0; i < 25; i++) { // Increased number of options
            const type = types[Math.floor(Math.random() * types.length)];
            let apy;
            if (type === 'meme') {
                apy = (Math.random() * 500 + 100).toFixed(2); // 100% to 600% APY for meme
            } else {
                apy = (Math.random() * 100 + 10).toFixed(2); // 10% to 110% APY for others
            }
            const pionexEval = (Math.random() * 5 + 1).toFixed(1); // 1 to 5
            const ownEval = (Math.random() * 5 + 1).toFixed(1); // 1 to 5
            const minDuration = minDurations[Math.floor(Math.random() * minDurations.length)];
            const predictionParams = {
                volatility: (Math.random() * 0.8 + 0.2).toFixed(2),
                volume: (Math.random() * 1000 + 500).toFixed(0),
                trend: Math.random() > 0.5 ? 'bullish' : 'bearish'
            };
            const idealParams = {
                minVolatility: (Math.random() * 0.3 + 0.1).toFixed(2),
                maxDrawdown: (Math.random() * 5 + 2).toFixed(1) + '%',
                targetVolume: (Math.random() * 800 + 300).toFixed(0)
            };

            investmentOptions.push({
                id: i,
                name: names[Math.floor(Math.random() * names.length)] + ' ' + (i + 1),
                type: type,
                apy: parseFloat(apy),
                pionexEval: parseFloat(pionexEval),
                ownEval: parseFloat(ownEval),
                minDuration: minDuration,
                currentIncome: 0,
                progress: 0,
                isRunning: false,
                simulationData: {
                    '10m': { income: (Math.random() * 5 * (type === 'meme' ? 5 : 1)).toFixed(2), progress: 0 },
                    '1h': { income: (Math.random() * 10 * (type === 'meme' ? 5 : 1)).toFixed(2), progress: 0 },
                    '3h': { income: (Math.random() * 20 * (type === 'meme' ? 5 : 1)).toFixed(2), progress: 0 },
                    '16h': { income: (Math.random() * 50 * (type === 'meme' ? 5 : 1)).toFixed(2), progress: 0 },
                    '24h': { income: (Math.random() * 70 * (type === 'meme' ? 5 : 1)).toFixed(2), progress: 0 },
                    '7d': { income: (Math.random() * 150 * (type === 'meme' ? 5 : 1)).toFixed(2), progress: 0 }
                },
                graphThumbnail: `graph-thumbnail-${i}`, // Use ID for canvas
                liveIncome: 0, // Simulated live income
                prediction: 0, // Simulated prediction
                predictionParameters: predictionParams,
                predictionTechnique: predictionTechniques[Math.floor(Math.random() * predictionTechniques.length)],
                idealParameters: idealParams
            });
        }
    }

    // --- Rendering Functions ---
    function renderOptions(options) {
        optionsContainer.innerHTML = '';
        options.forEach(option => {
            const optionCard = document.createElement('div');
            optionCard.className = 'option-card';
            optionCard.dataset.id = option.id;
            optionCard.innerHTML = `
                <h3>${option.name} (${option.type})</h3>
                <p><strong>Current APY:</strong> ${option.apy}%</p>
                <p><strong>Pionex Evaluation:</strong> ${option.pionexEval}</p>
                <p><strong>My Evaluation:</strong> ${option.ownEval}</p>
                <p><strong>Min Duration:</strong> ${option.minDuration}</p>
                <canvas class="graph-thumbnail" id="graph-${option.graphThumbnail}" width="150" height="50" style="border: 1px solid #ccc; margin-bottom: 10px;"></canvas>
                <div class="progress-bar-container">
                    <div class="progress-bar" id="progress-${option.id}" style="width: ${option.progress}%"></div>
                </div>
                <div class="simulation-stats">
                    Simulated Income: <span id="income-${option.id}">${option.currentIncome.toFixed(2)}</span> USDT<br>
                    Live Income (Mock): <span id="live-income-${option.id}">${option.liveIncome.toFixed(2)}</span> USDT<br>
                    Prediction (Mock): <span id="prediction-${option.id}">${option.prediction.toFixed(2)}</span> USDT<br>
                    <span id="live-countdown-${option.id}" style="font-size: 0.8em; color: #666;"></span>
                </div>
                <div class="prediction-details">
                    <h4 class="toggle-details">Prediction Details <span class="arrow">▼</span></h4>
                    <div class="details-content">
                        <p><strong>Technique:</strong> ${option.predictionTechnique}</p>
                        <p><strong>Parameters:</strong> Volatility: ${option.predictionParameters.volatility}, Volume: ${option.predictionParameters.volume}, Trend: ${option.predictionParameters.trend}</p>
                        <p><strong>Ideal Parameters:</strong> Min Volatility: ${option.idealParameters.minVolatility}, Max Drawdown: ${option.idealParameters.maxDrawdown}, Target Volume: ${option.idealParameters.targetVolume}</p>
                    </div>
                </div>
                <div class="simulation-controls">
                    <button class="start-simulation" data-id="${option.id}" ${option.isRunning ? 'disabled' : ''}>Start Simulation</button>
                    <button class="pause-simulation" data-id="${option.id}" ${!option.isRunning ? 'disabled' : ''}>Pause Simulation</button>
                </div>
                <div class="guide-section">
                    <h4 class="toggle-guide">Step-by-step Guide <span class="arrow">▼</span></h4>
                    <div class="guide-content">
                        <p>Detailed steps for setting up ${option.name}:</p>
                        <ol>
                            <li>Step 1: Go to Pionex and find ${option.name}.</li>
                            <li>Step 2: Allocate 101 USDT.</li>
                            <li>Step 3: Configure parameters (e.g., price range, grid numbers).</li>
                            <li>Step 4: Confirm and create the bot.</li>
                        </ol>
                        <button class="execute-button">Execute Automated Setup</button>
                    </div>
                </div>
            `;
            optionsContainer.appendChild(optionCard);
        });
        addEventListenersToOptionCards();
    }

    function renderTopVariants() {
        topVariantsContainer.innerHTML = '';
        const sortedByIncome = [...investmentOptions].sort((a, b) => b.currentIncome - a.currentIncome);
        const top3 = sortedByIncome.slice(0, 3);

        top3.forEach(option => {
            const topCard = document.createElement('div');
            topCard.className = 'top-variant-card';
            topCard.innerHTML = `
                <h4>${option.name}</h4>
                <p>Income: ${option.currentIncome.toFixed(2)} USDT</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${option.progress}%"></div>
                </div>
                <div class="guide-section">
                    <h5 class="toggle-guide">Guide <span class="arrow">▼</span></h5>
                    <div class="guide-content">
                        <p>Quick guide for ${option.name}.</p>
                        <button class="execute-button">Execute</button>
                    </div>
                </div>
            `;
            topVariantsContainer.appendChild(topCard);
        });
        addEventListenersToGuideSections();
    }

    // --- Simulation Logic ---
    function startSimulation(optionId) {
        const option = investmentOptions.find(opt => opt.id === optionId);
        if (!option || option.isRunning) return;

        option.isRunning = true;
        const startButton = document.querySelector(`.start-simulation[data-id="${optionId}"]`);
        const pauseButton = document.querySelector(`.pause-simulation[data-id="${optionId}"]`);
        if (startButton) startButton.disabled = true;
        if (pauseButton) pauseButton.disabled = false;

        let currentProgress = option.progress;
        let currentIncome = option.currentIncome;
        const targetIncome = parseFloat(option.simulationData['7d'].income); // Use 7d income as target for full simulation
        const durationSteps = 100; // Number of steps to reach 100% progress

        simulationIntervals[optionId] = setInterval(() => {
            if (isPaused) return;

            currentProgress += (100 / durationSteps);
            currentIncome += (targetIncome / durationSteps);

            if (currentProgress >= 100) {
                currentProgress = 100;
                currentIncome = targetIncome;
                clearInterval(simulationIntervals[optionId]);
                option.isRunning = false;
                if (startButton) startButton.disabled = false;
                if (pauseButton) pauseButton.disabled = true;
            }

            option.progress = currentProgress;
            option.currentIncome = currentIncome;

            updateOptionCard(option);
            renderTopVariants(); // Update top variants as income changes
        }, 100); // Update every 100ms
    }

    function pauseSimulation(optionId) {
        const option = investmentOptions.find(opt => opt.id === optionId);
        if (!option) return;

        clearInterval(simulationIntervals[optionId]);
        option.isRunning = false;
        const startButton = document.querySelector(`.start-simulation[data-id="${optionId}"]`);
        const pauseButton = document.querySelector(`.pause-simulation[data-id="${optionId}"]`);
        if (startButton) startButton.disabled = false;
        if (pauseButton) pauseButton.disabled = true;
    }

    function updateOptionCard(option) {
        const progressBar = document.getElementById(`progress-${option.id}`);
        const incomeSpan = document.getElementById(`income-${option.id}`);
        const liveIncomeSpan = document.getElementById(`live-income-${option.id}`);
        const predictionSpan = document.getElementById(`prediction-${option.id}`);

        if (progressBar) progressBar.style.width = `${option.progress}%`;
        if (incomeSpan) incomeSpan.textContent = option.currentIncome.toFixed(2);
        if (liveIncomeSpan) liveIncomeSpan.textContent = option.liveIncome.toFixed(2);
        if (predictionSpan) predictionSpan.textContent = option.prediction.toFixed(2);
    }

    // Function to draw a simulated graph
    function drawGraph(canvasId, historicalData, predictedData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Clear previous drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 10;
        const width = canvas.width - padding * 2;
        const height = canvas.height - padding * 2;

        // Find min/max for scaling
        const allData = [...historicalData, ...predictedData];
        const minY = Math.min(...allData);
        const maxY = Math.max(...allData);
        const rangeY = maxY - minY;

        // Draw historical data
        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        historicalData.forEach((value, index) => {
            const x = padding + (index / (historicalData.length - 1)) * width;
            const y = padding + height - ((value - minY) / rangeY) * height;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw predicted data
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.setLineDash([5, 5]); // Dashed line for prediction
        ctx.lineWidth = 2;
        predictedData.forEach((value, index) => {
            const x = padding + ((historicalData.length - 1 + index) / (historicalData.length + predictedData.length - 1)) * width;
            const y = padding + height - ((value - minY) / rangeY) * height;
            if (index === 0) {
                // Connect prediction to the end of historical data
                const lastHistoricalX = padding + ((historicalData.length - 1) / (historicalData.length + predictedData.length - 1)) * width;
                const lastHistoricalY = padding + height - ((historicalData[historicalData.length - 1] - minY) / rangeY) * height;
                ctx.moveTo(lastHistoricalX, lastHistoricalY);
            }
            ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
    }

    // --- Live Data and Prediction Simulation ---
    let liveDataCountdown = 0;
    const liveDataCountdownElement = document.getElementById('live-data-countdown');
    const pionexLoginButton = document.getElementById('pionex-login-button');

    function toggleLiveDataChecking() {
        isLiveDataCheckingEnabled = !isLiveDataCheckingEnabled;
        if (isLiveDataCheckingEnabled) {
            startLiveDataChecking();
            if (pionexLoginButton) pionexLoginButton.disabled = true;
        } else {
            stopLiveDataChecking();
            if (pionexLoginButton) pionexLoginButton.disabled = false;
        }
    }

    function startLiveDataChecking() {
        if (liveDataCheckingInterval) clearInterval(liveDataCheckingInterval);
        liveDataCountdown = liveDataCheckRate / 1000; // Initialize countdown in seconds
        if (liveDataCountdownElement) liveDataCountdownElement.textContent = `Next update in ${liveDataCountdown}s`;

        liveDataCheckingInterval = setInterval(() => {
            if (isPaused) return;

            liveDataCountdown--;
            if (liveDataCountdownElement) liveDataCountdownElement.textContent = `Next update in ${liveDataCountdown}s`;

            if (liveDataCountdown <= 0) {
                liveDataCountdown = liveDataCheckRate / 1000;
                investmentOptions.forEach(option => {
                    // Simulate live data fluctuation around the simulated income
                    option.liveIncome = option.currentIncome * (1 + (Math.random() - 0.5) * 0.1); // +/- 5% fluctuation
                    option.prediction = option.liveIncome * (1 + (Math.random() - 0.5) * 0.05); // Prediction based on live income +/- 2.5%
                    updateOptionCard(option);

                    // Simulate historical and predicted data for graph
                    const historicalData = Array.from({ length: 20 }, (_, i) => option.currentIncome * (1 + (Math.random() - 0.5) * 0.2 * (i / 20)));
                    const predictedData = Array.from({ length: 5 }, (_, i) => option.prediction * (1 + (Math.random() - 0.5) * 0.1 * (i / 5)));
                    drawGraph(`graph-${option.graphThumbnail}`, historicalData, predictedData);
                });
            }
        }, 1000); // Update countdown every second
    }

    function stopLiveDataChecking() {
        if (liveDataCheckingInterval) {
            clearInterval(liveDataCheckingInterval);
            liveDataCheckingInterval = null;
        }
        if (liveDataCountdownElement) liveDataCountdownElement.textContent = '';
    }

    function handlePionexLogin() {
        // In a real application, this would open a secure login flow.
        // For this simulation, we'll just show a mock iframe.
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Pionex Login (Simulated)</h2>
                <iframe src="https://www.pionex.com/en-US/sign/ref/h20000000000000000" width="100%" height="400px" frameborder="0"></iframe>
                <button id="close-modal">Close</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    // --- Filtering and Sorting ---
    function applyFiltersAndSort() {
        let filteredOptions = [...investmentOptions];

        const filterDuration = filterDurationSelect.value;
        if (filterDuration !== 'all') {
            filteredOptions = filteredOptions.filter(option => {
                const minDurationMap = { '10m': 10, '1h': 60, '3h': 180, '16h': 960, '24h': 1440, '7d': 10080 };
                return minDurationMap[option.minDuration] <= minDurationMap[filterDuration];
            });
        }

        const sortBy = sortBySelect.value;
        filteredOptions.sort((a, b) => {
            if (sortBy === 'apy') return b.apy - a.apy;
            if (sortBy === 'pionex-eval') return b.pionexEval - a.pionexEval;
            if (sortBy === 'own-eval') return b.ownEval - a.ownEval;
            if (sortBy === 'simulation-income') return b.currentIncome - a.currentIncome;
            if (sortBy === 'min-duration') {
                const minDurationMap = { '10m': 10, '1h': 60, '3h': 180, '16h': 960, '24h': 1440, '7d': 10080 };
                return minDurationMap[a.minDuration] - minDurationMap[b.minDuration];
            }
            return 0;
        });

        renderOptions(filteredOptions);
    }

    // --- Event Listeners ---
    function addEventListenersToOptionCards() {
        document.querySelectorAll('.start-simulation').forEach(button => {
            button.onclick = (e) => startSimulation(parseInt(e.target.dataset.id));
        });
        document.querySelectorAll('.pause-simulation').forEach(button => {
            button.onclick = (e) => pauseSimulation(parseInt(e.target.dataset.id));
        });
        document.querySelectorAll('.toggle-details').forEach(toggle => {
            toggle.onclick = (e) => {
                const detailsContent = e.target.nextElementSibling;
                detailsContent.classList.toggle('expanded');
                e.target.querySelector('.arrow').textContent = detailsContent.classList.contains('expanded') ? '▲' : '▼';
            };
        });
        addEventListenersToGuideSections();
    }

    function addEventListenersToGuideSections() {
        document.querySelectorAll('.toggle-guide').forEach(toggle => {
            toggle.onclick = (e) => {
                const guideContent = e.target.nextElementSibling;
                guideContent.classList.toggle('expanded');
                e.target.querySelector('.arrow').textContent = guideContent.classList.contains('expanded') ? '▲' : '▼';
            };
        });
    }

    sortBySelect.addEventListener('change', applyFiltersAndSort);
    filterDurationSelect.addEventListener('change', applyFiltersAndSort);

    pauseAllButton.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseAllButton.textContent = isPaused ? 'Resume All Simulations' : 'Pause All Simulations';
        if (!isPaused) {
            investmentOptions.forEach(option => {
                if (option.isRunning && !simulationIntervals[option.id]) {
                    startSimulation(option.id);
                }
            });
            if (isLiveDataCheckingEnabled) startLiveDataChecking();
        } else {
            for (const id in simulationIntervals) {
                clearInterval(simulationIntervals[id]);
                delete simulationIntervals[id];
            }
            stopLiveDataChecking();
        }
    });

    startFilteredButton.addEventListener('click', () => {
        const currentlyDisplayedOptions = Array.from(optionsContainer.children).map(card =>
            investmentOptions.find(opt => opt.id === parseInt(card.dataset.id))
        );
        currentlyDisplayedOptions.forEach(option => {
            if (option && !option.isRunning) {
                startSimulation(option.id);
            }
        });
    });

    if (pionexLoginButton) {
        pionexLoginButton.addEventListener('click', handlePionexLogin);
    }

    const createIdealBotButton = document.getElementById('create-ideal-bot-button');
    if (createIdealBotButton) {
        createIdealBotButton.addEventListener('click', () => {
            alert('Simulating creation of ideal bot based on current parameters...');
            // In a real application, this would trigger a more complex process
        });
    }

    // --- Initialization ---
    generateInvestmentOptions();
    // Sort by APY initially to get top 10 for auto-simulation
    investmentOptions.sort((a, b) => b.apy - a.apy);
    applyFiltersAndSort(); // Initial render and sort

    // Auto-start simulations for the top 10
    investmentOptions.slice(0, 10).forEach(option => {
        startSimulation(option.id);
        // Initial graph draw for auto-simulated options
        const historicalData = Array.from({ length: 20 }, (_, i) => option.currentIncome * (1 + (Math.random() - 0.5) * 0.2 * (i / 20)));
        const predictedData = Array.from({ length: 5 }, (_, i) => option.prediction * (1 + (Math.random() - 0.5) * 0.1 * (i / 5)));
        drawGraph(`graph-${option.graphThumbnail}`, historicalData, predictedData);
    });

    renderTopVariants(); // Initial render of top variants

    // Start live data checking automatically
    toggleLiveDataChecking();
});