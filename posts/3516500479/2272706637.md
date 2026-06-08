### Introduction to Freqtrade DCA (Dollar-Cost Averaging) Techniques

In cryptocurrency trading, **Dollar-Cost Averaging (DCA)** is a common fund management strategy aimed at reducing the impact of market volatility by purchasing assets in batches. `freqtrade`, an open-source cryptocurrency trading bot, supports a variety of strategies and fund management techniques, including the **DCA (Dollar-Cost Averaging)** strategy.

The key to improving the success rate lies in the logic of adding positions: how much to add each time and when to add positions. Below, we will discuss this issue using mathematical calculations.

### What is DCA (Dollar-Cost Averaging)?

DCA is a strategy of purchasing assets in batches. Investors divide their funds into several batches and purchase at fixed time intervals or under certain market conditions. This method can help avoid the risk of one-time investment during high market volatility. For example, when the market price is low, buying in batches can help average the cost, thereby reducing the volatility of the overall investment.

### DCA Strategy in `freqtrade`

In `freqtrade`, the DCA strategy is implemented through the configuration of **position adjustment**. The basic idea is that when the market price falls, the bot will automatically increase the position to average the cost and reduce the loss of the position. This strategy is particularly suitable for highly volatile markets.

#### 1. Enabling Position Adjustments

Enabling position adjustments in `freqtrade` is straightforward, relying mainly on the following two parameters:

- **`position_adjustment_enable`**: Controls whether to enable position adjustments. If set to `True`, `freqtrade` will add more funds to the existing position.
  
```json
"position_adjustment_enable": true
```
 
- **`max_entry_position_adjustment`**: Controls the maximum amount by which the position can be increased each time. If set to `10`, then the position can be increased by up to 10 units of the asset each time.

```json
"max_entry_position_adjustment": 10
```

#### 2. Setting Fund Allocation Ratio

To ensure that each position increase does not exceed the available funds in the account, `freqtrade` provides the following parameters to set the fund allocation ratio:
- **`tradable_balance_ratio`**: Controls the proportion of funds available for each position increase. If set to `0.99`, it means that up to 99% of the account balance can be used for the increase each time.

```json
"tradable_balance_ratio": 0.99
```
 
- **`stake_amount`**: Controls the amount of funds used in each trade. If set to `"unlimited"`, it means there is no maximum limit per trade, and the system will dynamically calculate based on the balance and fund ratio.

```json
"stake_amount": "unlimited"
```

#### 3. Incremental Increase of Position Amount

In a DCA strategy, the amount of funds for each position increase is often incremental. You can set the amount of funds for each position increase to be based on the last position increase, thereby distributing the cost through gradual position increases.
For instance, suppose the initial amount for position increase is `1.6`, and each subsequent increase is `1.5` times the previous amount. Specifically:
- First position increase: $$1.6$$
 
- Second position increase: $$1.6 + 1.6 \times 1.5 = 4$$
 
- Third position increase: $$1.6 + 1.6 \times 1.5 + 1.6 \times 1.5 \times 1.5 = 10$$

The total amount for the n-th position increase can be calculated using the following formula:
$$
\text{Amount of the nth position increase} = 1.6 \times \left( 1 + 1.5 + 1.5^2 + \cdots + 1.5^{n-1} \right)
$$

This formula is a summation of a geometric series, so it can be simplified:
$$
S_n = 1.6 \times \frac{1.5^n - 1}{0.5}
$$

#### 4. Example: Total Amount After 10th Position Increase

Suppose we use the above formula to calculate the total amount after the 10th position increase. We set the initial position increase amount as `1.6`, each subsequent increase being `1.5` times the previous amount:

$$
S_{10} = 1.6 \times \frac{1.5^{10} - 1}{0.5}
$$

By calculating, we find that the total amount after the 10th position increase is **181.33**.

Therefore, you can use an initial fund amount of 1.6U and a total fund amount of 181.33U, with each position increase being 1.5 times the last, allowing for 10 position increases. This can significantly improve the success rate.

The initial fund can be calculated as total funds / leverage multiple / split factor, for example:

```python
max_open_trades = 1
max_entry_position_adjustment = 10
max_dca_multiplier = 10
leverage_num = 5
last_stake_amount = None

def custom_stake_amount(self, pair: str, current_time: datetime, current_rate: float,
                        proposed_stake: float, min_stake: Optional[float], max_stake: float,
                        leverage: float, entry_tag: Optional[str], side: str,
                        **kwargs) -> float:
    proposed_stake = proposed_stake / self.leverage_num / self.max_dca_multiplier
    return proposed_stake

def adjust_trade_position(self, trade: Trade, current_time: datetime, 
                          current_rate: float, current_profit: float, 
                          min_stake: Optional[float], max_stake: float, 
                          current_entry_rate: float, current_exit_rate: float, 
                          current_entry_profit: float, current_exit_profit: float, 
                          **kwargs) -> Optional[float]:
    filled_entries = trade.select_filled_orders(trade.entry_side) 
    stake_amount = filled_entries[0].cost 
    
    last_stake_amount = self.last_stake_amount 
    if last_stake_amount is None:
      last_stake_amount = stake_amount

    next_stake_amount = last_stake_amount * 1.6
    self.last_stake_amount  = next_stake_amount

    return next_stake_amount
```

### Advantages of DCA Strategy

1. **Risk Reduction**: By purchasing in batches, the DCA strategy can effectively diversify risk and avoid one-time investments at market highs.
 
2. **Adapting to Market Volatility**: During large market price fluctuations, DCA can distribute the cost by increasing the position, reducing the risk of passive holding.
 
3. **Better Fund Management**: Through fund management configurations in `freqtrade`, you can flexibly control the amount of funds for each trade, ensuring efficient use of funds.

### Summary
`freqtrade` provides robust configuration options to implement the DCA strategy, enabling traders to reduce investment risk through position increase techniques in volatile markets. By enabling the **position adjustment** function and setting reasonable fund allocation ratios, you can achieve flexible fund management, ensuring cost distribution during market declines and improving investment returns. If you wish to practice the DCA strategy in `freqtrade`, simply adjust the relevant parameters and combine it with suitable trading strategies to maximize the use of this technique and enhance your trading performance.