// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true;
// for apache, don't forget to update internal link with trailing slash
// export const trailingSlash = 'always';
// .htaccess should be
// RewriteEngine on 
// RewriteCond %{REQUEST_FILENAME} !-d
// RewriteCond %{REQUEST_FILENAME}\.html -f
// RewriteRule ^(.*)$ $1.html [NC,L]
