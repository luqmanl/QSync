import json
from channels.testing import WebsocketCommunicator
from django.test import SimpleTestCase
from router.asgi import application
from channels.layers import get_channel_layer
import random


class TestConsumers(SimpleTestCase):

    async def test_trade_table_consumer(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/trade/')
        connected, _subprotocol = await communicator.connect()

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

    async def test_basis_table_consumer(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/basis/')
        connected, _subprotocol = await communicator.connect()

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
        self.assertTrue(await communicator.receive_nothing(0.5, 0.05))

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
        # test exact json values
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

    async def test_l2overview_consumer(self):
        return
        communicator = WebsocketCommunicator(
            application, 'ws/data/l2overview/')
        connected, _subprotocol = await communicator.connect()

        await communicator.send_json_to({"exchanges": ['BINANCE', 'COINBASE', 'BITFINEX'], "pairs": ['BTC-USDT', 'ETH-USDT']})
        while await communicator.receive_nothing() is True:
            pass
        response = await communicator.receive_json_from()

        self.assertIn(response['exchange'], [
                      'BINANCE', 'COINBASE', 'BITFINEX'])
        self.assertIn(response['sym'], ['BTC-USDT', 'ETH-USDT'])
        self.assertIsInstance(response['highestBid'], float)
        self.assertIsInstance(response['lowestAsk'], float)
        self.assertIsInstance(response['volume'], float)
        self.assertIsInstance(response['imbalance'], float)

        self.assertLessEqual(response['highestBid'], response['lowestAsk'])

        await communicator.disconnect()

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
