from django.test.testcases import SimpleTestCase
from django.urls.base import reverse


class TestViews(SimpleTestCase):
    def test_historical_basis_data(self):
        url = reverse('historicalBasisData')
        response = self.client.get(url)
