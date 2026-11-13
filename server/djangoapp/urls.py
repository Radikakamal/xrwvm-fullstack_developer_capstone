from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'

urlpatterns = [
    path('get_cars', views.get_car_make_and_models, name='get_car_make_and_models'),
    path('dealers/state/<str:state>', views.get_dealers_by_state, name='get_dealers_by_state'),
    path('login', views.login_user, name='login'),
    path('logout', views.logout_request, name='logout'),
    path('get_dealerships', views.get_dealerships, name='get_dealerships'),
    path('dealer/<int:dealer_id>', views.get_dealer_details, name='get_dealer_details'),
    path('reviews/<int:dealer_id>', views.get_dealer_reviews, name='get_dealer_reviews'),
    path('add_review', views.add_review, name='add_review'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)