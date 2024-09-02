2024 will be a super bull market in the currency circle, with BTC halved and US dollar interest rates cut. If you are a programmer, quantitative trading robots should learn quickly!
> premise, you are familiar with the usage of ssh connection terminal on CVM and the basic python syntax (basic js is also acceptable)
This paper uses python quantization robot framework freqtrade to start operation!
[Freqtrade official documentation](https://www.freqtrade.io/en/stable/)
There are too many official documents. Please read this article first. For further study, please refer to the official documentation.
### 1. Prepare the docker environment for CVM
Start with the ubuntu system selected by the CVM, configure the docker environment first, and execute the following commands:
```sh
sudo apt update

sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

sudo apt update

sudo apt install docker-ce
```
### two。 Install freqtrade and initialize the project
ssh After logging into your server, press the following command in the terminal to start:
> it is more convenient to use vscode's ssh remote container development!
```sh
mkdir ft_userdata

cd ft_userdata/

curl https://raw.githubusercontent.com/freqtrade/freqtrade/stable/docker-compose.yml -o docker-compose.yml

docker compose pull

docker compose run --rm freqtrade create-userdir --userdir user_data
```
After execution, the docker-compose.yml file and user_data directory will be created
Then initialize the configuration file config.json
```sh
docker compose run --rm freqtrade new-config --config user_data/config.json
```
You will be asked several questions in a row. You can select "enter" as shown in the following log example:
> telegram robot creation token and telegram installation, please google search and check
```sh
? Do you want to enable Dry-run (simulated trades)? Yes ## Whether to use a simulated account for trading, meaning the trades will be simulated. If set to false, the bot will use your actual account balance for real trading.
? Please insert your stake currency: USDT ## Currency unit, the default here is USDT.
? Please insert your stake amount (Number or 'unlimited'): unlimited ## Maximum stake amount, `unlimited` means the bot will use all available funds. You can also specify an amount, like 100, meaning the bot will only use 100 USDT for trading.
? Please insert max_open_trades (Integer or -1 for unlimited open trades): 3 ## Maximum position size, `unlimited` means the bot will use all available funds. You can also specify an amount, like 100, meaning the bot will only use 100 USDT for trading.
? Time Have the strategy define timeframe. ## Whether to use the timeframe specified in the strategy. The default is used here, and the timeframe in the strategy is generally the best option.
? Please insert your display Currency (for reporting): USD ## The unit for displaying the bot's profits. 
? Select exchange okx ## Select the exchange, with OKX as an example here.
? Do you want to trade Perpetual Swaps (perpetual futures)? Yes ## Whether to enable contract trading. Setting it to `false` will use spot trading.
? Do you want to enable Telegram? Yes ## Enable the Telegram bot.
? Insert Telegram token # Telegram bot token
? Insert Telegram chat id # Telegram bot id
? Do you want to enable the Rest API (includes FreqUI)? Yes # Web management console.
? Insert Api server Listen Address (0.0.0.0 for docker, otherwise best left untouched) 0.0.0.0 # Web management console IP and port.
? Insert api-server username freqtrader # Web management console username
? Insert api-server password ****** # Web management console password
```
#### 2.1 profile description:
The configuration file of the trading robot is the most important, to explain:
```json
{
    // Trading mode, with three options: `spot` (default, for spot trading), `future` (for futures trading, which allows short selling), and `margin` (currently unavailable).
    "trading_mode": "spot",
    // When the trading mode is not `spot`, this needs to be set. For `future` trading mode, set it to `isolated`. For `margin` trading mode (currently unavailable), set it to `cross`.
    // "margin_mode": "isolated",
    // Maximum number of open trades.
    "max_open_trades": 5,
    // Cryptocurrency used for trading.
    "stake_currency": "USDT",
    // Amount available for the bot, which allows for running multiple bots to trade and potentially profit from differences between strategies.
    "stake_amount": 200,
    // The ratio of the total account balance that the bot is allowed to trade.
    "tradable_balance_ratio": 1,
    // The fiat currency to convert from virtual currencies. Here, it's set to USD. If conversion errors occur, you can leave this unset.
    // "fiat_display_currency": "USD",
    // Running mode, either virtual or real trading. Setting it to `true` enables virtual trading.
    "dry_run": true,
    // Timeframe to use, such as 1m, 5m, 15m, 30m, 1h, etc. This setting can be left as default here and reconfigured in the strategy file, with the strategy file settings taking precedence.
    "timeframe": "3m",
    // Total amount for virtual trading.
    "dry_run_wallet": 1000,
    // Cancel open orders upon exit.
    "cancel_open_orders_on_exit": true,
    // Required configuration.
    "unfilledtimeout": {
        // The bot will wait for a specified amount of time (in minutes or seconds) for pending orders to be filled. After this time, the order will be canceled and repeated at the current (new) price.
        "entry": 10,
        // The bot will wait for a specified amount of time (in minutes or seconds) for pending exit orders to be fulfilled. After this time, the order will be canceled and repeated at the current (new) price.
        "exit": 30
    },
    // Exchange settings.
    "exchange": {
        "name": "okx",
        // API key
        "key": "",
        // API secret
        "secret": "",
        // Some CCXT configurations, which are generally not used abroad but can be used to configure proxies in domestic settings.
        "ccxt_config": {},
        "ccxt_async_config": {},
        // Trading pair whitelist.
        // 1INCH/USDT is for spot trading.
        // 1INCH/USDT is for futures trading.
        // You can use wildcards here to configure in bulk, without needing to list all trading pairs.
        // To view the supported trading pairs on the exchange, use the command: freqtrade list-markets -c config.json or freqtrade list-pairs -c config.json 
        "pair_whitelist": [
            "1INCH/USDT:USDT",
            "ALGO/USDT:USDT"
        ],
        // blacklist
        "pair_blacklist": [
            // Blacklist wildcard settings are similar to whitelist settings.
            "*/BNB"
        ]
    },
    "entry_pricing": {
        // Required configuration to choose which side of the spread the bot should use for entry rates. The default is `same`, with other options being `ask`, `bid`, and `other`.
        "price_side": "same",
        // Allow the use of rates from the order book for entries. The default value is `true`.
        "use_order_book": true,
        // The bot will use the top N rates from the order book’s `price_side` for entering trades. For example, a value of 2 allows the bot to select the second entry from the order book.
        "order_book_top": 1,
        // Required configuration, interpolation of bid prices.
        "price_last_balance": 0.0,

        "check_depth_of_market": {
            // Do not enter if there is a disparity between the buy and sell orders in the order book.
            "enabled": false,
            // The difference between buy and sell orders in the order book. Values ​​below 1 indicate larger sell orders, while values ​​above 1 indicate larger buy orders.
            "bids_to_ask_delta": 1
        }
    },
    "exit_pricing": {
        // Select which side of the spread the robot should look at to get the exit rate. Default is same
        "price_side": "other",
        "use_order_book": true,
        "order_book_top": 1
    },
    //  Defines one or more pair lists to use.
    "pairlists": [
        // There are many methods here, [click to view details](https://www.freqtrade.io/en/stable/plugins/#pairlists-and-pairlist-handlers)
        // Most of them use StaticPairList by default.
        {
            "method": "StaticPairList"
        }
    ],
    // You can also add frequi configuration and telegrambot configuration later.
    "bot_name": "",
    "force_entry_enable": true,
    "initial_state": "running",
    "internals": {
        "process_throttle_secs": 5
    }
}
```
In config configuration, the most important ones are dry_run and trading_mode. Exchange needs to be matched with the API key and secret of the exchange, okx can create an apiKey in the API on the app.
Put my own config file here, which is the type of contract transaction:
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
### 3. Write configuration transaction strategy
In the user_data/strategies directory, you will be given a default policy file with a brief description:
> mplifying code
```py
class SampleStrategy(IStrategy):
    INTERFACE_VERSION = 3 # Only version 3 can be shorted

    can_short: bool = False # Is it possible to short sell?
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
    # Which timeline K-line to use
    timeframe = '5m'
    # Setting up indicators
    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        return dataframe
    # Entry
    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
            (
                (qtpylib.crossed_above(dataframe['rsi'], self.buy_rsi.value))
            ),
            'enter_long'] = 1 # Opening signal, long

        dataframe.loc[
            (
                (qtpylib.crossed_above(dataframe['rsi'], self.short_rsi.value))
            ),
            'enter_short'] = 1 # Opening signal, shorting

        return dataframe
    # Exit
    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
            (
                (qtpylib.crossed_above(dataframe['rsi'], self.sell_rsi.value)) # rsi crosses sell_rsi
            ),

            'exit_long'] = 1 # Close position signal, close long

        dataframe.loc[
            (
                (qtpylib.crossed_above(dataframe['rsi'], self.exit_short_rsi.value)) # rsi crosses exit_short_rsi
            ),
            'exit_short'] = 1 # Close position signal, close short

        return dataframe

```
This is the strategy of the example, it may not be easy to use, there are many websites in the community that can find the strategy and copy it directly to use it.
### Start the project
Open the docker.compose.yml file:
```yml
---
version: '3'
services:
  freqtrade:
    image: freqtradeorg/freqtrade:stable # Official images
    restart: unless-stopped
    container_name: freqtrade
    volumes:
      - "./user_data:/freqtrade/user_data"
    ports:
      - "127.0.0.1:8080:8080"
    command: >
      trade
      --logfile /freqtrade/user_data/logs/freqtrade.log # Output log file
      --db-url sqlite:////freqtrade/user_data/tradesv3.sqlite # database
      --config /freqtrade/user_data/config.json # Robot configuration file
      --strategy SmartTA # Policy file class name
```
The focus here is on the-- strategy parameter, followed by the class name in the policy code, not the file name
Terminal execution:
```sh
docker compose up -d
```
Boot, and then you can see the startup log in the user_data/logs/freqtrade.log file. The telegram robot will also print out logs.
### Profitable strategy

This website lists some strategies that can generate stable profits. If you are interested, you can click the link below to get the code.

[https://saber2pr.top/freqer/](https://saber2pr.top/freqer/)

### Back test
Finally, let's talk about the back test. Freqtrade provides the back test function. I can only say that it can only verify whether the code logic of the policy file has bug. The income gap between the return test and the normal test is still quite obvious. It is recommended that the actual environment dry-run is stable for a period of time before opening a real account.