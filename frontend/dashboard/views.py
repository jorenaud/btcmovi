from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def check_key(key, dict_obj):
    if key not in dict_obj:
        return False
    return True


def get_menu_data():
    data = [
        {'id': 0,
         'url': '/',
         'name': 'start'},
        {'id': 1,
         'url': '/about_us',
         'name': 'about'},
        {'id': 2,
         'url': '/testimonials',
         'name': 'epistolia'}
    ]
    return data


def index(request):
    menu_data = get_menu_data()
    data = {
        "title": "BTCmovi.com - Bitcoin move easy",
        "activated_menu": 0,
        "activated_url": menu_data[0]['url'],
        "menu_data": menu_data,
    }
    template_name = 'dashboard/index.html'
    return render(request, template_name, data)


def about_us(request):
    menu_data = get_menu_data()
    data = {
        "title": "About us - Bitcoin move easy",
        "activated_menu": 1,
        "activated_url": menu_data[1]['url'],
        "menu_data": menu_data,
    }
    template_name = 'dashboard/about_us.html'
    return render(request, template_name, data)


def services(request):
    menu_data = get_menu_data()
    data = {
        "title": "Services - Bitcoin move easy",
        "activated_menu": 2,
        "activated_url": menu_data[2]['url'],
        "menu_data": menu_data,
    }
    template_name = 'dashboard/services.html'
    return render(request, template_name, data)


def contact(request):
    menu_data = get_menu_data()
    data = {
        "title": "Contacts - Bitcoin move easy",
        "activated_menu": 3,
        "activated_url": menu_data[3]['url'],
        "menu_data": menu_data,
    }
    template_name = 'dashboard/contact.html'
    return render(request, template_name, data)


def testimonials(request):
    menu_data = get_menu_data()
    data = {
        "title": "Testimonials - Bitcoin move easy",
        "activated_menu": 2,
        "activated_url": menu_data[2]['url'],
        "menu_data": menu_data,
    }
    template_name = 'dashboard/testimonials.html'
    return render(request, template_name, data)

