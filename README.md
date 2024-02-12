
# image-gallery

This document provides instructions on how to install and deploy the Image Gallery application. You can either build the project from source using npm or directly deploy the pre-built files from the `/dist` folder to your web server.

## Prerequisites

- Node.js and npm (for building from source)
- Git (for cloning the repository)

## Installation and Build

### Method 1: Building from Source

1. **Clone the Repository**

   ```sh
   git clone https://github.com/tsdchan/image-gallery.git
   cd image-gallery
   ```

2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Build the Application**

   ```sh
   npm run build
   ```
   
   After the build process completes, the `/dist` folder will contain the compiled application ready for deployment.

### Method 2: Deploying the `/dist` Folder

#### Case 1: Root Directory Deployment

- If deploying to the root directory of your domain, no additional configuration is needed. Simply copy the contents of the `/dist` folder to your web server's root directory.

#### Case 2: Subdirectory Deployment

1. **Modify `index.html` for Base URL**

   - Before deploying, adjust the base URL in the `dist/index.html` file:
     ```html
     <script>
       var baseUrl = '/subdirectory/';
       document.write('<base href="' + baseUrl + '" />');
     </script>
     ```

2. **Prepare `.htaccess` for Routing**

   - To enable client-side routing, create an `.htaccess` file in the root of your subdirectory with the following content:
     ```apache
     <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /subdirectory/
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /subdirectory/index.html [L]
     </IfModule>
     ```
   - Replace `/subdirectory/` with the actual path to your application.

## Deployment

- Upload the contents of the `/dist` folder to your web server. For subdirectory deployments, ensure the `.htaccess` file is placed correctly and the `index.html` file has been modified as described.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
