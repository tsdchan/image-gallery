
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

## Customizing Your Image Galleries

### Editing `albums.json`

The `albums.json` file serves as a directory for all your image galleries. Each album is represented by a JSON object within the `albums` array. Here's how to edit or add new albums:

1. **Album Object Structure**:
   Each album should have the following properties:
   - `id`: A unique identifier for the album.
   - `title`: The title of the album.
   - `path`: A unique path or identifier used in the URL.
   - `description`: A brief description of the album.
   - `thumbnail`: A URL to an image used as the album's thumbnail. This can be a local path relative to the web server's root or an external URL.
   - `json`: The path to the JSON file containing the list of images for this album (e.g., `gallery1/images.json`).

2. **Adding a New Album**:
   To add a new album, append a new JSON object to the `albums` array with the properties described above.

3. **Example**:
   ```json
   {
     "albums": [
       {
         "id": 3,
         "title": "New Album",
         "path": "new-gallery",
         "description": "Description of the new album",
         "thumbnail": "/path/to/thumbnail.jpg",
         "json": "new-gallery/images.json"
       }
     ]
   }
   ```

### Editing `images.json` for an Album

Each album's images are listed in a separate JSON file, as specified by the `json` property in `albums.json`. Here's how to manage this file:

1. **Image Object Structure**:
   Each image should have the following properties:
   - `id`: A unique identifier for the image.
   - `src`: The source URL or path of the image. For local images, use a path relative to the web server's root. External URLs can also be used.
   - `title`: The title of the image.
   - `description`: A description of the image.

2. **Adding New Images**:
   To add a new image, append a new JSON object to the `images` array within the respective `images.json` file.

3. **CORS Limitation**:
   Note that if using images from external domains, you might encounter CORS (Cross-Origin Resource Sharing) limitations, affecting functionalities like downloading images. To avoid these issues, host the images on the same domain or ensure the external server supports CORS.

4. **Example**:
   ```json
   {
     "images": [
       {
         "id": 4,
         "src": "new-gallery/image04.jpeg",
         "title": "New Image",
         "description": "Description for the new image."
       }
     ]
   }
   ```

### Handling CORS Limitations

If you plan to use images hosted on external servers, ensure the server is configured to allow CORS requests from your domain to enable all features of your image gallery, including the ability to download images.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
