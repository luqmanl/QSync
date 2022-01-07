import json
from channels.testing import WebsocketCommunicator
from django.test import SimpleTestCase
from router.asgi import application
from channels.layers import get_channel_layer
import random
from mock import patch


class TestTradeConsumer(SimpleTestCase):
    async def test_trade_table_consumer_sends_update(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/trade/')
        await communicator.connect()

        await communicator.send_json_to({"exchange": 'BINANCE', "pair": 'BTC-USDT', })

        channel_group = 'BINANCE_BTC-USDT_trade'
        data = {
            'sym': 'BTC-USDT',
            'exchange': 'BINANCE',
            'timestamp': 30234.0,
            'price': 9254.23,
            'amount': 5623.6,
            'side': 'buy'
        }
        await get_channel_layer().group_send(channel_group, {"type": f"send_trade_data", "data": json.dumps(data)})

        response = await communicator.receive_json_from()
        self.assertEqual(response['sym'], "BTC-USDT")
        self.assertEqual(response['exchange'], "BINANCE")
        self.assertIn(response['side'], ['buy', 'sell'])
        self.assertIsInstance(response['timestamp'], float)
        self.assertIsInstance(response['price'], float)
        self.assertIsInstance(response['amount'], float)

        await communicator.disconnect()

    async def test_trade_table_consumer_ignores_irrelevent_exchange_updates(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/trade/')
        await communicator.connect()

        await communicator.send_json_to({"exchange": 'BINANCE', "pair": 'BTC-USDT', })

        channel_group = 'COINBASE_BTC-USDT_trade'
        data = {
            'sym': 'BTC-USDT',
            'exchange': 'COINBASE',
            'timestamp': 30234.0,
            'price': 9254.23,
            'amount': 5623.6,
            'side': 'buy'
        }
        await get_channel_layer().group_send(channel_group, {"type": f"send_trade_data", "data": json.dumps(data)})

        self.assertTrue(await communicator.receive_nothing())

        await communicator.disconnect()

    async def test_trade_table_consumer_ignores_irrelevent_pair_updates(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/trade/')
        await communicator.connect()

        await communicator.send_json_to({"exchange": 'COINBASE', "pair": 'BTC-USDT', })

        channel_group = 'COINBASE_ETH_USDT_trade'
        data = {
            'sym': 'ETH-USDT',
            'exchange': 'COINBASE',
            'timestamp': 30234.0,
            'price': 9254.23,
            'amount': 5623.6,
            'side': 'buy'
        }
        await get_channel_layer().group_send(channel_group, {"type": f"send_trade_data", "data": json.dumps(data)})

        self.assertTrue(await communicator.receive_nothing())

        await communicator.disconnect()

    async def test_trade_table_consumer_ignores_irrelevent_datatype_updates(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/trade/')
        await communicator.connect()

        await communicator.send_json_to({"exchange": 'BINANCE', "pair": 'BTC-USDT', })

        channel_group = 'COINBASE_BTC-USDT_basis'
        data = {
            'sym': 'BTC-USDT',
            'exchange': 'COINBASE',
            'timestamp': 30234.0,
            'price': 9254.23,
            'amount': 5623.6,
            'side': 'buy'
        }
        await get_channel_layer().group_send(channel_group, {"type": f"send_trade_data", "data": json.dumps(data)})

        self.assertTrue(await communicator.receive_nothing())

        await communicator.disconnect()


class TestBasisTableConsumer(SimpleTestCase):
    async def test_basis_table_consumer_calculates_single_basis_value(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/basis/')
        await communicator.connect()

        await communicator.send_json_to({"futures_exchanges": ['KRAKEN_FUTURES'], "spot_exchanges": ['BINANCE'], "spot_pairs": ['BTC-USDT'], "futures_pairs": ['BTC-USD-PERP']})

        channel_group = 'KRAKEN_FUTURES_BTC-USD-PERP_basis'
        future_data = {
            'sym': 'BTC-USD-PERP',
            'exchange': 'KRAKEN_FUTURES',
            'bids': [random.uniform(100, 1000) for i in range(10)],
            'asks': [random.uniform(100, 1000) for i in range(10)],
            'bidSizes': [random.uniform(100, 1000) for i in range(10)],
            'askSizes': [random.uniform(100, 1000) for i in range(10)],
        }

        await get_channel_layer().group_send(channel_group, {"type": f"send_basis_data", "data": json.dumps(future_data)})

        channel_group = 'BINANCE_BTC-USDT_basis'
        spot_data = {
            'sym': 'BTC-USDT',
            'exchange': 'BINANCE',
            'bids': [random.uniform(100, 1000) for i in range(10)],
            'asks': [random.uniform(100, 1000) for i in range(10)],
            'bidSizes': [random.uniform(100, 1000) for i in range(10)],
            'askSizes': [random.uniform(100, 1000) for i in range(10)],
        }
        await get_channel_layer().group_send(channel_group, {"type": f"send_basis_data", "data": json.dumps(spot_data)})

        future_mid_price = (future_data['bids']
                            [0] + future_data['asks'][0]) / 2
        spot_mid_price = (spot_data['bids'][0] + spot_data['asks'][0]) / 2
        expected_basis_value = spot_mid_price - future_mid_price

        response = await communicator.receive_json_from()
        response = response['basisAdditions']
        self.assertTrue(len(response) == 1)
        response = response[0]
        self.assertEqual(response['sym'], "BTC-USDT")
        self.assertEqual(response['spotExchange'], "BINANCE")
        self.assertEqual(response['futureExchange'], "KRAKEN_FUTURES")
        self.assertEqual(response['basisValue'], expected_basis_value)

        await communicator.disconnect()

    async def test_basis_table_consumer_calculates_multiple_basis_values(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/basis/')
        await communicator.connect()

        await communicator.send_json_to({"futures_exchanges": ['KRAKEN_FUTURES', 'OKEX'], "spot_exchanges": ['BINANCE', 'COINBASE'], "spot_pairs": ['BTC-USDT'], "futures_pairs": ['BTC-USD-PERP']})

        channel_group = 'KRAKEN_FUTURES_BTC-USD-PERP_basis'
        future_data = {
            'sym': 'BTC-USD-PERP',
            'exchange': 'KRAKEN_FUTURES',
            'bids': [random.uniform(100, 1000) for i in range(10)],
            'asks': [random.uniform(100, 1000) for i in range(10)],
            'bidSizes': [random.uniform(100, 1000) for i in range(10)],
            'askSizes': [random.uniform(100, 1000) for i in range(10)],
        }
        kraken_mid_price = (future_data['bids']
                            [0] + future_data['asks'][0]) / 2
        await get_channel_layer().group_send(channel_group, {"type": f"send_basis_data", "data": json.dumps(future_data)})

        channel_group = 'OKEX_BTC-USD-PERP_basis'
        future_data = {
            'sym': 'BTC-USD-PERP',
            'exchange': 'OKEX',
            'bids': [random.uniform(100, 1000) for i in range(10)],
            'asks': [random.uniform(100, 1000) for i in range(10)],
            'bidSizes': [random.uniform(100, 1000) for i in range(10)],
            'askSizes': [random.uniform(100, 1000) for i in range(10)],
        }
        okex_mid_price = (future_data['bids']
                          [0] + future_data['asks'][0]) / 2
        await get_channel_layer().group_send(channel_group, {"type": f"send_basis_data", "data": json.dumps(future_data)})

        channel_group = 'BINANCE_BTC-USDT_basis'
        spot_data = {
            'sym': 'BTC-USDT',
            'exchange': 'BINANCE',
            'bids': [random.uniform(100, 1000) for i in range(10)],
            'asks': [random.uniform(100, 1000) for i in range(10)],
            'bidSizes': [random.uniform(100, 1000) for i in range(10)],
            'askSizes': [random.uniform(100, 1000) for i in range(10)],
        }
        await get_channel_layer().group_send(channel_group, {"type": f"send_basis_data", "data": json.dumps(spot_data)})

        spot_mid_price = (spot_data['bids'][0] + spot_data['asks'][0]) / 2

        response = await communicator.receive_json_from()
        response = response['basisAdditions']
        self.assertTrue(len(response) == 2)

        self.assertEqual(response[0]['sym'], "BTC-USDT")
        self.assertEqual(response[0]['spotExchange'], "BINANCE")
        self.assertEqual(response[0]['futureExchange'], "KRAKEN_FUTURES")
        self.assertEqual(response[0]['basisValue'],
                         spot_mid_price - kraken_mid_price)

        self.assertEqual(response[1]['sym'], "BTC-USDT")
        self.assertEqual(response[1]['spotExchange'], "BINANCE")
        self.assertEqual(response[1]['futureExchange'], "OKEX")
        self.assertEqual(response[1]['basisValue'],
                         spot_mid_price - okex_mid_price)

        await communicator.disconnect()

    async def test_basis_table_consumer_calculates_updated_basis_value(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/basis/')
        await communicator.connect()

        await communicator.send_json_to({"futures_exchanges": ['KRAKEN_FUTURES'], "spot_exchanges": ['BINANCE'], "spot_pairs": ['BTC-USDT'], "futures_pairs": ['BTC-USD-PERP']})

        channel_group = 'KRAKEN_FUTURES_BTC-USD-PERP_basis'
        future_data = {
            'sym': 'BTC-USD-PERP',
            'exchange': 'KRAKEN_FUTURES',
            'bids': [random.uniform(100, 1000) for i in range(10)],
            'asks': [random.uniform(100, 1000) for i in range(10)],
            'bidSizes': [random.uniform(100, 1000) for i in range(10)],
            'askSizes': [random.uniform(100, 1000) for i in range(10)],
        }

        await get_channel_layer().group_send(channel_group, {"type": "send_basis_data", "data": json.dumps(future_data)})

        channel_group = 'BINANCE_BTC-USDT_basis'
        spot_data = {
            'sym': 'BTC-USDT',
            'exchange': 'BINANCE',
            'bids': [random.uniform(100, 1000) for i in range(10)],
            'asks': [random.uniform(100, 1000) for i in range(10)],
            'bidSizes': [random.uniform(100, 1000) for i in range(10)],
            'askSizes': [random.uniform(100, 1000) for i in range(10)],
        }
        await get_channel_layer().group_send(channel_group, {"type": "send_basis_data", "data": json.dumps(spot_data)})

        await communicator.receive_json_from()

        channel_group = 'BINANCE_BTC-USDT_basis'
        spot_data = {
            'sym': 'BTC-USDT',
            'exchange': 'BINANCE',
            'bids': [random.uniform(100, 1000) for i in range(10)],
            'asks': [random.uniform(100, 1000) for i in range(10)],
            'bidSizes': [random.uniform(100, 1000) for i in range(10)],
            'askSizes': [random.uniform(100, 1000) for i in range(10)],
        }
        await get_channel_layer().group_send(channel_group, {"type": f"send_basis_data", "data": json.dumps(spot_data)})

        future_mid_price = (future_data['bids']
                            [0] + future_data['asks'][0]) / 2
        spot_mid_price = (spot_data['bids'][0] + spot_data['asks'][0]) / 2
        expected_basis_value = spot_mid_price - future_mid_price

        response = await communicator.receive_json_from()
        response = response['basisAdditions']
        self.assertTrue(len(response) == 1)
        response = response[0]
        self.assertEqual(response['sym'], "BTC-USDT")
        self.assertEqual(response['spotExchange'], "BINANCE")
        self.assertEqual(response['futureExchange'], "KRAKEN_FUTURES")
        self.assertEqual(response['basisValue'], expected_basis_value)

        await communicator.disconnect()

    async def test_basis_table_consumer_does_not_send_empty_basis_updates(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/basis/')
        await communicator.connect()

        await communicator.send_json_to({"futures_exchanges": ['KRAKEN_FUTURES'], "spot_exchanges": ['BINANCE', 'COINBASE'], "spot_pairs": ['BTC-USDT'], "futures_pairs": ['BTC-USD-PERP']})

        channel_group = 'BINANCE_BTC-USDT_basis'
        future_data = {
            'sym': 'BTC-USDT',
            'exchange': 'BINANCE',
            'bids': [random.uniform(100, 1000) for i in range(10)],
            'asks': [random.uniform(100, 1000) for i in range(10)],
            'bidSizes': [random.uniform(100, 1000) for i in range(10)],
            'askSizes': [random.uniform(100, 1000) for i in range(10)],
        }

        await get_channel_layer().group_send(channel_group, {"type": f"send_basis_data", "data": json.dumps(future_data)})
        self.assertTrue(await communicator.receive_nothing())

        channel_group = 'COINBASE_BTC-USDT-basis'
        future_data = {
            'sym': 'BTC-USDT',
            'exchange': 'COINBASE',
            'bids': [random.uniform(100, 1000) for i in range(10)],
            'asks': [random.uniform(100, 1000) for i in range(10)],
            'bidSizes': [random.uniform(100, 1000) for i in range(10)],
            'askSizes': [random.uniform(100, 1000) for i in range(10)],
        }

        await get_channel_layer().group_send(channel_group, {"type": f"send_basis_data", "data": json.dumps(future_data)})
        self.assertTrue(await communicator.receive_nothing())

        await communicator.disconnect()

    async def test_basis_table_consumer_ignores_irrelevent_exchange_updates(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/basis/')
        await communicator.connect()

        await communicator.send_json_to({"futures_exchanges": ['KRAKEN_FUTURES', 'DERIBIT'], "spot_exchanges": ['BINANCE', 'COINBASE'], "spot_pairs": ['BTC-USDT'], "futures_pairs": ['BTC-USD-PERP']})

        channel_group = 'OKEX_BTC-USD-PERP_basis'
        future_data = {
            'sym': 'BTC-USD-PERP',
            'exchange': 'OKEX',
            'bids': [random.uniform(100, 1000) for i in range(10)],
            'asks': [random.uniform(100, 1000) for i in range(10)],
            'bidSizes': [random.uniform(100, 1000) for i in range(10)],
            'askSizes': [random.uniform(100, 1000) for i in range(10)],
        }

        await get_channel_layer().group_send(channel_group, {"type": f"send_basis_data", "data": json.dumps(future_data)})
        self.assertTrue(await communicator.receive_nothing())

        await communicator.disconnect()

    async def test_basis_table_consumer_ignores_irrelevent_pair_updates(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/basis/')
        await communicator.connect()

        await communicator.send_json_to({"futures_exchanges": ['KRAKEN_FUTURES', 'OKEX'], "spot_exchanges": ['BINANCE', 'COINBASE'], "spot_pairs": ['BTC-USDT'], "futures_pairs": ['BTC-USD-PERP']})

        channel_group = 'OKEX_ETH-USD-PERP_basis'
        future_data = {
            'sym': 'ETH-USD-PERP',
            'exchange': 'OKEX',
            'bids': [random.uniform(100, 1000) for i in range(10)],
            'asks': [random.uniform(100, 1000) for i in range(10)],
            'bidSizes': [random.uniform(100, 1000) for i in range(10)],
            'askSizes': [random.uniform(100, 1000) for i in range(10)],
        }

        await get_channel_layer().group_send(channel_group, {"type": f"send_basis_data", "data": json.dumps(future_data)})
        self.assertTrue(await communicator.receive_nothing())

        await communicator.disconnect()

    async def test_basis_table_consumer_ignores_irrelevent_datatype_updates(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/basis/')
        await communicator.connect()

        await communicator.send_json_to({"futures_exchanges": ['KRAKEN_FUTURES', 'OKEX'], "spot_exchanges": ['BINANCE', 'COINBASE'], "spot_pairs": ['BTC-USDT'], "futures_pairs": ['BTC-USD-PERP']})

        channel_group = 'OKEX_BTC-USDT_l2overview'
        future_data = {
            'sym': 'BTC-USD-PERP',
            'exchange': 'OKEX',
            'bids': [random.uniform(100, 1000) for i in range(10)],
            'asks': [random.uniform(100, 1000) for i in range(10)],
            'bidSizes': [random.uniform(100, 1000) for i in range(10)],
            'askSizes': [random.uniform(100, 1000) for i in range(10)],
        }

        await get_channel_layer().group_send(channel_group, {"type": f"send_basis_data", "data": json.dumps(future_data)})
        self.assertTrue(await communicator.receive_nothing())

        await communicator.disconnect()


class TestL2overviewConsumer(SimpleTestCase):
    @patch('app.consumers.QConnection')
    async def test_l2overview_consumer_sends_multiple_exchange_updates(self, mock_q):
        mock_q.return_value.sendSync.return_value = 13256.0
        communicator = WebsocketCommunicator(
            application, 'ws/data/l2overview/')
        await communicator.connect()

        await communicator.send_json_to({"exchanges": ['BINANCE', 'COINBASE', 'BITFINEX'], "pairs": ['BTC-USDT']})
        self.assertTrue(await communicator.receive_nothing())

        channel_group = "BINANCE_BTC-USDT_l2overview"
        data = {
            'sym': 'BTC-USDT',
            'exchange': 'BINANCE',
            'bids': [random.uniform(100, 1000) for i in range(10)],
            'asks': [random.uniform(100, 1000) for i in range(10)],
            'bidSizes': [random.uniform(100, 1000) for i in range(10)],
            'askSizes': [random.uniform(100, 1000) for i in range(10)],
        }
        await get_channel_layer().group_send(channel_group, {"type": f"send_l2overview_data", "data": json.dumps(data)})

        response = await communicator.receive_json_from()

        self.assertIn(response['exchange'], [
                      'BINANCE', 'COINBASE', 'BITFINEX'])
        self.assertIn(response['sym'], ['BTC-USDT', 'ETH-USDT'])
        self.assertEqual(response['highestBid'], data['bids'][0])
        self.assertEqual(response['lowestAsk'], data['asks'][0])
        self.assertIsInstance(response['volume'], float)
        expected_imbalance = (data['bidSizes'][0] - data['askSizes']
                              [0]) / (data['bidSizes'][0] + data['askSizes'][0])
        self.assertEqual(response['imbalance'], expected_imbalance)

        await communicator.disconnect()


class TestL2orderbookConsumer(SimpleTestCase):

    async def test_l2orderbook_consumer(self):
        return
        communicator = WebsocketCommunicator(
            application, 'ws/data/l2orderbook/')
        connected, _subprotocol = await communicator.connect()

        await communicator.send_json_to({"exchange": 'COINBASE', "pair": 'ETH-USDT'})
        while await communicator.receive_nothing() is True:
            pass
        response = await communicator.receive_json_from()

        self.assertEqual(response['sym'], "ETH-USDT")
        self.assertEqual(response['exchange'], "COINBASE")
        self.assertIsInstance(response['bids'], list)
        self.assertIsInstance(response['bids'][0], float)
        self.assertIsInstance(response['asks'], list)
        self.assertIsInstance(response['asks'][0], float)
        self.assertIsInstance(response['bidSizes'], list)
        self.assertIsInstance(response['bidSizes'][0], float)
        self.assertIsInstance(response['askSizes'], list)
        self.assertIsInstance(response['askSizes'][0], float)

        self.assertEqual(len(response['bids']), 10)
        self.assertEqual(len(response['bidSizes']), 10)
        self.assertEqual(len(response['asks']), 10)
        self.assertEqual(len(response['askSizes']), 10)

        await communicator.disconnect()
