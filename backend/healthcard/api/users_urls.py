from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login/'),
    path('signup/', views.SignupView.as_view(), name='signup/'),
    path('generateotp/', views.OTPview.as_view(), name='generateotp/'),
    path('cardslist/', views.Cardslist.as_view(), name='cardslist'),
    path('viewcard/', views.CardView.as_view(), name='viewcard/'),
    path('addcard/', views.AddCard.as_view(), name='addcard/'),
    path('deletecard/', views.DeleteCard.as_view(), name='deletecard/'),
    path('downloadcard/', views.DownlaodCard.as_view(), name='downloadcard/'),
    path('profileview/', views.Profile.as_view(), name='profileview/'),
    path('updatecard/', views.UpdateCard.as_view(), name='updatecard/'),
    path('verifytoken/', views.verifytoken.as_view(), name='verifytoken/'),
    path('sendcard/', views.SendCard.as_view(), name='sendcard/')
]
