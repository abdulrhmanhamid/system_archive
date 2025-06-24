from .models import SystemSettings

def system_settings_context(request):
    try:
        settings = SystemSettings.objects.first()
    except SystemSettings.DoesNotExist:
        settings = None
    return {
        'system_settings': settings
    }
