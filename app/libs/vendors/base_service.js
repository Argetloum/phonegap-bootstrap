/* global angular */
'use strict'; // jshint ignore:line


angular.module('toolkit.base_service',  [])
    .service('BaseService', ['Utils', 'Config', function (Utils, Config)
{
    /**
     * Usage
     *
     * inject BaseService in your service
     * create a new, fresh service bind to your Api whit some options
     *     var options = {
     *          maxResults: 33,
                ...
     *          };
     *     var myService = BaseService.createService(MyApi, options);
     *
     * then customize it
     *     myService.maxResults = 42
     *     myService.defaultParams = { parentKey: 123456789 };
     *
     * and expose to the world (!)
     *
     *     return myService;
     *
     *
     *
     * You can overwrite service methods like this:
     *     myService.methodName = function(@params1...n)
     *     {
     *          // some custom logic here
     *          // ...
     *
     *          // just call the underscore version of the method at the end
     *          return this._methodName(@params1...n)
     *     }
     *
     *
     */


    /**
     * Service Builder
     * create a service instance
     * @param {Object} Api Real Api resource
     * @param {Object} options an object of options
     * @return {Object} A servive instance
     */
    function createService(Api, options)
    {
        var _serv = new SimpleService(Api, options);
        return _serv;
    }

    /**
     * List Key Service Builder
     * create a service instance, this service can handle list key
     * @param {Object} Api Real Api resource
     * @param {Object} options an object of options
     * @return {Object} A servive instance
     */

    function createListKeyService(Api, options)
    {
        var _serv = new ListKeyService(Api, options);
        return _serv;
    }

    /**
     * Paginated Service Builder
     * create a service instance with paginated fetch
     * @param {Object} Api Real Api resource
     * @param {Object} options an object of options
     * @return {Object} A servive instance
     */

    function createPaginatedService(Api, options)
    {
        var _serv = new PaginatedService(Api, options);
        return _serv;
    }


    // =============================================================================
    // ============================= Simple  =======================================
    // =============================================================================


    // PRIVATE ATTRIBUTES

    var _localListTimeout = Config.localListTimeout || 60000;

    /**
     * CONSTRUCTOR
     * @param {Object} Api Real Api resource
     */
    var SimpleService = function(Api, options)
    {
        var acceptedOptions = {
            maxResults: 'number',
            objectIdentifier: 'string',
            defaultParams: 'object',
            autoInit: 'boolean',
            preSave: 'function',
            postSave: 'function',
            postGet: 'function',
            postList: 'function'
        };

        this.Api = Api || {};

        // max results per fetch
        this.maxResults = 30;
        // for list, which object.property should be check as object id
        this.objectIdentifier = 'objectKey';
        // store default param to pass on _getWithParams or filter
        this.defaultParams = {};
        // auto fetch some result on the first getList() call
        this.autoInit = true;

        //
        // hooks
        //
        // preSave : transform object just before it is send to Api.save()
        this.preSave = undefined;
        // postSave : transform object just after it is send to Api.save()
        this.postSave = undefined;
        // postGet : transform object return by get() from local list or Api.get() call
        this.postGet = undefined;
        // postList : transform list return by Api.list()
        this.postList = undefined;

        // update options
        var instance = this;

        if (angular.isDefined(options))
        {
            angular.forEach(acceptedOptions, function(type, option)
            {
                if(angular.isDefined(options[option]))
                {
                    if (typeof options[option] != type)
                    {
                        throw new TypeError(option + ' must be a ' + type);
                    }

                    instance[option] = options[option];
                }
            });
        }

        // many attribut are not mandatory and can be defined at run level
        // they are set here for clarity
        //
        // Current edited object
        this._current = undefined;

        // store temp value during call proccess
        // to check response consistency
        this._lastListCallId = undefined;
        this._lastCallId = undefined;
        this._lastRefreshDate = undefined;
        this._saveInProgress = undefined;
        this._deleteInProgress = undefined;

        // object list, populated by fetch
        this._list = [];
    };

    /**
     * Main get function
     * @param  {String}   key      The objectIdentifier used to retrieve object
     * @param  {Function} callback success callback
     * @param  {Function} errorCb  error callback
     * @return {Object}            the object or a ref to the object in
     *                             case of a Api call
     */
    SimpleService.prototype.get = function(key, callback, errorCb)
    {
        return this._get(key, callback, errorCb);
    };

    /**
     * Main getAsync function
     * @param  {String}   key      The objectIdentifier used to retrieve object
     * @param  {Function} callback success callback
     * @param  {Function} errorCb  error callback
     * @return {Object}            the object or a ref to the object in
     *                             case of a Api call
     */
    SimpleService.prototype.getAsync = function(key, callback, errorCb)
    {
        return this._getAsync(key, callback, errorCb);
    };

    /**
     * Main getList function
     * You can overwrite it like this:
     * myService.getList = function(callback, errorCb)
     * {
     *      // some custom logic here
     *      // ...
     *      // IMPORTANT
     *      return this._getList(callback, errorCb)
     * }
     * @param  {Function} callback success callback
     * @param  {Function} errorCb  error callback
     * @return {Object}            the object list
     */
    SimpleService.prototype.getList = function(callback, errorCb)
    {
        return this._getList(callback, errorCb);
    };

    /**
     * Main fetch function
     * You can overwrite it like this:
     * myService.fetch = function(queryFilters, callback, errorCb)
     * {
     *      // some custom logic here
     *      // manage queryFilters
     *      // extend callback
     *      // ...
     *      // IMPORTANT
     *      return this._fetch(queryFilters, callback, errorCb)
     * }
     * @param  {Object} queryFilters to pass to the Api
     * @param  {Function} callback success callback
     * @param  {Function} errorCb  error callback
     */
    SimpleService.prototype.fetch = function(queryFilters, callback, errorCb)
    {
        return this._fetch(queryFilters, callback, errorCb);
    };


    /**
     * Main delete function
     * You can overwrite it like this:
     * myService.del = function(key, callback, errorCb)
     * {
     *      // some custom logic here

     *      // IMPORTANT
     *      return this._del(key, callback, errorCb)
     * }
     * @param  {String} key key of the object to delete
     * @param  {Function} callback success callback
     * @param  {Function} errorCb  error callback
     */
    SimpleService.prototype.del = function(key, callback, errorCb)
    {
        return this._del(key, callback, errorCb);
    };

    /**
     * Main deleteMulti function

     * @param  {Array} list of object keys to delete
     * @param  {Function} callback success callback
     * @param  {Function} errorCb  error callback
     */
    SimpleService.prototype.delMulti = function(keyList, callback, errorCb)
    {
        return this._delMulti(keyList, callback, errorCb);
    };

    /**
     * Main save function
     * You can overwrite it like this:
     * myService.save = function(object, callback, errorCb)
     * {
     *      // some custom logic here

     *      // IMPORTANT
     *      return this._save(key, callback, errorCb)
     * }
     * @param  {Object} object the object to save
     * @param  {Function} callback success callback
     * @param  {Function} errorCb  error callback
     */
    SimpleService.prototype.save = function(object, callback, errorCb)
    {
        return this._save(object, callback, errorCb);
    };

    /**
     * Main isCallInProgress function
     *
     * @param {String} functionName specify witch call you want to check
     *                                     in [list, save, get, del]
     */
    SimpleService.prototype.isCallInProgress = function(functionName)
    {
        return this._isCallInProgress(functionName);
    };

    // "PRIVATE" functions
    //
    // we need to keep them in public Api to allow overwriting

    /**
     * get object by key in async way and return the promise given
     * @param  {String}   key      The objectkey used to retrieve object
     *         {Object}   key      params used to retrieve object ( use Api call)
     * @param  {Function} callback        success callback
     * @param  {Function} errorCb  error callback
     * @return {Object}            the object or a ref to the object in
     *                             case of a Api call
     */
    SimpleService.prototype._getAsync = function(key, callback, errorCb)
    {
        if(angular.isUndefined(key))
        {
            return;
        }

        // Quick and dirty way to extend get with additional behavior
        if (angular.isObject(key))
        {
            // key is an object with additional params
            var params = key;
            return this._getWithParams(params, callback, errorCb);
        }

        // use the Api
        var instance = this;
        var param = {};
        param[this.objectIdentifier] = key;

        return this.Api.get(param, function(resp)
        {
            if (instance.postGet)
            {
                resp = instance.postGet(resp);
            }
            instance.setCurrent(resp);
            if (callback)
            {
                callback(resp);
            }
        }, errorCb);
    };

    /**
     * get object by key from the _list if available
     * else call the Api to retrieve object
     * @param  {String}   key      The objectkey used to retrieve object
     *         {Object}   key      params used to retrieve object ( use Api call)
     * @param  {Function} callback        success callback
     * @param  {Function} errorCb  error callback
     * @return {Object}            the object or a ref to the object in
     *                             case of a Api call
     */
    SimpleService.prototype._get = function(key, callback, errorCb)
    {

        if(angular.isUndefined(key))
        {
            return;
        }

        // Quick and dirty way to extend get with additional behavior
        if (angular.isObject(key))
        {
            // key is an object with additional params
            var allParams = angular.copy(this.defaultParams);
            angular.extend(allParams, key);
            return this._getWithParams(allParams, callback, errorCb);
        }

        // return object from the list if available
        for (var idx in this._list)
        {
            if (this._list[idx][this.objectIdentifier] === key)
            {
                var resp = this._list[idx];
                if (this.postGet)
                {
                    resp = this.postGet(resp);
                }

                if (callback)
                {
                    callback(resp);
                }
                this.setCurrent(resp);
                return resp;
            }
        }
        // object not found in local list, try to get it from serveur
        if (this._lastListCallId === undefined)
        {
            // use the Api
            var instance = this;
            var param = {};
            param[this.objectIdentifier] = key;
            this._lastCallId = Utils.generateUUID();
            this.Api.get(param, function(resp)
            {
                if (instance.postGet)
                {
                    resp = instance.postGet(resp);
                }

                instance.setCurrent(resp);

                if (callback)
                {
                    callback(instance.getCurrent());
                }
                instance._lastCallId = undefined;

            }, function(errorResp)
            {
                if (errorCb)
                {
                    errorCb(errorResp);
                }
                instance._lastCallId = undefined;
            }
            );

        }
        return undefined;
    };

    /**
     * Set object as current for this service
     *
     * @param {Object} object
     */
    SimpleService.prototype.setCurrent = function(object)
    {
        this._current = object;
    };

    /**
     * Get current object
     *
     * @return {Object} object
     */
    SimpleService.prototype.getCurrent = function()
    {
        return this._current;
    };

    /**
     * get object by parameters from Api
     *
     * @param  {Object}   params     parameters
     * @param  {Function} callback        success callback
     * @param  {Function} errorCb  error callback
     * @return {Object}            the object or a ref to the object in
     *                             case of a Api call
     */
    SimpleService.prototype._getWithParams = function(params, callback, errorCb)
    {
        // force a Api call
        // TODO check in local list if available by params
       // use the Api
        var instance = this;
        params = params || {};

        this._lastCallId = Utils.generateUUID();
        return this.Api.get(params, function(resp)
        {
            if (instance.postGet)
            {
                resp = instance.postGet(resp);
            }
            instance._current = resp;
            if (callback)
            {
                callback(resp);
            }
            instance._lastCallId = undefined;
        }, function(errorResp)
        {
            if (errorCb)
            {
                errorCb(errorResp);
            }
            instance._lastCallId = undefined;
        });
    };

    /**
     * Get list of object
     * trigger refresh if no previous fetch or after _localListTimeout
     * @param  {Function} callback success callback
     * @param  {Function} errorCb  error callback
     * @return {Object}            the object list
     */
    SimpleService.prototype._getList = function(callback, errorCb)
    {
        if (this.autoInit &&
            angular.isUndefined(this._lastListCallId) &&
            (angular.isUndefined(this._lastRefreshDate) ||
            Date.now() - this._lastRefreshDate > _localListTimeout))
        {
            if (callback)
            {
                this.fetch(undefined, function(resp)
                {
                    callback(resp.items);
                }, errorCb);
            }
            else
            {
                this.fetch(undefined, callback, errorCb);
            }
        }

        if (callback)
        {
            callback(this._list);
        }
        return this._list;
    };

    /**
     * Fetch object list from Api
     * Should not be used directly, use 'fetch' instead
     * @param  {Object} queryFilters to pass to the Api
     * @param  {Function} callback success callback
     * @param  {Function} errorCb  error callback
     */
    SimpleService.prototype._fetch = function(queryFilters, callback, errorCb)
    {
        var requestData = {
            maxResults: this.maxResults
        };

        // merge queryFilters in requestData
        for (var o in this.defaultParams)
        {
            requestData[o] = this.defaultParams[o];
        }

        // merge queryFilters in requestData
        for (var o in queryFilters)
        {
            requestData[o] = queryFilters[o];
        }

        this._lastListCallId = Utils.generateUUID();
        requestData.callId = this._lastListCallId;

        var instanceList = this;

        return this.Api.list(requestData, function(resp)
        {
            // check the response is for the right question
            if(resp.callId !== instanceList._lastListCallId)
            {
                return;
            }

            if (instanceList.postList)
            {
                resp.items = instanceList.postList(resp.items);
            }

            instanceList._list = resp.items || [];
            instanceList._lastListCallId = undefined;
            instanceList._lastRefreshDate = Date.now();

            if (callback)
            {
                callback(instanceList._list);
            }
        }, function(err)
        {
            instanceList._lastListCallId = undefined;
            if(errorCb)
            {
                errorCb(err);
            }
        });
    };

    /**
     * Delete object and update _list
     * @param  {String} key key of the object to delete
     * @param  {Function} callback success callback
     * @param  {Function} errorCb  error callback
     */
    SimpleService.prototype._del = function(key, callback, errorCb)
    {
        var instance = this;
        instance._deleteInProgress = Utils.generateUUID();

        var param = {};
        param[this.objectIdentifier] = key;

        this.Api.delete(param, function()
        {
            for(var idx in instance._list)
            {
                if(instance._list[idx][instance.objectIdentifier] === key)
                {
                    instance._list.splice(idx, 1);
                    break;
                }
            }
            instance._deleteInProgress = undefined;
            if (callback)
            {
                callback();
            }
        }, function(err)
        {
            instance._deleteInProgress = undefined;
            if(errorCb)
            {
                errorCb(err);
            }
        });
    };

    /**
     * Delete objects and update _list
     * @param  {Array} list of object keys to delete
     * @param  {Function} callback success callback
     * @param  {Function} errorCb  error callback
     */
    SimpleService.prototype._delMulti = function(keyList, callback, errorCb)
    {
        var instance = this;
        instance._deleteInProgress = Utils.generateUUID();

        var param = {};
        param.uid = keyList;

        this.Api.deleteMulti(param, function(resp)
        {
            for(var item in resp.uid)
            {
                for(var idx in instance._list)
                {
                    if(instance._list[idx][instance.objectIdentifier] === resp.uid[item])
                    {
                        instance._list.splice(idx, 1);
                    }
                }
            }
            if (callback)
            {
                callback(resp);
            }
            instance._deleteInProgress = undefined;

        }, function(err)
        {
            if(errorCb)
            {
                errorCb(err);
            }
            instance._deleteInProgress = undefined;
        });
    };

    /**
     * Save object and update _list
     * @param  {Object}  object the object to save
     * @param  {Function} callback success callback
     * @param  {Function} errorCb  error callback
     */
    SimpleService.prototype._save = function(object, callback, errorCb)
    {

        var instance = this;
        instance._saveInProgress = Utils.generateUUID();

        // use preSave hook
        if (angular.isDefined(this.preSave))
        {
            object = this.preSave(object);
        }

        this.Api.save(object, function(resp)
        {
            var insert = false;

            // use postSave hook
            if (angular.isDefined(instance.postSave))
            {
                resp = instance.postSave(resp);
            }

            for(var idx in instance._list)
            {
                if(instance._list[idx][instance.objectIdentifier] === resp[instance.objectIdentifier])
                {
                    Utils.copyObjectToExistingOne(resp, instance._list[idx]);
                    insert = true;
                }
            }

            if(!insert)
            {
                instance._list.push(resp);
            }
            instance.setCurrent(resp);
            instance._saveInProgress = undefined;
            if(callback)
            {
                callback(resp);
            }

        }, function(err)
        {
            instance._saveInProgress = undefined;
            if(errorCb)
            {
                errorCb(err);
            }
        });
    };

    /**
     * isCallInProgress check Service activity
     * usefull for notificatio nand/or progress bar
     * @return {Boolean} true if any call is in progress
     */
    SimpleService.prototype._isCallInProgress = function(functionName)
    {
        var callIds = {
            list: '_lastListCallId',
            get: '_lastCallId',
            save: '_saveInProgress',
            del: '_deleteInProgress'
        };

        if (callIds[functionName] !== undefined)
        {
            return this[callIds[functionName]] !== undefined;
        }

        var isCallInProgress = false;
        var instance = this;
        angular.forEach(callIds, function(id)
        {
            isCallInProgress = isCallInProgress || instance[id] !== undefined;
        });
        return isCallInProgress;
    };


    // =============================================================================
    // ============================ PAGINATED  =====================================
    // =============================================================================

    /*
     * Paginated Service
     * manage paginated list of object
     *
     * 'public' Api:
     *
     *  filterize()            initialize query
     *  getList()              get current list
     *  nextPage()             fetch next page of results
     *  get()
     *  save()
     *  del()
     *  isCallinProgress()
     *
     *  maxResults
     *  defaultParams

     * this service inherit from SimpleService
     *
     */
    var PaginatedService = function(Api, options)
    {
        // inherit property from SimpleService
        SimpleService.call(this, Api, options);

        this._cursor = undefined;
        this._more = false;
        this._firstRun = true;
        this._params = {};
    };

    PaginatedService.prototype = Object.create(SimpleService.prototype);

    /**
     * Reset the local list, the local filter and query for the first results
     * @param {Object} params
     * @param {Function} callback
     * @param {Function} errorCb
     */
    PaginatedService.prototype.filterize = function(params, callback, errorCb)
    {
        return this._filterize(params, callback, errorCb);
    };

    PaginatedService.prototype._filterize = function(params, callback, errorCb)
    {
        params = params || {};
        var allParams = angular.copy(this.defaultParams);
        angular.extend(allParams, params);

        this._list = [];

        this._lastListCallId = undefined;
        this._more = true;
        this._cursor = undefined;
        this._params = allParams;

        return this.fetch(allParams, callback, errorCb);
    };

    /**
     * Return "_more" status
     */
    PaginatedService.prototype.hasMore = function()
    {
        return this._more;
    };

    /**
     * Get the next page from the API according to the local filter attributes
     * Do nothing if the "_more" boolean is false
     * @param {Function} callback
     * @param {Function} errorCb
     */
    PaginatedService.prototype.nextPage = function(callback, errorCb)
    {
        return this._nextPage(callback, errorCb);
    };

    PaginatedService.prototype._nextPage = function(callback, errorCb)
    {
        if (this._more && !this._isCallInProgress())
        {
            this.fetch(this._params, callback, errorCb);
        }
    };


    /**
     * Return current list and initialize if empty
     *
     * @param  {Function}   callback
     * @param  {Function}   errorCb
     * @return {List}       current list
     */
    PaginatedService.prototype._getList = function(callback, errorCb)
    {
        // initialize this._list
        if (this._firstRun && this._list.length === 0 && this.autoInit)
        {
            this.filterize(null, callback, errorCb);
            this._firstRun = false;
        }

        if (callback)
        {
            callback(this._list);
        }
        return this._list;
    };

    /**
     * Call the API to list items according to the local filter
     * Use a callId in case of multiple request during a short time
     * Handle with pagination params
     * Update the local list
     *
     * @param {Object} query filters
     * @param {Function} callback
     * @param {Function} errorCb
     */
    PaginatedService.prototype._fetch = function(queryFilter, callback, errorCb)
    {
        this._lastListCallId = Utils.generateUUID();

        if (!this._more)
        {
            return;
        }

        var requestData = {
            maxResults: this.maxResults,
            callId: this._lastListCallId,
            more: this._more,
            cursor: this._cursor
        };

        this._firstRun = false;
        queryFilter = queryFilter || {};
        angular.extend(requestData, queryFilter);

        var instanceList = this;
        return this.Api.list(requestData, function(resp)
        {
            // check the response is for the right question
            if(resp.callId !== instanceList._lastListCallId)
            {
                return;
            }


            if (instanceList.postList)
            {
                resp.items = instanceList.postList(resp.items, instanceList._list);
            }

            instanceList._more = resp.more;
            instanceList._cursor = resp.cursor;
            instanceList._lastListCallId = undefined;
            instanceList._lastRefreshDate = Date.now();

            if (resp.items)
            {
                instanceList._list = instanceList._list.concat(resp.items);
            }
            if (callback)
            {
                callback(instanceList._list);
            }
        }, function(err)
        {
            instanceList._lastListCallId = undefined;
            if(errorCb)
            {
                errorCb(err);
            }
        });
    };


    // =============================================================================
    // ============================== LIST KEY =====================================
    // =============================================================================

    /*
     * List Key Service
     * This service manage a list of PaginatedService by name
     * and delegate calls to them
     *
     * 'public' Api
     *  filterize(...., listKey)    initialize query
     *  getList(...., listKey)      get current list
     *  nextPage(...., listKey)     fetch next page of results
     *  get(...., listKey)
     *  save(...., listKey)
     *  del(...., listKey)
     *  isCallinProgress(listKey)
     *
     *  maxResults
     *  defaultParams
     *
     */

    var listKeyBaseService = createPaginatedService;

    var ListKeyService = function(Api, options)
    {
        var acceptedOptions = [
            'maxResults',
            'objectIdentifier',
            'defaultParams',
            'autoInit'];

        this.Api = Api;
        this.maxResults = 30;
        // auto fetch some result on the first getList() call
        this.autoInit = true;
        // default param to pass to filterize
        this.defaultParams = {};
        this.objectIdentifier = 'objectKey';
        // service instances by key
        this._services = {};

        this.options = options || {};

        var instance = this;
        if (angular.isDefined(options))
        {
            angular.forEach(acceptedOptions, function(option)
            {
                if(angular.isDefined(options[option]))
                {
                    instance[option] = options[option];
                }
            });
        }
    };

    /**
     * Initialize a listKey service
     * @param  {String} listKey        name of te listKey
     * @param  {Object} defaultParams defaults parameters to use, else use ListKeyService.defaultParams
     */
    ListKeyService.prototype.initList = function(listKey, defaultParams)
    {
        var _service = listKeyBaseService(this.Api, this.options);
        _service.maxResults = this.maxResults;
        _service.objectIdentifier = this.objectIdentifier;
        _service.defaultParams = defaultParams || this.defaultParams;
        this._services[listKey] = _service;
    };

    /**
     * Intialize request
     * @param {String} listKey which list to use
     */
    ListKeyService.prototype.filterize = function(params, callback, errorCb, listKey)
    {
        listKey = this._getListKey(listKey);
        return this._services[listKey]._filterize(params, callback, errorCb);
    };

    /**
     * Get next page of result if any
     * @param {String} listKey which list to use
     */
    ListKeyService.prototype.nextPage = function(callback, errorCb, listKey)
    {
        listKey = this._getListKey(listKey);
        return this._services[listKey]._nextPage(callback, errorCb);
    };

    /**
     * Get current list
     * @param {String} listKey which list to use
     */
    ListKeyService.prototype.getList = function(callback, errorCb, listKey)
    {
        listKey = this._getListKey(listKey);
        return this._services[listKey]._getList(callback, errorCb);
    };


    ListKeyService.prototype.get = function(key, callback, errorCb, listKey)
    {
        listKey = this._getListKey(listKey);
        return this._services[listKey]._get(key, callback, errorCb);
    };

    ListKeyService.prototype.getAsync = function(key, callback, errorCb, listKey)
    {
        listKey = this._getListKey(listKey);
        return this._services[listKey]._getAsync(key, callback, errorCb);
    };

    ListKeyService.prototype.save = function(object, callback, errorCb, listKey)
    {
        listKey = this._getListKey(listKey);
        return this._services[listKey]._save(object, callback, errorCb);
    };

    ListKeyService.prototype.del = function(key, callback, errorCb, listKey)
    {
        listKey = this._getListKey(listKey);
        return this._services[listKey]._del(key, callback, errorCb);
    };

    ListKeyService.prototype.delMulti = function(keyList, callback, errorCb, listKey)
    {
        listKey = this._getListKey(listKey);
        return this._services[listKey]._delMulti(keyList, callback, errorCb);
    };

    ListKeyService.prototype.getCurrent = function(listKey)
    {
        listKey = this._getListKey(listKey);
        return this._services[listKey]._current;
    };

    ListKeyService.prototype.setCurrent = function(object, listKey)
    {
        listKey = this._getListKey(listKey);
        return this._services[listKey].setCurrent(object);
    };

    /**
     * Get the correct key for the list and init service instance
     * @param {string} listKey
     * @return {string}
     */
    ListKeyService.prototype._getListKey = function(listKey)
    {
        var key = (angular.isDefined(listKey)) ? listKey : 'default';

        // get from listKey or create a new list
        if(angular.isUndefined(this._services[key]))
        {
            this.initList(key);
        }
        return key;
    };

    // ListKeyService.prototype.fetch = function(queryFilters, callback, errorCb, listKey)
    // {
    //     listKey = this._getListKey(listKey);
    //     return this._services[listKey]._fetch(queryFilters, callback, errorCb);
    // };

    ListKeyService.prototype.isCallInProgress = function(listKey, functionName)
    {
        var inProgress = false;

        if (angular.isString(listKey) &&  // scope.$watch may send additional params, skip them
            angular.isDefined(listKey) &&
            angular.isDefined(this._services[listKey]))
        {
            inProgress = this._services[listKey]._isCallInProgress(functionName) || inProgress;
        }
        else
        {
            for (var key in this._services)
            {
                inProgress = this._services[key]._isCallInProgress(functionName) || inProgress;
            }
        }
        return inProgress;
    };

    ListKeyService.prototype.hasMore = function(listKey)
    {
        var key = (angular.isDefined(listKey)) ? listKey : 'default';
        return this._services[key].hasMore();
    };

    return {
        createService: createService,
        createPaginatedService: createPaginatedService,
        createListKeyService: createListKeyService,
        // return object services to allow inheritence
        SimpleService: SimpleService,
        PaginatedService: PaginatedService,
        ListKeyService: ListKeyService
    };
}]);
