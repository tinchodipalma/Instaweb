(function (mask) {
  Caman.Plugin.register("customMask", function (mask) {
    var width = this.dimensions.width,
      height = this.dimensions.height,
      pixels = this.pixelData,
      imageData, ctx, Gx, Gy, intensity, coords, canvas, a, b, x, y, lw, lh, pixelLoc;


    if (typeof exports !== 'undefined' && exports !== null) {
      canvas = new Canvas( width, height );
    } else {
      canvas = document.createElement( 'canvas' );
      canvas.width = width;
      canvas.height = height;
    }
    ctx = canvas.getContext( '2d' );

    var FILTER_Y = mask;

    var FILTER_X = mask;

    var FILTER_Y = [ [ -1, -2,  -1 ],
                     [  0,  0,  0 ],
                     [  1,  2,  1 ] ];

    var FILTER_X = [ [ -1,  0,  1 ],
                     [ -2,  0,  2 ],
                     [ -1,  0,  1 ] ];

    var sumRgb = function (rgba) {
      return rgba.r + rgba.g + rgba.b;
    }

    var getPixelRelative = function(loc, h, v) {
      var newLoc = loc + (width * 4 * (v * -1)) + (4 * h);

      if (newLoc > pixels.length || newLoc < 0) {
        throw new Error('No existe el pixel en esa posición', loc, h, v);
      }

      return newLoc;
    }
      console.log(this.pixelData);

    var pixelAtLocation = function(loc) {
      return {
        r: pixels[loc],
        g: pixels[loc + 1],
        b: pixels[loc + 2],
        a: pixels[loc + 3]
      };
    }

    imageData = ctx.createImageData(width, height);

    for (x = 1, lw = width - 1; x < lw; ++x) {
      for (y = 1, lh = height - 1; y < lh; ++y) {

        Gx = Gy = 0;
        pixelLoc = Caman.PixelInfo.coordinatesToLocation(x, y, width);

        for (a = -1, b; a <= 1; ++a) {
          for (b = -1; b <= 1; ++b) {
            relativePixel = getPixelRelative(pixelLoc, a, b);
            pixel = pixelAtLocation(relativePixel);
            intensity = sumRgb(pixel);

            Gx += FILTER_X[a + 1][b + 1] * intensity;
            Gy += FILTER_Y[a + 1][b + 1] * intensity;

          }
        }

        val = Math.sqrt( (Gx*Gx) + (Gy*Gy) );
        val = val / 765 * 255;

        imageData.data[ pixelLoc ] = val;
        imageData.data[ pixelLoc + 1 ] = val;
        imageData.data[ pixelLoc + 2 ] = val;
        imageData.data[ pixelLoc + 3 ] = 255;

      }
    }

    ctx.putImageData( imageData, 0, 0 );

    this.replaceCanvas( canvas );

  });


  Caman.Filter.register("customMask", function(mask) {
    return this.processPlugin("customMask", mask);
  });
}).call(this);