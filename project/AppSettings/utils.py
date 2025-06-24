from django.shortcuts import render
from .models import SystemSettings

def render_with_settings(request, template_name, context=None):
    if context is None:
        context = {}
    settings = SystemSettings.objects.first()
    context["system_settings"] = settings
    return render(request, template_name, context)
