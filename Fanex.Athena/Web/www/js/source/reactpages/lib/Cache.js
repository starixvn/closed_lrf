/*
  cache.set('foo', 'bar');
  cache.get('foo'); //'bar'
*/

class Cache {    
    constructor() {
        this._cache = {};
        this._size = 0;
    }

    _remove(key){
        this._size--;
        delete this._cache[key];
    }

    size(){
        return this._size;
    }

    get(key, defaultValue = null) {
        const data = this._cache[key];
        if(!data)
            return defaultValue;
        return data.value;
    }

    // @time: timeout in minute
    set(key, value, time = 1) {
        if(!key || !time || time < 0)
        {
            throw new Error('Invalid params!');
        }
        
        var oldData = this._cache[key];
        if(oldData){
            clearTimeout(oldData.timeout);
        }
        else {
            this._size++;
        }

        let data = { value: value };
        data.timeout = setTimeout(() => this._remove(key), time * 60000);
        this._cache[key] = data;
    }

    clear(){
        for (var key in this._cache) {
            clearTimeout(this._cache[key].timeout);
        }
        this._size = 0;
        this._cache = {};
    }
}

export default new Cache()
   