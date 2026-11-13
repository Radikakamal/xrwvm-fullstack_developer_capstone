import os
# Uncomment the required imports before adding the code

# from django.shortcuts import render
# from django.http import HttpResponseRedirect, HttpResponse
# from django.contrib.auth.models import User
# from django.shortcuts import get_object_or_404, render, redirect
# from django.contrib.auth import logout
# from django.contrib import messages
# from datetime import datetime

from django.http import JsonResponse
from django.contrib.auth import login, authenticate, logout
import logging
import json
from django.views.decorators.csrf import csrf_exempt
# from .populate import initiate


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.

# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    return JsonResponse(data)

@csrf_exempt
def logout_request(request):
    logout(request)
    return JsonResponse({"status": "Logged out"})

# Create a `registration` view to handle sign up request
# @csrf_exempt
# def registration(request):
# ...

# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
# def get_dealerships(request):
# ...

# Create a `get_dealer_reviews` view to render the reviews of a dealer
# def get_dealer_reviews(request,dealer_id):
# ...

# Create a `get_dealer_details` view to render the dealer details
# def get_dealer_details(request, dealer_id):
# ...

# Create a `add_review` view to submit a review
# def add_review(request):
# ...

# Task 8: Get reviews for a specific dealership
def get_dealer_reviews(request, dealer_id):
    try:
        reviews_file = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "database", "data", "reviews.json"
        )
        with open(reviews_file, "r", encoding="utf-8") as file:
            data = json.load(file)

        reviews = [
            review for review in data.get("reviews", [])
            if str(review.get("dealership")) == str(dealer_id)
        ]
        return JsonResponse(reviews, safe=False)
    except Exception as error:
        return JsonResponse({"error": str(error)}, status=500)

# Task 9: Get all dealerships
def get_dealerships(request):
    try:
        file_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "database", "data", "dealerships.json"
        )
        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)
        return JsonResponse(data.get("dealerships", []), safe=False)
    except Exception as error:
        return JsonResponse({"error": str(error)}, status=500)

# Task 9: Get all dealerships
def get_dealerships(request):
    try:
        file_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "database", "data", "dealerships.json"
        )
        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)
        return JsonResponse(data.get("dealerships", []), safe=False)
    except Exception as error:
        return JsonResponse({"error": str(error)}, status=500)
