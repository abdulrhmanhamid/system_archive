from django.utils import translation
from .models import SystemSettings

class SystemLanguageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            settings = SystemSettings.objects.first()
            if settings and settings.language:
                translation.activate(settings.language)
                request.LANGUAGE_CODE = settings.language
        except:
            pass

        return self.get_response(request)
