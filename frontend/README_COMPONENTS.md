# Component System for Header and Footer

This system allows you to maintain header and footer code in a single location and include them across all pages using JavaScript.

## How it works

1. **Header Component**: `components/header.html` - Contains the header HTML
2. **Footer Component**: `components/footer.html` - Contains the footer HTML  
3. **JavaScript Loader**: `js/components.js` - Loads the components into placeholders
4. **Template**: `template.html` - Base template for new pages

## How to use

### For existing pages:
1. Replace the header section with: `<div id="header-placeholder"></div>`
2. Replace the footer section with: `<div id="footer-placeholder"></div>`
3. Add this script before closing `</body>` tag: `<script src="js/components.js"></script>`

### For new pages:
1. Copy `template.html` as your starting point
2. Replace the content in the `<main>` section with your page-specific content
3. Update the page title in the `<title>` tag

## File Structure

```
MainFile/blad-ai/
├── components/
│   ├── header.html      # Header component
│   └── footer.html      # Footer component
├── js/
│   └── components.js    # Component loader
├── template.html        # Base template
└── README_COMPONENTS.md # This file
```

## Benefits

- **DRY Principle**: Don't Repeat Yourself - header and footer code is maintained in one place
- **Easy Maintenance**: Update header/footer once, changes appear on all pages
- **Consistency**: Ensures all pages have the same header and footer
- **Clean Code**: Pages only contain their specific content

## Example

Before (repeating code):
```html
<!-- Every page had the same header -->
<header>
  <!-- 50+ lines of header code -->
</header>

<!-- Page content -->
<main>...</main>

<!-- Every page had the same footer -->
<footer>
  <!-- 100+ lines of footer code -->
</footer>
```

After (using components):
```html
<!-- Simple placeholder -->
<div id="header-placeholder"></div>

<!-- Page content -->
<main>...</main>

<!-- Simple placeholder -->
<div id="footer-placeholder"></div>

<!-- Component loader -->
<script src="js/components.js"></script>
```

## Notes

- The components are loaded using JavaScript fetch API
- Make sure your web server supports serving HTML files
- If you need to modify header or footer, edit the files in the `components/` folder
- All pages must include the `components.js` script for the system to work 