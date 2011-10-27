(function (window) {
  
  function rgbToHsl (r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        h, s, l = (max + min) / 2;

    if (max === min) {
      h = s= 0;
    } else {
      var d = max - min;
      s = (l > 0.5) ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r : h = (g - b) / d + (g < b ? 6 : 0); break;
        case g : h = (b - r) / d + 2; break;
        case b : h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h, s, l];
  };

  function hslToRgb (h, s, l) {
    var r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      function hueToRgb (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      var q = (l < 0.5) ? l * (1 + s) : l + s - l * s,
          p = 2 * l - q;
      r = hueToRgb(p, q, h + 1/3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
  };

  function rgbToHex (r, g, b) {
    function toHex (n) {
      n = parseInt(n, 10);
      if (isNaN(n)) return '00';
      n = Math.max(0, Math.min(n, 255));
      return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
    };

    return toHex(r) + toHex(g) + toHex(b);
  };

  function Switch (hexCode) {
    this.rgb = this.hsl = [];
    this.setColour(hexCode);
  };

  Switch.prototype.setColour = function (hexCode) {
    if (hexCode[0] === '#')
      hexCode = hexCode.substring(1, 7);

    this.rgb[0] = parseInt(hexCode.substring(0, 2), 16);
    this.rgb[1] = parseInt(hexCode.substring(2, 4), 16);
    this.rgb[2] = parseInt(hexCode.substring(4, 6), 16);

    this.hsl = rgbToHsl(this.rgb[0], this.rgb[1], this.rgb[2]);
    this.hsl[3] = this.hsl[2];
  };

  Switch.prototype.change = function (ratio) {
    this.hsl[2] = (ratio > 0) ? this.hsl[3] + (this.hsl[2] * ratio) :
                                this.hsl[3] - (this.hsl[2] * Math.abs(ratio));
    return this.toHex();
  };

  Switch.prototype.toHex = function () {
    var rgb = hslToRgb(this.hsl[0], this.hsl[1], this.hsl[2]);
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
  };

  window['Switch'] = function (hexCode) {
    return new Switch(hexCode);
  };

}(window));


$(function () {

  var flick       = Switch('#191919')
      originalBox = $('#original'),
      originalVal = $('#original-value'),
      newBox      = $('#new'),
      newVal      = $('#new-value'),
      sliderBar   = $('#slider');

  originalVal.change(function () {
    var hex = originalVal.val();

    if (hex.match(/^#?[a-z0-9]{6}$/i)) {
      flick.setColour(hex);
      originalBox.css('background-color', hex);
      newBox.css('background-color', hex);
      newVal.val(hex);
      sliderBar.slider('option', 'value', 0);
    } else {
      originalVal.effect('shake', { }, 100, function () {
        originalVal.val('');
      });
    }
  });

  sliderBar.slider({
    value: 0,
    min: -1.1,
    max: 1.1,
    step: 0.01,
    slide: function (e, u) {
      var hex = '#' + flick.change(u.value);
      newVal.val(hex);
      newBox.css('background-color', hex);
    }
  });

  newVal.click(function () { newVal.select(); });
  originalVal.click(function () { originalVal.select(); });

});
