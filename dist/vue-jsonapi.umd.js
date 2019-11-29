(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = global || self, factory(global['vue-jsonapi'] = {}, global.Vue));
}(this, (function (exports, Vue) { 'use strict';

  Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  var asTruthyArray = function asTruthyArray(obj) {
    return (Array.isArray(obj) ? obj : [obj]).filter(Boolean);
  };
  var pick = function pick() {
    var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return keys.reduce(function (output, key) {
      output[key] = input[key];
      return output;
    }, {});
  };
  var omit = function omit() {
    var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return Object.keys(input).reduce(function (output, key) {
      if (!keys.includes(key)) output[key] = input[key];
      return output;
    }, {});
  };
  var isEqual = function isEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };
  var assignPropertyDescriptors = function assignPropertyDescriptors(target) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    sources.forEach(function (source) {
      Object.keys(source).forEach(function (prop) {
        var descriptor = Object.getOwnPropertyDescriptor(source, prop);
        Object.defineProperty(target, prop, _objectSpread2({}, descriptor, {
          configurable: true
        }));
      });
    });
    return target;
  };
  var reactiveEnsurePath = function reactiveEnsurePath(target, path) {
    var empty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    path.reduce(function (current, prop, index) {
      if (!current[prop]) {
        Vue.set(current, prop, index < path.length - 1 ? {} : empty);
      }

      return current[prop];
    }, target);
  };

  var normalize = function normalize(ctx, record) {
    var model = _objectSpread2({
      __type: record.type,
      id: record.id
    }, record.attributes);

    var relationships = record.relationships || {};
    Object.keys(relationships).forEach(function (relation) {
      var data = relationships[relation].data;

      if (data) {
        Object.defineProperty(model, relation, {
          get: function get() {
            if (Array.isArray(data)) return data.map(function (item) {
              return ctx.read(item);
            });
            return ctx.read(data);
          },
          enumerable: true,
          configurable: true
        });
      }
    });
    return model;
  };
  var metadata = function metadata(resource) {
    if (Array.isArray(resource)) return resource.map(function (r) {
      return omit(r, ['attributes']);
    });
    return omit(resource, ['attributes']);
  };

  var POLICY_NETWORK_ONLY = 'network-only';
  var POLICY_CACHE_AND_NETWORK = 'cache-and-network';
  var POLICY_CACHE_FIRST = 'cache-first';
  var POLICY_CACHE_ONLY = 'cache-only';
  var POLICY_NO_CACHE = 'no-cache';
  var STATUS_IDLE = 'idle';
  var STATUS_PENDING = 'pending';
  var STATUS_SUCCESS = 'success';
  var STATUS_ERROR = 'error';
  var defaultOptions = {
    config: function config() {
      throw Error('No action specified!');
    },
    fetchPolicy: POLICY_NETWORK_ONLY
  };

  var SmartQuery =
  /*#__PURE__*/
  function () {
    function SmartQuery(vm, name) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, SmartQuery);

      this.name = name;
      this.rawOptions = _objectSpread2({}, defaultOptions, {}, options);
      this.vm = vm;
      this.watchers = [];
      this.observable = Vue.observable({
        info: {}
      });
      this.init();
      this.run();
    }

    _createClass(SmartQuery, [{
      key: "init",
      value: function init() {
        this.watchers.push(this.vm.$watch(this.computeOptions.bind(this), this.onComputeOptionsChange.bind(this)), this.vm.$watch(this.readCachedRequest.bind(this), this.onRequestDataChange.bind(this), {
          deep: true
        }));
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.watchers.forEach(function (unwatch) {
          return unwatch();
        });
      }
    }, {
      key: "run",
      value: function run() {
        var computedOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.computeOptions();
        var skip = computedOptions.skip,
            config = computedOptions.config,
            fetchPolicy = computedOptions.fetchPolicy;
        if (skip) return;
        var info = this.createRequestInfo(config);
        this.info = info;
        var cacheValue;

        if ([POLICY_CACHE_AND_NETWORK, POLICY_CACHE_FIRST, POLICY_CACHE_ONLY].includes(fetchPolicy)) {
          cacheValue = this.fetchFromCache();
        }

        if ([POLICY_CACHE_AND_NETWORK, POLICY_NETWORK_ONLY, POLICY_NO_CACHE].includes(fetchPolicy) || fetchPolicy === POLICY_CACHE_FIRST && !cacheValue) {
          var noCache = fetchPolicy === POLICY_NO_CACHE;
          this.fetch({
            config: config,
            noCache: noCache
          }, info);
        }
      }
    }, {
      key: "createRequestInfo",
      value: function createRequestInfo(config) {
        return {
          requestId: this.$jsonapi.cache.getRequestId(config),
          status: STATUS_IDLE
        };
      }
    }, {
      key: "readCachedRequest",
      value: function readCachedRequest() {
        var requestId = this.info.requestId;
        return this.$jsonapi.cache.readRequest(requestId);
      }
    }, {
      key: "fetchFromCache",
      value: function fetchFromCache() {
        var _ref = this.request || {},
            data = _ref.data;

        if (data) this.data = data;
        return data;
      }
    }, {
      key: "fetch",
      value: function fetch(options) {
        var _this = this;

        var info = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.info;
        info.status = STATUS_PENDING;
        var promise = this.$jsonapi.request(options).then(function (response) {
          info.status = STATUS_SUCCESS;
          return response;
        })["catch"](function (error) {
          info.status = STATUS_ERROR;

          if (_this.rawOptions.error) {
            _this.rawOptions.error.call(_this.vm, error);

            return null;
          }

          throw error;
        });
        return promise;
      }
    }, {
      key: "refetch",
      value: function refetch() {
        var _this$computeOptions = this.computeOptions(),
            skip = _this$computeOptions.skip,
            config = _this$computeOptions.config,
            fetchPolicy = _this$computeOptions.fetchPolicy;

        if (skip) return;
        var noCache = fetchPolicy === POLICY_NO_CACHE;
        return this.fetch({
          config: config,
          noCache: noCache
        });
      }
    }, {
      key: "onComputeOptionsChange",
      value: function onComputeOptionsChange(options, oldOptions) {
        var determinants = ['variables', 'skip'];
        pick(options, determinants);

        if (!isEqual(pick(options, determinants), pick(oldOptions, determinants))) {
          this.run(options);
        }
      }
    }, {
      key: "computeOptions",
      value: function computeOptions() {
        var skip = typeof this.rawOptions.skip === 'function' ? this.rawOptions.skip.call(this.vm) : this.rawOptions.skip;
        if (skip) return {
          skip: skip
        };
        var variables = typeof this.rawOptions.variables === 'function' ? this.rawOptions.variables.call(this.vm) : this.rawOptions.variables;
        var config = typeof this.rawOptions.config === 'function' ? this.rawOptions.config.call(this.vm, variables) : this.rawOptions.config;
        return _objectSpread2({}, this.rawOptions, {
          variables: variables,
          config: config,
          skip: skip
        });
      }
    }, {
      key: "onRequestDataChange",
      value: function onRequestDataChange(request) {
        if (request) return this.data = request.data;
      }
    }, {
      key: "$jsonapi",
      get: function get() {
        return this.vm.$jsonapi;
      }
    }, {
      key: "loading",
      get: function get() {
        return this.info.status === STATUS_PENDING;
      }
    }, {
      key: "info",
      get: function get() {
        return this.observable.info;
      },
      set: function set(info) {
        return this.observable.info = info;
      }
    }, {
      key: "data",
      set: function set(data) {
        if (data) {
          var updated = this.rawOptions.update ? this.rawOptions.update.call(this.vm, data, this.request) : data;

          if (!Object.prototype.hasOwnProperty.call(this.vm, this.name)) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn('Default value for jsonapi query is not specified in component\'s `data` object.');
            }

            return;
          }

          this.vm.$set(this.vm, this.name, updated);
        }
      }
    }, {
      key: "request",
      get: function get() {
        return this.readCachedRequest();
      }
    }]);

    return SmartQuery;
  }();

  var DolarJsonapi =
  /*#__PURE__*/
  function () {
    function DolarJsonapi(_ref) {
      var cache = _ref.cache,
          client = _ref.client;

      _classCallCheck(this, DolarJsonapi);

      this.cache = cache;
      this.client = client;
      this.queries = {};
    }

    _createClass(DolarJsonapi, [{
      key: "addQuery",
      value: function addQuery(vm, name, options) {
        this.queries[name] = new SmartQuery(vm, name, options);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        Object.values(this.queries).forEach(function (sq) {
          return sq.destroy();
        });
      }
    }, {
      key: "request",
      value: function request(_ref2) {
        var _this = this;

        var config = _ref2.config,
            noCache = _ref2.noCache;
        var cacheRequest = config.method === 'get';

        if (cacheRequest && !noCache) {
          this.cache.initRequest(config);
        }

        return this.client.request(config).then(function (response) {
          var parsed = _this.cache.parseResponse(config, response);

          var raw = _objectSpread2({}, response, {
            data: _objectSpread2({}, response.data, {
              data: response.data.data && metadata(response.data.data),
              included: response.data.included && metadata(response.data.included)
            })
          });

          if (!noCache) {
            parsed.persist();
            if (cacheRequest) _this.cache.writeRequestData(config, parsed.getData, raw);
          }

          return {
            raw: raw,

            get data() {
              return parsed.getData();
            }

          };
        });
      }
    }]);

    return DolarJsonapi;
  }();

  var defaultConfig = {
    getRequestId: function getRequestId(_ref) {
      var method = _ref.method,
          url = _ref.url;
      return "".concat(method, ":").concat(url);
    },
    getRecordId: function getRecordId(_ref2) {
      var type = _ref2.type,
          id = _ref2.id;
      return "".concat(type, ":").concat(id);
    }
  };

  var Cache =
  /*#__PURE__*/
  function () {
    function Cache() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Cache);

      this.options = _objectSpread2({}, defaultConfig, {}, config);
      this.actionIndex = 0;
      this.state = Vue.observable({
        records: {},
        requests: {}
      });
    }

    _createClass(Cache, [{
      key: "initRequest",
      value: function initRequest(config) {
        var requestId = this.getRequestId(config);
        reactiveEnsurePath(this.state.requests, [requestId], Object.freeze({
          requestId: requestId,
          data: function data() {
            return null;
          }
        }));
      }
    }, {
      key: "writeRequestData",
      value: function writeRequestData(config, dataGetter, raw) {
        var requestId = this.getRequestId(config);
        this.state.requests[requestId] = Object.freeze(_objectSpread2({}, this.state.requests[requestId], {
          timestamp: +new Date(),
          data: dataGetter,
          raw: raw
        }));
        return this.state.requests[requestId];
      }
    }, {
      key: "readRequest",
      value: function readRequest(requestId) {
        var request = this.state.requests[requestId];
        return request && _objectSpread2({}, request, {
          get data() {
            return request.data();
          }

        });
      }
    }, {
      key: "read",
      value: function read(record) {
        return this.state.records[this.getRecordId(record)];
      }
    }, {
      key: "parseResponse",
      value: function parseResponse(config, response) {
        var _this = this;

        if (config.method === 'get' && response.status === 200 || config.method === 'post' && [200, 201].includes(response.status) || config.method === 'patch' && [200, 201, 204].includes(response.status)) {
          var dataFromRequest = ['post', 'patch'].includes(config.method) && response.status === 204;
          var data = dataFromRequest ? config.data : response.data.data;
          var included = response.data.included;
          var records = this.collectRecords(data);
          var includedRecords = asTruthyArray(data).concat(included || []);
          var includedRecordsIds = includedRecords.map(this.getRecordId);
          var mutations = Array.from(records).map(function (recordId) {
            return function (ctx) {
              return reactiveEnsurePath(ctx.state.records, [recordId], null);
            };
          }).concat(includedRecordsIds.map(function (recordId) {
            return function (ctx) {
              return reactiveEnsurePath(ctx.state.records, [recordId], {});
            };
          })).concat(includedRecords.map(function (rec) {
            return function (ctx) {
              var recordId = _this.getRecordId(rec);

              var extendedNormalizedRec = assignPropertyDescriptors({}, ctx.state.records[recordId], normalize(ctx, rec));
              ctx.state.records[recordId] = Object.freeze(extendedNormalizedRec);
            };
          }));
          var getter = null;

          var createGetter = function createGetter(ctx) {
            return function () {
              return Array.isArray(data) ? data.map(ctx.read.bind(ctx)) : ctx.read(data);
            };
          };

          return {
            persist: function persist() {
              mutations.forEach(function (commit) {
                return commit(_this);
              });
              getter = createGetter(_this);
            },
            getData: function getData() {
              if (getter) return getter();
              var state = {
                records: []
              };

              var read = function read(record) {
                return state.records[_this.getRecordId(record)];
              };

              var temporaryContext = {
                state: state,
                read: read
              };
              mutations.forEach(function (commit) {
                return commit(temporaryContext);
              });
              getter = createGetter(temporaryContext);
              return getter();
            }
          };
        }

        return {
          persist: function persist() {},
          getData: function getData() {
            return response;
          }
        };
      }
    }, {
      key: "collectRecords",
      value: function collectRecords(data) {
        var _this2 = this;

        var records = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();

        if (data) {
          asTruthyArray(data).map(this.getRecordId).forEach(function (id) {
            return records.add(id);
          });
          asTruthyArray(data).forEach(function (record) {
            var relationships = record.relationships || {};
            Object.keys(relationships).forEach(function (rel) {
              return _this2.collectRecords(relationships[rel].data, records);
            });
          });
        }

        return records;
      }
    }, {
      key: "getRecordId",
      get: function get() {
        return this.options.getRecordId;
      }
    }, {
      key: "getRequestId",
      get: function get() {
        return this.options.getRequestId;
      }
    }]);

    return Cache;
  }();

  var plugin = DolarJsonapi;

  function install(Vue, _ref) {
    var cache = _ref.cache,
        client = _ref.client;
    if (install.installed) return;
    install.installed = true; // Options merging

    Vue.config.optionMergeStrategies.jsonapi = Vue.config.optionMergeStrategies.computed; // Lazy creation

    Object.defineProperty(Vue.prototype, '$jsonapi', {
      get: function get() {
        if (!this.$_jsonapi) {
          this.$_jsonapi = new DolarJsonapi({
            cache: cache,
            client: client
          });
        }

        return this.$_jsonapi;
      }
    });
    Vue.mixin({
      created: function created() {
        var _this = this;

        var queries = this.$options.jsonapi;

        if (queries) {
          var queriesNames = Object.keys(queries);
          queriesNames.forEach(function (name) {
            _this.$jsonapi.addQuery(_this, name, queries[name]);
          });
        }
      },
      beforeDestroy: function beforeDestroy() {
        if (this.$_jsonapi) {
          this.$_jsonapi.destroy();
        }
      }
    });
  }

  plugin.install = install; // Auto-install

  var GlobalVue = null;

  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  }

  exports.Cache = Cache;
  exports.default = plugin;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
