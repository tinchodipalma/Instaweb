(function (mask) {

  // Se registra el plugin en la libreria Caman
  Caman.Plugin.register("customMask", function (mask) {

    // Se definen las variables que van a ser utilizadas
    var width = this.dimensions.width,
      height = this.dimensions.height,
      pixels = this.pixelData,
      imageData, ctx, Gx, Gy, intensity, coords, canvas, a, b, x, y, lw, lh, pixelLoc;

    // Obtenemos el elemento canvas del html
    canvas = this.canvas;
    // Obtenemos el contexto en 2D del canvas
    ctx = this.canvas.getContext('2d');

    // Se asignan las mascaras en X e Y que se pasan por parametro en el objeto mask
    var FILTER_Y = mask.y,
        FILTER_X = mask.x;

    // Funcion anonima que suma los elementos R, G y B de un pixel
    var sumRgb = function (rgba) {
      return rgba.r + rgba.g + rgba.b;
    }

    // Funcion anonima que devuelve la posicion del proximo pixel en base a una
    // localizacion pasada por parametro
    var getPixelRelative = function(loc, h, v) {

      // El 4 esta dado porque un pixel se define por 4 elementos:
      // Red, Green, Blue y Alpha
      var newLoc = loc + (width * 4 * (v * -1)) + (4 * h);

      if (newLoc > pixels.length || newLoc < 0) {
        throw new Error('No existe el pixel en esa posición', loc, h, v);
      }

      return newLoc;
    }

    // Dada una posicion se obtiene un pixel definido en formato RGBA
    var pixelAtLocation = function(loc) {
      return {
        r: pixels[loc], // RED
        g: pixels[loc + 1], // GREEN
        b: pixels[loc + 2], // BLUE
        a: pixels[loc + 3] // ALPHA
      };
    }

    // Creamos una imagen a partir del contexto con el mismo ancho y alto
    imageData = ctx.createImageData(width, height);

    // Recorremos la imagen en ancho y alto (width y height, x e y)
    for (x = 1, lw = width - 1; x < lw; ++x) {
      for (y = 1, lh = height - 1; y < lh; ++y) {

        Gx = Gy = 0;

        // Se obtiene la localizacion del pixel a partir de las posiciones x, y
        pixelLoc = Caman.PixelInfo.coordinatesToLocation(x, y, width);

        // Convolucion (comienza la sumatoria)
        // Mascara de 3x3
        for (a = -1, b; a <= 1; ++a) {
          for (b = -1; b <= 1; ++b) {
            // A partir de la posicion actual obtengo la localizacion del proximo pixel
            relativePixel = getPixelRelative(pixelLoc, a, b);
            // Obtengo el pixel en RGBA a partir de la localizacion anterior
            pixel = pixelAtLocation(relativePixel);
            // Obtengo la intensidad (sumando los 3 componentes R, G y B del Pixel)
            intensity = sumRgb(pixel);

            // Sumo el valor de la intensidad multiplicado por el valor en la matriz X e Y
            Gx += FILTER_X[a + 1][b + 1] * intensity;
            Gy += FILTER_Y[a + 1][b + 1] * intensity;

          }
        }

        // Normalizamos el valor del pixel
        val = Math.sqrt( (Gx*Gx) + (Gy*Gy) );
        val = val / 765 * 255;

        // Se le asigna valor a la variable imageDate en la posicion del pixel actual
        imageData.data[ pixelLoc ] = val; // Red
        imageData.data[ pixelLoc + 1 ] = val; // Green
        imageData.data[ pixelLoc + 2 ] = val; // Blue
        imageData.data[ pixelLoc + 3 ] = 255; // Alpha

      }
    }

    // Se imprime la imagen en el inicio (x=0, y=0)
    ctx.putImageData( imageData, 0, 0 );
    this.replaceCanvas( canvas );
  });

  // Se registra el filtro customMask al conjunto del filtros de Caman
  Caman.Filter.register("customMask", function(mask) {
    // Indicamos que procese el plugin customMask con una mascara como parametro
    return this.processPlugin("customMask", mask);
  });
}).call(this);
