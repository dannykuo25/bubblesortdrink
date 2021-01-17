# from backemd.models import Product, ProductDetail, Order
# from .serializers import ProductSerializer, ProductDetailSerializer, OrderSerializer

from backend.models import Product, ProductDetail, Order
from rest_framework import viewsets, permissions, status
from .serializers import ProductSerializer, ProductDetailSerializer, OrderSerializer, CategorySerializer

from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from . import models
from . import serializers

# Order Viewset
class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = OrderSerializer

    def get_queryset(self):
        return self.request.user.order.all()

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

# # Product Viewset
# class ProductViewSet(viewsets.ModelViewSet):
#     permission_classes = [
#         permissions.IsAuthenticated
#     ]

#     serializer_class = ProductSerializer

#     def get_queryset(self):
#         return self.request.user.order.all()

#     def perform_create(self, serializer):
#         serializer.save(customer=self.request.user)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = models.Product.objects.all().order_by('order')
    serializer_class = ProductSerializer
    filter_backends = (DjangoFilterBackend, )
    filter_fields = ('category', )

    @action(methods=['post'], detail=True)
    def move(self, request, pk):
        # """ Move a single Step to a new position """
        obj = self.get_object()
        new_order = request.data.get('order', None)

        # Make sure we received an order 
        if new_order is None:
            return Response(
                data={'error': 'No order given'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Make sure our new order is not below one
        if int(new_order) < 1:
            return Response(
                data={'error': 'Order cannot be zero or below'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        models.Product.objects.move(obj, new_order)

        return Response({'success': True, 'order': new_order})
    

class CatgoryViewSet(viewsets.ModelViewSet):
    queryset = models.Category.objects.all().order_by('order')
    serializer_class = CategorySerializer
    filter_backends = (DjangoFilterBackend, )

    @action(methods=['post'], detail=True)
    def move(self, request, pk):
        # """ Move a single Step to a new position """
        obj = self.get_object()
        new_order = request.data.get('order', None)

        # Make sure we received an order 
        if new_order is None:
            return Response(
                data={'error': 'No order given'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Make sure our new order is not below one
        if int(new_order) < 1:
            return Response(
                data={'error': 'Order cannot be zero or below'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        models.Category.objects.move(obj, new_order)

        return Response({'success': True, 'order': new_order})