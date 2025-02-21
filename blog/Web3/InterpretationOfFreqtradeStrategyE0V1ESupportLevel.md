### Preface

E0V1E is a strategy developed by the author github/ssssi, which has undergone multiple iterations. The strategy is characterized by its expertise in bottom-fishing rebounds, short holding periods, quick profit-taking, and comes with customized stop-loss.

Below is a logical interpretation.

### Code

```python
from datetime import datetime, timedelta
import talib.abstract as ta
import pandas_ta as pta
from freqtrade.persistence import Trade
from freqtrade.strategy.interface import IStrategy
from pandas import DataFrame
from freqtrade.strategy import DecimalParameter, IntParameter
from functools import reduce
import warnings

warnings.simplefilter(action="ignore", category=RuntimeWarning)

# Stores a list of currency pairs above the ma120 and ma240 support levels at the close price on a 5m timeframe
# These pairs will stop-loss exit when breaking the ma120, ma240 support levels
TMP_HOLD = []
TMP_HOLD1 = []


class E0V1E(IStrategy):
    # Default roi is infinite, not using roi for take-profit
    minimal_roi = {
        "0": 1
    }

    # Strategy uses a 5m timeframe
    timeframe = '5m'

    # Will only process open/close signals on new candle start
    process_only_new_candles = True
    
    # Strategy requires at least 240 5m candles to start, which means it will operate after 20 hours
    # Mainly because the ma120 and ma240 support levels need longer time frames to calculate
    # If other 5m strategies have been run before, this can be reduced as there is cached data available
    startup_candle_count = 240

    # Order types, market and limit
    order_types = {
        'entry': 'market', # Market order for entry
        'exit': 'market', # Market order for exit
        'emergency_exit': 'market', # Market order for emergency exit (used when stop-loss creation fails, usually during sharp drops)
        'force_entry': 'market',  # Market order for force entry via tg bot/web control forceentry command
        'force_exit': "market",  # Market order for force exit via tg bot/web control force_exit command
        'stoploss': 'market', # Market stop-loss
        'stoploss_on_exchange': False, # Whether to automatically set stop-loss on the exchange. (By default, the bot's stop-loss line is not visible on the exchange, enabling this will show it)
        'stoploss_on_exchange_interval': 60, # Frequency of exchange sync with bot stop-loss (seconds)
        'stoploss_on_exchange_market_ratio': 0.99
    }

    stoploss = -0.25 # Hard stop-loss, this attribute will be invalid when use_custom_stoploss is enabled
    trailing_stop = False # Trailing stop-loss, it is recommended to turn this off as it can lead to backtesting errors
    trailing_stop_positive = 0.002
    trailing_stop_positive_offset = 0.05
    trailing_only_offset_is_reached = True

    use_custom_stoploss = True # Use custom stop-loss

    is_optimize_32 = True # Enable hyper-optimization parameters

    # Fast rsi parameter
    buy_rsi_fast_32 = IntParameter(20, 70, default=40, space='buy', optimize=is_optimize_32)
    # Slow rsi parameter
    buy_rsi_32 = IntParameter(15, 50, default=42, space='buy', optimize=is_optimize_32)
    # sma parameter
    buy_sma15_32 = DecimalParameter(0.900, 1, default=0.973, decimals=3, space='buy', optimize=is_optimize_32)
    # cti parameter
    buy_cti_32 = DecimalParameter(-1, 1, default=0.69, decimals=2, space='buy', optimize=is_optimize_32)

    # Sell fastk parameter
    sell_fastx = IntParameter(50, 100, default=84, space='sell', optimize=True)

    # cci stop-loss parameters
    cci_opt = False
    sell_loss_cci = IntParameter(low=0, high=600, default=120, space='sell', optimize=cci_opt)
    sell_loss_cci_profit = DecimalParameter(-0.15, 0, default=-0.05, decimals=2, space='sell', optimize=cci_opt)

    @property
    def protections(self):
        return [
            {
                "method": "CooldownPeriod", # Cooldown period after trades
                "stop_duration_candles": 18 # Restart after 18 5m candles
            }
        ]
    
    # Custom stop-loss
    def custom_stoploss(self, pair: str, trade: Trade, current_time: datetime,
                        current_rate: float, current_profit: float, **kwargs) -> float:
        # When the current profit is greater than 5%, stop-profit if profit drops by 0.2%
        if current_profit >= 0.05:
            return -0.002
        
        # If the entry signal is buy_new, stop-profit when current profit is greater than 3% and profit drops by 0.3%
        if str(trade.enter_tag) == "buy_new" and current_profit >= 0.03:
            return -0.003

        return None

    # Technical indicators calculation
    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        # buy_1 indicators
        dataframe['sma_15'] = ta.SMA(dataframe, timeperiod=15) # sma calculation with 15 candle window
        dataframe['cti'] = pta.cti(dataframe["close"], length=20) # cti calculation with 20 candle window
        dataframe['rsi'] = ta.RSI(dataframe, timeperiod=14) # rsi calculation with 14 candle window
        dataframe['rsi_fast'] = ta.RSI(dataframe, timeperiod=4) # fast rsi calculation with 4 candle window
        dataframe['rsi_slow'] = ta.RSI(dataframe, timeperiod=20) # slow rsi calculation with 20 candle window

        # profit sell indicators
        stoch_fast = ta.STOCHF(dataframe, 5, 3, 0, 3, 0) # STOCHF indicator
        dataframe['fastk'] = stoch_fast['fastk'] # The larger the fastk, the easier it is to pull back, similar to rsi, starting to pullback above 80, starting to rebound below 20

        dataframe['cci'] = ta.CCI(dataframe, timeperiod=20)

        # ma support levels
        dataframe['ma120'] = ta.MA(dataframe, timeperiod=120)
        dataframe['ma240'] = ta.MA(dataframe, timeperiod=240)

        return dataframe

    # Entry signals
    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        conditions = []
        dataframe.loc[:, 'enter_tag'] = ''

        # Go long when all the following conditions are met
        # The current slow rsi is less than the slow rsi of the previous candle
        # The current fast rsi value is less than the value of the hyperparameter buy_rsi_fast_32, default is 40
        # The current rsi value is greater than the value of the hyperparameter buy_rsi_32, default is 42
        # The current close price is less than sma_15 multiplied by the coefficient buy_sma15_32, buy_sma15_32 default is 0.973
        # cti < buy_cti_32
        buy_1 = (
                (dataframe['rsi_slow'] < dataframe['rsi_slow'].shift(1)) &
                (dataframe['rsi_fast'] < self.buy_rsi_fast_32.value) &
                (dataframe['rsi'] > self.buy_rsi_32.value) &
                (dataframe['close'] < dataframe['sma_15'] * self.buy_sma15_32.value) &
                (dataframe['cti'] < self.buy_cti_32.value)
        )

        # buy_new is the same as buy_1, just changing the hyperparameter
        buy_new = (
                (dataframe['rsi_slow'] < dataframe['rsi_slow'].shift(1)) &
                (dataframe['rsi_fast'] < 34) &
                (dataframe['rsi'] > 28) &
                (dataframe['close'] < dataframe['sma_15'] * 0.96) &
                (dataframe['cti'] < self.buy_cti_32.value)
        )


        conditions.append(buy_1)
        # Set entry signal name buy_1 when buy_1 is satisfied
        dataframe.loc[buy_1, 'enter_tag'] += 'buy_1'

        conditions.append(buy_new)
        # Set entry signal name buy_new when buy_new is satisfied
        dataframe.loc[buy_new, 'enter_tag'] += 'buy_new'

        # Go long signal when at least one of buy_1 and buy_new is met
        if conditions:
            dataframe.loc[
                reduce(lambda x, y: x | y, conditions),
                'enter_long'] = 1

        return dataframe

    # Custom exit
    def custom_exit(self, pair: str, trade: 'Trade', current_time: 'datetime', current_rate: float,
                    current_profit: float, **kwargs):
        dataframe, _ = self.dp.get_analyzed_dataframe(pair=pair, timeframe=self.timeframe)

        # Take the current last candle
        # Here, to prevent foresight, choose the previous candle
        current_candle = dataframe.iloc[-1].squeeze()
        # Calculate the minimum profit within the candle
        min_profit = trade.calc_profit_ratio(trade.min_rate)
        
        # If the closing price is above ma120 and ma240 support levels, record it in TMP_HOLD
        if current_candle['close'] > current_candle["ma120"] and current_candle['close'] > current_candle["ma240"]:
            if trade.id not in TMP_HOLD:
                TMP_HOLD.append(trade.id)
        
        # If (open price - ma120) / open price > 10%, record in TMP_HOLD1
        if (trade.open_rate - current_candle["ma120"]) / trade.open_rate >= 0.1:
            if trade.id not in TMP_HOLD1:
                TMP_HOLD1.append(trade.id)
        
        # If profit is greater than 0
        if current_profit > 0:
            # Exit if fastk is greater than the hyperparameter sell_fastx
            if current_candle["fastk"] > self.sell_fastx.value:
                return "fastk_profit_sell"
        
        # If minimum profit is less than -10%
        if min_profit <= -0.1:
            # Exit if cci > sell_loss_cci
            if current_profit > self.sell_loss_cci_profit.value:
                if current_candle["cci"] > self.sell_loss_cci.value:
                    return "cci_loss_sell"

        # Exit if closing price falls below ma120
        if trade.id in TMP_HOLD1 and current_candle["close"] < current_candle["ma120"]:
            TMP_HOLD1.remove(trade.id)
            return "ma120_sell_fast"

        # Exit if closing price falls below both ma120 & ma240
        if trade.id in TMP_HOLD and current_candle["close"] < current_candle["ma120"] and current_candle["close"] < \
                current_candle["ma240"]:
            if min_profit <= -0.1:
                TMP_HOLD.remove(trade.id)
                return "ma120_sell"

        return None

    # Exit technical indicators
    # The calculated exit signals are not used here, use the custom stop-loss and custom exit as mentioned above
    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[:, ['exit_long', 'exit_tag']] = (0, 'long_out')
        return dataframe
```

### Improvement Directions

1. This strategy is a contract strategy that can only long (only has enter_long, no enter_short), so consider optimizing with DCA. Refer to the article [How to Properly DCA with Freqtrade](/zh/posts/3516500479/1606919060/)
2. The contract strategy does not apply leverage, thus it cannot harness the advantages of contracts. Leverage can be set (recommended between 1-5x)
3. If you are interested in this strategy, you can study the coefficient of the sma_15 indicator closely, and you will make a great discovery. The default is 0.973, you can try a lower multiple, recommended to adjust between 0.90 and 0.99. (Win rate, returns, and entry count will vary significantly)
4. The cti indicator can be removed, as my tests found it to be of little use
5. The sell_fastx parameter of fastk can also be focused on, as most exit signals are fastk_profit_sell. The recommended sell_fastx setting is 50-70; setting it lower will also increase the win rate.