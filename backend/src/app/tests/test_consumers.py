from channels.testing import WebsocketCommunicator
from django.test import SimpleTestCase
from router.asgi import application


class TestTradeTableConsumer(SimpleTestCase):

    async def test_trade_table_consumer(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/trade/')
        connected, _subprotocol = await communicator.connect()

        await communicator.send_json_to({"exchange": 'BINANCE', "pair": 'BTC-USDT', })
        while await communicator.receive_nothing() is True:
            pass
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
        while await communicator.receive_nothing() is True:
            pass
        response = await communicator.receive_json_from()
        response = response['basisAdditions']
        self.assertTrue(len(response) == 1)
        response = response[0]
        self.assertEqual(response['sym'], "BTC-USDT")
        self.assertEqual(response['spotExchange'], "BINANCE")
        self.assertEqual(response['futureExchange'], "KRAKEN_FUTURES")
        self.assertIsInstance(response['basisValue'], float)

        await communicator.disconnect()

    async def test_l2overview_consumer(self):
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
