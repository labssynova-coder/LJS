from django.contrib.auth import password_validation
from django.contrib.auth.forms import (
    UserCreationForm, AuthenticationForm, UsernameField,
    PasswordChangeForm as AuthPasswordChangeForm,
    PasswordResetForm as AuthPasswordResetForm,
    SetPasswordForm as AuthSetPasswordForm,
)
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django import forms
from django.utils.translation import gettext_lazy as _
from store.models import Address


class RegistrationForm(UserCreationForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={'class': 'form-control form-control-lg', 'placeholder': 'Password', 'autocomplete': 'new-password'}))
    password2 = forms.CharField(label="Confirm Password", widget=forms.PasswordInput(attrs={'class': 'form-control form-control-lg', 'placeholder': 'Confirm Password', 'autocomplete': 'new-password'}))
    email = forms.CharField(required=True, widget=forms.EmailInput(attrs={'class': 'form-control form-control-lg', 'placeholder': 'Email Address'}))

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
        labels = {'email': 'Email'}
        widgets = {'username': forms.TextInput(attrs={'class': 'form-control form-control-lg', 'placeholder': 'Username'})}

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email and User.objects.filter(email=email).exists():
            raise ValidationError("A user with that email already exists.")
        return email


class LoginForm(AuthenticationForm):
    username = UsernameField(widget=forms.TextInput(attrs={'autofocus': True, 'class': 'form-control form-control-lg', 'autocomplete': 'username'}))
    password = forms.CharField(label=_("Password"), strip=False, widget=forms.PasswordInput(attrs={'autocomplete': 'current-password', 'class': 'form-control form-control-lg'}))


class AddressForm(forms.ModelForm):
    class Meta:
        model = Address
        fields = ['locality', 'city', 'state', 'phone']
        widgets = {
            'locality': forms.TextInput(attrs={'class': 'form-control form-control-lg', 'placeholder': 'Popular Place like Restaurant, Religious Site, etc.'}),
            'city': forms.TextInput(attrs={'class': 'form-control form-control-lg', 'placeholder': 'City'}),
            'state': forms.TextInput(attrs={'class': 'form-control form-control-lg', 'placeholder': 'State or Province'}),
            'phone': forms.TextInput(attrs={'class': 'form-control form-control-lg', 'placeholder': 'Phone Number'}),
        }


class CustomPasswordChangeForm(AuthPasswordChangeForm):
    old_password = forms.CharField(label=_("Old Password"), strip=False, widget=forms.PasswordInput(attrs={'autocomplete': 'current-password', 'auto-focus': True, 'class': 'form-control form-control-lg', 'placeholder': 'Current Password'}))
    new_password1 = forms.CharField(label=_("New Password"), strip=False, widget=forms.PasswordInput(attrs={'autocomplete': 'new-password', 'class': 'form-control form-control-lg', 'placeholder': 'New Password'}), help_text=password_validation.password_validators_help_text_html())
    new_password2 = forms.CharField(label=_("Confirm Password"), strip=False, widget=forms.PasswordInput(attrs={'autocomplete': 'new-password', 'class': 'form-control form-control-lg', 'placeholder': 'Confirm Password'}))


class CustomPasswordResetForm(AuthPasswordResetForm):
    email = forms.EmailField(label=_("Email"), max_length=254, widget=forms.EmailInput(attrs={'autocomplete': 'email', 'class': 'form-control form-control-lg'}))


class CustomSetPasswordForm(AuthSetPasswordForm):
    new_password1 = forms.CharField(label=_("New Password"), strip=False, widget=forms.PasswordInput(attrs={'autocomplete': 'new-password', 'class': 'form-control form-control-lg'}), help_text=password_validation.password_validators_help_text_html())
    new_password2 = forms.CharField(label=_("Confirm Password"), strip=False, widget=forms.PasswordInput(attrs={'autocomplete': 'new-password', 'class': 'form-control form-control-lg'}))