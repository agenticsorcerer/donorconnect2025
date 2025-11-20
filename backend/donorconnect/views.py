"""
Views for serving frontend HTML files
"""
from django.conf import settings
from django.http import HttpResponse, Http404
from django.views.decorators.http import require_http_methods


@require_http_methods(["GET"])
def serve_frontend(request, path=''):
    """
    Serve frontend HTML files
    """
    # Clean the path - remove leading/trailing slashes and .html extension
    if path:
        path = path.strip('/')
        # Remove .html extension if present
        if path.endswith('.html'):
            clean_path = path[:-5]  # Remove .html
        else:
            clean_path = path
    else:
        clean_path = ''
    
    # Map common paths to HTML files
    path_mapping = {
        '': 'index.html',
        'about': 'about.html',
        'contact': 'contact.html',
        'donate': 'donate.html',
        'faq': 'faq.html',
        'register': 'register.html',
        'terms': 'terms.html',
        'privacy-policy': 'privacypolicy.html',
        'blog-details': 'blog-details.html',
        'blog-details3': 'blog-details3.html',
        'campaign-details': 'campaign-details.html',
        'service-details': 'service-details.html',
        'team-member': 'team-member.html',
        'photo-gallary': 'photo-gallary.html',
        'template': 'template.html',
    }
    
    # Get the HTML file name
    if clean_path in path_mapping:
        html_file = path_mapping[clean_path]
    elif clean_path:
        # Try the path as-is with .html extension
        html_file = f'{clean_path}.html'
    else:
        html_file = 'index.html'
    
    # Construct full file path
    file_path = settings.FRONTEND_DIR / html_file
    
    # Check if file exists
    if not file_path.exists() or not file_path.is_file():
        raise Http404(f"Page not found: {html_file}")
    
    # Read and return the HTML file
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Inject header and footer components if placeholders exist
        if 'id="header-placeholder"' in content or "id='header-placeholder'" in content:
            header_path = settings.FRONTEND_DIR / 'components' / 'header.html'
            if header_path.exists():
                with open(header_path, 'r', encoding='utf-8') as hf:
                    header_content = hf.read()
                # Replace header placeholder with actual header
                content = content.replace('<div id="header-placeholder"></div>', header_content)
                content = content.replace("<div id='header-placeholder'></div>", header_content)
        
        if 'id="footer-placeholder"' in content or "id='footer-placeholder'" in content:
            footer_path = settings.FRONTEND_DIR / 'components' / 'footer.html'
            if footer_path.exists():
                with open(footer_path, 'r', encoding='utf-8') as ff:
                    footer_content = ff.read()
                # Replace footer placeholder with actual footer
                content = content.replace('<div id="footer-placeholder"></div>', footer_content)
                content = content.replace("<div id='footer-placeholder'></div>", footer_content)
        
        return HttpResponse(content, content_type='text/html')
    except Exception as e:
        raise Http404(f"Error reading file: {str(e)}")

