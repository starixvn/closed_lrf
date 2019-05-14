"use strict";
define(["lib/linq"], function () {
    function sort(arrayData, sortByFunc, sortOrder, sortThenByFunc, sortThenOrder) {
        if (!sortByFunc || arrayData.length <= 1) {
            return arrayData;
        }

        var sortType = sortOrder === "asc" ? "OrderBy" : "OrderByDescending";

        if (!sortThenByFunc) {
            return Enumerable.From(arrayData)[sortType](sortByFunc).ToArray();
        }

        var sortThenType = sortThenOrder === "asc" ? "ThenBy" : "ThenByDescending";

        return Enumerable.From(arrayData)[sortType](sortByFunc)[sortThenType](sortThenByFunc).ToArray();
    }

    return {
        sort: sort
    };
});