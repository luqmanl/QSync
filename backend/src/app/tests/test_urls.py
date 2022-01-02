from django.http import response
from django.test.testcases import SimpleTestCase
from django.urls import reverse, resolve
from app.views import getHistoricalBasisData
from mock import patch


class TestUrls(SimpleTestCase):
    @patch('app.views.QConnection')
    def test_historical_basis_data_resolves(self, mock_q):
        mock_q.sendSync.return_value = '[[1.0,2.0,3.0], [4.0,5.0,6.0]]'
        url = reverse('historicalBasisData')
        self.assertEqual(resolve(url).func, getHistoricalBasisData)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
