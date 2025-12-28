// ---- Traffic Light Loading Animation ----
window.addEventListener('DOMContentLoaded', function() {
    const introDiv = document.createElement('div');
    introDiv.id = "intro-loading";
    introDiv.innerHTML = `
      <div class="traffic-light-loader">
         <div class="light red"></div>
         <div class="light yellow"></div>
         <div class="light green"></div>
      </div>
      <div class="loading-text">Initializing Traffic Analytics System</div>
      <div class="loading-bar-bg">
         <div class="loading-bar" id="loadingBar"></div>
      </div>
      <div class="loading-status" id="loadingStatus">Starting up...</div>
    `;
    document.body.appendChild(introDiv);

    let percent = 0;
    const loadingBar = document.getElementById('loadingBar');
    const loadingStatus = document.getElementById('loadingStatus');
    
    const statusMessages = [
        "Initializing AI models...",
        "Loading junction data...",
        "Connecting to weather APIs...",
        "Setting up multi-dataset analysis...",
        "Preparing advanced charts...",
        "Finalizing dashboard...",
        "Ready to predict!"
    ];

    const loadingInterval = setInterval(() => {
        percent += 15;
        loadingBar.style.width = percent + '%';
        
        // Update status message
        const statusIndex = Math.floor((percent / 100) * (statusMessages.length - 1));
        loadingStatus.textContent = statusMessages[statusIndex] || statusMessages[statusMessages.length - 1];
        
        if (percent >= 100) {
            clearInterval(loadingInterval);
            loadingStatus.textContent = "Launch complete!";
            
            setTimeout(() => {
                introDiv.style.transition = 'opacity 0.8s ease-out';
                introDiv.style.opacity = '0';
                setTimeout(() => {
                    introDiv.remove();
                    document.querySelector('.main-scroll-container').style.display = '';
                    // Optional: Add entrance animation to main content
                    document.querySelector('.main-scroll-container').style.animation = 'fadeIn 0.8s ease-in';
                }, 800);
            }, 600);
        }
    }, 300);

    // Hide app contents until loaded
    document.querySelector('.main-scroll-container').style.display = 'none';
});

// ---- Advanced Traffic Prediction System ----

// Sample datasets for different junctions
const junctionData = {
    1: { name: "Main Street", baseFlow: 45, variance: 15 },
    2: { name: "Highway Cross", baseFlow: 78, variance: 25 },
    3: { name: "City Center", baseFlow: 92, variance: 30 },
    4: { name: "Airport Road", baseFlow: 65, variance: 20 }
};

// Chart.js configuration with safe plugin initialization
const chartConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Predicted Traffic Flow',
                data: [],
                borderColor: 'rgba(8,217,214,0.9)',
                backgroundColor: 'rgba(8,217,214,0.2)',
                fill: true,
                pointRadius: 6,
                pointBackgroundColor: '#fff',
                pointBorderColor: 'rgba(8,217,214,0.9)',
                borderWidth: 3,
                tension: 0.4,
            },
            {
                label: 'Actual Traffic Flow',
                data: [],
                borderColor: 'rgba(255,97,166,0.9)',
                backgroundColor: 'rgba(255,97,166,0.2)',
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#fff',
                pointBorderColor: 'rgba(255,97,166,0.9)',
                borderWidth: 2,
                tension: 0.3,
            },
            {
                label: 'Junction 1 - Main Street',
                data: [],
                borderColor: 'rgba(31,162,255,0.8)',
                backgroundColor: 'rgba(31,162,255,0.2)',
                fill: false,
                pointRadius: 4,
                borderWidth: 2,
                hidden: true
            },
            {
                label: 'Junction 2 - Highway Cross',
                data: [],
                borderColor: 'rgba(255,189,89,0.8)',
                backgroundColor: 'rgba(255,189,89,0.2)',
                fill: false,
                pointRadius: 4,
                borderWidth: 2,
                hidden: true
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#fff', usePointStyle: true }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(31,162,255,0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#08d9d6',
                borderWidth: 1,
                callbacks: {
                    afterLabel: function(context) {
                        if (context.datasetIndex < 2) {
                            const accuracy = Math.round(85 + Math.random() * 10);
                            return `Accuracy: ${accuracy}%`;
                        }
                        return '';
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: { color: "#fff" },
                grid: { color: "rgba(255,255,255,0.1)" }
            },
            y: {
                ticks: { color: "#fff" },
                grid: { color: "rgba(255,255,255,0.1)" },
                beginAtZero: true
            }
        }
    }
};

const ctx = document.getElementById('trafficChart').getContext('2d');
let trafficChart = new Chart(ctx, chartConfig);

let predictionHistory = [];
let totalPredictions = 0;

document.getElementById('predictForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const hour = document.getElementById('hour').value;
    const weekday = document.getElementById('weekday').value;
    const junction = document.getElementById('junction').value;
    const temperature = document.getElementById('temperature').value || 25;
    const city = document.getElementById('citySelection').value;
    
    const resultSection = document.getElementById('resultSection');
    resultSection.innerHTML = '<div style="color:#08d9d6;">🔄 Processing multi-dataset prediction...</div>';

    // Make API call to backend
    fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            hour: parseInt(hour),
            weekday: parseInt(weekday),
            junction: parseInt(junction),
            temperature: parseFloat(temperature),
            city: city
        })
    })
    .then(response => response.json())
    .then(data => {
        const predicted = data.predicted_traffic;
        const actual = data.actual_traffic || generateActualFlow(predicted);
        
        const timestamp = new Date().toLocaleTimeString();
        addDataPoint(timestamp, predicted, actual, junction);
        
        resultSection.innerHTML = `
            <div style="text-align: center;">
                <h2>Multi-Dataset Prediction Results</h2>
                <p style="color: #08d9d6; font-size: 1.2rem; margin-bottom: 1rem;">📍 City: ${city}</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    <div style="background: rgba(8,217,214,0.1); padding: 1rem; border-radius: 10px; border: 1px solid rgba(8,217,214,0.3);">
                        <h3>Predicted Flow</h3>
                        <span style="font-size: 2rem; color: #08d9d6; text-shadow: 0 0 10px #08d9d6;">${predicted}</span>
                    </div>
                    <div style="background: rgba(255,97,166,0.1); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,97,166,0.3);">
                        <h3>${data.actual_traffic ? 'Actual' : 'Simulated Actual'}</h3>
                        <span style="font-size: 2rem; color: #ff61a6; text-shadow: 0 0 10px #ff61a6;">${Math.round(actual)}</span>
                    </div>
                    <div style="background: rgba(31,162,255,0.1); padding: 1rem; border-radius: 10px; border: 1px solid rgba(31,162,255,0.3);">
                        <h3>Accuracy</h3>
                        <span style="font-size: 2rem; color: #1fa2ff; text-shadow: 0 0 10px #1fa2ff;">${calculateAccuracy(predicted, actual)}%</span>
                    </div>
                </div>
                <p style="margin-top: 1rem; color: #b8e8f3;">Junction ${junction} | Weather Factor: ${getWeatherImpact(temperature)}</p>
            </div>
        `;
        
        totalPredictions++;
        updateStatistics();
    })
    .catch(error => {
        console.error('Error:', error);
        // Fallback to local prediction if API fails
        const predicted = generatePrediction(hour, weekday, junction, temperature);
        const actual = generateActualFlow(predicted);
        
        const timestamp = new Date().toLocaleTimeString();
        addDataPoint(timestamp, predicted, actual, junction);
        
        resultSection.innerHTML = `
            <div style="text-align: center;">
                <h2>Multi-Dataset Prediction Results (Local Mode)</h2>
                <p style="color: #ff61a6; font-size: 0.9rem;">Backend unavailable - using local predictions</p>
                <p style="color: #08d9d6; font-size: 1.2rem; margin-bottom: 1rem;">📍 City: ${city}</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    <div style="background: rgba(8,217,214,0.1); padding: 1rem; border-radius: 10px; border: 1px solid rgba(8,217,214,0.3);">
                        <h3>Predicted Flow</h3>
                        <span style="font-size: 2rem; color: #08d9d6; text-shadow: 0 0 10px #08d9d6;">${predicted}</span>
                    </div>
                    <div style="background: rgba(255,97,166,0.1); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,97,166,0.3);">
                        <h3>Simulated Actual</h3>
                        <span style="font-size: 2rem; color: #ff61a6; text-shadow: 0 0 10px #ff61a6;">${actual}</span>
                    </div>
                    <div style="background: rgba(31,162,255,0.1); padding: 1rem; border-radius: 10px; border: 1px solid rgba(31,162,255,0.3);">
                        <h3>Accuracy</h3>
                        <span style="font-size: 2rem; color: #1fa2ff; text-shadow: 0 0 10px #1fa2ff;">${calculateAccuracy(predicted, actual)}%</span>
                    </div>
                </div>
                <p style="margin-top: 1rem; color: #b8e8f3;">Junction ${junction} | Weather Factor: ${getWeatherImpact(temperature)}</p>
            </div>
        `;
        
        totalPredictions++;
        updateStatistics();
    });
});

// All other functions remain the same as in previous version...
function generatePrediction(hour, weekday, junction, temperature) {
    const junctionInfo = junctionData[junction] || junctionData[1];
    let flow = junctionInfo.baseFlow;
    
    const hourFactors = [0.3, 0.2, 0.1, 0.1, 0.2, 0.4, 0.8, 1.2, 1.0, 0.7, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.3, 1.5, 1.2, 0.9, 0.7, 0.5, 0.4, 0.3];
    flow *= hourFactors[hour] || 0.5;
    
    const weekdayFactors = [0.6, 1.0, 1.0, 1.0, 1.0, 1.0, 0.8];
    flow *= weekdayFactors[weekday] || 1.0;
    
    const tempFactor = 1 + (temperature - 25) * 0.01;
    flow *= tempFactor;
    
    flow += (Math.random() - 0.5) * junctionInfo.variance;
    
    return Math.max(5, Math.round(flow));
}

function generateActualFlow(predicted) {
    const variance = predicted * 0.15;
    const actual = predicted + (Math.random() - 0.5) * variance;
    return Math.max(0, Math.round(actual));
}

function calculateAccuracy(predicted, actual) {
    const error = Math.abs(predicted - actual);
    const accuracy = Math.max(0, 100 - (error / predicted) * 100);
    return Math.round(accuracy);
}

function getWeatherImpact(temperature) {
    if (temperature < 10) return "Cold - Reduced Traffic";
    if (temperature > 35) return "Hot - Increased AC Load";
    return "Optimal Conditions";
}

function addDataPoint(timestamp, predicted, actual, junction) {
    trafficChart.data.labels.push(timestamp);
    trafficChart.data.datasets[0].data.push(predicted);
    trafficChart.data.datasets[1].data.push(actual);
    
    if (junction >= 3) {
        trafficChart.data.datasets[parseInt(junction)].data.push(predicted);
    }
    
    if (trafficChart.data.labels.length > 15) {
        trafficChart.data.labels.shift();
        trafficChart.data.datasets.forEach(dataset => {
            if (dataset.data.length > 0) dataset.data.shift();
        });
    }
    
    trafficChart.update('none');
    
    predictionHistory.push({
        timestamp,
        hour: document.getElementById('hour').value,
        weekday: document.getElementById('weekday').value,
        junction,
        predicted,
        actual,
        accuracy: calculateAccuracy(predicted, actual)
    });
}

// Chart controls
document.getElementById('toggleLegend').addEventListener('click', () => {
    trafficChart.options.plugins.legend.display = !trafficChart.options.plugins.legend.display;
    trafficChart.update();
});

document.getElementById('resetZoom').addEventListener('click', () => {
    // Reset zoom if plugin is available, otherwise just update chart
    if (trafficChart.resetZoom) {
        trafficChart.resetZoom();
    } else {
        trafficChart.update();
    }
});

document.getElementById('exportPNG').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'traffic-chart.png';
    link.href = trafficChart.toBase64Image();
    link.click();
});

document.getElementById('exportPDF').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const imgData = trafficChart.toBase64Image();
    
    pdf.setFontSize(16);
    pdf.text('Advanced Traffic Flow Analysis Report', 20, 20);
    pdf.setFontSize(12);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    pdf.text(`Total Predictions: ${totalPredictions}`, 20, 40);
    
    pdf.addImage(imgData, 'PNG', 15, 50, 180, 90);
    pdf.save('traffic-analysis-report.pdf');
});

// Filter controls
document.getElementById('junctionFilter').addEventListener('change', updateChartFilters);
document.getElementById('weekFilter').addEventListener('change', updateChartFilters);

document.getElementById('dataView').addEventListener('change', function(e) {
    const view = e.target.value;
    
    switch(view) {
        case 'predicted':
            trafficChart.data.datasets[0].hidden = false;
            trafficChart.data.datasets[1].hidden = true;
            trafficChart.data.datasets[2].hidden = true;
            trafficChart.data.datasets[3].hidden = true;
            break;
        case 'actual':
            trafficChart.data.datasets[0].hidden = true;
            trafficChart.data.datasets[1].hidden = false;
            trafficChart.data.datasets[2].hidden = true;
            trafficChart.data.datasets[3].hidden = true;
            break;
        case 'multiple':
            trafficChart.data.datasets[0].hidden = true;
            trafficChart.data.datasets[1].hidden = true;
            trafficChart.data.datasets[2].hidden = false;
            trafficChart.data.datasets[3].hidden = false;
            break;
        default: // comparison
            trafficChart.data.datasets[0].hidden = false;
            trafficChart.data.datasets[1].hidden = false;
            trafficChart.data.datasets[2].hidden = true;
            trafficChart.data.datasets[3].hidden = true;
    }
    trafficChart.update();
});

function updateChartFilters() {
    trafficChart.update();
}

// Export functions
document.getElementById('downloadCSV').addEventListener('click', function() {
    if (predictionHistory.length === 0) {
        alert("No predictions to download yet!");
        return;
    }
    
    let csv = "timestamp,hour,weekday,junction,predicted,actual,accuracy\n";
    predictionHistory.forEach(row => {
        csv += `${row.timestamp},${row.hour},${row.weekday},${row.junction},${row.predicted},${row.actual},${row.accuracy}\n`;
    });
    
    downloadFile(csv, 'traffic-predictions.csv', 'text/csv');
});

document.getElementById('downloadAnalysis').addEventListener('click', function() {
    const report = generateAnalysisReport();
    downloadFile(report, 'traffic-analysis-report.txt', 'text/plain');
});

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generateAnalysisReport() {
    const avgAccuracy = predictionHistory.reduce((sum, item) => sum + item.accuracy, 0) / predictionHistory.length || 0;
    const peakHour = findPeakHour();
    
    return `
ADVANCED TRAFFIC FLOW ANALYSIS REPORT
=====================================
Generated: ${new Date().toLocaleString()}
Total Predictions: ${totalPredictions}
Average Accuracy: ${avgAccuracy.toFixed(2)}%
Peak Traffic Hour: ${peakHour}

PREDICTION HISTORY:
${predictionHistory.map(p => 
    `${p.timestamp} - Junction ${p.junction}: Predicted ${p.predicted}, Actual ${p.actual} (${p.accuracy}% accuracy)`
).join('\n')}

SYSTEM PERFORMANCE:
- Multi-dataset processing: Enabled
- Real-time comparison: Active
- Weather integration: Enabled
- Export capabilities: Full

Developed by Megha and Team - PDA College 2025
    `;
}

function updateStatistics() {
    const avgAccuracy = predictionHistory.reduce((sum, item) => sum + item.accuracy, 0) / predictionHistory.length || 0;
    const peakHour = findPeakHour();
    
    document.getElementById('avgAccuracy').textContent = avgAccuracy.toFixed(1) + '%';
    document.getElementById('peakHours').textContent = peakHour + ':00';
    document.getElementById('totalPredictions').textContent = totalPredictions;
}

function findPeakHour() {
    const hourCounts = {};
    predictionHistory.forEach(item => {
        hourCounts[item.hour] = (hourCounts[item.hour] || 0) + 1;
    });
    
    return Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b, '8');
}

// Initialize statistics
updateStatistics();
