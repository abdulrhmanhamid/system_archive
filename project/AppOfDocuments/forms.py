from django import forms
from .models import Import

class ImportForm(forms.ModelForm):
    import_image = forms.CharField(widget=forms.HiddenInput(), required=False)
    
    class Meta:
        model = Import
        fields = ['document_title', 'sender', 'import_date', 'notes']
        widgets = {
            'import_date': forms.DateInput(attrs={'type': 'date'}),
            'notes': forms.Textarea(attrs={'rows': 4}),
        }