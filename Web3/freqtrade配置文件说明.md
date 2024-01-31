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
        "name": "binance",
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