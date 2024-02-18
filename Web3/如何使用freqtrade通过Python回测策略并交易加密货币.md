> 介绍如何使用freqtrade，这是一个用 Python 编写的开源交易软件。我们将使用 freqtrade 使用pandas创建、优化和运行加密货币交易策略。

### 第 1 部分（本文）

1. Freqtrade 的基本功能和加密市场术语 — 我们将学习 freqtrade 的工作原理、如何使用命令行工具下载历史市场数据、创建新的配置文件和新策略。

如何使用Python和pandas定义策略——我们将定义一个简单的移动平均策略，在以太坊（ETH）和比特币（BTC）之间进行交易，试图最大化我们持有的比特币数量。

根据历史数据对策略进行回溯测试，以确定我们策略的表现——我们将了解如何生成完整的报告，以及如何可视化机器人模拟交易的图表。

### Freqtrade 基础知识

Freqtrade 是一款用 Python 编写的加密货币算法交易软件。它允许您：

1. 制定策略：轻松使用 Python 和 pandas。我们将在本文中创建一个简单的策略，您可以查看 freqtrade 的示例策略存储库。

[freqtrade 的示例策略存储库](https://github.com/freqtrade/freqtrade-strategies/)

2. 下载市场数据：快速下载您选择的加密货币的历史价格数据。

3. 回测：根据历史数据测试您的策略。回溯测试是查看您的策略是否有机会在现实世界中赚钱的关键步骤。它不能保证实际性能，因为市场条件比下载的数据更复杂。

4. 优化：使用hyperopt找到最适合您策略的参数。

5. 选择要交易的货币对：您的选择可以是基于简单过滤器的静态或动态选择，例如交易量是否大于一定金额。

6. 试运行：使用模拟钱包根据实时数据测试策略。

7. 实时运行：通过加密货币交易所的 API 使用真实资金部署策略。这是您知道自己在做什么并愿意损失所有钱之后的最后一步。

8. 使用 Telegram 机器人：通过 Telegram 控制和监控您的策略。

9. 分析和可视化交易历史：利用保存文件或通过 SQL 数据库的交易数据。

### 安装 freqtrade

好的，让我们从安装开始深入探讨。Docker - 适用于所有平台的最简单方法Docker 是在所有平台上入门的最快方法，也是 Windows 的推荐方法。您需要首先安装Docker和docker-compose，然后通过启动 Docker Desktop 确保 Docker 正在运行。您现在可以通过在所需目录中发出以下命令来设置 freqtrade：

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


您现在应该具有以下目录结构：

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

如何在没有 Docker 的情况下安装 freqtrade？

直接安装对于无需 Docker 的直接安装在您的系统（Linux、MacOS、Windows）上，我建议您直接查看文档。

就我而言，使用 Ubuntu 20.04，它很简单

```sh
git clone https://github.com/freqtrade/freqtrade.git 
cd freqtrade 
git checkout stable 
./setup.sh -i
```

此步骤需要一些时间才能完成，并且需要输入来生成初始配置。不要太担心这一点，因为我们可以稍后更改它，但根据经验，对所有事情都说“是”。

注意：安装创建了一个 virtualenv (.env)，我们应该在使用 freqtrade 进行任何操作之前激活它。

```sh
source ./.env/bin/activate
```

我们可以使用 freqtrade 命令。要验证安装是否成功，请运行

```sh
freqtrade --help
```

重要提示：如果您直接安装 freqtrade，则无需

```sh
docker-compose run --rm
```

像本文其余部分那样在命令前加上前缀。要验证 freqtrade 是否已正确安装并可供使用，请发出帮助命令：

```sh
docker-compose run --rm freqtrade --help
```

您应该看到以下输出

```sh
usage: freqtrade [-h] [-V] 
        {trade,create-userdir,new-config,new-hyperopt,new-strategy,download-data,convert-data,convert-trade-data,list-data,backtesting,edge,hyperopt,hyperopt-list,hyperopt-show,list-exchanges,list-hyperopts,list-markets,list-pairs,list-strategies,list-timeframes,show-trades,test-pairlist,instal l-ui,plot-dataframe,plot-profit} ...
```

help 命令的输出显示所有可能的 freqtrade 命令。

在本系列中，我们将探索最重要的命令以及如何使用它们。

第一个是回溯测试。

### 回测：freqtrade 如何测试交易策略

在本文中，我们希望创建一个简单的策略并根据历史数据进行回测。回测根据历史数据测试策略，模拟策略预期进行的交易。虽然这并不能保证现实世界中的表现，但它很好地表明了获胜/失败的策略。

Freqtrade 通过以下步骤回测策略：

1. 在提供的配置文件中加载币对（ETH/BTC、ADA/BTC、XRP/BTC 等）的历史数据调用该策略的bot_loop_start()函数一次。

2. 这会在实时运行中启动一个新循环，而在回溯测试中，只需要一次。

3. 通过调用每对的方法来计算策略的技术指标populate_indicators()

4. 通过调用每对的populate_buy_trend()和方法来计算买入/卖出信号populate_sell_trend()

5. 如果在策略中实现，则通过调用confirm_trade_entry()和方法确认买入/卖出交易confirm_trade_exit()

6. 循环遍历每个时间段（5m、1h、1d等）并模拟进入点和退出点

7. 最后，生成回测报告，总结指定期间内的所有交易以及相关盈亏

8. populate_indicators()我们将在接下来的段落中定义上面提到的方法。

下载数据为了进行回溯测试，我们需要来自交易所的历史价格数据。让我们首先使用以下命令从Binance下载一些数据：

```sh
docker-compose run --rm freqtrade download-data -p ETH/BTC -t 1d --timerange 20200101-20201231 --exchange binance
```

该命令的参数告诉 freqtrade 以下内容：

-p ETH/BTC- 下载以太坊 (ETH) - 比特币 (BTC) 货币对的数据

-t 1d- 下载时间范围为 1 天的数据

--timerange 20200101-20201231 下载2020年1月1日至2020年12月31日的数据。

--exchange binance- 从币安交易所下载数据。

在这里，您可以使用freqtrade 支持的任何交易所。

该命令生成文件：

```sh
ft_userdata
└───user_data
    └───data
        └───binance
               ETH_BTC-1d.json
```
    

其中包含多个开高低闭卷 (OHLCV) 数据工件，如下所示：

```sh
时间	打开	高的	低的	关闭	体积
1622851200000	0.073013	0.075	0.0726	0.073986	143662.752
1622937600000	0.073989	0.075961	0.073626	0.075737	120623.423
```

其中各列含义如下：

time：Unix 时间戳（以毫秒为单位）
开盘价：烛台开始处的开盘价
最高价：烛台期间达到的最高价格
最低价：烛台期间达到的最低价格
收盘价：烛台末端的收盘价
交易量：购买或出售的资产数量，以基础货币（在我们的例子中为 ETH）显示。BTC 是报价货币。


### freqtrade 配置

我们拥有回测策略所需的数据，但我们需要创建一个配置文件，这将使我们能够轻松控制策略的多个参数。要创建新配置，我们运行以下命令：

```sh
docker-compose run --rm freqtrade new-config --config user_data/learndatasci-config.json
```

在继续之前，我们需要打开配置文件并设置 pair_whitelist = ["ETH/BTC"]，这会建立我们感兴趣的货币对。

然后我们就准备出发了。您暂时不需要担心其他任何事情，但您应该确保了解其他配置选项的含义，因此请务必访问相关文档。

### 实施简单的自定义策略 - 移动平均线交叉

在这里，我们将定义一种简单的移动平均策略，类似于《Python for Finance》系列中的策略。如果您还没有阅读过，请务必结帐。您可以在Investopedia中找到更多详细信息。

了解策略我要告诉你一个小秘密。交易其实非常简单，你只需要做两件事：

低买
高价卖出

这么容易吗？有什么问题吗？棘手的是找到实际的低点和高点。

移动平均线策略背后的思想如下：

你有两条线
- 慢速移动平均线(SMA)：过去值的长期平均值，代表总体趋势。
- 快速移动平均线(FMA)：过去值的短期平均值，代表当前趋势。

对于我们的策略，我们将使用以下指标：当 FMA 穿越 SMA 上方时买入，表明趋势向上。当 FMA 穿越 SMA 下方时卖出，表明趋势下降。这称为移动平均线交叉策略。

为 freqtrade 定义自定义策略让我们使用pandas转换 freqtrade 中的移动平均线交叉策略。

首先，我们需要创建一个新的策略文件来保存买入/卖出信号背后的逻辑。

```sh
docker-compose run --rm freqtrade new-strategy -s SimpleMA_strategy --template minus
```

现在，我们可以在策略文件夹中找到新创建的文件：

```sh
ft_userdata
└───user_data
    ...
    └───strategies
            SimpleMA_strategy.py
```

SimpleMA_strategy.py包含一个自动生成的类，SimpleMA_strategy以及我们需要更新的几个函数。

为了定义我们的简单策略，我们需要更新以下三个函数：

populate_indicators()

populate_buy_trend()

populate_sell_trend()

让我们逐一讨论一下这些内容。

1.populate_indicators()

在这里，我们计算我们的策略产生买入/卖出信号所需的指标。为 ETH/BTC 绘制的快速移动平均线（蓝线）和慢速移动平均线（黄线）指标根据我们的策略，我们计算快速移动平均线fast_MA（使用最后 5 个烛台计算）和慢速移动平均线slow_ma（使用前 50 个烛台计算）：


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

请注意，我们将数据帧作为参数传递，对其进行操作，然后返回它。我们所有的函数都会以这种方式处理数据帧。如果您有兴趣查看简单移动平均线以外的指标，请查看ta-lib 文档。笔记此类中的函数定义使用类型提示来定义参数和返回值类型。

2.populate_buy_trend()

该函数填充我们的买入信号，当fast_MA交叉线高于我们策略slow_MA中的 时，就会触发该信号。

我们可以通过更新populate_buy_trend()以包含以下逻辑来实现此目的：


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

使用qtpylib，我们可以轻松找到交叉点。本质上，当我们的购买条件 ( ) 被触发时，上面的代码会buy用 1 填充该列crossed_above。

3.populate_sell_trend()

以与前一个函数类似的方式，该函数填充我们的卖出信号。根据我们的策略，这是当fast_MA交叉线低于时slow_MA。

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

我们现在使用的crossed_below是——相反的——当我们的卖出条件被触发时，它将用 1crossed_above填充该列。

3. populate_sell_trend()

默认情况下，生成的 freqtrade 策略文件包含更多选项，例如 ROI（投资回报率）和止损，这将在本系列文章的第二部分中讨论。我们现在将禁用它们：

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

现在我们已经填写了策略，我们可以测试它在过去数据上的表现。回测策略定义了我们的简单策略后，现在我们希望使用回测的历史数据来评估它，这使我们能够在过去进行交易，看看它们的表现如何。

回溯测试并不能完美地代表我们的策略的执行情况，因为其他因素会影响实时市场的回报，例如滑点。要使用 freqtrade 执行回溯测试，我们可以使用刚刚创建的类和函数运行以下命令：

```sh
docker-compose run --rm freqtrade backtesting 
    --strategy SimpleMA_strategy -i 1d -p ETH/BTC 
    --timerange 20200101-20201231 
    --starting-balance 1
    -c ./user_data/learndatasci-config.json
```

上述命令中的参数如下：

-p ETH/BTC- 交易 ETH/BTC 货币对，将我们的 BTC 换成 ETH

--timerange 20200101-20201231- 2020年的回测，从第一天01/01/2020到最后一天12/31/2020。

-c ./user_data/config-learndatasci.json 我们正在使用本文前面定义的配置。

--starting-balance 1我们从 1 BTC 余额开始。

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

我们得到一份完整的报告，其中包含指定期间内所有交易的结果。

Freqtrade 将报告分为四个部分：

1. 回测报告本部分显示每个货币对的性能报告，在我们的例子中，只有 ETH/BTC。平均利润 % 列显示所有交易的平均利润，而累计利润 % 列总结所有利润/损失。总利润 % 列显示相对于起始余额的总利润 %。~ 频率贸易文档

2. 卖出原因统计该报告向我们展示了卖出原因的表现。根据我们的策略，我们仅使用卖出信号，因此我们只有 1 行。一般来说，我们也可以出于其他原因出售，例如可接受的投资回报率（ROI）和止损。我们将在本系列的下一篇文章中看到这一点。

3. 未平仓交易报告报告的这一部分显示回测结束时未平仓的所有交易。在我们的例子中，我们没有任何，一般来说，它不是很重要，因为它代表回测的结束状态。

4. 指标概要就我个人而言，这是我通常首先关注的领域。最需要指出的部分如下：每日交易数- 每日平仓交易的平均数量。我通常寻找每天进行大约十笔交易的策略。利润总额 % - 利润占期初余额的百分比。Drawdown - 最大连续亏损金额市场变化- 指定时期内市场增长/收缩的程度。当交易多个货币对时，该指标是所有货币对从指定时期开始到结束所发生的市场变化的平均值。在我们的案例中，ETH/BTC 市场在 2020 年增长了 24.93%。在不同的市场条件下测试策略至关重要，而不仅仅是在上升趋势的市场中测试策略。

要完整了解该报告，请务必阅读相关文档。

### 注意事项和改进

我们可以看到只发生了六笔交易。这些交易产生了 5.09% 的利润，从 1 BTC 开始，到 1.05086506 BTC 结束。

考虑到所涉及的风险，这个结果并不令人印象深刻。然而，这个策略非常简单，并且还有很大的改进空间：

与购买并持有仅持有 ETH 相比，即在测试期开始时将我们的整个 BTC 堆栈转换为 ETH，我们将获得 24.93%（市场变化指标），但这不是我们通常可以预期的。我们的风险敞口要少得多，每笔交易只押注 10% 的筹码，而不是全部。在不同条件下测试我们的策略非常重要——不仅是在市场增长时，而且在市场萎缩时。

交易更多的货币对 我们只考虑了以太坊，它是我们可以交易的数百种货币之一。此限制仅允许一次进行一笔交易，这显然不是最理想的。

使用更高级的策略我们可以说使用了最简单的策略之一，它仅使用简单的移动平均线作为指标。增加复杂性并不一定意味着更好的性能，但是我们可以对大量指标组合进行相互回测，以找到最佳策略。

优化参数目前，我们还没有尝试优化任何超参数，例如移动平均周期、投资回报和止损。

较小的时间段我们只考虑每日烛台，这就是机器人每天仅发现约 0.02 笔交易的原因之一，其交易次数比人类交易者少得多。机器人可以通过更频繁的交易和查看更详细的烛台来赚取更多利润。

### 绘制结果

要使用 freqtrade 的绘图命令，我们需要更改docker-compose.yml文件。我们唯一需要做的就是注释掉一行并取消注释另一行。请参阅以下文件摘录以查看示例：

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

这告诉 docker-compose 拉取包含正确绘图库的 freqtrade Docker 镜像。

我们现在可以使用该命令可视化我们的数据、指标和买入/卖出信号freqtrade plot-dataframe。

```sh
docker-compose run --rm freqtrade plot-dataframe -s SimpleMA_strategy --config ./user_data/learndatasci-config.json -i 1d --timerange 20200101-20201231 --indicators1 fast_MA slow_MA
```

该--indicators1选项定义了我们想要绘制的指标，即fast_MA和Slow_MA。这些必须在使用选项指定的策略内定义-s。

默认情况下，这会在绘图目录中创建一个可用的绘图 html 文件：./user_data/plot/freqtrade-plot-ETH_BTC-1d.html

```sh
ft_userdata
└───user_data
    ...
    └───plot
          freqtrade-plot-ETH_BTC-1d.html
```

将鼠标悬停在绘图上，查看机器人实际上如何执行我们希望它执行的操作，如我们的简单移动平均策略所定义：

fast_MA当交叉至下方时买入slow_MA。
fast_MA当交叉于上方时卖出slow_MA。

要了解您还可以做什么plot-dataframe，请运行 docker-compose run --rm freqtrade plot-dataframe -h 或访问相关文档。