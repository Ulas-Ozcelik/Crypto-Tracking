export type Currency = "usd" | "try";

export class AppState {
    public coins: string[] = ["bitcoin", "ethereum"];
    public currency: Currency = "usd";
    public locale: string = "en-US";
    private listeners: Function[] = [];

    public async load(): Promise<void> {
        return new Promise((resolve) => {
            chrome.storage.sync.get(["coins", "currency"], (result) => {
                if (result.coins) {
                    this.coins = result.coins as string[];
                }
                if (result.currency) {
                    this.currency = result.currency as Currency;
                    this.locale = this.currency === "usd" ? "en-US" : "tr-TR";
                }
                resolve();
            });
        });
    }

    public async addCoin(coinId: string): Promise<boolean> {
        if (!coinId) return false;
        const normalizedCoin = coinId.toLowerCase().trim();

        if (!this.coins.includes(normalizedCoin)) {
            this.coins.push(normalizedCoin);
            await this.save();
            this.notify();
            return true;
        }
        return false;
    }

    public async removeCoin(coinId: string): Promise<void> {
        this.coins = this.coins.filter(c => c !== coinId);
        await this.save();
        this.notify();
    }

    public async setCurrency(currency: Currency): Promise<void> {
        this.currency = currency;
        this.locale = this.currency === "usd" ? "en-US" : "tr-TR";
        await this.save();
        this.notify();
    }

    private async save(): Promise<void> {
        return new Promise((resolve) => {
            chrome.storage.sync.set({
                coins: this.coins,
                currency: this.currency
            }, () => {
                resolve();
            });
        });
    }

    public subscribe(listener: Function): void {
        this.listeners.push(listener);
    }

    private notify(): void {
        this.listeners.forEach(listener => listener());
    }
}

export const state = new AppState();
