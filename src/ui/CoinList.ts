import { state } from '../store/state.js';
import { fetchCryptoPrices } from '../api/binance.js';

export class CoinList {
    private listElement: HTMLElement;
    private onCoinClickCallback: ((coinId: string) => void) | null = null;

    constructor() {
        const el = document.getElementById("crypto-list");
        if (!el) throw new Error("List not found");
        this.listElement = el;

        this.listElement.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            const clickedItem = target.closest(".crypto-item") as HTMLElement;

            if (!clickedItem) return;

            const coinId = clickedItem.dataset.id;
            if (!coinId) return;

            if (target.classList.contains("delete-btn")) {
                state.removeCoin(coinId);
                return;
            }

            if (this.onCoinClickCallback) {
                this.onCoinClickCallback(coinId);
            }
        });

        state.subscribe(() => this.render());
    }

    public onCoinClick(callback: (coinId: string) => void) {
        this.onCoinClickCallback = callback;
    }

    public async render() {
        this.listElement.innerHTML = "<div class='loading'>Loading...</div>";

        if (state.coins.length === 0) {
            this.listElement.innerHTML = "<div class='cookie-card'>No coins tracked. Click '+' to add.</div>";
            return;
        }

        const data = await fetchCryptoPrices(state.coins, state.currency);

        if (!data) {
            this.listElement.innerHTML = "<div class='loading' style='color:red;'>Connection Error</div>";
            return;
        }

        this.listElement.innerHTML = "";

        state.coins.forEach(coin => {
            if (data[coin]) {
                const coinEl = document.createElement("div");
                coinEl.className = "crypto-item";
                coinEl.dataset.id = coin;

                const infoDiv = document.createElement("div");
                infoDiv.className = "crypto-info";

                const nameDiv = document.createElement("div");
                nameDiv.className = "crypto-name";
                nameDiv.textContent = coin.charAt(0).toUpperCase() + coin.slice(1);

                const change = data[coin][`${state.currency}_24h_change`] || 0;
                const changeEl = document.createElement("span");
                changeEl.className = `change ${change >= 0 ? 'positive' : 'negative'}`;
                changeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;

                infoDiv.appendChild(nameDiv);
                infoDiv.appendChild(changeEl);

                const priceDiv = document.createElement("div");
                priceDiv.className = "crypto-price";

                const formatOptions = {
                    style: "currency",
                    currency: state.currency.toUpperCase()
                } as Intl.NumberFormatOptions;

                const priceText = document.createElement("span");
                priceText.textContent = data[coin][state.currency].toLocaleString(state.locale, formatOptions);

                const delBtn = document.createElement("span");
                delBtn.className = "delete-btn";
                delBtn.textContent = "×";
                delBtn.title = "Remove";

                priceDiv.appendChild(priceText);

                coinEl.appendChild(infoDiv);
                coinEl.appendChild(priceDiv);
                coinEl.appendChild(delBtn);

                this.listElement.appendChild(coinEl);
            }
        });
    }
}
