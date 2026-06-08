In the **Freqtrade**  strategy framework, position adjustment (`adjust_trade_position`) is one of the key factors in improving strategy profitability and risk management. Proper position adjustment can increase the position size to amplify profits when the market is favorable, and decrease the position size to control risk when the market is unfavorable. However, overly frequent or untimely position adjustments, especially at the beginning of a candlestick cycle, can lead to unnecessary losses.Therefore, optimizing the timing of position adjustments has become a crucial point in strategy design. This article will focus on how to use `fresh_candle` to optimize position adjustments and explain the difference between it and `process_only_new_candles`, helping traders better understand their roles and optimization effects in the strategy.

### 1. Introduction to `adjust_trade_position`

`adjust_trade_position` is a function in the Freqtrade framework used to dynamically adjust positions. The strategy uses this function to decide whether to increase or decrease the position. The basic logic of position adjustment includes: 
- **Increase Position** : When the market trend is favorable, increase the position to amplify profits.
 
- **Decrease Position** : When the market trend is unfavorable, decrease the position to reduce risk.

However, at the beginning of a candlestick cycle, market volatility is typically high, and frequent position adjustments may lead to misjudgments. Therefore, avoiding position adjustments early in the candlestick cycle is an important aspect of optimizing the strategy.

### 2. `fresh_candle`: Avoid Early Position Adjustments at the Start of the Candlestick Cycle

`fresh_candle` is a custom mechanism designed to control whether a position adjustment should be executed based on whether the trade has entered a new candlestick cycle. The basic idea is to calculate the duration of the current trade, and if the duration is shorter than a preset minimum adjustment time (e.g., 5 minutes), the current trade is considered to be in the early stage of the candlestick cycle, and the position adjustment is skipped.Implementation of the `fresh_candle` method: `fresh_candle` determines if a new candlestick cycle has started by calculating the difference between the current time and the trade's opening time. If the trade duration is less than the preset `adjustment_time_pending_minutes` (e.g., 5 minutes), the position adjustment is skipped to avoid adjusting the position at the early stage of the candlestick cycle.
Here’s a simple code example:


```python
class MyStrategy(IStrategy):

    adjustment_time_pending_minutes = 5  # Set the adjustment time to 5 minutes

    def is_fresh_candle(self, trade, current_time):
        # Calculate the duration of the trade
        trade_duration = (current_time - trade.open_date_utc).seconds / 60
        return trade_duration < self.adjustment_time_pending_minutes  # New candle if under 5 minutes

    def adjust_trade_position(self, trade, current_time):
        # Check if it's a fresh candle, and if so, skip position adjustment
        if self.is_fresh_candle(trade, current_time):
            return None  # Skip position adjustment if it's a new candlestick

        # If it's not a new candlestick, proceed with position adjustment logic
        current_profit = self.get_profit(trade)
        if current_profit > 0.05:
            self.buy(...)  # Increase position
        elif current_profit < -0.05:
            self.sell(...)  # Decrease position
```
The role of `fresh_candle`: 
- **Avoid Early Position Adjustments** : At the start of a candlestick cycle (e.g., a few minutes after the open), market volatility tends to be high. Adjusting the position too early may lead to incorrect decisions. `fresh_candle` ensures that position adjustments occur only after the candlestick cycle has had enough time to evolve.
 
- **Improve Strategy Stability** : Avoiding frequent position adjustments during periods of high market volatility can improve the stability of the strategy and reduce the risks associated with overtrading.
 
- **Optimize Execution Timing** : By using `fresh_candle`, the strategy effectively controls when to skip position adjustments during the initial phase of the candlestick cycle, giving more time for the market trend to develop before making any changes.

### 3. `process_only_new_candles`: Controlling the Handling of Candlestick Data

`process_only_new_candles` is a built-in parameter in the Freqtrade framework that determines whether the strategy should only rely on the most recent candlestick data when processing candlesticks. This parameter differs from `fresh_candle`, but both relate to controlling the strategy’s behavior during a candlestick cycle. 
- **Functionality** : `process_only_new_candles` controls whether the strategy should only process the most recent candlestick data when each new candlestick arrives. When set to `True`, the strategy will only process the latest candlestick data, avoiding reliance on prior candlestick data for calculations. This helps simplify the strategy and avoid processing unnecessary historical data.
 
- **Applicable Scenarios** : It is suitable for strategies that do not rely on historical data, particularly for short-term or high-frequency trading strategies that require more efficient calculations.

#### Difference between `process_only_new_candles` and `fresh_candle`

| Feature | process_only_new_candles | fresh_candle | 
| --- | --- | --- | 
| Description | Controls whether the strategy only processes the latest candlestick data during each candlestick cycle, avoiding repeated calculations. | Determines if the trade has entered a new candlestick cycle (i.e., whether the minimum adjustment time has been exceeded), and controls whether position adjustments should occur. | 
| Granularity | Affects the populate_indicators method, deciding whether to calculate technical indicators based solely on the most recent candlestick data. | Affects the adjust_trade_position method, controlling whether position adjustments should be made at the start of a candlestick cycle. | 
| Impact on Strategy Execution | Yes, process_only_new_candles affects the entire strategy's data processing, ensuring that the strategy executes based only on the latest candlestick data. | Affects the timing of position adjustments but does not directly impact the overall execution of the strategy. | 
| Usage Scenario | Used in high-frequency or short-term trading strategies that rely only on the latest candlestick data and do not need to consider historical data. | Used to avoid frequent position adjustments at the start of a candlestick cycle, ensuring position adjustments only occur after sufficient time has passed in the cycle. | 
| Advantages | Improves strategy efficiency by avoiding redundant calculations and unnecessary data processing. | Prevents premature position adjustments, reducing losses due to misjudgments caused by high market volatility early in the cycle. | 

### 4. Summary: How to Choose Between `fresh_candle` and `process_only_new_candles` 

- **`fresh_candle`** : Primarily used to control the timing of position adjustments. It determines whether to skip position adjustments based on whether the trade is still in the early stage of a candlestick cycle (i.e., the duration is shorter than the minimum adjustment time). `fresh_candle` is useful for avoiding frequent position adjustments at the start of a candlestick cycle, reducing the risk of misjudgments and overtrading.
 
- **`process_only_new_candles`** : Impacts how the strategy processes candlestick data, ensuring that only the latest candlestick data is used for calculating technical indicators. It is suitable for high-frequency or short-term strategies that require efficient computation and do not rely on historical data.

The main difference between the two is:
 
- **`process_only_new_candles`**  affects the strategy's overall candlestick data handling, ensuring only the current candlestick is used for calculations.
 
- **`fresh_candle`**  focuses on the timing of position adjustments, ensuring that adjustments only occur after the candlestick cycle has had enough time to evolve.

In practice, you can configure these two parameters flexibly depending on the needs of your strategy to enhance both stability and efficiency, ensuring position adjustments happen at the right time and minimizing the risk of making wrong decisions during market fluctuations.