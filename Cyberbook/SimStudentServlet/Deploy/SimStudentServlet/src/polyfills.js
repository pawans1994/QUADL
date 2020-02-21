// ECMAScript 6 Number

if (!Number.EPSILON) {
  Number.EPSILON = 2.2204460492503130808472633361816E-16;
}

if (!Number.MAX_SAFE_INTEGER) {
  Number.MAX_SAFE_INTEGER = 9007199254740991;
}

if (!Number.MIN_SAFE_INTEGER) {
  Number.MIN_SAFE_INTEGER = -9007199254740991;
}

if (!Number.isFinite) {
  Number.isFinite = function (value) {
    // 1. If Type(number) is not Number, return false.
    if (typeof value !== 'number') return false;
    // 2. If number is NaN, +∞, or −∞, return false.
    if (value !== value || value === Infinity || value === -Infinity) return false;
    // 3. Otherwise, return true.
    return true;
  };
}

if (!Number.isInteger) {
  Number.isInteger = function (nVal) {
    return typeof nVal === "number" && isFinite(nVal) &&
      nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
  };
}

// ECMAScript 6 Math

if (!Math.cbrt) {
  Math.cbrt = function (x) {
    var y = Math.pow(Math.abs(x), 1/3);
    return x < 0 ? -y : y;
  };
}

if (!Math.clz32) {
  Math.clz32 = function (value) {
    var value = Number(value) >>> 0;
    return value ? 32 - value.toString(2).length : 32;
  };
}

if (!Math.expm1) {
  Math.expm1 = function (x) {
    return Math.exp(x) - 1;
  };
}

if (!Math.fround) {
  Math.fround = function (x) {
    var f32 = new Float32Array(1);
    return f32[0] = x, f32[0];
  };
}

if (!Math.hypot) {
  Math.hypot = function hypot() {
    var y = 0;
    var length = arguments.length;
    for (var i = 0; i < length; i++) {
      if (arguments[i] === Infinity || arguments[i] === -Infinity) return Infinity;
      y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
  };
}

if (!Math.imul) {
  Math.imul = function (a, b) {
    var ah  = (a >>> 16) & 0xffff;
    var al = a & 0xffff;
    var bh  = (b >>> 16) & 0xffff;
    var bl = b & 0xffff;
    // the shift by 0 fixes the sign on the high part
    // the final |0 converts the unsigned value into a signed value
    return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
  };
}

if (!Math.log10) {
  Math.log10 = function (x) {
    return Math.log(x) / Math.LN10;
  };
}

if (!Math.log1p) {
  Math.log1p = function (x) {
    return Math.log(1 + x);
  };
}

if (!Math.log2) {
  Math.log2 = function (x) {
    return Math.log(x) / Math.LN2;
  };
}

if (!Math.sign) {
  Math.sign = function (x) {
    if (isNaN(x))
      return NaN;
    else if (x === 0)
      return x;
    else
      return (x > 0 ? 1 : -1);
  };
}

if (!Math.trunc) {
  Math.trunc = function (x) {
    return x < 0 ? Math.ceil(x) : Math.floor(x);
  };
}

if (!Math.sinh) {
  Math.sinh = function (x) {
    var y = Math.exp(x);
    return (y - 1 / y) / 2;
  };
}

if (!Math.cosh) {
  Math.cosh = function (x) {
    var y = Math.exp(x);
    return (y + 1 / y) / 2;
  };
}

if (!Math.tanh) {
  Math.tanh = function (x) {
    if (x === Infinity)
      return 1;
    else if (x === -Infinity)
      return -1;
    else {
      var y = Math.exp(2 * x);
      return (y - 1) / (y + 1);
    }
  };
}

if (!Math.asinh) {
  Math.asinh = function (x) {
    if(x === -Infinity)
      return x;
    else
      return Math.log(x + Math.sqrt(x * x + 1));
  };
}

if (!Math.acosh) {
  Math.acosh = function (x) {
    return (x + Math.sqrt(x * x - 1));
  };
}

if (!Math.atanh) {
  Math.atanh = function (x) {
    return Math.log((1 + x) / (1 - x)) / 2;
  };
}

// ECMAScript 6 String

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
    position = position || 0;
    return this.lastIndexOf(searchString, position) === position;
  };
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (searchString, position) {
    var subjectString = this.toString();
    if (position === undefined || position > subjectString.length)
      position = subjectString.length;
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}

if (!String.prototype.contains) {
  String.prototype.contains = function () {
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}

if (!String.fromCodePoint) {
  (function() {
    var stringFromCharCode = String.fromCharCode;
    var floor = Math.floor;
    var fromCodePoint = function () {
      var MAX_SIZE = 0x4000;
      var codeUnits = [];
      var highSurrogate;
      var lowSurrogate;
      var index = -1;
      var length = arguments.length;
      if (!length) return '';
      var result = '';
      while (++index < length) {
        var codePoint = Number(arguments[index]);
        if (
          !isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
          codePoint < 0 || // not a valid Unicode code point
          codePoint > 0x10FFFF || // not a valid Unicode code point
          floor(codePoint) != codePoint // not an integer
        ) {
          throw RangeError('Invalid code point: ' + codePoint);
        }
        if (codePoint <= 0xFFFF) { // BMP code point
          codeUnits.push(codePoint);
        } else { // Astral code point; split in surrogate halves
          // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
          codePoint -= 0x10000;
          highSurrogate = (codePoint >> 10) + 0xD800;
          lowSurrogate = (codePoint % 0x400) + 0xDC00;
          codeUnits.push(highSurrogate, lowSurrogate);
        }
        if (index + 1 == length || codeUnits.length > MAX_SIZE) {
          result += stringFromCharCode.apply(null, codeUnits);
          codeUnits.length = 0;
        }
      }
      return result;
    };
    String.fromCodePoint = fromCodePoint;
  }());
}

if (!String.prototype.codePointAt) {
  String.prototype.codePointAt = function (position) {
    "use strict"; // needed to support `apply`/`call` with `undefined`/`null`
    if (this == null) throw TypeError();
    var string = String(this);
    var size = string.length;
    // `ToInteger`
    var index = position ? Number(position) : 0;
    if (index != index) index = 0; // better `isNaN`
    // Account for out-of-bounds indices:
    if (index < 0 || index >= size) return undefined;
    // Get the first code unit
    var first = string.charCodeAt(index);
    var second;
    if ( // check if it’s the start of a surrogate pair
      first >= 0xD800 && first <= 0xDBFF && // high surrogate
      size > index + 1 // there is a next code unit
    ) {
      second = string.charCodeAt(index + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
      }
    }
    return first;
  };
}

if (!String.prototype.repeat) {
  String.prototype.repeat = function (count) {
    "use strict";
    if (this == null) throw new TypeError("can't convert " + this + " to object");
    var str = "" + this;
    count = +count;
    if (count != count) count = 0;
    if (count < 0) throw new RangeError("repeat count must be non-negative");
    if (count == Infinity) throw new RangeError("repeat count must be less than infinity");
    count = Math.floor(count);
    if (str.length == 0 || count == 0) return "";
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (august 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so :
    if (str.length * count >= 1 << 28) throw new RangeError("repeat count must not overflow maximum string size");
    var rpt = "";
    for (;;) {
      if ((count & 1) == 1) rpt += str;
      count >>>= 1;
      if (count == 0) break;
      str += str;
    }
    return rpt;
  }
}

// ECMAScript 5 Array

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement, fromIndex) {
    var k;
    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) throw new TypeError('"this" is null or not defined');
    var O = Object(this);
    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;
    // 4. If len is 0, return -1.
    if (len === 0) return -1;
    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;
    if (Math.abs(n) === Infinity) n = 0;
    // 6. If n >= len, return -1.
    if (n >= len) return -1;
    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
    // 9. Repeat, while k < len
    while (k < len) {
      var kValue;
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) return k;
      k++;
    }
    return -1;
  };
}

if (!Array.prototype.lastIndexOf) {
  Array.prototype.lastIndexOf = function (searchElement /*, fromIndex*/) {
    'use strict';
    if (this === void 0 || this === null) throw new TypeError();
    var n, k,
        t = Object(this),
        len = t.length >>> 0;
    if (len === 0) return -1;
    n = len - 1;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n)
        n = 0;
      else if (n != 0 && n != (1 / 0) && n != -(1 / 0))
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
      if (k in t && t[k] === searchElement) return k;
    }
    return -1;
  };
}

if (!Array.prototype.every) {
  Array.prototype.every = function (callbackfn, thisArg) {
    "use strict";
    var T, k;
    if (this == null) throw new TypeError("this is null or not defined");
    // 1. Let O be the result of calling ToObject passing the this 
    //    value as the argument.
    var O = Object(this);
    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;
    // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
    if (typeof callbackfn !== "function") throw new TypeError();
    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) T = thisArg;
    // 6. Let k be 0.
    k = 0;
    // 7. Repeat, while k < len
    while (k < len) {
      var kValue;
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal 
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then      
      if (k in O) {
        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];
        // ii. Let testResult be the result of calling the Call internal method 
        //     of callbackfn with T as the this value and argument list 
        //     containing kValue, k, and O.
        var testResult = callbackfn.call(T, kValue, k, O);
        // iii. If ToBoolean(testResult) is false, return false.
        if (!testResult) return false;
      }
      k++;
    }
    return true;
  };
}

if (!Array.prototype.some) {
  Array.prototype.some = function (fun /*, thisArg */) {
    'use strict';
    if (this === void 0 || this === null) throw new TypeError();
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') throw new TypeError();
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisArg, t[i], i, t)) return true;
    }
    return false;
  };
}

if (!Array.prototype.filter) {
  Array.prototype.filter = function (fun /*, thisArg */) {
    "use strict";
    if (this === void 0 || this === null) throw new TypeError();
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") throw new TypeError();
    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];
        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) res.push(val);
      }
    }
    return res;
  };
}

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback, thisArg) {
    var T, k;
    if (this == null) throw new TypeError(" this is null or not defined");
    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);
    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;
    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") throw new TypeError(callback + " is not a function");
    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) T = thisArg;
    // 6. Let k be 0
    k = 0;
    // 7. Repeat, while k < len
    while (k < len) {
      var kValue;
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {
        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];
        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

if (!Array.prototype.map) {
  Array.prototype.map = function (callback, thisArg) {
    var T, A, k;
    if (this == null) throw new TypeError(" this is null or not defined");
    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);
    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;
    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") throw new TypeError(callback + " is not a function");
    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) T = thisArg;
    // 6. Let A be a new array created as if by the expression new Array( len) where Array is
    // the standard built-in constructor with that name and len is the value of len.
    A = new Array(len);
    // 7. Let k be 0
    k = 0;
    // 8. Repeat, while k < len
    while (k < len) {
      var kValue, mappedValue;
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {
        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];
        // ii. Let mappedValue be the result of calling the Call internal method of callback
        // with T as the this value and argument list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);
        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor {Value: mappedValue, Writable: true, Enumerable: true, Configurable: true},
        // and false.
        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty( A, k, { value: mappedValue, writable: true, enumerable: true, configurable: true });
        // For best browser support, use the following:
        A[k] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }
    // 9. return A
    return A;
  };
}

if (!Array.prototype.reduce) {
  Array.prototype.reduce = function (callback /*, initialValue*/) {
    'use strict';
    if (null === this || 'undefined' === typeof this)
      throw new TypeError('Array.prototype.reduce called on null or undefined');
    if ('function' !== typeof callback)
      throw new TypeError(callback + ' is not a function');
    var t = Object(this), len = t.length >>> 0, k = 0, value;
    if (arguments.length >= 2)
      value = arguments[1];
    else {
      while (k < len && ! k in t) k++; 
      if (k >= len) throw new TypeError('Reduce of empty array with no initial value');
      value = t[k++];
    }
    for (; k < len; k++) {
      if (k in t) value = callback(value, t[k], k, t);
    }
    return value;
  };
}

if (!Array.prototype.reduceRight) {
  Array.prototype.reduceRight = function (callback /*, initialValue*/) {
    'use strict';
    if (null === this || 'undefined' === typeof this)
      throw new TypeError('Array.prototype.reduce called on null or undefined');
    if ('function' !== typeof callback)
      throw new TypeError(callback + ' is not a function');
    var t = Object(this), len = t.length >>> 0, k = len - 1, value;
    if (arguments.length >= 2)
      value = arguments[1];
    else {
      while (k >= 0 && ! k in t) k--;
      if (k < 0) throw new TypeError('Reduce of empty array with no initial value');
      value = t[k--];
    }
    for (; k >= 0 ; k--) {
      if (k in t) value = callback(value, t[k], k, t);
    }
    return value;
  };
}

// ECMAScript 6 Array

if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };
    // The length property of the from method is 1.
    return function (arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;
      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);
      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) throw new TypeError("Array.from requires an array-like object - not null or undefined");
      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn, T;
      if (arguments.length > 1) {
        mapFn = arguments[1];
        // 5. else      
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) throw new TypeError('Array.from: when provided, the second argument must be a function');

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) T = arguments[2];
      }
      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);
      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);
      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn)
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        else
          A[k] = kValue;
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}

if (!Array.of) {
  Array.of = function () {
    return Array.prototype.slice.call(arguments);
  };
}

if (!Array.prototype.copyWithin) {
  Array.prototype.copyWithin = function (target, start /*, end*/) {
    /* Steps 1-2. */
    if (this == null) throw new TypeError("this is null or not defined");
    var O = Object(this);
    /* Steps 3-5. */
    var len = O.length >>> 0;
    /* Steps 6-8. */
    var relativeTarget = target >> 0;
    var to = relativeTarget < 0 ?
      Math.max(len + relativeTarget, 0) :
      Math.min(relativeTarget, len);
    /* Steps 9-11. */
    var relativeStart = start >> 0;
    var from = relativeStart < 0 ?
      Math.max(len + relativeStart, 0) :
      Math.min(relativeStart, len);
    /* Steps 12-14. */
    var end = arguments[2];
    var relativeEnd = end === undefined ? len : end >> 0;
    var last = relativeEnd < 0 ?
      Math.max(len + relativeEnd, 0) :
      Math.min(relativeEnd, len);
    /* Step 15. */
    var count = Math.min(last - from, len - to);
    /* Steps 16-17. */
    var direction = 1;
    if (from < to && to < (from + count)) {
      direction = -1;
      from += count - 1;
      to += count - 1;
    }
    // Step 18
    while (count > 0) {
      if (from in O)
        O[to] = O[from];
      else
        delete O[to];
      from += direction;
      to += direction;
      count--;
    }
    /* Step 19. */
    return O;
  };
}

if (!Array.prototype.fill) {
  Array.prototype.fill = function (value) {
    // Steps 1-2.
    if (this == null) throw new TypeError("this is null or not defined");
    var O = Object(this);
    // Steps 3-5.
    var len = O.length >>> 0;
    // Steps 6-7.
    var start = arguments[1];
    var relativeStart = start >> 0;
    // Step 8.
    var k = relativeStart < 0 ?
      Math.max(len + relativeStart, 0) :
      Math.min(relativeStart, len);
    // Steps 9-10.
    var end = arguments[2];
    var relativeEnd = end === undefined ?
      len : end >> 0;
    // Step 11.
    var last = relativeEnd < 0 ?
      Math.max(len + relativeEnd, 0) :
      Math.min(relativeEnd, len);
    // Step 12.
    while (k < last) {
      O[k] = value;
      k++;
    }
    // Step 13.
    return O;
  };
}

if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this == null) throw new TypeError('Array.prototype.find called on null or undefined');
    if (typeof predicate !== 'function') throw new TypeError('predicate must be a function');
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;
    for (var i = 0; i < length; i++) {
      if (i in list) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) return value;
      }
    }
    return undefined;
  };
}

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function (predicate) {
    if (this == null) throw new TypeError('Array.prototype.find called on null or undefined');
    if (typeof predicate !== 'function') throw new TypeError('predicate must be a function');
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;
    for (var i = 0; i < length; i++) {
      if (i in list) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) return i;
      }
    }
    return -1;
  };
}

// ECMAScript 5 Date

if (!Date.prototype.toISOString) {
  (function () {
    function pad(number) {
      var r = String(number);
      if (r.length === 1) r = '0' + r;
      return r;
    }
    Date.prototype.toISOString = function () {
      return this.getUTCFullYear()
        + '-' + pad(this.getUTCMonth() + 1)
        + '-' + pad(this.getUTCDate())
        + 'T' + pad(this.getUTCHours())
        + ':' + pad(this.getUTCMinutes())
        + ':' + pad(this.getUTCSeconds())
        + '.' + String((this.getUTCMilliseconds()/1000).toFixed(3)).slice(2, 5)
        + 'Z';
    };
  }());
};

// ECMAScript 6 Set

if (typeof(Iterator) === 'undefined') {

	Iterator = function(o) {
		if(!(this instanceof arguments.callee))
		  return new arguments.callee(o);

		var index = 0, keys = [];

		if(!o || typeof o != "object") return; //If it is not an object (includes arrays)

		if(typeof o.splice !=='undefined' && typeof o.join !=='undefined') { //If the object is an array

			while(keys.length < o.length) keys.push(o[keys.length]); //index keys range from 0 to length-1

		} else {

			for(p in o) if(o.hasOwnProperty(p)) keys.push(p);        
		};

		//Successively returns the next element until the end, when it returns a 
		this.next = function next() {
			if(index < keys.length) {
				var key = keys[index++];
				return {value: key, done: false};
			} else return { done: true };
		};
	};

	Iterator.prototype = Object.create(Object.prototype);
	Iterator.prototype.constructor = Iterator;

};

if (!Set.prototype.values) {
  Set.prototype.values = function() {

	var result = [];

	this.forEach(function(e) {
		result.push(e);
    });

    return new Iterator(result);
  }
};
