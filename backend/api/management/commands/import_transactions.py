from django.core.management.base import BaseCommand, CommandError
from api.models import Transaction, Tenant
import requests
import json
from datetime import datetime

class Command(BaseCommand):
    help = 'Imports transaction data from the integration API into the Django database.'

    def handle(self, *args, **options):
        self.stdout.write('Starting transaction import...')

        # Fetch data from the integration API
        # Assuming the Django development server is running at 8009
        integration_api_url = "http://localhost:8009/api/simulated-pms-integration-api/transactions/"
        try:
            response = requests.get(integration_api_url)
            response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
            transactions_data = response.json()
        except requests.exceptions.RequestException as e:
            self.stderr.write(f'Error fetching data from integration API: {e}')
            return

        for transaction_data in transactions_data:
            tenant_id = transaction_data.get('tenant_id')
            try:
                tenant = Tenant.objects.get(id=tenant_id) # type: ignore
            except Tenant.DoesNotExist: # type: ignore
                self.stderr.write(f'Tenant with ID {tenant_id} not found. Skipping transaction {transaction_data.get("id")}.')
                continue

            # Create or update Transaction object
            # Note: The 'type' field is intentionally omitted here for the candidate to add.
            Transaction.objects.update_or_create( # type: ignore
                id=transaction_data.get('id'), # Assuming 'id' is unique for transactions
                defaults={
                    'tenant': tenant,
                    'date': datetime.strptime(transaction_data.get('date'), '%Y-%m-%d').date(),
                    'description': transaction_data.get('description'),
                    'amount': transaction_data.get('amount'),
                    'type': transaction_data.get('type', 'charge'),
                }
            )
        self.stdout.write('Successfully imported transaction data.') 