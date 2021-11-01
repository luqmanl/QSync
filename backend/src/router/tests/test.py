from django.test import TestCase
from channels.testing import WebsocketCommunicator


class WebsocketTestCase(TestCase):
    def setUp(self):
        self.communicator = WebsocketCommunicator(
            QsyncConsumer.as_asgi(), "/ws/data")

    async def testWebsocketDoesConnect(self):
        """Websocket can be connected end-to-end"""
        connected, subprotocol = await self.communicator.connect()
        assert connected
        await self.communicator.disconnect()

    async def testSendingData(self):
        """ Test data is sent and recieved correctly"""
        # Test sending text
        await self.communicator.send_to(text_data="hello")
        response = await self.communicator.receive_from()
        assert response == "hello"
        # Close
        await self.communicator.disconnect()
