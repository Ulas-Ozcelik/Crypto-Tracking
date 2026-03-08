import { state } from './store/state.js';
import { CoinList } from './ui/CoinList.js';
import { AnalyticsCard } from './ui/AnalyticsCard.js';
import { AddModal } from './ui/AddModal.js';
import { CurrencySelect } from './ui/CurrencySelect.js';

document.addEventListener("DOMContentLoaded", async () => {
    await state.load();

    const coinList = new CoinList();
    const analytics = new AnalyticsCard();
    new AddModal();
    new CurrencySelect();

    coinList.onCoinClick((coinId) => {
        analytics.show(coinId);
    });

    coinList.render();
});