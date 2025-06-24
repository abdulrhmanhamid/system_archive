from django import forms
from django.contrib.auth.models import User, Group
from django.contrib.auth.forms import UserCreationForm

class CustomUserCreationForm(UserCreationForm):
    full_name = forms.CharField(label="الاسم الرباعي")
    role = forms.ModelChoiceField(queryset=Group.objects.all(), label="الدور")
    status = forms.ChoiceField(choices=[('active', 'نشط'), ('inactive', 'غير نشط')], label="الحالة")

    class Meta:
        model = User
        fields = ('full_name', 'username', 'password1', 'password2', 'role', 'status')