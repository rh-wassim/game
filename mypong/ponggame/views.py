from django.shortcuts import render

def index(request):
    return render(request, '2players.html')