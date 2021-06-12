__author__ = 'com'

from django.conf.urls import url
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('about_us', views.about_us, name='about_us'),
    path('services', views.services, name='services'),
    path('contact', views.contact, name='contact'),
    path('testimonials', views.testimonials, name='testimonials'),
]
