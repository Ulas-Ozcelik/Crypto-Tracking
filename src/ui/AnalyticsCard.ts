import { state } from '../store/state.js';
import { fetchCoinChart, fetchCoinDetails, ChartData } from '../api/binance.js';

export class AnalyticsCard {
    private mainView: HTMLElement;
    private analyticsView: HTMLElement;
    private chartContainer: HTMLElement;
    private statsContainer: HTMLElement;
    private titleEl: HTMLElement;

    constructor() {
        this.mainView = document.getElementById("main-view") as HTMLElement;
        this.analyticsView = document.getElementById("analytics-view") as HTMLElement;
        this.chartContainer = document.getElementById("analytics-chart") as HTMLElement;
        this.statsContainer = document.getElementById("analytics-stats") as HTMLElement;
        this.titleEl = document.getElementById("analytics-title") as HTMLElement;

        const backBtn = document.getElementById("back-btn");
        if (backBtn) {
            backBtn.addEventListener("click", () => this.hide());
        }
    }

    public async show(coinId: string) {
        this.titleEl.textContent = coinId.toUpperCase();
        this.mainView.classList.add("hidden");
        this.analyticsView.classList.remove("hidden");

        this.chartContainer.innerHTML = "<div class='loading' style='color:#777;text-align:center;padding:20px'>Loading chart...</div>";
        this.statsContainer.innerHTML = "<div class='loading' style='color:#777;text-align:center;padding:10px'>Loading data...</div>";

        try {
            const [chartData, detailsData] = await Promise.all([
                fetchCoinChart(coinId, state.currency),
                fetchCoinDetails(coinId, state.currency)
            ]);

            if (chartData) {
                this.drawChart(this.chartContainer, chartData);
            } else {
                this.chartContainer.innerHTML = "<div class='loading' style='color:red;text-align:center;'>Chart unavailable (Rate Limit). Please wait.</div>";
            }

            if (detailsData) {
                const formatOptions = {
                    style: "currency",
                    currency: state.currency.toUpperCase(),
                    maximumFractionDigits: 0
                } as Intl.NumberFormatOptions;

                const formatPrice = {
                    style: "currency",
                    currency: state.currency.toUpperCase()
                } as Intl.NumberFormatOptions;

                this.statsContainer.innerHTML = `
                    <div class="stats-grid">
                        <div class="stat-box">
                            <span class="stat-label">Market Cap</span>
                            <span class="stat-value">${detailsData.market_cap.toLocaleString(state.locale, formatOptions)}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">24h Volume</span>
                            <span class="stat-value">${detailsData.total_volume.toLocaleString(state.locale, formatOptions)}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">24h High</span>
                            <span class="stat-value" style="color:#4caf50">${detailsData.high_24h.toLocaleString(state.locale, formatPrice)}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">24h Low</span>
                            <span class="stat-value" style="color:#f44336">${detailsData.low_24h.toLocaleString(state.locale, formatPrice)}</span>
                        </div>
                    </div>
                `;
            } else {
                this.statsContainer.innerHTML = `
                <div class='loading' style='color:red;text-align:center;padding:10px;'>
                    <strong>Data Unavailable (Rate Limit)</strong><br>
                    Too many rapid requests.<br>
                    Please wait 1 minute and try again.
                </div>`;
            }
        } catch (error) {
            this.chartContainer.innerHTML = "";
            this.statsContainer.innerHTML = `
                <div class='loading' style='color:red;text-align:center;'>
                    <strong>Rate Limit (429)</strong><br>
                    Too many requests. CoinGecko API temporarily blocked access.<br>
                    Please wait 1-2 minutes and try again.
                </div>
            `;
        }
    }

    public hide() {
        this.analyticsView.classList.add("hidden");
        this.mainView.classList.remove("hidden");
        this.chartContainer.innerHTML = "";
        this.statsContainer.innerHTML = "";
    }

    private drawChart(container: HTMLElement, data: ChartData) {
        if (!data || data.length === 0) return;

        const prices = data.map(item => item[1]);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        const svgWidth = 300;
        const svgHeight = 100;
        const padding = 10;

        const usableWidth = svgWidth - (padding * 2);
        const usableHeight = svgHeight - (padding * 2);

        const xStep = usableWidth / (prices.length - 1);
        const priceRange = maxPrice - minPrice || 1;

        let points = "";
        for (let i = 0; i < prices.length; i++) {
            const x = padding + (i * xStep);
            const normalizedY = (prices[i] - minPrice) / priceRange;
            const y = padding + (usableHeight - (normalizedY * usableHeight));
            points += `${x},${y} `;
        }

        const isPositive = prices[prices.length - 1] >= prices[0];
        const lineColor = isPositive ? "#4caf50" : "#f44336";

        container.innerHTML = `
            <svg width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none" style="overflow: visible;">
                <polyline 
                    fill="none" 
                    stroke="${lineColor}" 
                    stroke-width="2" 
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    points="${points.trim()}" 
                />
            </svg>
        `;
    }
}
