When using **Freqtrade**  for backtesting trading strategies, **trailing_stop**  (trailing stop-loss) may seem to improve profits, but in practice, it can have the opposite effect. This happens due to the limitations of the backtesting mechanism, particularly when using a larger time frame that fails to capture short-term price fluctuations, resulting in trailing stops not performing as expected.
### Cause of the Problem 

Freqtrade backtesting typically uses larger time frames (e.g., 1-hour candles). However, in live trading, the market often exhibits price fluctuations in smaller time frames (e.g., 5-minute candles or shorter). For example, an asset might show a steady upward trend on the 1-hour candle, but on smaller time frames, there could be sharp pullbacks or spikes, which may trigger tight stop-loss orders. This results in premature exits, causing missed profit opportunities.
Since backtesting typically uses 1-hour candles, it can't accurately reflect the price movement on smaller time frames. As a result, relying too heavily on **trailing_stop**  for stop-loss may lead to worse outcomes rather than higher profits.
### Solution 
To avoid this backtesting stop-loss pitfall, it's recommended to use **custom_exit**  (custom exit conditions) instead of trailing_stop. By implementing a custom exit strategy, you can have more flexibility in controlling stop-loss conditions, making it more responsive to short-term market fluctuations.
Here is an example code that triggers an exit based on the difference between the maximum profit and the current profit:


```python
def custom_exit(self, pair: str, trade: Trade, current_time: datetime, current_rate: float,
                current_profit: float, **kwargs) -> Optional[Union[str, bool]]:
    max_profit = trade.calc_profit_ratio(trade.max_rate)

    if not max_profit > 0.1:
        return None

    if (max_profit - current_profit) < 0.02:
        return "custom_trailing_stop"
```

In this example, the exit strategy will only be triggered when the maximum profit exceeds 10%, and the difference between the maximum profit and current profit is less than 2%, thus preventing premature stop-loss when there isn't enough profit to lock in.

### Conclusion 
In summary, using **trailing_stop**  for stop-loss may not perform as expected due to the coarse time frame used in backtesting. To better reflect market dynamics, it's recommended to implement **custom_exit**  for a more flexible stop-loss strategy, avoiding potential pitfalls that arise from relying too heavily on the backtesting mechanism.