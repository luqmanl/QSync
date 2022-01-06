from django.test.testcases import SimpleTestCase
from django.urls.base import reverse
from mock import patch
from app.views import getHistoricalBasisData


class TestViews(SimpleTestCase):
    @patch('app.views.QConnection')
    def test_historical_basis_data(self, mock_q):
        mock_q.return_value.sendSync.return_value = [
            [1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]
        url = reverse(
            'historicalBasisData', args=['hello', 'BTC-USDT', 'BTC-USD-PERP', 'BINANCE', 'OKEX'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
