from rest_framework import serializers
from .models import Product, ProductDetail, Order, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
    
    def to_representation(self, instance):
        self.fields['category'] =  CategorySerializer(read_only=False)
        return super(ProductSerializer, self).to_representation(instance)


class ProductRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'name', 'ratings', 'rating_count')

    def update(self, instance, validated_data):
        original_product = Product.objects.get(pk=validated_data.get('id', instance.id))
        total = original_product.ratings * original_product.rating_count + validated_data.get('ratings', instance.ratings)
        divider = original_product.rating_count + 1
        new_rating = total / divider

        instance.rating_count = divider
        instance.ratings = new_rating
        instance.save()

        return instance       

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('ref_code', 'customer', 'comment')    

    def update(self, instance, validated_data):
        instance.comment = validated_data.get('comment', instance.comment)
        instance.save()

        return instance    

class ProductDetailSerializer(serializers.ModelSerializer):
    # product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    # product = ProductSerializer()

    class Meta:
        model = ProductDetail
        fields = ('id', 'product', 'quantity', 'productName')

class OrderSerializer(serializers.ModelSerializer):
    products = ProductDetailSerializer(many=True)

    class Meta:
        model = Order
        fields = ('ref_code', 'customer', 'products', 'status', 'totalPrice', 'address', 'comment', 'created_at', 'customer_name')

    # create product details by product name and quantity, 
    # and then create order with product details
    def create(self, validated_data):
        print('validated_data =', validated_data)
        productDetails_data = validated_data.pop('products')
        print('productDetails_data =', productDetails_data)
        order = Order.objects.create(**validated_data)
        print('order =', order)

        for productDetail_data in productDetails_data:
            productDetail = ProductDetail.objects.create(**productDetail_data)
            print('productDetail =', productDetail)
            order.products.add(productDetail)
        
        print('order.products =', order.products)
        
        return order

    def update(self, instance, validated_data):
        productDetails_data = validated_data.pop('products')
        productDetails = (instance.products).all()
        productDetails = list(productDetails)
        instance.customer = validated_data.get('customer', instance.customer)
        instance.status = validated_data.get('status', instance.status)
        instance.totalPrice = validated_data.get('totalPrice', instance.totalPrice)
        instance.address = validated_data.get('address', instance.address)
        instance.save()

        for productDetail_data in productDetails_data:
            productDetail = productDetails.pop(0)
            productDetail.product = productDetail_data.get('product', productDetail.product)
            productDetail.quantity = productDetail_data.get('quantity', productDetail.quantity)
            productDetail.save()
        return instance    
