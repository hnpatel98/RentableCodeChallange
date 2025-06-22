from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.models import Tenant, Transaction
from api.serializers import TenantSerializer, TransactionSerializer
import json
from django.conf import settings
from pathlib import Path

# Create your views here.

@api_view(['GET'])
def welcome_message(request):
    """
    A simple view to test the API.
    """
    return Response({'message': 'Welcome to the Rentable Code Challenge!'})

@api_view(['GET'])
def tenant_list(request):
    """
    Returns a list of all tenants.
    """
    tenants = Tenant.objects.all() # type: ignore
    serializer = TenantSerializer(tenants, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def tenant_detail(request, pk):
    # Implementation of tenant_detail view
    pass

@api_view(['GET'])
def simulated_pms_integration_transactions_api(request):
    """
    This endpoint simulates an external Property Management System (PMS) API, 
    providing raw transaction data. In a real-world scenario, this data would 
    come from a live integration.
    """
    file_path = settings.BASE_DIR / 'api' / 'integration-data' / 'transactions.json'
    with open(file_path, 'r') as f:
        data = json.load(f)
    return Response(data)

@api_view(['GET'])
def transaction_list(request):
    """
    Returns a list of transactions, optionally filtered by tenant.
    """
    tenant_id = request.query_params.get('tenant_id', None)
    if tenant_id:
        transactions = Transaction.objects.filter(tenant__id=tenant_id) # type: ignore
    else:
        transactions = Transaction.objects.all() # type: ignore
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data) 