from django.shortcuts import render

from .models import Product, ProductDetail, Order, Category, CategoryManager
from .serializers import ProductSerializer, ProductDetailSerializer, OrderSerializer, CategorySerializer, CommentSerializer, ProductRatingSerializer
from rest_framework import generics

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework import status
from django.http import Http404
# from rest_framework import permissions
from rest_framework.decorators import api_view
import stripe


stripe.api_key = 'sk_test_51HtMtlDewreRBzr0Qd8XUsJ1gdE7lqewjL8eD2io33MDZVlSNBXmuwR0ERXeV86bFKWoRbCesRvKv649FPskOyoo00xPVJBk7v'


@api_view(['POST'])
def test_payment(request):
    test_payment_intent = stripe.PaymentIntent.create(
        amount=1000, currency='pln',
        payment_method_types=['card'],
        receipt_email='test@example.com')
    return Response(status=status.HTTP_200_OK, data=test_payment_intent)


@api_view(['POST'])
def create_checkout_session(request):
    print(request.data)
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': 'Food',
                },
                'unit_amount': request.data['unit_amount'],
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url='https://bubble-sort-drink.herokuapp.com/#/OrderStatuspage/' + request.data['ref_code'],
        cancel_url='https://bubble-sort-drink.herokuapp.com/#/',
    )

    return Response(status=status.HTTP_200_OK, data=session.id)


class RatingDetail(APIView):
    """
    Retrieve, update or delete an product rating instance.
    """

    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        product = self.get_object(pk)
        serializer = ProductRatingSerializer(product)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        product = self.get_object(pk)
        serializer = ProductRatingSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderCommentDetail(APIView):
    """
    Retrieve, update an order comment instance.
    """

    def get_object(self, pk):
        try:
            return Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        order = self.get_object(pk)
        serializer = CommentSerializer(order)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        order = self.get_object(pk)
        serializer = CommentSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save(customer=self.request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderList(APIView):
    """
    List all orders, or create a new order.
    """
    # permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = OrderSerializer(data=request.data)
        print('order serializer = ', serializer)
        if serializer.is_valid():
            print('is_valid')
            serializer.save(customer=self.request.user)
            print('is saved')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderDetail(APIView):
    """
    Retrieve, update or delete an order instance.
    """

    def get_object(self, pk):
        try:
            return Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        order = self.get_object(pk)
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        order = self.get_object(pk)
        serializer = OrderSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save(customer=self.request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        order = self.get_object(pk)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserIDView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({'userID': request.user.id}, status=HTTP_200_OK)


# product list/create
class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# product form data
class ProductView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        products = Product.objects.all().order_by('order')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):

        # try:
        # category = Category.objects.get(name=request.)
        # except:
        #     return Response(status=status.HTTP_404_NOT_FOUND)
        # request.data['category'] = category
        products_serializer = ProductSerializer(data=request.data)
        if products_serializer.is_valid():
            products_serializer.save()
            return Response(products_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', products_serializer.errors)
            return Response(products_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# product retrieve/update/destroy
class ProductRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer   


# category list/create
class CategoryListCreate(generics.ListCreateAPIView):
    queryset = Category.objects.all().order_by('order')
    serializer_class = CategorySerializer 

# category retrieve/update/destroy
class CategoryRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer 

# categoryManager retrieve/update/destroy
# class CategoryManagerRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
#     queryset = CategoryManager.objects.all()
#     serializer_class = CategoryManagerSerializer 

# productDetail list/create


class ProductDetailListCreate(generics.ListCreateAPIView):
    queryset = ProductDetail.objects.all()
    serializer_class = ProductDetailSerializer

# productDetail retrieve/update/destroy


class ProductDetailRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductDetail.objects.all()
    serializer_class = ProductDetailSerializer

# order list/create


class OrderListCreate(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

# order retrieve/update/destroy


class OrderRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
