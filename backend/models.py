from django.db import models, transaction
from django.db.models import F, Max
from django.contrib.auth.models import User
from django.core.validators import int_list_validator


class CategoryManager(models.Manager):
    # """ Manager to encapsulate bits of business logic """

    def move(self, obj, new_order):
        # """ Move an object to a new order position """

        qs = self.get_queryset()

        with transaction.atomic():
            if obj.order > int(new_order):
                qs.filter(
                    order__lt=obj.order,
                    order__gte=new_order,
                ).exclude(
                    pk=obj.pk
                ).update(
                    order=F('order') + 1,
                )
            else:
                qs.filter(
                    order__lte=new_order,
                    order__gt=obj.order,
                ).exclude(
                    pk=obj.pk,
                ).update(
                    order=F('order') - 1,
                )

            obj.order = new_order
            obj.save()

    def create(self, **kwargs):
        instance = self.model(**kwargs)

        with transaction.atomic():
            # Get our current max order number
            results = self.aggregate(
                Max('order')
            )

            # Increment and use it for our new object
            current_order = results['order__max']
            if current_order is None:
                current_order = 0

            value = current_order + 1
            instance.order = value
            instance.save()

            return instance


class Category(models.Model):
    name = models.CharField(max_length=100)
    order = models.IntegerField(default=1)
    objects = CategoryManager()

    def __str__(self):
        return self.name


class ProductManager(models.Manager):
    # """ Manager to encapsulate bits of business logic """

    def move(self, obj, new_order):
        # """ Move an object to a new order position """

        qs = self.get_queryset()

        with transaction.atomic():
            if obj.order > int(new_order):
                qs.filter(
                    category=obj.category,
                    order__lt=obj.order,
                    order__gte=new_order,
                ).exclude(
                    pk=obj.pk
                ).update(
                    order=F('order') + 1,
                )
            else:
                qs.filter(
                    category=obj.category,
                    order__lte=new_order,
                    order__gt=obj.order,
                ).exclude(
                    pk=obj.pk,
                ).update(
                    order=F('order') - 1,
                )

            obj.order = new_order
            obj.save()

    def create(self, **kwargs):
        instance = self.model(**kwargs)

        with transaction.atomic():
            # Get our current max order number
            results = self.filter(
                category=instance.category
            ).aggregate(
                Max('order')
            )

            # Increment and use it for our new object
            current_order = results['order__max']
            if current_order is None:
                current_order = 0

            value = current_order + 1
            instance.order = value
            instance.save()

            return instance
    

CATEGORY_CHOICES = (
    ('0', 'Milk Tea'),
    ('1', 'Slush'),
    ('2', 'Yogurt'),
    ('3', 'Milk Strike'),
    ('4', 'Punch'),
    ('5', 'Specials')
)

STATUS_CHOICES = (
    ('0', 'Processing'),
    ('1', 'Preparing'),
    ('2', 'Delivering'),
    ('3', 'Arriving'),
    ('4', 'Arrived')
)


class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=120)
    list_price = models.FloatField()
    category = models.ForeignKey(Category, related_name='product_category', on_delete=models.CASCADE, null=True)
    image = models.ImageField(upload_to='product_images', blank=True)
    order = models.IntegerField(default=1)
    objects = ProductManager()
    rating_count = models.IntegerField(default=1)

    ratings = models.FloatField()
    rating_count = models.IntegerField(default=1)

    class Meta:
        index_together = ('category', 'order')

    def __str__(self):
        return 'Product(name = {})'.format(self.name)
        # return 'Product(id= ' + str(self.id) + ', name=' + self.name + '),'

class ProductDetail(models.Model):
    product = models.ForeignKey(Product, related_name='productDetail_product', on_delete=models.CASCADE, null=True)
    quantity = models.IntegerField()
    price = models.FloatField(null = True)
    productName = models.CharField(max_length=200, null=True)

    def __str__(self):
        return "{} of {}".format(self.quantity, self.product.name)


class Order(models.Model):
    ref_code = models.CharField(max_length=20, primary_key=True, default="")
    customer = models.ForeignKey(
        User, related_name='order_customer', on_delete=models.CASCADE, null=True)
    products = models.ManyToManyField(
        ProductDetail, related_name='order_productDetails')
    status = models.CharField(
        choices=STATUS_CHOICES,
        max_length=2,
        default='0',
    )
    totalPrice = models.FloatField()
    address = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)
    comment = models.CharField(max_length=200, default="")
    customer_name = models.CharField(max_length=100, default="")


    def __str__(self):
        return "{}'s order with ref_code {}".format(self.customer.username, self.ref_code)
