from django.urls import path
from .views import tenant_list, simulated_pms_integration_transactions_api, transaction_list, tenant_detail

urlpatterns = [
    path('tenants/', tenant_list, name='tenant_list'),
    path('transactions/', transaction_list, name='transaction_list'),
    path('simulated-pms-integration-api/transactions/', simulated_pms_integration_transactions_api, name='Simulated PMS Integration Transactions'),
] 