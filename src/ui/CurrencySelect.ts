import { state, Currency } from '../store/state.js';

export class CurrencySelect {
    private selectElement: HTMLSelectElement;

    constructor() {
        this.selectElement = document.getElementById("currency-select") as HTMLSelectElement;

        state.subscribe(() => {
            if (this.selectElement.value !== state.currency) {
                this.selectElement.value = state.currency;
            }
        });

        this.selectElement.addEventListener("change", (e) => {
            const target = e.target as HTMLSelectElement;
            const newCurrency = target.value as Currency;
            state.setCurrency(newCurrency);
        });
    }
}
