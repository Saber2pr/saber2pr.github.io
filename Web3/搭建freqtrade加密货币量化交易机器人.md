2024年会是币圈超级大牛市，有 BTC 减半和美元降息加持，如果你是程序员，量化交易机器人赶紧学起来！

> 前提，你熟悉云服务器ssh连接终端的用法，和基础的python语法(有js基础也可)

本文采用python量化机器人框架 freqtrade 开始操作！

[freqtrade官方文档](https://www.freqtrade.io/en/stable/)

官方文档内容过多，请先跟随本文入门阅读，后续深入学习可参考官方文档～

### 1. 准备云服务器 docker 环境

这里以云服务器选择 ubuntu 系统开始，先配置 docker 环境，依次执行以下命令：

```sh
sudo apt update

sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

sudo apt update

sudo apt install docker-ce
```

### 2. 安装 freqtrade 和初始化项目

ssh登录你的服务器后，在终端内按以下命令开始：

> 建议使用 vscode 的 ssh remote container 开发更方便！

```sh
mkdir ft_userdata

cd ft_userdata/

curl https://raw.githubusercontent.com/freqtrade/freqtrade/stable/docker-compose.yml -o docker-compose.yml

docker compose pull

docker compose run --rm freqtrade create-userdir --userdir user_data
```

执行完后，会创建出来 docker-compose.yml文件、user_data目录

然后初始化配置文件 config.json

```sh
docker compose run --rm freqtrade new-config --config user_data/config.json
```

会连续问你几个问题，选择 Y/N 回车即可，按下面的日志示例操作：

> telegram 机器人创建token以及telegram安装请自行google搜索查阅

```sh
? Do you want to enable Dry-run (simulated trades)? Yes ## 是否使用模拟账户操作，就是模拟交易。设置为false则会用你账户里的真实余额交易
? Please insert your stake currency: USDT ## 货币单位 这里用默认的USDT
? Please insert your stake amount (Number or 'unlimited'): unlimited ## 最大开仓占比，unlimited就是所有金额都会被机器人拿去用。也可以指定如 100，就是只给机器人 100 USDT 去交易
? Please insert max_open_trades (Integer or -1 for unlimited open trades): 3 ## 最大开仓数量，就是可以买几种币。3就是机器人最多只买3种货币。
? Time Have the strategy define timeframe. ## 是否用策略中的时间线，这里用默认的。一般策略中的时间线都是最好的。
? Please insert your display Currency (for reporting): USD ## 机器人展示收益用的单位，可以设置为 CNY，会用人民币表示
? Select exchange okx ## 选择交易所，这里示例选择okx欧易
? Do you want to trade Perpetual Swaps (perpetual futures)? Yes ## 是否启用合约模式。设置false为现货交易。
? Do you want to enable Telegram? Yes ## 启用 telegram 机器人
? Insert Telegram token # telegram 机器人 token
? Insert Telegram chat id # telegram 机器人 id
? Do you want to enable the Rest API (includes FreqUI)? Yes # web管理控制台页面
? Insert Api server Listen Address (0.0.0.0 for docker, otherwise best left untouched) 0.0.0.0 # web管理控制台ip端口
? Insert api-server username freqtrader # web管理控制台账号
? Insert api-server password ****** # web管理控制台密码
```

#### 2.1 配置文件说明：

交易机器人的配置文件最重要，说明一下：

```json
{
    // 交易模式，这里有三个选项，spot (默认，现货交易)，future(期货交易，可以进行做空交易)， margin（当前不可用）
    "trading_mode": "spot",
    // 当交易模式不是spot时，需要设置这里，当交易模式为future时，要设置为isolated， 当交易模式为margin时设置为cross（暂时不可用）
    // "margin_mode": "isolated",
    // 最大的单数
    "max_open_trades": 5,
    // 用于交易的加密货币
    "stake_currency": "USDT",
    // 机器人可用的金额，可以开启多个机器人用于交易，平横策略间的收益差异
    "stake_amount": 200,
    // 允许机器人交易的账户总余额的比率
    "tradable_balance_ratio": 1,
    // 从虚拟币转换为哪种法定货币，这里时美金，如果转换报错，可以不设置
    // "fiat_display_currency": "USD",
    // 运行模式，虚拟运行，还是真实运行，true是虚拟运行
    "dry_run": true,
    // 要使用的时间帧 1m，5m, 15m, 30m, 1h  ...,这个歌配置可以在这里缺省，并在策略文件进行再次配置，也就是策略文件的配置强于这里
    "timeframe": "3m",
    // 虚拟运行的总金额
    "dry_run_wallet": 1000,
    // 在退出时取消未结订单
    "cancel_open_orders_on_exit": true,
    // 必须的配置
    "unfilledtimeout": {
        // 只要有信号，机器人将等待未完成的挂单完成多长时间（以分钟或秒为单位），之后订单将被取消并以当前（新）价格重复。
        "entry": 10,
        // 只要有信号，机器人将等待未履行的退出订单完成多长时间（以分钟或秒为单位），之后订单将被取消并以当前（新）价格重复
        "exit": 30
    },
    // 交易所设置
    "exchange": {
        "name": "okx",
        // API key
        "key": "",
        // API secret
        "secret": "",
        // ccxt的一些配置，在国外一般用不到，在国内可以在这里配置代理
        "ccxt_config": {},
        "ccxt_async_config": {},
        // 交易对白名单
        // 1INCH/USDT是现货交易
        // 1INCH/USDT:USDT是期货交易
        // 在这里可以使用通配符进行批量的配置，不必列出所有交易对
        // 查看交易所支持的交易对，命令：freqtrade list-markets -c config.json 或者是 freqtrade list-pairs -c config.json 
        "pair_whitelist": [
            "1INCH/USDT:USDT",
            "ALGO/USDT:USDT"
        ],
        // 黑名单
        "pair_blacklist": [
            // 黑名单通配符设置，白名单同理
            "*/BNB"
        ]
    },
    "entry_pricing": {
        // 必须配置，选择机器人应查看价差的一侧以获得进入率。默认same 还有 ask, bid, other
        "price_side": "same",
        // 允许使用订单簿输入中的费率进行输入。缺省值为true
        "use_order_book": true,
        // 机器人将使用订单簿“price_side”中的前 N ​​个汇率来进入交易。即，值为 2 将允许机器人选择Order Book Entry中的第二个条目。
        "order_book_top": 1,
        // 必须配置，插值投标价格。
        "price_last_balance": 0.0,

        "check_depth_of_market": {
            // 如果Order Book中的买单和卖单有差异，则不要进入。
            "enabled": false,
            // 订单簿中的买单与卖单的差额比例。值低于 1 表示卖单规模较大，而值大于 1 表示买单规模较大
            "bids_to_ask_delta": 1
        }
    },
    "exit_pricing": {
        // 选择机器人应查看的价差一侧以获得退出率。默认same
        "price_side": "other",
        "use_order_book": true,
        "order_book_top": 1
    },
    // 定义要使用的一个或多个配对列表。
    "pairlists": [
        // 这里的方法有很多， [点击查看详情](https://www.freqtrade.io/en/stable/plugins/#pairlists-and-pairlist-handlers)
        // 大部分默认情况下都是使用StaticPairList
        {
            "method": "StaticPairList"
        }
    ],
    // 后面还可以添加frequi的配置，以及telegrambot的配置
    "bot_name": "",
    "force_entry_enable": true,
    "initial_state": "running",
    "internals": {
        "process_throttle_secs": 5
    }
}
```

config配置里，最重要的是dry_run、trading_mode。exchange里要配一下交易所的api key和secret，okx可以在app上的API里创建apiKey。

这里放一下我自己的config文件，是合约交易类型：

```json
{
    "tradable_balance_ratio": 0.99,
    "fiat_display_currency": "CNY",
    "stake_amount": "unlimited",
    "stake_currency": "USDT",
    "amend_last_stake_amount": true,
    "dry_run_wallet": 1600,
    "max_open_trades": 10,
    "dry_run": false,
    "cancel_open_orders_on_exit": false,
    "trading_mode": "futures",
    "margin_mode": "isolated",
    "unfilledtimeout": {
        "entry": 10,
        "exit": 10,
        "exit_timeout_count": 0,
        "unit": "minutes"
    },
    "entry_pricing": {
        "price_side": "other",
        "use_order_book": true,
        "order_book_top": 1,
        "price_last_balance": 0.0,
        "check_depth_of_market": {
            "enabled": false,
            "bids_to_ask_delta": 1
        }
    },
    "exit_pricing": {
        "price_side": "other",
        "use_order_book": true,
        "order_book_top": 1
    },
    "exchange": {
        "name": "okx",
        "key": "",
        "secret": "",
        "password": "",
        "ccxt_config": {},
        "ccxt_async_config": {},
        "pair_blacklist": [
            "(BTCUSDT_.*|ETHUSDT_.*)",
            "(GT|HT)/.*",
            "(WBTC|BSV|BTCDOM|DEFI)/.*",
            ".*(_PREMIUM|BEAR|BULL|DOWN|HALF|HEDGE|UP|[1235][SL])/.*",
            "(AUD|BRZ|CAD|CHF|EUR|GBP|HKD|IDRT|JPY|NGN|RUB|SGD|TRY|UAH|USD|ZAR|UST)/.*",
            "(BUSD|CUSDT|DAI|PAX|PAXG|SUSD|TUSD|USDC|USDT|VAI|USDN)/.*",
            "(ACM|AFA|ALA|ALL|APL|ASR|ATM|BAR|CAI|CITY|FOR|GOZ|IBFK|LEG|LOCK-1|NAVI|NOV|OG|PFL|PSG|ROUSH|STV|TH|TRA|UCH|UFC|YBO)/.*"
        ]
    },
    "pairlists": [
        {
            "method": "VolumePairList",
            "number_assets": 20,
            "sort_key": "quoteVolume",
            "min_value": 0,
            "refresh_period": 86400,
            "lookback_days": 1
        },
        {
            "method": "AgeFilter",
            "min_days_listed": 10
        },
        {
            "method": "PrecisionFilter"
        },
        {
            "method": "PriceFilter",
            "low_price_ratio": 0.01
        },
        {
            "method": "SpreadFilter",
            "max_spread_ratio": 0.002
        },
        {
            "method": "RangeStabilityFilter",
            "lookback_days": 3,
            "min_rate_of_change": 0.02,
            "refresh_period": 1440
        },
        {
            "method": "ShuffleFilter",
            "seed": 42
        }
    ],
    "telegram": {
        "enabled": true,
        "token": "",
        "chat_id": "",
        "keyboard": [
            [
                "/daily",
                "/status table",
                "/count"
            ],
            [
                "/profit",
                "/performance",
                "/balance"
            ],
            [
                "/status",
                "/show_config",
                "/whitelist"
            ],
            [
                "/logs",
                "/reload_config",
                "/help"
            ]
        ]
    },
    "edge": {
        "enabled": false,
        "process_throttle_secs": 3600,
        "calculate_since_number_of_days": 14,
        "allowed_risk": 0.01,
        "stoploss_range_min": -0.01,
        "stoploss_range_max": -0.1,
        "stoploss_range_step": -0.01,
        "minimum_winrate": 0.60,
        "minimum_expectancy": 0.20,
        "min_trade_number": 10,
        "max_trade_duration_minute": 1440,
        "remove_pumps": false
    },
    "api_server": {
        "enabled": false,
        "listen_ip_address": "127.0.0.1",
        "listen_port": 8080,
        "verbosity": "error",
        "enable_openapi": false,
        "jwt_secret_key": "",
        "ws_token": "",
        "CORS_origins": [],
        "username": "",
        "password": ""
    },
    "bot_name": "freqtrade",
    "initial_state": "running",
    "force_entry_enable": true,
    "internals": {
        "process_throttle_secs": 5
    }
}
```

### 3. 编写配置交易策略

在 user_data/strategies 目录下，会给你一个默认的策略文件，内容简单说明一下：

> 简化代码

```py
class SampleStrategy(IStrategy):
    INTERFACE_VERSION = 3 # 版本为3的才可以做空

    can_short: bool = False # 是否可以做空
    # 止盈
    minimal_roi = {
        "60": 0.01,
        "30": 0.02,
        "0": 0.04
    }
    # 止损
    stoploss = -0.10
    # 移动止损
    trailing_stop = False
    # 用哪个时间线的k线
    timeframe = '5m'
    # 设置指标
    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        return dataframe
    # 入场
    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
            (
                (qtpylib.crossed_above(dataframe['rsi'], self.buy_rsi.value))
            ),
            'enter_long'] = 1 # 开仓信号，做多

        dataframe.loc[
            (
                (qtpylib.crossed_above(dataframe['rsi'], self.short_rsi.value))
            ),
            'enter_short'] = 1 # 开仓信号，做空

        return dataframe
    # 出场
    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
            (
                (qtpylib.crossed_above(dataframe['rsi'], self.sell_rsi.value)) # rsi穿过sell_rsi
            ),

            'exit_long'] = 1 # 平仓信号，平多

        dataframe.loc[
            (
                (qtpylib.crossed_above(dataframe['rsi'], self.exit_short_rsi.value)) # rsi穿过exit_short_rsi
            ),
            'exit_short'] = 1 # 平仓信号，平空

        return dataframe

```

这是示例的策略，不一定好用，社区有很多网站可以找到策略，直接复制过来可以用了。

### 启动项目

打开 docker.compose.yml文件：

```yml
---
version: '3'
services:
  freqtrade:
    image: freqtradeorg/freqtrade:stable # 官方镜像
    restart: unless-stopped
    container_name: freqtrade
    volumes:
      - "./user_data:/freqtrade/user_data"
    ports:
      - "127.0.0.1:8080:8080"
    command: >
      trade
      --logfile /freqtrade/user_data/logs/freqtrade.log # 输出日志的文件
      --db-url sqlite:////freqtrade/user_data/tradesv3.sqlite # 数据库
      --config /freqtrade/user_data/config.json # 机器人配置文件
      --strategy SmartTA # 策略文件class名
```

这里重点关注--strategy参数，后面的是策略代码里的class名，不是文件名

终端执行:

```sh
docker compose up -d
```

启动，然后在 user_data/logs/freqtrade.log 文件里可以看到启动日志了。telegram机器人也会打印日志出来。

### 开源策略网站

推荐2个策略网站：

1. https://freqst.com/
2. https://strat.ninja/ranking.php

这两个网站上可以找到很多不错的策略拿来参考。

### 回测

最后说一下回测，freqtrade提供了回测功能，这个功能，我只能说它只能验证一下策略文件代码逻辑是否有bug，回测的收益结果和正常去实测跑差距还是比较明显的。建议先实际环境dry-run一段时间稳定了再开真实账户。