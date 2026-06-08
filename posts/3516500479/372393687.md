> describes how to use freqtrade, an open source trading software written in Python. We will use freqtrade to create, optimize, and run cryptocurrency trading policies using pandas.
### Part 1 (this article)
1. Basic functions of Freqtrade and encryption market terminology-we will learn how freqtrade works, how to use command-line tools to download historical market data, and how to create new profiles and policies.
How to define policies using Python and pandas-We will define a simple moving average strategy to trade between ETH and BTC in an attempt to maximize the number of bitcoins we hold.
Retroactively test the strategy based on historical data to determine the performance of our strategy-we will learn how to generate a complete report and how to visualize the graph of the robot simulation transaction.
### Basic knowledge of Freqtrade
Freqtrade is a cryptocurrency algorithm trading software written in Python. It allows you to:
1. Make a strategy: use Python and pandas easily. We will create a simple policy in this article, and you can view freqtrade's sample policy repository.
[Sample policy repository for freqtrade](https://github.com/freqtrade/freqtrade-strategies/)
two。 Download market data: quickly download historical price data for the cryptocurrency of your choice.
3. Backtest: Test your strategy against historical data. Backtesting is a key step in seeing if your strategy has a chance of making money in the real world. It does not guarantee actual performance because market conditions are more complex than the downloaded data.
4. Optimization: use hyperopt to find the parameters that best suit your strategy.
5. Select currency pairs to trade: your selection can be static or dynamic based on a simple filter, such as whether the transaction volume is greater than a certain amount.
6. Trial run: use a simulation wallet to test the strategy based on real-time data.
7. Real-time operation: deploy the strategy using real funds through the API of the cryptocurrency exchange. This is the last step after you know what you are doing and are willing to lose all your money.
8. Use Telegram Robots: control and monitor your policies through Telegram.
9. Analyze and visualize transaction history: utilize transaction data saved on file or through SQL databases.
### Install freqtrade
OK, let's start with the installation. Docker-the easiest way to get started on all platforms is Docker, which is the fastest way to get started on all platforms and is recommended by Windows. You need to install Docker and docker-compose first, and then make sure that Docker is running by starting Docker Desktop. You can now set up freqtrade by issuing the following command in the desired directory:
```sh
mkdir ft_userdata
cd ft_userdata/

# Download the docker-compose file from the repository
curl https://raw.githubusercontent.com/freqtrade/freqtrade/stable/docker-compose.yml -o docker-compose.yml

# Pull the freqtrade image
docker-compose pull

# Create user directory structure
docker-compose run --rm freqtrade create-userdir --userdir user_data
```
You should now have the following directory structure:
```sh
ft_userdata
└───user_data
    ├───backtest_results
    ├───data
    ├───hyperopts
    ├───hyperopt_results
    ├───logs
    ├───notebooks
    ├───plot
    └───strategies
```
How do I install freqtrade without Docker?
Direct installation for direct installation on your system (Linux, MacOS, Windows) that do not require Docker, I recommend that you review the documentation directly.
As far as I'm concerned, with Ubuntu 20.04, it's simple.
```sh
git clone https://github.com/freqtrade/freqtrade.git 
cd freqtrade 
git checkout stable 
./setup.sh -i
```
This step takes some time to complete and requires input to generate the initial configuration. Don't worry too much about this, because we can change it later, but as a rule of thumb, say "yes" to everything.
Note: the installation creates a virtualenv (.env), and we should activate it before doing anything with freqtrade.
```sh
source ./.env/bin/activate
```
We can use the freqtrade command. To verify that the installation was successful, run
```sh
freqtrade --help
```
Important: if you install freqtrade directly, you do not need to
```sh
docker-compose run --rm
```
Prefix the command as in the rest of this article. To verify that freqtrade is properly installed and available for use, issue the help command:
```sh
docker-compose run --rm freqtrade --help
```
You should see the following output
```sh
usage: freqtrade [-h] [-V] 
        {trade,create-userdir,new-config,new-hyperopt,new-strategy,download-data,convert-data,convert-trade-data,list-data,backtesting,edge,hyperopt,hyperopt-list,hyperopt-show,list-exchanges,list-hyperopts,list-markets,list-pairs,list-strategies,list-timeframes,show-trades,test-pairlist,instal l-ui,plot-dataframe,plot-profit} ...
```
The output of the help command shows all possible freqtrade commands.
In this series, we will explore the most important commands and how to use them.
The first is the backtracking test.
### Backtest: how freqtrade tests trading strategy
In this article, we want to create a simple strategy and test it back based on historical data. The backtest simulates the transactions expected by the strategy based on the historical data test strategy. Although this does not guarantee performance in the real world, it is a good indication of the winning / losing strategy.
Freqtrade uses the following steps to test back the policy:
1. Load the historical data of the currency pairs (ETH/BTC, ADA/BTC, XRP/BTC, and so on) in the provided configuration file and call the bot_loop_start () function of the policy once.
two。 This starts a new loop in a real-time run, but only once in a backtracking test.
3. Calculate the technical indicator of the policy populate_indicators () by calling each pair of methods.
4. Calculate the buy / sell signal populate_sell_trend () by calling the populate_buy_trend () and method of each pair
5. If implemented in the policy, confirm the buy / sell transaction confirm_trade_exit () by calling confirm_trade_entry () and the method
6. Cycle through each time period (5m, 1h, 1D, etc.) and simulate entry and exit points
7. Finally, a back test report is generated to summarize all transactions and related profits and losses during the specified period.
8. Populate_indicators () We will define the methods mentioned above in the following paragraphs.
Download data for retrospective testing, we need historical price data from the exchange. Let's first download some data from Binance using the following command:
```sh
docker-compose run --rm freqtrade download-data -p ETH/BTC -t 1d --timerange 20200101-20201231 --exchange binance
```
The arguments to this command tell freqtrade the following:
-p ETH/BTC- downloads data of ETH-BTC currency pairs
-t 1d-download data with a time range of 1 day
-- timerange 20200101-20201231 downloads data from January 1, 2020 to December 31, 2020.
-- exchange binance- downloads data from the currency Exchange.
Here, you can use any exchange supported by freqtrade.
This command generates files:
```sh
ft_userdata
└───user_data
    └───data
        └───binance
               ETH_BTC-1d.json
```

It contains several open, low and closed volume (OHLCV) data artifacts, as follows:
```sh
时间	打开	高的	低的	关闭	体积
1622851200000	0.073013	0.075	0.0726	0.073986	143662.752
1622937600000	0.073989	0.075961	0.073626	0.075737	120623.423
```
The meanings of the columns are as follows:
time: Unix timestamp in milliseconds
Opening price: the opening price at the beginning of a candlestick.
The highest price reached during a candlestick.
Lowest price: the lowest price reached during the candlestick.
Closing price: the closing price at the end of a candlestick
Transaction volume: the number of assets purchased or sold, shown in the base currency (in our case, ETH). BTC is the quoted currency.
### Freqtrade configuration
We have the data needed to test back the policy, but we need to create a configuration file, which will allow us to easily control multiple parameters of the policy. To create a new configuration, we run the following command:
```sh
docker-compose run --rm freqtrade new-config --config user_data/learndatasci-config.json
```
Before continuing, we need to open the configuration file and set pair_whitelist = ["ETH/BTC"], which will create the currency pair we are interested in.
And then we're ready to go. You don't need to worry about anything else for now, but you should make sure you understand what the other configuration options mean, so be sure to visit the documentation.
### Implement a simple custom policy-moving average crossover
Here, we will define a simple moving average policy, similar to the one in the "Python for Finance" series. If you haven't read it, be sure to check out. You can find more details in Investopedia.
Know the strategy. I'll tell you a little secret. The deal is actually very simple, you only need to do two things:
Buy cheaply
Sell at a high price
Is it that easy? Any problems? The tricky part is finding actual lows and highs.
The ideas behind the moving average strategy are as follows:
You have two lines.
-slow moving average (SMA): the long-term average of past values, representing the overall trend.
-Fast moving average (FMA): a short-term average of past values, representing current trends.
For our strategy, we will use the following indicators: buy when the FMA crosses the top of the SMA, indicating an upward trend. Selling when the FMA crosses below the SMA indicates a downward trend. This is called the moving average crossover strategy.
Defining a custom policy for freqtrade allows us to use pandas to transform the moving average crossover policy in freqtrade.
First, we need to create a new strategy file to preserve the logic behind buy/sell signals.
```sh
docker-compose run --rm freqtrade new-strategy -s SimpleMA_strategy --template minus
```
We can now find the newly created file in the policy folder:
```sh
ft_userdata
└───user_data
    ...
    └───strategies
            SimpleMA_strategy.py
```
SimpleMA_strategy.py contains an automatically generated class, SimpleMA_strategy, and several functions that we need to update.
To define our simple policy, we need to update the following three functions:
Populate_indicators ()
Populate_buy_trend ()
Populate_sell_trend ()
Let's discuss these contents one by one.
1.populate_indicators ()
Here, we calculate the indicators that our strategy needs to generate buy / sell signals. Fast moving average (blue line) and slow moving average (yellow line) indicators drawn for ETH/BTC according to our strategy, we calculate the fast moving average fast_MA (using the last 5 candlesticks) and the slow moving average slow_ma (using the first 50 candlesticks):
```python
class SimpleMA_strategy(IStrategy):
    
    ...
    
    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        fast_period = 5
        slow_period = 50
        dataframe['fast_MA'] = ta.SMA(dataframe, timeperiod=fast_period)
        dataframe['slow_MA'] = ta.SMA(dataframe, timeperiod=slow_period)
        
        return dataframe
```
Notice that we pass the data frame as a parameter, manipulate it, and return it. All of our functions process frames of data in this way. If you are interested in seeing metrics other than simple moving averages, check out the ta-lib documentation. Note Function definitions in this class use type hints to define parameter and return value types.
2.populate_buy_trend ()
This function populates our buy signal, which is triggered when the fast_MA cross line is higher than that in our strategy slow_MA.
We can do this by updating populate_buy_trend () to include the following logic:
```python
class SimpleMA_strategy(IStrategy):
    
    ...
    
    def populate_indicators(...):
        ...
    
    def populate_buy_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
          (
            qtpylib.crossed_above(dataframe['fast_MA'], dataframe['slow_MA'])
          ),
          'buy'] = 1
        
        return dataframe
```
With qtpylib, we can easily find the intersection. In essence, when our purchase condition () is triggered, the above code buy populates the column crossed_above with 1.
3.populate_sell_trend ()
In a manner similar to the previous function, this function populates our sell signal. According to our strategy, this is slow_MA when the fast_MA crossover line is below.
```python
class SimpleMA_strategy(IStrategy):
    
    ...
    
    def populate_indicators(...):
        ...
    
    def populate_buy_trend(...):
        ...
        
    def populate_sell_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
          (
            qtpylib.crossed_below(dataframe['fast_MA'], dataframe['slow_MA'])
          ),
          'sell'
        ] = 1
        
        return dataframe
```
The crossed_below we use now is-- vice versa-- when our sell condition is triggered, it populates the column with 1crossed_above.
3. Populate_sell_trend ()
By default, the generated freqtrade policy file contains more options, such as ROI (return on investment) and stop loss, which will be discussed in the second part of this series. We will now disable them:
```python
class SimpleMA_strategy(IStrategy):
    
    ...
    
    # the following statement disables selling due to ROI
    minimal_roi = {
        "0": 100
    }
    
    # the following statement disables selling due to stop-loss
    stoploss = -1.0
    
    def populate_indicators(...):
        ...
    
    def populate_buy_trend(...):
        ...
        
    def populate_sell_trend(...):
        ...
```
Now that we have filled in the strategy, we can test its performance on past data. After the backtest strategy has defined our simple strategy, we now want to evaluate it using the historical data of the retest, which allows us to trade in the past and see how they perform.
Backtesting is not a perfect representation of how well our strategy performs because other factors affect real-time market returns, such as slippage. To perform backtesting using freqtrade, we can run the following command using the class and function we just created:
```sh
docker-compose run --rm freqtrade backtesting 
    --strategy SimpleMA_strategy -i 1d -p ETH/BTC 
    --timerange 20200101-20201231 
    --starting-balance 1
    -c ./user_data/learndatasci-config.json
```
The parameters in the above command are as follows:
-p ETH/BTC- trades ETH/BTC currency pairs and changes our BTC to ETH
-- timerange 20200101-20201231-2020, from the first day 01max 01max 2020 to the last day 121max 2020.
-c. / user_data/config-learndatasci.json We are using the configuration defined earlier in this article.
-- starting-balance 1 Let's start with the balance of 1 BTC.
```sh
Result for strategy SimpleMA_strategy
========================================================== BACKTESTING REPORT ==========================================================
|    Pair |   Buys |   Avg Profit % |   Cum Profit % |   Tot Profit BTC |   Tot Profit % |      Avg Duration |   Win  Draw  Loss  Win% |
|---------+--------+----------------+----------------+------------------+----------------+-------------------+-------------------------|
| ETH/BTC |      6 |           8.47 |          50.81 |       0.05086506 |           5.09 | 34 days, 12:00:00 |     3     0     3  50.0 |
|   TOTAL |      6 |           8.47 |          50.81 |       0.05086506 |           5.09 | 34 days, 12:00:00 |     3     0     3  50.0 |
==================================================== SELL REASON STATS =====================================================
|   Sell Reason |   Sells |   Win  Draws  Loss  Win% |   Avg Profit % |   Cum Profit % |   Tot Profit BTC |   Tot Profit % |
|---------------+---------+--------------------------+----------------+----------------+------------------+----------------|
|   sell_signal |       6 |      3     0     3  50.0 |           8.47 |          50.81 |        0.0508651 |          50.81 |
===================================================== LEFT OPEN TRADES REPORT ======================================================
|   Pair |   Buys |   Avg Profit % |   Cum Profit % |   Tot Profit BTC |   Tot Profit % |   Avg Duration |   Win  Draw  Loss  Win% |
|--------+--------+----------------+----------------+------------------+----------------+----------------+-------------------------|
|  TOTAL |      0 |           0.00 |           0.00 |       0.00000000 |           0.00 |           0:00 |     0     0     0     0 |
=============== SUMMARY METRICS ===============
| Metric                | Value               |
|-----------------------+---------------------|
| Backtesting from      | 2020-01-01 00:00:00 |
| Backtesting to        | 2020-12-31 00:00:00 |
| Max open trades       | 1                   |
|                       |                     |
| Total trades          | 6                   |
| Starting balance      | 1.00000000 BTC      |
| Final balance         | 1.05086506 BTC      |
| Absolute profit       | 0.05086506 BTC      |
| Total profit %        | 5.09%               |
| Trades per day        | 0.02                |
| Avg. stake amount     | 0.10000000 BTC      |
| Total trade volume    | 0.60000000 BTC      |
|                       |                     |
| Best Pair             | ETH/BTC 50.81%      |
| Worst Pair            | ETH/BTC 50.81%      |
| Best trade            | ETH/BTC 36.59%      |
| Worst trade           | ETH/BTC -10.57%     |
| Best day              | 0.03662727 BTC      |
| Worst day             | -0.01058107 BTC     |
| Days win/draw/lose    | 3 / 277 / 3         |
| Avg. Duration Winners | 51 days, 16:00:00   |
| Avg. Duration Loser   | 17 days, 8:00:00    |
| Zero Duration Trades  | 0.00% (0)           |
| Rejected Buy signals  | 0                   |
|                       |                     |
| Min balance           | 1.02441263 BTC      |
| Max balance           | 1.06732320 BTC      |
| Drawdown              | 16.44%              |
| Drawdown              | 0.01645814 BTC      |
| Drawdown high         | 0.06732320 BTC      |
| Drawdown low          | 0.05086506 BTC      |
| Drawdown Start        | 2020-09-10 00:00:00 |
| Drawdown End          | 2020-12-19 00:00:00 |
| Market change         | 24.93%              |
===============================================
```
We get a complete report that contains the results of all transactions over the specified period.
Freqtrade divides the report into four parts:
1. The backtest report this section shows the performance report for each currency pair, in our case, only ETH/BTC. The average profit% column shows the average profit of all transactions, while the cumulative profit% column summarizes all profits / losses. The total profit% column shows the total profit% relative to the initial balance. ~ Frequency trade documents
two。 Selling reason statistics the report shows us the performance of the selling reason. According to our strategy, we only use sell signals, so we only have 1 line. Generally speaking, we can also sell for other reasons, such as acceptable return on investment (ROI) and stop loss. We will see this in the next article in this series.
3. This section of the Open Trades Report shows all trades open at the end of the backtest. In our example, we don't have any, and generally it's not important because it represents the end state of backtesting.
4. Summary of indicators personally, this is the area I usually focus on first. The parts that need to be pointed out most are as follows: daily transactions-the average number of daily closing trades. I'm usually looking for a strategy of doing about ten trades a day. Total profit%-profit as a percentage of the opening balance. Drawdown-maximum continuous loss amount market change-the degree of market growth / contraction over a specified period of time. When trading multiple currency pairs, this indicator is the average of the market changes that have taken place in all currency pairs from the beginning to the end of a specified period. In our case, the ETH/BTC market grew by 24.93% in 2020. It is important to test the strategy under different market conditions, not just in the uptrend market.
For a complete understanding of the report, be sure to read the relevant documentation.
### Notes and improvements
We can see that only six transactions have taken place. These transactions generated 5.09 per cent profits, starting at 1 BTC and ending at 1.05086506 BTC.
Given the risks involved, the result is not impressive. However, this strategy is very simple and there is a lot of room for improvement:
Compared to buying and holding only ETH, that is, converting our entire BTC stack to ETH at the beginning of the test period, we will get 24.93% (market change indicator), but this is not what we can usually expect. We have much less exposure, betting only 10 per cent of each deal, not all of it. It is important to test our strategy under different conditions-not only when the market is growing, but also when the market is shrinking.
Trading more currencies for us only considers Ethernet Fong, which is one of the hundreds of currencies we can trade. This restriction allows only one transaction at a time, which is obviously not ideal.
With a more advanced strategy, we can say that we use one of the simplest strategies, which only uses a simple moving average as an indicator. Increased complexity does not necessarily mean better performance, but we can test a large number of combinations of metrics against each other to find the best strategy.
At this point, we haven't tried to optimize any hyperparameters, such as moving average periods, investment returns, and stops.
In a smaller period of time we only think about daily candlesticks, which is one reason why robots find only about 0.02 transactions a day, which is much less than human traders. Robots can make more money by trading more frequently and looking at more detailed candlesticks.
### Draw the result
To use freqtrade's drawing command, we need to change the docker-compose.yml file. The only thing we need to do is comment out one line and uncomment the other. Refer to the following file excerpt for an example:
```sh
---
version: '3'
services:
  freqtrade:
    # image: freqtradeorg/freqtrade:stable      <--- comment this line
    # image: freqtradeorg/freqtrade:develop
    # Use plotting image
    image: freqtradeorg/freqtrade:develop_plot  <--- uncomment this line
    ...
```
This tells docker-compose to pull the freqtrade Docker image that contains the correct drawing library.
We can now use this command to visualize our data, metrics, and buy / sell signal freqtrade plot-dataframe.
```sh
docker-compose run --rm freqtrade plot-dataframe -s SimpleMA_strategy --config ./user_data/learndatasci-config.json -i 1d --timerange 20200101-20201231 --indicators1 fast_MA slow_MA
```
The-- indicators1 option defines the metrics we want to plot, namely fast_MA and Slow_MA. These must be defined within the policy specified with the option.
By default, this creates an available drawing html file in the drawing directory:. / user_data/plot/freqtrade-plot-ETH_BTC-1d.html
```sh
ft_userdata
└───user_data
    ...
    └───plot
          freqtrade-plot-ETH_BTC-1d.html
```
Hover over the drawing to see how the robot actually performs what we want it to do, as defined by our simple moving average strategy:
Fast_MA buys slow_MA when crossing below.
Fast_MA sells slow_MA when crossed at the top.
To see what else you can do with plot-dataframe, run docker-compose run-- rm freqtrade plot-dataframe-h or visit the documentation.