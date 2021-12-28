from django.http import response
from django.test.testcases import SimpleTestCase
from django.urls import reverse, resolve
from app.views import getHistoricalBasisData


class TestUrls(SimpleTestCase):
    def test_historical_basis_data_resolves(self):
        url = reverse('historicalBasisData')
        self.assertEquals(resolve(url).func, getHistoricalBasisData)
        response = self.client.get(url)
        self.assertEquals(response.status_code, 200)
