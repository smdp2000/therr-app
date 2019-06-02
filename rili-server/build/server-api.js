(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server-api.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../global-config.js":
/*!***************************!*\
  !*** ../global-config.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

const apiPort = 7770;
const socketPortDev = 7771;
const socketPortProd = 7743;

module.exports = {
    development: {
        apiPort,
        baseApiRoute: `http://localhost:${apiPort}/api/`,
        baseSocketUrl: `http://localhost:${socketPortDev}`,
        clientPort: 7070,
        googleAnalyticsKey: '',
        redisHost: '127.0.0.1',
        redisPubPort: 17771,
        redisSubPort: 17772,
        socketPort: socketPortDev,
        socket: {
            pingInterval: 1000 * 10,
            pingTimeout: 1000 * 5,
            userSocketSessionExpire: 1000 * 60 * 60,
        },
    },
    production: {
        apiPort,
        baseApiRoute: `http://rili.live:${apiPort}/api/`,
        baseSocketUrl: `https://rili.live:${socketPortProd}`,
        clientPort: 7070,
        googleAnalyticsKey: '',
        redisHost: '127.0.0.1',
        redisPubPort: 17771,
        redisSubPort: 17772,
        socketPort: socketPortProd,
        socket: {
            pingInterval: 1000 * 10,
            pingTimeout: 1000 * 5,
            userSocketSessionExpire: 1000 * 60 * 60,
        },
    },
};


/***/ }),

/***/ "../node_modules/express-validator/check/check.js":
/*!********************************************************!*\
  !*** ../node_modules/express-validator/check/check.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const validator = __webpack_require__(/*! validator */ "validator");

const runner = __webpack_require__(/*! ./runner */ "../node_modules/express-validator/check/runner.js");
const { isSanitizer, isValidator } = __webpack_require__(/*! ../utils/filters */ "../node_modules/express-validator/utils/filters.js");

module.exports = (fields, locations, message) => {
  let optional;
  const validators = [];
  const sanitizers = [];
  fields = Array.isArray(fields) ? fields : [fields];

  const middleware = (req, res, next) => {
    return runner(req, middleware._context).then(errors => {
      req._validationContexts = (req._validationContexts || []).concat(middleware._context);
      req._validationErrors = (req._validationErrors || []).concat(errors);
      next();
    }, next);
  };

  Object.keys(validator)
    .filter(isValidator)
    .forEach(methodName => {
      const validationFn = validator[methodName];
      middleware[methodName] = (...options) => {
        validators.push({
          negated: middleware._context.negateNext,
          validator: validationFn,
          options
        });
        middleware._context.negateNext = false;
        return middleware;
      };
    });

  Object.keys(validator)
    .filter(isSanitizer)
    .forEach(methodName => {
      const sanitizerFn = validator[methodName];
      middleware[methodName] = (...options) => {
        sanitizers.push({
          sanitizer: sanitizerFn,
          options
        });
        return middleware;
      };
    });

  middleware.optional = (options = {}) => {
    optional = options;
    return middleware;
  };

  middleware.custom = validator => {
    validators.push({
      validator,
      custom: true,
      negated: middleware._context.negateNext,
      options: []
    });
    middleware._context.negateNext = false;
    return middleware;
  };

  middleware.customSanitizer = sanitizer => {
    sanitizers.push({
      sanitizer,
      custom: true,
      options: []
    });
    return middleware;
  };

  middleware.exists = (options = {}) => {
    const validator = options.checkFalsy
      ? existsValidatorCheckFalsy
      : (options.checkNull ? existsValidatorCheckNull : existsValidator);

    return middleware.custom(validator);
  };

  middleware.isArray = () => middleware.custom(value => Array.isArray(value));
  middleware.isString = () => middleware.custom(value => typeof value === 'string');

  middleware.withMessage = message => {
    const lastValidator = validators[validators.length - 1];
    if (lastValidator) {
      lastValidator.message = message;
    }

    return middleware;
  };

  middleware.not = () => {
    middleware._context.negateNext = true;
    return middleware;
  };

  middleware._context = {
    get optional() {
      return optional;
    },
    negateNext: false,
    message,
    fields,
    locations,
    sanitizers,
    validators
  };

  return middleware;
};

function existsValidator(value) {
  return value !== undefined;
}

function existsValidatorCheckNull(value) {
  return value != null;
}

function existsValidatorCheckFalsy(value) {
  return !!value;
}

/***/ }),

/***/ "../node_modules/express-validator/check/index.js":
/*!********************************************************!*\
  !*** ../node_modules/express-validator/check/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const {
  buildCheckFunction,
  check,
  body,
  cookie,
  header,
  param,
  query
} = __webpack_require__(/*! ./validation-chain-builders */ "../node_modules/express-validator/check/validation-chain-builders.js");

module.exports = {
  buildCheckFunction,
  check,
  body,
  cookie,
  header,
  param,
  query,
  checkSchema: __webpack_require__(/*! ./schema */ "../node_modules/express-validator/check/schema.js"),
  oneOf: __webpack_require__(/*! ./one-of */ "../node_modules/express-validator/check/one-of.js"),
  validationResult: __webpack_require__(/*! ./validation-result */ "../node_modules/express-validator/check/validation-result.js")
};

/***/ }),

/***/ "../node_modules/express-validator/check/one-of.js":
/*!*********************************************************!*\
  !*** ../node_modules/express-validator/check/one-of.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const _ = __webpack_require__(/*! lodash */ "lodash");
const runner = __webpack_require__(/*! ./runner */ "../node_modules/express-validator/check/runner.js");

module.exports = (validationChains, message) => (req, res, next) => {
  const run = chain => runner(req, getContext(chain));

  const contexts = _.flatMap(validationChains, chain => {
    return Array.isArray(chain) ? chain.map(getContext) : getContext(chain);
  });

  const promises = validationChains.map(chain => {
    const group = Array.isArray(chain) ? chain : [chain];
    return Promise.all(group.map(run)).then(results => _.flatten(results));
  });

  return Promise.all(promises).then(results => {
    req._validationContexts = (req._validationContexts || []).concat(contexts);
    req._validationErrors = req._validationErrors || [];

    const failedGroupContexts = findFailedGroupContexts(results, validationChains);
    req._validationOneOfFailures = (req._validationOneOfFailures || []).concat(failedGroupContexts);

    const empty = results.some(result => result.length === 0);
    if (!empty) {
      req._validationErrors.push({
        param: '_error',
        msg: getDynamicMessage(message || 'Invalid value(s)', req),
        nestedErrors: _.flatten(results, true)
      });
    }

    next();
    return results;
  }).catch(next);
};

function getContext(chain) {
  return chain._context;
}

function findFailedGroupContexts(results, validationChains) {
  return _(results)
    // If the group is free of errors, the empty array plays the trick of filtering such group.
    .flatMap((result, index) => result.length > 0 ? validationChains[index] : [])
    .map(getContext)
    .value();
}

function getDynamicMessage(message, req) {
  if (typeof message !== 'function') {
    return message;
  }

  return message({ req });
}

/***/ }),

/***/ "../node_modules/express-validator/check/runner.js":
/*!*********************************************************!*\
  !*** ../node_modules/express-validator/check/runner.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const toString = __webpack_require__(/*! ../utils/to-string */ "../node_modules/express-validator/utils/to-string.js");
const selectFields = __webpack_require__(/*! ../utils/select-fields */ "../node_modules/express-validator/utils/select-fields.js");

module.exports = (req, context) => {
  const validationErrors = [];
  const promises = selectFields(req, context).map(field => {
    const { location, path, value } = field;
    return context.validators.reduce((promise, validatorCfg) => promise.then(() => {
      const result = validatorCfg.custom ?
        validatorCfg.validator(value, { req, location, path }) :
        validatorCfg.validator(toString(value), ...validatorCfg.options);

      return getActualResult(result).then(result => {
        if ((!validatorCfg.negated && !result) || (validatorCfg.negated && result)) {
          return Promise.reject();
        }
      });
    }).catch(err => {
      validationErrors.push({
        location,
        param: path,
        value: field.originalValue,
        msg: getDynamicMessage([
          validatorCfg.message,
          err && err.message,
          err,
          context.message,
          'Invalid value'
        ], field, req)
      });
    }), Promise.resolve());
  });

  return Promise.all(promises).then(() => validationErrors);
};

function getActualResult(result) {
  const promiseLike = result && !!result.then;
  return Promise.resolve(result).then(result => {
    return result === undefined && promiseLike ? true : result;
  });
}

function getDynamicMessage(messageSources, field, req) {
  const message = messageSources.find(message => !!message);
  if (typeof message !== 'function') {
    return message;
  }

  return message(field.originalValue, {
    req,
    location: field.location,
    path: field.path
  });
}

/***/ }),

/***/ "../node_modules/express-validator/check/schema.js":
/*!*********************************************************!*\
  !*** ../node_modules/express-validator/check/schema.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const { isValidator } = __webpack_require__(/*! ../utils/filters */ "../node_modules/express-validator/utils/filters.js");
const check = __webpack_require__(/*! ./check */ "../node_modules/express-validator/check/check.js");
const validLocations = ['body', 'cookies', 'headers', 'params', 'query'];
const notValidators = ['errorMessage', 'in'];

module.exports = (
  schema,
  defaultLocations = validLocations,
  chainCreator = check
) => Object.keys(schema).map(field => {
  const config = schema[field];
  const chain = chainCreator(
    field,
    ensureLocations(config, defaultLocations),
    config.errorMessage
  );

  Object.keys(config)
    .filter(method => config[method] && !notValidators.includes(method))
    .forEach(method => {
      if (typeof chain[method] !== 'function') {
        console.warn(`express-validator: a validator with name ${method} does not exist`);
        return;
      }

      const methodCfg = config[method];

      let options = methodCfg.options || [];
      if (options != null && !Array.isArray(options)) {
        options = [options];
      }

      const methodIsValidator = isValidator(method) || method === 'custom' || method === 'exists';

      methodIsValidator && methodCfg.negated && chain.not();
      chain[method](...options);
      methodIsValidator && chain.withMessage(methodCfg.errorMessage);
    });

  return chain;
});

function ensureLocations(config, defaults) {
  const locations = (Array.isArray(config.in) ? config.in : [config.in]).filter(Boolean);
  const actualLocations = locations.length ? locations : defaults;

  return actualLocations.filter(location => validLocations.includes(location));
}

/***/ }),

/***/ "../node_modules/express-validator/check/validation-chain-builders.js":
/*!****************************************************************************!*\
  !*** ../node_modules/express-validator/check/validation-chain-builders.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const check = __webpack_require__(/*! ./check */ "../node_modules/express-validator/check/check.js");

const buildCheckFunction = locations => (fields, message) => check(fields, locations, message);
module.exports = {
  buildCheckFunction,
  check: buildCheckFunction(['body', 'cookies', 'headers', 'params', 'query']),
  body: buildCheckFunction(['body']),
  cookie: buildCheckFunction(['cookies']),
  header: buildCheckFunction(['headers']),
  param: buildCheckFunction(['params']),
  query: buildCheckFunction(['query'])
};

/***/ }),

/***/ "../node_modules/express-validator/check/validation-result.js":
/*!********************************************************************!*\
  !*** ../node_modules/express-validator/check/validation-result.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const _ = __webpack_require__(/*! lodash */ "lodash");

module.exports = withDefaults();
module.exports.withDefaults = withDefaults;

function withDefaults(options = {}) {
  const defaults = {
    formatter: error => error
  };

  _.defaults(options, defaults);

  function decorateAsValidationResult(obj, errors = []) {
    let formatter = options.formatter;

    obj.isEmpty = () => !errors.length;
    obj.array = ({ onlyFirstError } = {}) => {
      const used = {};
      let filteredErrors = !onlyFirstError ? errors : errors.filter(error => {
        if (used[error.param]) {
          return false;
        }

        used[error.param] = true;
        return true;
      });

      return filteredErrors.map(formatter);
    };

    obj.mapped = () => errors.reduce((mapping, error) => {
      if (!mapping[error.param]) {
        mapping[error.param] = formatter(error);
      }

      return mapping;
    }, {});

    obj.formatWith = errorFormatter => {
      formatter = errorFormatter;
      return obj;
    };

    obj.throw = () => {
      if (errors.length) {
        throw decorateAsValidationResult(new Error('Validation failed'), errors).formatWith(formatter);
      }
    };

    return obj;
  }

  return req => decorateAsValidationResult({}, req._validationErrors)
}

/***/ }),

/***/ "../node_modules/express-validator/utils/constants.js":
/*!************************************************************!*\
  !*** ../node_modules/express-validator/utils/constants.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.extraValidators = ['contains', 'equals', 'matches'];
exports.extraSanitizers = [
  'blacklist',
  'escape',
  'unescape',
  'normalizeEmail',
  'ltrim',
  'rtrim',
  'trim',
  'stripLow',
  'whitelist'
];

/***/ }),

/***/ "../node_modules/express-validator/utils/filters.js":
/*!**********************************************************!*\
  !*** ../node_modules/express-validator/utils/filters.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const { extraSanitizers, extraValidators } = __webpack_require__(/*! ./constants */ "../node_modules/express-validator/utils/constants.js");

exports.isSanitizer = name => name.startsWith('to') || extraSanitizers.includes(name);
exports.isValidator = name => name.startsWith('is') || extraValidators.includes(name);

/***/ }),

/***/ "../node_modules/express-validator/utils/format-param-output.js":
/*!**********************************************************************!*\
  !*** ../node_modules/express-validator/utils/format-param-output.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const validator = __webpack_require__(/*! validator */ "validator");

module.exports = function formatParamOutput(param) {
  if (Array.isArray(param)) {
    param = param.reduce((prev, curr) => {
      var part = '';
      if (validator.isInt(curr)) {
        part = '[' + curr + ']';
      } else if (prev) {
        part = '.' + curr;
      } else {
        part = curr;
      }

      return prev + part;
    }, '');
  }

  return param;
};

module.exports(['foo']);

/***/ }),

/***/ "../node_modules/express-validator/utils/persist-values.js":
/*!*****************************************************************!*\
  !*** ../node_modules/express-validator/utils/persist-values.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const _ = __webpack_require__(/*! lodash */ "lodash");

module.exports = (req, fieldInstances) => {
  fieldInstances.filter(instance => {
    const initialValue = _.get(req[instance.location], instance.path);
    return initialValue !== instance.value;
  }).forEach(instance => {
    instance.path === ''
      ? _.set(req, instance.location, instance.value)
      : _.set(req[instance.location], instance.path, instance.value);
  });
};

/***/ }),

/***/ "../node_modules/express-validator/utils/select-fields.js":
/*!****************************************************************!*\
  !*** ../node_modules/express-validator/utils/select-fields.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const _ = __webpack_require__(/*! lodash */ "lodash");
const formatParamOutput = __webpack_require__(/*! ./format-param-output */ "../node_modules/express-validator/utils/format-param-output.js");
const persistValues = __webpack_require__(/*! ./persist-values */ "../node_modules/express-validator/utils/persist-values.js");

module.exports = (req, context, options = {}) => {
  let allFields = [];
  const optionalityFilter = options.filterOptionals == null || options.filterOptionals
    ? createOptionalityFilter(context)
    : Boolean;
  const sanitizerMapper = createSanitizerMapper(req, context, options);

  context.fields.map(field => field == null ? '' : field).forEach(field => {
    let instances = _(context.locations)
      .flatMap(createFieldExpander(req, field))
      .map(sanitizerMapper)
      .filter(optionalityFilter)
      .value();

    // #331 - When multiple locations are involved, all of them must pass the validation.
    // If none of the locations contain the field, we at least include one for error reporting.
    // #458, #531 - Wildcards are an exception though: they may yield 0..* instances with different
    // paths, so we may want to skip this filtering.
    if (instances.length > 1 && context.locations.length > 1 && !field.includes('*')) {
      const withValue = instances.filter(field => field.value !== undefined);
      instances = withValue.length ? withValue : [instances[0]];
    }

    allFields = allFields.concat(instances);
  });

  persistValues(req, allFields);
  return _.uniqWith(allFields, _.isEqual);
};

function createFieldExpander(req, field) {
  return location => {
    const fieldPath = location === 'headers' ? field.toLowerCase() : field;
    return expand(req[location], fieldPath, []).map(path => ({
      location,
      path: path,
      value: path === '' ? req[location] : _.get(req[location], path)
    })).map(field => Object.assign(field, {
      originalValue: field.value
    }));
  };
}

function expand(object, path, paths) {
  const segments = _.toPath(path);
  const wildcard = segments.indexOf('*');

  if (wildcard > -1) {
    const subObject = wildcard ? _.get(object, segments.slice(0, wildcard)) : object;
    if (!subObject) {
      return paths;
    }

    Object.keys(subObject)
      .map(key => segments
        .slice(0, wildcard)
        .concat(key)
        .concat(segments.slice(wildcard + 1)))
      .forEach(path => expand(object, path, paths));
  } else {
    paths.push(formatParamOutput(segments));
  }

  return paths;
}

function createSanitizerMapper(req, { sanitizers = [] }, { sanitize = true }) {
  return !sanitize ? field => field : field => sanitizers.reduce((prev, sanitizer) => {
    const value = typeof prev.value === 'string' ?
      callSanitizer(sanitizer, prev) :
      prev.value;

    return Object.assign({}, prev, { value });
  }, field);

  function callSanitizer(config, field) {
    return !config.custom ?
      config.sanitizer(field.value, ...config.options) :
      config.sanitizer(field.value, {
        req,
        location: field.location,
        path: field.path
      });
  }
}

function createOptionalityFilter({ optional }) {
  const checks = [
    value => value !== undefined,
    value => optional.nullable ? value != null : true,
    value => optional.checkFalsy ? value : true
  ];

  return field => {
    if (!optional) {
      return true;
    }

    return checks.every(check => check(field.value));
  };
}


/***/ }),

/***/ "../node_modules/express-validator/utils/to-string.js":
/*!************************************************************!*\
  !*** ../node_modules/express-validator/utils/to-string.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = value => {
  if (Array.isArray(value) && value.length) {
    return toString(value[0]);
  }

  return toString(value);
};

function toString(value) {
  if (value instanceof Date) {
    return value.toISOString();
  } else if (value && typeof value === 'object' && value.toString) {
    return value.toString();
  } else if (value == null || (isNaN(value) && !value.length)) {
    return '';
  }

  return String(value);
};

/***/ }),

/***/ "../rili-public-library/utilities/lib/http-response.js":
/*!*************************************************************!*\
  !*** ../rili-public-library/utilities/lib/http-response.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?module.exports=t(__webpack_require__(/*! http-status */ "http-status")):undefined}(global,function(e){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/",r(r.s="rPjh")}({Os7e:function(t,r){t.exports=e},rPjh:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r("Os7e");t.error=((e,t)=>({error:t,statusCode:e,status:n[e]}));t.success=(e=>({data:e}))}})});

/***/ }),

/***/ "../rili-public-library/utilities/lib/print-logs.js":
/*!**********************************************************!*\
  !*** ../rili-public-library/utilities/lib/print-logs.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?module.exports=t():undefined}(global,function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/",r(r.s="Sxyf")}({Sxyf:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=(e=>{if(e.shouldPrintLogs){const t=0!==e.time?`<at:${e.time||new Date}>`:"",r=Array.isArray(e.messages)?e.messages:[e.messages];for(let n=0;n<r.length;n+=1)e.messageOrigin?console.info(`${e.messageOrigin}${t}:`,r[n]):console.info(`LOG${t}:`,r[n])}})}})});

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, description, main, scripts, keywords, author, license, dependencies, devDependencies, default */
/***/ (function(module) {

module.exports = {"name":"rili-server","version":"1.0.0","description":"The server side code for Rili","main":"build/index.js","scripts":{"build":"../node_modules/.bin/webpack --env production","build:dev":"../node_modules/.bin/webpack --env development","build:watch":"../node_modules/.bin/webpack --watch --env development","cleanup":"npm run stop:redis","connect:postgres":"docker container exec -it rili-postgres bash","connect:postgres:dev":"docker container exec -it rili-postgres-dev bash","lint:fix":"../node_modules/.bin/eslint --ext .jsx,.js --fix ./ && ../node_modules/.bin/tslint --fix -p ./","lint":"../node_modules/.bin/eslint --ext .jsx,.js ./ && ../node_modules/.bin/tslint -p ./","run:postgres:dev":"docker container run --name rili-postgres-dev -d -p 127.0.0.1:7432:5432 -e POSTGRES_USER=riliAdmin -e POSTGRES_PASSWORD=secret postgres:latest","run:redis:dev":"docker container run --name rili-redis-pub-dev -d -p 17771:6379 redis:latest && docker container run --name rili-redis-sub-dev -d -p 17772:6379 redis:latest","setup:dev":"npm run run:postgres:dev && npm run run:redis:dev","start":"../node_modules/.bin/pm2 start pm2/ecosystem.config.js --watch --env production","start:server:api":"npm run start:postgres && ../node_modules/.bin/pm2 start pm2/ecosystem.config.js --only rili-server-api --env production","start:server:api:dev":"npm run start:postgres:dev && npm run build:dev && ../node_modules/.bin/nodemon --require=../node_modules/dotenv/config build/server-api.js dotenv_config_path=../.env --withSQLLogs","start:server:socketio":"npm run start:redis && ../node_modules/.bin/pm2 start pm2/ecosystem.config.js --only rili-server-socket-io --env production","start:server:socketio:dev":"npm run start:redis:dev && npm run build:dev && ../node_modules/.bin/nodemon --require=../node_modules/dotenv/config build/server-socket-io.js dotenv_config_path=../.env --withAllLogs","start:docker":"npm run start:postgres && npm run start:redis","start:docker:dev":"npm run start:postgres:dev && npm run start:redis:dev","start:postgres":"docker container start rili-postgres","start:postgres:dev":"docker container start rili-postgres-dev","start:redis":"docker container start rili-redis-pub rili-redis-sub","start:redis:dev":"docker container start rili-redis-pub-dev rili-redis-sub-dev","stop:postgres":"docker container stop rili-postgres","stop:postgres:dev":"docker container stop rili-postgres-dev","stop:redis":"docker container stop rili-redis-pub rili-redis-sub","stop:redis:dev":"docker container stop rili-redis-pub-dev rili-redis-sub-dev","test":"npm run lint:fix && echo \"Error: no test specified\" && exit 0"},"keywords":["rili","server"],"author":"Rili, Inc.","license":"MIT","dependencies":{},"devDependencies":{}};

/***/ }),

/***/ "./src/api/db/create-tables.ts":
/*!*************************************!*\
  !*** ./src/api/db/create-tables.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const print_logs_1 = __webpack_require__(/*! rili-public-library/utilities/print-logs */ "../rili-public-library/utilities/lib/print-logs.js");
const server_api_1 = __webpack_require__(/*! ../../server-api */ "./src/server-api.ts");
const notProd = "development" !== 'production';
// TODO: Configure to maintain migrations
const createTables = (knex) => {
    // Users
    return knex.schema.hasTable('main.users').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('main.users', (table) => {
                table.increments('id');
                table.string('user_name');
                table.string('first_name');
                table.string('last_name');
                table.string('password');
                table.string('phone_number').unique();
                table.timestamps(true, true);
            }).debug(notProd).then((table) => {
                print_logs_1.default({
                    shouldPrintLogs: server_api_1.shouldPrintSQLLogs,
                    messageOrigin: `SQL:CREATE_TABLE:USERS`,
                    messages: ['Users table created successfully'],
                });
            }).catch((err) => {
                print_logs_1.default({
                    shouldPrintLogs: server_api_1.shouldPrintSQLLogs,
                    messageOrigin: `SQL:CREATE_TABLE:USERS`,
                    messages: ['Users table failed to create', err.toString()],
                });
            });
        }
        return;
    });
};
exports.default = createTables;


/***/ }),

/***/ "./src/api/routes/UserRoutes.ts":
/*!**************************************!*\
  !*** ./src/api/routes/UserRoutes.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express = __webpack_require__(/*! express */ "express");
const httpResponse = __webpack_require__(/*! rili-public-library/utilities/http-response */ "../rili-public-library/utilities/lib/http-response.js");
const print_logs_1 = __webpack_require__(/*! rili-public-library/utilities/print-logs */ "../rili-public-library/utilities/lib/print-logs.js");
const server_api_1 = __webpack_require__(/*! ../../server-api */ "./src/server-api.ts");
const users_1 = __webpack_require__(/*! ../validation/users */ "./src/api/validation/users.ts");
const validation_1 = __webpack_require__(/*! ../validation */ "./src/api/validation/index.ts");
const userHelpers_1 = __webpack_require__(/*! ../../utilities/userHelpers */ "./src/utilities/userHelpers.ts");
const router = express.Router();
const notProd = "development" !== 'production';
class UserRoutes {
    constructor(knex) {
        this.router = router;
        this.getUser = (userId) => {
            return this.knex.select('*').from('main.users').where({ id: userId }).debug(notProd)
                .then((results) => {
                if (results && results.length > 0) {
                    return results[0];
                }
                throw 404;
            });
        };
        this.handleError = (err, res) => {
            // TODO: Handle various error status codes
            print_logs_1.default({
                shouldPrintLogs: server_api_1.shouldPrintSQLLogs,
                messageOrigin: `SQL:USER_ROUTES:ERROR`,
                messages: [err.toString()],
            });
            res.status(500).send(httpResponse.error(500, err.toString()));
        };
        // TODO: Determine if should end connection after each request
        this.knex = knex;
        // middleware to log time of a user route request
        router.use((req, res, next) => {
            print_logs_1.default({
                shouldPrintLogs: server_api_1.shouldPrintSQLLogs,
                messageOrigin: `SQL:USER_ROUTES:${req.method}`,
                messages: [req.baseUrl],
            });
            next();
        });
        router.route('/users')
            .get((req, res) => {
            knex.select('*').from('main.users').orderBy('id').debug(notProd)
                .then((results) => {
                res.status(200).send(httpResponse.success(results));
            })
                .catch((err) => {
                return this.handleError(err, res);
            });
        })
            .post(users_1.createUserValidation, validation_1.validate, (req, res) => {
            userHelpers_1.hashPassword(req.body.password).then((hash) => {
                knex().insert({
                    first_name: req.body.firstName,
                    last_name: req.body.lastName,
                    password: hash,
                    phone_number: req.body.phoneNumber,
                    user_name: req.body.userName,
                }).into('main.users').returning('id').debug(notProd)
                    .then((results) => {
                    return res.status(201).send(httpResponse.success({
                        id: results[0],
                    }));
                })
                    .catch((err) => {
                    return this.handleError(err.toString(), res);
                });
            }).catch((err) => {
                return this.handleError(err.toString(), res);
            });
        });
        router.route('/users/:id')
            .get((req, res) => {
            return this.getUser(req.params.id).then((user) => {
                res.send(httpResponse.success(user));
            }).catch((err) => {
                if (err === 404) {
                    res.status(404).send(httpResponse.error(404, `No user found with id, ${req.params.id}.`));
                }
                else {
                    this.handleError(err, res);
                }
            });
        })
            .put((req, res) => {
            knex()
                .update({
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                phone_number: req.body.phoneNumber,
                user_name: req.body.userName,
            })
                .into('main.users')
                .where({ id: req.params.id }).returning('*').debug(notProd)
                .then((results) => {
                // TODO: Handle case where user already exists
                return this.getUser(req.params.id).then((user) => {
                    res.status(200).send(httpResponse.success(user));
                });
            })
                .catch((err) => {
                return this.handleError(err, res);
            });
        })
            .delete((req, res) => {
            knex.delete().from('main.users').where({ id: req.params.id })
                .then((results) => {
                if (results > 0) {
                    res.status(200).send(httpResponse.success(`Customer with id, ${req.params.id}, was successfully deleted`));
                }
                else {
                    res.status(404).send(httpResponse.error(404, `No user found with id, ${req.params.id}.`));
                }
            })
                .catch((err) => {
                return this.handleError(err, res);
            });
        });
    }
}
exports.default = UserRoutes;


/***/ }),

/***/ "./src/api/validation/index.ts":
/*!*************************************!*\
  !*** ./src/api/validation/index.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = __webpack_require__(/*! express-validator/check */ "../node_modules/express-validator/check/index.js");
exports.validate = (req, res, next) => {
    const result = check_1.validationResult(req);
    /** Validate that the correct body, query params, and headers exist */
    if (!result.isEmpty()) {
        return res.status(400).json({
            message: req.errorMessage || 'The required parameters were not provided.',
        });
    }
    next();
};


/***/ }),

/***/ "./src/api/validation/users.ts":
/*!*************************************!*\
  !*** ./src/api/validation/users.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = __webpack_require__(/*! express-validator/check */ "../node_modules/express-validator/check/index.js");
exports.createUserValidation = [
    check_1.body('phoneNumber').exists().isMobilePhone('any'),
    check_1.body('firstName').exists().isString(),
    check_1.body('password').exists().isString().isLength({ min: 8 }),
    check_1.body('lastName').exists().isString(),
    check_1.body('userName').exists().isString(),
];


/***/ }),

/***/ "./src/server-api.ts":
/*!***************************!*\
  !*** ./src/server-api.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const cluster = __webpack_require__(/*! cluster */ "cluster");
const bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
const express = __webpack_require__(/*! express */ "express");
const fs = __webpack_require__(/*! fs */ "fs");
const https = __webpack_require__(/*! https */ "https");
const os = __webpack_require__(/*! os */ "os");
const path = __webpack_require__(/*! path */ "path");
const yargs_1 = __webpack_require__(/*! yargs */ "yargs");
const Knex = __webpack_require__(/*! knex */ "knex");
const globalConfig = __webpack_require__(/*! ../../global-config.js */ "../global-config.js");
const print_logs_1 = __webpack_require__(/*! rili-public-library/utilities/print-logs */ "../rili-public-library/utilities/lib/print-logs.js");
const create_tables_1 = __webpack_require__(/*! ./api/db/create-tables */ "./src/api/db/create-tables.ts");
const UserRoutes_1 = __webpack_require__(/*! ./api/routes/UserRoutes */ "./src/api/routes/UserRoutes.ts");
exports.shouldPrintAllLogs = yargs_1.argv.withAllLogs;
exports.shouldPrintSQLLogs = yargs_1.argv.withSQLLogs || exports.shouldPrintAllLogs;
exports.shouldPrintServerLogs = yargs_1.argv.withServerLogs || exports.shouldPrintAllLogs;
const package_json_1 = __webpack_require__(/*! ../package.json */ "./package.json");
const API_BASE_ROUTE = `/api/v${package_json_1.version.split('.')[0]}`;
const app = express();
// Parse JSON
app.use(bodyParser.json());
// Serves static files in the /build/static directory
app.use(express.static(path.join(__dirname, 'static')));
// Databse Connection
const dbConnectionConfig = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
};
const knex = Knex({
    client: 'pg',
    connection: dbConnectionConfig,
    pool: {
        min: 2,
        max: 10,
        log: true,
    },
    acquireConnectionTimeout: 60000,
});
// Update database and configure routes
create_tables_1.default(knex).then(() => {
    app.use(API_BASE_ROUTE, (new UserRoutes_1.default(knex)).router);
});
// Cluster config and server start
if (cluster.isMaster && yargs_1.argv.shouldCluster) {
    const numWorkers = os.cpus().length;
    print_logs_1.default({
        shouldPrintLogs: exports.shouldPrintServerLogs,
        messageOrigin: 'API_SERVER',
        messages: `Master cluster setting up ${numWorkers} workers...`,
    });
    for (let i = 0; i < numWorkers; i += 1) {
        cluster.fork();
    }
    cluster.on('online', (worker) => {
        print_logs_1.default({
            shouldPrintLogs: exports.shouldPrintServerLogs,
            messageOrigin: 'API_SERVER',
            messages: `Worker ${worker.process.pid} is online`,
        });
    });
    cluster.on('exit', (worker, code, signal) => {
        print_logs_1.default({
            shouldPrintLogs: exports.shouldPrintServerLogs,
            messageOrigin: 'API_SERVER',
            messages: `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`,
        });
        print_logs_1.default({
            shouldPrintLogs: exports.shouldPrintServerLogs,
            messageOrigin: 'API_SERVER',
            messages: 'Starting a new worker',
        });
        cluster.fork();
    });
}
else {
    if (false) {}
    else {
        app.listen(globalConfig["development"].apiPort, (err) => {
            if (err) {
                throw err;
            }
            print_logs_1.default({
                shouldPrintLogs: exports.shouldPrintServerLogs,
                messageOrigin: 'API_SERVER',
                messages: [`Server running on port ${globalConfig["development"].apiPort} with process id`, process.pid],
            });
        });
    }
}


/***/ }),

/***/ "./src/utilities/userHelpers.ts":
/*!**************************************!*\
  !*** ./src/utilities/userHelpers.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const saltRounds = 10;
exports.hashPassword = (password) => {
    return bcrypt.hash(password, saltRounds);
};


/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bcrypt");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cluster":
/*!**************************!*\
  !*** external "cluster" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cluster");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "http-status":
/*!******************************!*\
  !*** external "http-status" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http-status");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "knex":
/*!***********************!*\
  !*** external "knex" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("knex");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "validator":
/*!****************************!*\
  !*** external "validator" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("validator");

/***/ }),

/***/ "yargs":
/*!************************!*\
  !*** external "yargs" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("yargs");

/***/ })

/******/ });
});
//# sourceMappingURL=server-api.js.map