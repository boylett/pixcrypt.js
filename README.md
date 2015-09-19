[PixCrypt.js](http://pixcrypt.co.uk/)
=
PixCrypt is a lightweight javascript library that encodes data into a small, 1 pixel high image that can be exchanged and decoded much like a barcode.

PixCrypt was primarily built to store mouse movement heatmaps without taking up too much memory.

Usage Examples
=

Standard objects, strings and numbers can be encoded and decoded

    var pix = new Pixcrypt(),
    encoded = pix.encode({ foo: 'bar' });

    $('<img />').attr('src', encoded);

Passing in an image element will attempt to decrypt its contents

    var pix = new Pixcrypt(),
    decoded = pix.decode($('img')[0]);

    console.log(decoded);

PixCrypt is not dependent on jQuery, but is very much dependent on the `<canvas>` element.

    var pix = new Pixcrypt(),
    decoded = pix.decode('data:image/png;base64,...');

    console.log(decoded);
