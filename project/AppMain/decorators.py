# from django.shortcuts import redirect
# from django.urls import reverse

# def employee_login_required(view_func):
#     def wrapper(request, *args, **kwargs):
#         if 'employee_id' not in request.session:
#             return redirect(reverse('index_sign'))  # ✅ هذا يحل الخطأ
#         return view_func(request, *args, **kwargs)
#     return wrapper

from django.shortcuts import redirect
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from functools import wraps

def employee_login_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if 'employee_id' not in request.session:
            return redirect(reverse('index_sign'))

        # التحقق من آخر نشاط
        last_activity = request.session.get('last_activity')
        if last_activity:
            try:
                last_time = timezone.datetime.fromisoformat(last_activity)
            except Exception:
                request.session.flush()
                return redirect(reverse('index_sign'))

            now = timezone.now()

            if now - last_time > timedelta(minutes=15):
                request.session.flush()
                return redirect(reverse('index_sign'))

        # تحديث وقت آخر نشاط
        request.session['last_activity'] = timezone.now().isoformat()

        return view_func(request, *args, **kwargs)

    return wrapper
