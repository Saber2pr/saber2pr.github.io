**Freqtrade Strategy Optimization: Achieving Balanced Long and Short Positions** 

In **freqtrade**  strategies, simultaneously managing long and short positions can perform exceptionally well in **ranging markets** . However, when the market experiences a **unidirectional fake breakout**  (e.g., inducing long positions), the strategy’s performance can suffer significantly.

**Problem Analysis** 

For example, if `max_open_trades=10` and the strategy detects an uptrend, it might open **8 long positions**  and **2 short positions** . If the market suddenly reverses downward, the **8 long positions will stop out** , leaving only **2 short positions profitable** , resulting in overall losses.

**Solution** 

To prevent mass stop-losses caused by sudden market reversals, we can implement a **custom entry rule**  in the `confirm_trade_entry` function to limit the number of long and short positions: 

- A maximum of **5 long positions** .
 
- A maximum of **5 short positions** .

This **5/5 balance**  in position management ensures stability and reduces risk during sudden market shifts.

**Code Implementation** 

Below is the implementation of the custom entry rule in a freqtrade strategy:


```python
def confirm_trade_entry(
    self,
    pair: str,
    order_type: str,
    amount: float,
    rate: float,
    time_in_force: str,
    current_time: datetime,
    entry_tag: Optional[str],
    side: str,
    **kwargs
) -> bool:
    open_trades = Trade.get_open_trades()

    num_shorts, num_longs = 0, 0
    for trade in open_trades:
        if "short" in trade.enter_tag:
            num_shorts += 1
        elif "long" in trade.enter_tag:
            num_longs += 1

    # Limit to a maximum of 5 long positions
    if side == "long" and num_longs >= 5:
        return False

    # Limit to a maximum of 5 short positions
    if side == "short" and num_shorts >= 5:
        return False

    return True
```
**Effect and Benefits**  
1. **Balanced Positions** : Ensures that the number of long and short positions remains balanced, reducing the impact of a sudden unidirectional market.
 
2. **Risk Management** : By capping each direction to a maximum of 5 positions, the strategy minimizes potential losses in extreme market conditions.
 
3. **Stable Performance** : Enhances the strategy's performance in both ranging and trending markets, reducing losses from fake breakouts.

**Conclusion** 

By implementing custom entry rules to cap long and short positions at a maximum of 5 each, we can ensure **balanced risk management**  and **position stability** . This simple yet effective optimization allows **freqtrade**  strategies to perform more consistently and adapt to complex market conditions with greater resilience.
