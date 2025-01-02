Here's the translation of the Markdown content strictly following your rules:

---

2024 will be a super bull market for the crypto world, supported by BTC halving and USD interest rate cuts. If you are a programmer, quickly learn quantitative trading robots!

> Prerequisite: You are familiar with using cloud server SSH terminal connections and basic Python syntax (having a JavaScript background is also acceptable)

This article uses the Python quantitative robot framework `freqtrade` to get started!

[freqtrade official documentation](https://www.freqtrade.io/en/stable/)

The official documentation is extensive, please follow this introductory reading first, and refer to the official documentation for further study.

### 1. Prepare Cloud Server Docker Environment

Choose the Ubuntu system for the cloud server and configure the Docker environment by sequentially executing the following commands:

```sh
sudo apt update

sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

sudo apt update

sudo apt install docker-ce
```

### 2. Install freqtrade and Initialize the Project

After logging into your server via SSH, start in the terminal with the following commands:

> It is recommended to use the SSH remote container of VS Code for more convenience!

```sh
mkdir ft_userdata

cd ft_userdata/

curl https://raw.githubusercontent.com/freqtrade/freqtrade/stable/docker-compose.yml -o docker-compose.yml

docker compose pull

docker compose run --rm freqtrade create-userdir --userdir user_data
```

After execution, it will create a `docker-compose.yml` file and a `user_data` directory.

Then initialize the configuration file `config.json`

```sh
docker compose run --rm freqtrade new-config --config user_data/config.json
```

You will be asked a few questions continuously, select Y/N and press Enter, operate according to the log example below:

> Please Google search for creating a Telegram bot token and Telegram installation

```sh
? Do you want to enable Dry-run (simulated trades)? Yes ## Whether to use a simulated account operation, which is simulated trading. Setting to false will use the real balance in your account for trading.
? Please insert your stake currency: USDT ## Currency unit, here defaults to USDT
? Please insert your stake amount (Number or 'unlimited'): unlimited ## Maximum open position ratio, unlimited means all amounts will be used by the bot. You can also specify like 100, which only gives the bot 100 USDT to trade.
? Please insert max_open_trades (Integer or -1 for unlimited open trades): 3 ## Maximum number of open positions, which means how many types of coins you can buy. 3 means the bot can buy up to 3 types of currencies.
? Time Have the strategy define timeframe. ## Whether to use the timeline in the strategy, here the default is used. Generally, the timeline in the strategy is the best.
? Please insert your display Currency (for reporting): USD ## The unit used for displaying returns in the bot, can be set to CNY to be displayed in RMB
? Select exchange okx ## Select the exchange, here OKX is chosen as an example
? Do you want to trade Perpetual Swaps (perpetual futures)? Yes ## Whether to enable contract mode, set false for spot trading.
? Do you want to enable Telegram? Yes ## Enable Telegram bot
? Insert Telegram token # Telegram bot token
? Insert Telegram chat id # Telegram bot ID
? Do you want to enable the Rest API (includes FreqUI)? Yes # Web management console page
? Insert Api server Listen Address (0.0.0.0 for docker, otherwise best left untouched) 0.0.0.0 # Web management console IP port
? Insert api-server username freqtrader # Web management console account
? Insert api-server password ****** # Web management console password
```

#### 2.1 Configuration File Explanation:

The configuration file of the trading robot is the most important, here is an explanation:

```json
{
    // Trading mode, there are three options: spot (default, spot trading), future (futures trading, can short), margin (currently unavailable)
    "trading_mode": "spot",
    // When the trading mode is not spot, you need to set here. When the trading mode is future, set to isolated, and when it is margin, set to cross (temporarily unavailable)
    // "margin_mode": "isolated",
    // Maximum number of trades
    "max_open_trades": 5,
    // Cryptocurrency used for trading
    "stake_currency": "USDT",
    // Amount available to the bot, you can run multiple bots to trade and balance strategy differences
    "stake_amount": 200,
    // Ratio of the total balance allowed for trading by the bot
    "tradable_balance_ratio": 1,
    // Convert from cryptocurrency to which fiat currency, here is USD, if conversion errors occur, it can be unset
    // "fiat_display_currency": "USD",
    // Operating mode, virtual or real, true is virtual
    "dry_run": true,
    // Timeframe to use 1m, 5m, 15m, 30m, 1h... this configuration can be omitted here, and reconfigured in the strategy file, meaning that the configuration in the strategy file overrides this
    "timeframe": "3m",
    // Total amount for virtual operation
    "dry_run_wallet": 1000,
    // Cancel unfilled orders on exit
    "cancel_open_orders_on_exit": true,
    // Required configuration
    "unfilledtimeout": {
        // As long as there is a signal, the bot will wait for how long to complete an unfilled entry order (in minutes or seconds), after which the order will be canceled and repeated at the current (new) price.
        "entry": 10,
        // As long as there is a signal, the bot will wait for how long to complete unfilled exit orders (in minutes or seconds), after which the orders will be canceled and repeated at the current (new) price
        "exit": 30
    },
    // Exchange settings
    "exchange": {
        "name": "okx",
        // API key
        "key": "",
        // API secret
        "secret": "",
        // Some settings for `ccxt`, usually unused abroad, can set proxy here in China
        "ccxt_config": {},
        "ccxt_async_config": {},
        // Whitelist for trading pairs
        // 1INCH/USDT is spot trading
        // 1INCH/USDT:USDT is futures trading
        // You can use wildcard here for batch configuration, no need to list all trading pairs
        // Check trading pairs supported by the exchange, command: `freqtrade list-markets -c config.json` or `freqtrade list-pairs -c config.json`
        "pair_whitelist": [
            "1INCH/USDT:USDT",
            "ALGO/USDT:USDT"
        ],
        // Blacklist
        "pair_blacklist": [
            // Blacklist wildcard settings, same as whitelist
            "*/BNB"
        ]
    },
    "entry_pricing": {
        // Must configure, select which side of the spread the robot should look at to obtain the entry rate. Default is `same`, others are `ask`, `bid`, `other`
        "price_side": "same",
        // Allow using rates from order book entries. Default is true
        "use_order_book": true,
        // Bot will use the first N rates from the "price_side" of the order book to enter trades. That is, a value of 2 will allow the bot to choose the second entry from the Order Book Entry.
        "order_book_top": 1,
        // Must configure, interpolated bid price.
        "price_last_balance": 0.0,

        "check_depth_of_market": {
            // Do not enter if there is a discrepancy between bids and asks in the Order Book.
            "enabled": false,
            // The ratio difference of bids and asks in the Order Book. A value below 1 indicates a larger ask size, while a value above 1 indicates a larger bid size
            "bids_to_ask_delta": 1
        }
    },
    "exit_pricing": {
        // Select which side of the spread the robot should look at to obtain the exit rate. Default is `same`
        "price_side": "other",
        "use_order_book": true,
        "order_book_top": 1
    },
    // Define one or more pair lists to use.
    "pairlists": [
        // Many methods here, [click to see details](https://www.freqtrade.io/en/stable/plugins/#pairlists-and-pairlist-handlers)
        // Mostly uses `StaticPairList` by default
        {
            "method": "StaticPairList"
        }
    ],
    // You can also add `freqUI` configs and `telegram bot` configs later
    "bot_name": "",
    "force_entry_enable": true,
    "initial_state": "running",
    "internals": {
        "process_throttle_secs": 5
    }
}
```

In the config settings, the most important are `dry_run` and `trading_mode`. In the `exchange` section, configure the API key and secret of the exchange; on OKX, you can create `apiKey` in the API section of the app.

Here's my own config file for contract trading type:

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

### 3. Write and Configure Trading Strategy

In the `user_data/strategies` directory, you will be given a default strategy file, with a brief explanation of the content:

> Simplified Code

```py
class SampleStrategy(IStrategy):
    INTERFACE_VERSION = 3 # Only version 3 can short

    can_short: bool = False # Can short or not
    # Take Profit
    minimal_roi = {
        "60": 0.01,
        "30": 0.02,
        "0": 0.04
    }
    # Stop Loss
    stoploss = -0.10
    # Trailing Stop
    trailing_stop = False
    # Use which timeframe's K-line
    timeframe = '5m'
    # Set Indicator
    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        return dataframe
    # Entry
    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
            (
                (qtpylib.crossed_above(dataframe['rsi'], self.buy_rsi.value))
            ),
            'enter_long'] = 1 # Entry signal, long

        dataframe.loc[
            (
                (qtpylib.crossed_above(dataframe['rsi'], self.short_rsi.value))
            ),
            'enter_short'] = 1 # Entry signal, short

        return dataframe
    # Exit
    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
            (
                (qtpylib.crossed_above(dataframe['rsi'], self.sell_rsi.value)) # RSI crosses sell_rsi
            ),

            'exit_long'] = 1 # Exit signal, close long

        dataframe.loc[
            (
                (qtpylib.crossed_above(dataframe['rsi'], self.exit_short_rsi.value)) # RSI crosses exit_short_rsi
            ),
            'exit_short'] = 1 # Exit signal, close short

        return dataframe
```

This is a sample strategy and may not be optimal. There are many community websites where you can find strategies that can be copied and used directly.

### Start the Project

Open the `docker.compose.yml` file:

```yml
---
version: '3'
services:
  freqtrade:
    image: freqtradeorg/freqtrade:stable # Official image
    restart: unless-stopped
    container_name: freqtrade
    volumes:
      - "./user_data:/freqtrade/user_data"
    ports:
      - "127.0.0.1:8080:8080"
    command: >
      trade
      --logfile /freqtrade/user_data/logs/freqtrade.log # Output log file
      --db-url sqlite:////freqtrade/user_data/tradesv3.sqlite # Database
      --config /freqtrade/user_data/config.json # Robot config file
      --strategy SmartTA # Strategy file class name
```

Focus on the `--strategy` parameter. The name following it is the class name in the strategy code, not the file name.

In the terminal, execute:

```sh
docker compose up -d
```

Start, and you can see the startup log in the `user_data/logs/freqtrade.log` file. The Telegram bot will also print out logs.

### Backtesting

Lastly, regarding backtesting, freqtrade provides the functionality to backtest. I can only say it can verify if there are any bugs in the strategy file code logic. The yield results from backtesting and normal actual test runs vary significantly. It is suggested to run in a real environment with dry-run for some time before switching to a real account.

### Recommended Reading

If you want to delve deeper into the field of quantification, read the following articles:

1. [Interpretation of freqtrade strategy E0V1E support level](/zh/posts/3516500479/1259322740/)
2. [How to correctly DCA with Freqtrade](/zh/posts/3516500479/1606919060/)