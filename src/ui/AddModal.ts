import { state } from '../store/state.js';
import { fetchCryptoNames } from '../api/binance.js';

export class AddModal {
    private addBtn: HTMLElement;
    private addContainer: HTMLElement;
    private saveBtn: HTMLElement;
    private cancelBtn: HTMLElement;
    private input: HTMLInputElement;

    constructor() {
        this.addBtn = document.getElementById("add-btn") as HTMLElement;
        this.addContainer = document.getElementById("add-coin-container") as HTMLElement;
        this.saveBtn = document.getElementById("save-coin-btn") as HTMLElement;
        this.cancelBtn = document.getElementById("cancel-btn") as HTMLElement;
        this.input = document.getElementById("coin-input") as HTMLInputElement;

        this.addBtn.addEventListener("click", () => this.show());
        this.cancelBtn.addEventListener("click", () => this.hide());
        this.saveBtn.addEventListener("click", () => this.save());

        this.input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.save();
            }
        });
    }

    private show() {
        this.addContainer.classList.remove("hidden");
        this.input.focus();
    }

    private hide() {
        this.addContainer.classList.add("hidden");
        this.input.value = "";
    }

    private async save() {
        const coinId = this.input.value.trim().toLowerCase();
        if (!coinId) return;

        if (state.coins.includes(coinId)) {
            alert("This coin is already in your list.");
            this.hide();
            return;
        }

        const btnOriginalText = this.saveBtn.textContent || "Add";
        this.saveBtn.textContent = "Verifying...";
        this.saveBtn.setAttribute("disabled", "true");

        const data = await fetchCryptoNames([coinId]);

        this.saveBtn.textContent = btnOriginalText;
        this.saveBtn.removeAttribute("disabled");

        if (data && data[coinId]) {
            await state.addCoin(coinId);
            this.hide();
        } else {
            alert("Invalid Coin ID. Please check CoinGecko.");
        }
    }
}
