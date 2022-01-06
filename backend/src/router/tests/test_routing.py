from channels.testing import WebsocketCommunicator
from django.test import SimpleTestCase
from router.asgi import application


class TestRouting(SimpleTestCase):

    async def test_trade_resolves(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/trade/')
        connected, _subprotocol = await communicator.connect()
        self.assertTrue(connected)
        self.assertTrue(await communicator.receive_nothing())
        await communicator.disconnect()

    async def test_basis_resolves(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/basis/')
        connected, _subprotocol = await communicator.connect()
        self.assertTrue(connected)
        self.assertTrue(await communicator.receive_nothing())
        await communicator.disconnect()

    async def test_l2overview_resolves(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/l2overview/')
        connected, _subprotocol = await communicator.connect()
        self.assertTrue(connected)
        self.assertTrue(await communicator.receive_nothing())
        await communicator.disconnect()

    async def test_l2orderbook_resolves(self):
        communicator = WebsocketCommunicator(
            application, 'ws/data/l2orderbook/')
        connected, _subprotocol = await communicator.connect()
        self.assertTrue(connected)
        self.assertTrue(await communicator.receive_nothing())
        await communicator.disconnect()
