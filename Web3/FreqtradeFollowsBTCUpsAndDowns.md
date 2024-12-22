In cryptocurrency trading, many altcoins are significantly affected by Bitcoin's price movements. Therefore, integrating Bitcoin (BTC) indicators into your strategy can provide a better understanding of market trends, helping you make more accurate decisions. One way to do this is by using Bitcoin's price movement as a leading indicator for your altcoin trades.
In this guide, we'll explore how to use Bitcoin's price data and the Exponential Moving Average (EMA) to improve your strategy's entry and exit points. We will use Freqtrade's `informative` feature to pull Bitcoin’s indicators and use them in the strategy.
### 1. Why Use BTC Indicators? 

Altcoins often follow Bitcoin's price movements, meaning that when Bitcoin is in an uptrend, many altcoins also tend to rise. Therefore, by incorporating BTC's price action into your strategy, you can better time your trades and potentially increase the profitability of your strategy.

For example, if Bitcoin is in an uptrend, it could signal that altcoins may follow, so it might be a good time to go long. Conversely, if Bitcoin is in a downtrend, it could signal caution, and you might avoid going long or even consider shorting altcoins.

### 2. How to Implement BTC Indicators in Freqtrade 
Step 1: Add the `informative` libraryFirst, you need to import the `informative` function from Freqtrade. This function allows you to pull data from different pairs (such as BTC/USDT) and use them for further analysis.

```python
from freqtrade.strategy import informative
```

#### Step 2: Define the Informative Function 
You need to define functions that pull the relevant Bitcoin data for different timeframes. We will use the 1-minute (`1M`) and 1-hour (`1h`) timeframes for BTC/USDT to track Bitcoin's price action.
Here’s how you define these functions:


```python
# Add this code above the populate_indicators function
@informative('1M')
def populate_indicators_1M(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
    # This will provide 1-minute data for the current trading pair
    return dataframe

@informative('1M', 'BTC/USDT:USDT', fmt='{column}_{base}_{timeframe}')
def populate_indicators_btc_1M(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
    # This will provide 1-minute data for BTC/USDT
    return dataframe

@informative('1h', 'BTC/USDT:USDT', fmt='{column}_{base}_{timeframe}')
def populate_indicators_btc_1h(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
    # This will provide 1-hour data for BTC/USDT
    return dataframe
```
 
- **`@informative('1M')`** : Specifies the timeframe for the trading pair.
 
- **`@informative('1M', 'BTC/USDT:USDT')`** : Pulls data for the BTC/USDT pair for the 1-minute timeframe.

#### Step 3: Add Conditions for Long and Short Entries Based on BTC Indicators 

Now, we need to define the conditions that combine the BTC indicators with your trading pair’s conditions. Specifically, we want to check if the current price of the altcoin is above the 1-minute close price and if Bitcoin’s price is also trending upwards (comparing the 1-hour and 1-minute closes).
**For long entries** , you might want to enter the market when:
- The current altcoin price is higher than the previous 1-minute close.

- Bitcoin’s 1-hour close is higher than its 1-minute close (indicating an uptrend).
**For short entries** , you might want to enter the market when:
- The current altcoin price is lower than the previous 1-minute close.

- Bitcoin’s 1-hour close is lower than its 1-minute close (indicating a downtrend).

Here’s how you can implement these conditions in your strategy:


```python
# Add these conditions to your long entry conditions:
(dataframe['close'] > dataframe['close_1M']) &  # Altcoin's current close is above 1-minute close
(dataframe['close_btc_1h'] > dataframe['close_btc_1M'])  # BTC 1-hour close is above 1-minute close

# Add these conditions to your short entry conditions:
(dataframe['close'] < dataframe['close_1M']) &  # Altcoin's current close is below 1-minute close
(dataframe['close_btc_1h'] < dataframe['close_btc_1M'])  # BTC 1-hour close is below 1-minute close
```

### 3. Explanation of Conditions 
 
- **`dataframe['close'] > dataframe['close_1M']`** : This condition checks if the current price of the altcoin is higher than the 1-minute close, indicating an upward price movement.
 
- **`dataframe['close_btc_1h'] > dataframe['close_btc_1M']`** : This condition checks if Bitcoin's price is in an uptrend. It compares the 1-hour close with the 1-minute close of Bitcoin, and if the 1-hour close is higher, it suggests that Bitcoin is in an uptrend.
For **short entries** , we reverse the conditions: 
- **`dataframe['close'] < dataframe['close_1M']`** : The altcoin price is lower than the 1-minute close, indicating a downtrend.
 
- **`dataframe['close_btc_1h'] < dataframe['close_btc_1M']`** : Bitcoin is in a downtrend, with the 1-hour close lower than the 1-minute close.

### 4. Final Strategy Example 

Here’s a simplified example of how you could integrate these BTC indicators into your strategy:


```python
from freqtrade.strategy import IStrategy, informative
import talib.abstract as ta

class MyStrategy(IStrategy):

    # Define the timeframe for the trading pair
    timeframe = '5m'

    # Define the indicators for your strategy
    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe['ema_20'] = ta.EMA(dataframe, timeperiod=20)
        return dataframe

    # Define long entry condition
    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
            (
                (dataframe['close'] > dataframe['close_1M']) &  # Altcoin above 1-minute close
                (dataframe['close_btc_1h'] > dataframe['close_btc_1M']) &  # BTC uptrend
                (dataframe['ema_20'] > dataframe['close'])  # EMA confirmation
            ),
            'enter_long'] = 1
        return dataframe

    # Define short entry condition
    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
            (
                (dataframe['close'] < dataframe['close_1M']) &  # Altcoin below 1-minute close
                (dataframe['close_btc_1h'] < dataframe['close_btc_1M'])  # BTC downtrend
            ),
            'exit_long'] = 1
        return dataframe
```

### 5. Conclusion 

Integrating Bitcoin’s price indicators into your Freqtrade strategy allows you to better understand the broader market trend, as altcoins often follow Bitcoin’s movements. By using BTC indicators such as the 1-hour and 1-minute closes, you can time your entries and exits more accurately, potentially improving your strategy’s performance.
