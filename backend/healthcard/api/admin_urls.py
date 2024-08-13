from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.AdminLogin.as_view(), name='login/'),
    path('verifycard/', views.Admin_VerifyCard.as_view(), name='verifycard/'),
    path('search/', views.Admin_SearchCard.as_view(), name='search/'),
    path('cardslist/', views.Admin_Cardslist.as_view(), name='cardslist'),
    path('viewcard/', views.Admin_ViewCard.as_view(), name='viewcard/'),
    path('addcard/', views.Admin_AddCard.as_view(), name='addcard/'),
    path('deletecard/', views.Admin_DeleteCard.as_view(), name='deletecard/'),
    path('downloadcard/', views.Admin_DownloadCard.as_view(), name='downloadcard/'),
    path('profileview/', views.Admin_Profile.as_view(), name='profileview/'),
    path('updatecard/', views.Admin_UpdateCard.as_view(), name='updatecard/'),
    path('verifytoken/',views.Admin_Verifytoken.as_view(),name='verifytoken/')
]
