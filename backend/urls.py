from django.urls import path
from rest_framework import routers
from . import api
from . import views

router = routers.SimpleRouter()
router.register(r'category', api.CatgoryViewSet)
router.register(r'product', api.ProductViewSet)

urlpatterns = [
    path('api/product/', views.ProductView.as_view() ),
    path('api/product/<int:pk>/', views.ProductRetrieveUpdateDestroy.as_view() ),
    path('api/productDetail/', views.ProductDetailListCreate.as_view() ),
    path('api/productDetail/<int:pk>/', views.ProductDetailRetrieveUpdateDestroy.as_view() ),
    path('api/order/', views.OrderListCreate.as_view() ),
    path('api/order/<pk>/', views.OrderRetrieveUpdateDestroy.as_view() ),
    path('api/category/', views.CategoryListCreate.as_view()),
    path('api/category/<int:pk>/', views.CategoryRetrieveUpdateDestroy.as_view() ),
    path('api/product-rating/<pk>/', views.RatingDetail.as_view() ),
    path('api/order-comment/<pk>/', views.OrderCommentDetail.as_view() ),
    path('api/checkout/', views.create_checkout_session ),
] + router.urls
