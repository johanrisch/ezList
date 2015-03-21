/*
This file abstracts the code for hiding and showing columns in a table.
Put all controlling elements inside a container and call initListFilter with the containers id.

The init method takes three ids, all of them should point to the div responsible for containing that control type.

the controls are generated from the in parameters.

each set has three possible functions:
    filter(item) - first function to be called when a set is activated. Should return true for each item that is desirable to be shown in the list
    sort(a, b) - second function to be called. is a normal compare. a and b both has their position saved as a.index and b.index to be able to implement 
                stable sorting in chrome V8.
    activated(self) - called when the set is filtered and sorted.sort

---- Javascript ----
initListFilter("filterContainer");
*/

// self module declaration.
if (typeof window.ez === "undefined") {
    window.ez = {};
}
(function(ez) {
    ez.list = function(opts) {
        // Add the dynamic style to able to hide columns.
        var myStyleElement = (document).createElement('style');
        myStyleElement.setAttribute('id', 'dynamic_style');
        $('head').append(myStyleElement);

        var self = {};

        /**
         * @brief Simple ezFormat function.
         * @return the ezFormatted string
         */
        String.prototype.ezFormat = function() {
            var args = arguments;
            return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function(curlyBrack, index) {
                return ((curlyBrack === "{{") ? "{" : ((curlyBrack === "}}") ? "}" : args[index]));
            });
        };
        // Production steps of ECMA-262, Edition 5, 15.4.4.17
        // Reference: http://es5.github.io/#x15.4.4.17
        if (!Array.prototype.some) {
            Array.prototype.some = function(fun /*, thisArg*/ ) {
                'use strict';

                if (this === null) {
                    throw new TypeError('Array.prototype.some called on null or undefined');
                }

                if (typeof fun !== 'function') {
                    throw new TypeError();
                }

                var t = Object(this);
                var len = t.length >>> 0;

                var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                for (var i = 0; i < len; i++) {
                    if (i in t && fun.call(thisArg, t[i], i, t)) {
                        return true;
                    }
                }

                return false;
            };
        }

        Array.prototype.contains = function(obj) {
            return this.some(function(e) {
                return e === obj;
            });
        };

        // The module object, contains all necessary inezezFormation and methods to use this module.

        // html used to present toggle items.
        self.toggleItemHtml =
            "<span " +
            "class='ezItem ezToggle ezToggleActive col-3' " +
            "data-ezActiontype='toggle' " +
            "data-ezToggle='{0}'" +
            "checked>" +
            "{1}" +
            "</span>";

        // html used to present se titems.
        self.setItemHtml =
            "<span " +
            "class='ezItem ezSet' " +
            "data-ezActiontype='set' " +
            "ezFilterID='{0}'>" +
            "{1}" +
            "</span>";

        // html used to present filter items
        self.filterItemHtml =
            "<span " +
            "class='ezItem ezFilter' " +
            "data-ezActiontype='filter' " +
            "data-ezFilterID='{0}' " +
            ">" +
            "{1}" +
            "</span>";
        self.filterTextItemHtml =
            "<input type='text' " +
            "class='ezItem ezFilter' " +
            "data-ezActiontype='filter' " +
            "data-ezFilterID='{0}' " +
            "placeholder='{1}'" +
            "/>";
        // Sets the visibility of the column.
        self.setColumnVisiblity = function(column, visible) {
            var index = self.columnIndicies[column];
            var checkBox = self.toggleControlDiv.children("[data-ezToggle=" + column + "]").first();
            self.visibility[index] = visible;
            if (visible) {
                checkBox.addClass("ezToggleActive");
                checkBox.attr("checked", true);
                $("tr").each(function(i, element) {
                    $(this).children(":eq(" + (index) + ")").show();
                });
            } else {
                checkBox.removeClass("ezToggleActive");
                checkBox.attr("checked", false);
                $("#ezColGroup").children("col:nth-child(" + (index) + ")").css("display", "none;");
                $("tr").each(function() {
                    $(this).children(":eq(" + (index) + ")").hide();
                });
            }
        };

        /*
         * Sets all culumns in show to shown and all columns in hide to hidden
         */
        self.setVisibilities = function(show, hide) {
            for (var i = 0; i < show.length; i++) {
                self.setColumnVisiblity(show[i], true);
            }
            for (i = 0; i < hide.length; i++) {
                self.setColumnVisiblity(hide[i], false);
            }
        };

        self.loadItems = function(set) {
            var self = self;
            self.items = [];
            var rows = self.tableBody.children("tr");
            rows.each(function(index) {
                var item = {};
                item.data = {};
                item.element = $(this);
                $(this).children().each(function(index) {
                    var columnName = self.columnNames[index];
                    item.data[columnName] = $(this).text();
                    item.matching = true;
                });
                self.items.push(item);
            });
            self.unFilteredItems = self.items;
            if (typeof set === "undefined") {
                self.update();
            } else {
                self.activateSet(self["set" + set]);
            }
        };

        /*
         * Activates the given setObject.
         */
        self.activateSet = function(set) {
            if (_defined(set)) {
                self.setControlDiv.children(".ezSet").removeClass("ezToggleActive");
                self.setControlDiv.children("[ezFilterID=" + set.id + "]").addClass("ezToggleActive");
            }
            // Filter out unwanted rows
            //self.filter();
            if (_defined(set.filter)) {
                self.clearFiltersAndAddNew({
                    id: self.id + "filter",
                    type: "preset",
                    filter: set.filter
                });
            } else {
                self.clearFiltersAndAddNew();
            }

            // Sort remaining rows
            if (_defined(set.sortCols)) {
                var sortCols = set.sortCols.split(",");
                for (var i = 0; i < sortCols.length; i++) {
                    var sortCol = sortCols[i];
                    if (_defined(set.sort)) {
                        self.sort(sortCol, set.order, set.sort, false);
                    } else {
                        self.sort(sortCol, set.order, undefined, false);
                    }
                }
            }
            self.update();
            // call activation funciton if it is defined.
            if (set.activated) {
                set.activated(self);
            }
            var shownColumns = set.show.split(",");
            var hiddenColumns = [];
            for (var key in self.columnIndicies) {
                if (!shownColumns.contains(key)) {
                    hiddenColumns.push(key);
                }
            }
            self.setVisibilities(shownColumns, hiddenColumns);
        };

        /* 
         * Event method to be triggered when a toggleItemHtml is pressed.
         */
        function _onToggleClicked() {
            var toggleItem = $(this);
            var column = $(this).data("eztoggle");
            if (!toggleItem.attr("checked")) {
                toggleItem.addClass("ezToggleActive");
                self.setColumnVisiblity(column, true);
            } else {
                toggleItem.removeClass("ezToggleActive");
                self.setColumnVisiblity(column, false);
            }
        }

        /*
         * Event method to be triggered when a setItemHtml is pressed.
         */
        function _onSetClicked() {
            var button = $(this);
            var setid = button.attr("ezFilterID");
            self.activateSet(self["set" + setid]);
        }

        /*
         * Event method to be triggered when a filterItemHtml is pressed.
         */
        function _onFilterClicked() {
            var button = $(this);
            var filterId = button.attr("data-ezFilterID");
            var filter = self["filter" + filterId];
            self.addNewFilter(filter);
        }

        function _defined(field) {
            return typeof field !== "undefined";
        }

        function _getName(item) {
            if (_defined(item.attr("name"))) {
                return item.attr("name");
            } else {
                return item.text();
            }
        }

        function _getColumn(item) {
            if (_defined(item.data) && _defined(item.data("column"))) {
                return item.data("column");
            } else {
                return item.index();
            }
        }
        var _fastSort = function(ary, sortFunc) {

            //Adds a sequential number to each row of the array
            //This is the part that adds stability to the sort
            for (var x = 0; x < ary.length; x++) {
                ary[x].index = x;
            }

            ary.sort(function(a, b) {
                return sortFunc(a, b);
            });
        };

        var _getColumnsForFilter = function(extra) {
            if (extra.column === "all") {
                var columns = [];
                for (var key in self.columnIndicies) {
                    columns.push(key);
                }
                return columns;
            } else {
                return extra.column.split(",");

            }
        };

        var _callFilter = function(self, filter, doNotUpdate) {
            if (typeof self.filterHook !== "undefined") {
                for (var i = 0; i < self.filterHook.length; i++) {
                    self.filterHook[i](self, filter, doNotUpdate);
                }
            }
        };

        var _callSort = function(self, column, order, doNotUpdate) {
            if (typeof self.sortHook !== "undefined") {
                for (var i = 0; i < self.sortHook.length; i++) {
                    self.sortHook[i](self, column, order, doNotUpdate);
                }
            }
        };

        var _callUpdate = function(self) {
            if (typeof self.updateHook !== "undefined") {
                for (var i = 0; i < self.updateHook.length; i++) {
                    self.updateHook[i](self);
                }
            }
        };
        /**
         * Updates the self to make sure the representation is up to date with the internal state
         *
         *
         *
         *
         *
         *
         *
         *
         *
         *
         */
        self.update = function() {
            var items = self.items;

            if (_defined(self.paginator)) {
                self.visibleIems = self.paginator.getPage();
            } else {
                self.visibleIems = self.items;
            }
            var tbody = self.table.children("tbody").first();
            tbody.empty();
            for (i = 0; i < self.visibleIems.length; i++) {
                var item = self.visibleIems[i];
                if (_defined(item)) {
                    tbody.append(item.element);
                }
            }

            for (var key in self.columnIndicies) {
                self.setColumnVisiblity(key, self.visibility[self.columnIndicies[key]]);
            }
            /*for (var index = 0; index < self.headers.length; index++) {
                $("tr").each(function() {
                    $(this).children("td:eq(" + (index) + ")").addClass(self.columnNames[index]);
                });
            }*/
            if (typeof self.paginator !== "undefined") {
                self.paginator.update();
            }
            _callUpdate(self);
        };
        /* SORT FUNCITON
         *
         *
         *
         *
         *
         *
         */
        self.sort = function(column, order, sortFunction, doNotUpdate) {

            var columnElement = $("[data-sort=" + column + "]").first();
            var f;
            var mult = 1;
            if (_defined(order)) {
                if (order === "asc") {
                    mult = 1;
                    columnElement.attr("data-order", "desc");
                } else {
                    mult = -1;
                    columnElement.attr("data-order", "asc");
                }
            } else {
                columnElement.attr("data-order", "desc");
            }
            if (_defined(sortFunction)) {
                f = sortFunction;
            } else {
                f = function(a, b) {
                    var aVal = a.data[column].trim().replace(/[^a-zA-z0-9\.]+/g, '').replace(/^0+/g, '').toLowerCase();
                    var bVal = b.data[column].trim().replace(/[^a-zA-z0-9\.]+/g, '').replace(/^0+/g, '').toLowerCase();
                    if (aVal == bVal) {
                        return a.index - b.index;
                    }
                    if (aVal.match(/^\d+/) && bVal.match(/^\d+/)) {
                        return parseFloat(aVal) < parseFloat(bVal) ? -1 : 1;
                    }
                    return aVal < bVal ? -1 : 1;

                };
            }
            _fastSort(self.unFilteredItems, function(a, b) {
                var res = mult * f(a, b);
                if (res === 0) {
                    return mult * (a.index - b.index);
                }
                return res;
            });
            if (typeof self.endUpdate !== "undefined") {
                for (var i = 0; i < self.endUpdate.length; i++) {
                    self.endUpdate[i](filter, doNotUpdate);
                }
            }
            _callSort(self, column, order, doNotUpdate);
            if (typeof doNotUpdate === "undefined") self.update();
        };



        self.addNewFilter = function(filter) {
            if (typeof filter.filter === "undefined") {
                filter.filter = self.textFilter;
            }
            var added = false;
            for (var i = 0; i < self.filters.length; i++) {
                if (self.filters[i].id === filter.id) {
                    self.filters[i] = filter;
                    added = true;
                }
            }
            if (!added) self.filters.push(filter);
            self.filters.sort(function(a, b) {
                var ah = typeof a.heuristic === "undefined" ? 0 : a.heuristic;
                var bh = typeof b.heuristic === "undefined" ? 0 : b.heuristic;
                return -1 * (ah - bh);
            });
            self.filter(true);
        };

        /**
         * @brief Default text filter function. Replace this if you want another behaviour
         * @details [long description]
         *
         * @param m [description]
         * @param s [description]
         *
         * @return [description]
         */
        self.textFilter = function(item, value, extra) {
            var columns = _getColumnsForFilter(extra);
            for (var i = 0; i < columns.length; i++) {
                if (self.visibility[self.columnIndicies[columns[i]]] &&
                    item.data[columns[i]].toLowerCase()
                    .indexOf(value.toLowerCase()) > -1) {
                    return true;
                }
            }
            return false;
        };

        self.baseFilter = {
            id: "ezBaseFilter",
            type: "preset",
            heuristic: 1000000000,
            name: "Salary above 500",
            filter: function(item) {
                return true;
            }
        };
        /**
         * @brief Filter funciton used to decide what items to include in the list
         * @details [long description]
         *
         *
         *
         *
         *
         *
         *
         * @param  a function that takes one argument and return true if item should be shown
         *      and false if it should be omitted, if not supplied all items will be visible.
         * @return nothing.
         */
        self.filter = function(update) {
            self.matchingItems = [];
            for (var itemIndex = 0; itemIndex < self.items.length; itemIndex++) {
                var item = self.items[itemIndex];
                item.matching = true;
                for (var filterIndex = 0; filterIndex < self.filters.length; filterIndex++) {
                    var filter = self.filters[filterIndex];
                    _callFilter(self, filter, update);
                    var value = "";
                    if (filter.type === "text") {
                        value = $("[data-ezfilterid=" + filter.id + "]").val();
                    }
                    item.matching = filter.filter(item, value, filter.extra);
                    if (!item.matching) {
                        break;
                    }
                }
                if (item.matching) {
                    self.matchingItems.push(item);
                }
            }
            if (typeof self.paginator !== "undefined") self.paginator.setPage(0);
            else if (update) self.update();
        };

        self.clearFiltersAndAddNew = function(filter) {
            self.filters = [self.baseFilter];
            if (typeof filter !== "undefined") {
                self.addNewFilter(filter);
            } else {
                self.filter(true);
            }

        };


        /**
         * @brief Used to bind to an event in self
         *
         * @param event, the event identifier, possible values:
         *          "filterHook","sortHook","updateHook".
         * @return nothing.
         */
        self.on = function(event, func) {
            if (typeof self[event] === "undefined") {
                self[event] = [];
            }
            self[event].push(func);
        };
        /* INITIALISATION PART
         *
         *
         *
         *
         *
         *
         *
         *
         *
         *
         *
         *
         *
         *
         * Init function for self.
         * opts has the following fields:
         *      table - the id of the table, if not set self will take to first table on the page.
         *      tableHeader - the id of the row containing the header fields for the table.
         *                      If not set it will default to the first row in the table
         *      controlDiv - If set the div with controlDiv as id will be used for all controls use either this or
         *                      toggle|set|filter ContainerDivs.
         */
        self.table = _defined(opts.table) ? $("#" + opts.table) : $("table").first();
        if (_defined(opts.tableHeaderId)) {
            self.tableHeader = $("#" + opts.tableHeaderId);
        } else {
            if (_defined(opts.table)) {
                self.tableHeader = $('#' + opts.table + ' tr,' + '#' + opts.table + ' table tbody tr').first();
            } else {
                self.tableHeader = $('table thead tr').first();
            }
        }
        self.tableBody = self.table.children('tbody').first();

        if (_defined(opts.controlDiv)) {
            self.toggleControlDiv = $("#" + opts.controlDiv);
            self.setControlDiv = $("#" + opts.controlDiv);
            self.filterControlDiv = $("#" + opts.controlDiv);
        } else {
            self.toggleControlDiv = $("#" + opts.toggleContainerDiv);
            self.setControlDiv = $("#" + opts.setContainerDiv);
            self.filterControlDiv = $("#" + opts.filterContainerDiv);
        }
        self.filters = [self.baseFilter];
        self.columnNames = {};
        self.visibility = {};
        self.columnIndicies = {};
        self.initialized = true;
        self.headers = self.tableHeader.children("th,td");
        self.resetPageOnUpdate = typeof opts.resetPageOnUpdate !== "undefined" && opts.resetPageOnUpdate === true;
        self.resetPageOnSort = typeof opts.resetPageOnSort !== "undefined" && opts.resetPageOnSort === true;
        self.resetPageOnFilter = typeof opts.resetPageOnFilter !== "undefined" && opts.resetPageOnFilter === true;


        // For each table header add a toggle item with the text defined in the "name" attribute from the header
        self.headers.each(function(index) {
            var name = _getName($(this));
            var column = _getColumn($(this));
            self.columnIndicies[column] = index;
            self.columnNames[index] = column;
            self.toggleControlDiv.append(self.toggleItemHtml.ezFormat(column, name));
        });

        if (_defined(opts.items)) {
            self.items = opts.items;
            self.unFilteredItems = self.items;

        } else {
            self.items = [];
            var rows = self.tableBody.first().children("tr");
            rows.each(function(index) {
                var item = {};
                item.data = {};
                item.element = $(this);
                $(this).children().each(function(index) {
                    var columnName = self.columnNames[index];
                    item.data[columnName] = $(this).text();
                    item.matching = true;
                });
                self.items.push(item);
            });
            self.unFilteredItems = self.items;
            self.matchingItems = self.items;
        }
        var i = 0;
        // For each set in sets, add a set button to the toggleControlDiv.
        if (_defined(opts.sets)) {
            for (i = 0; i < opts.sets.length; i++) {
                var set = opts.sets[i];
                var setId = set.id;
                var filterContainer = typeof set.containerId === "undefined" ? self.setControlDiv : $("#" + set.containerId);
                self["set" + setId] = set;
                filterContainer.append(self.setItemHtml.ezFormat(set.id, set.name));
            }
        }
        if (_defined(opts.filters)) {
            for (i = 0; i < opts.filters.length; i++) {
                var filter = opts.filters[i];
                var filterId = filter.id;
                var setContainer = typeof filter.containerId === "undefined" ? self.filterControlDiv : $("#" + filter.containerId);
                self["filter" + filterId] = filter;
                if (filter.type === "text") {
                    setContainer.append(self.filterTextItemHtml.ezFormat(filter.id, filter.name));
                } else {
                    setContainer.append(self.filterItemHtml.ezFormat(filter.id, filter.name));
                }
            }
        }

        // Bind click event on toggle items to onToggleClicked function.
        self.toggleControlDiv.children("[data-ezActionType=toggle]").on("click", _onToggleClicked);

        // Bind click event on set items to onSetClicked function
        self.setControlDiv.children("[data-ezActionType=set]").on("click", _onSetClicked);
        self.filterControlDiv.children("span[data-ezActionType=filter]").on("click", _onFilterClicked);
        self.filterControlDiv.children("input[data-ezActionType=filter]").on("keyup", _onFilterClicked);
        $(".sort").on("click", function() {
            var dataCol = $(this).data("sort");
            var order = $(this).attr("data-order");
            self.sort(dataCol, order);
        });
        self.toggleControlDiv.height(self.toggleControlDiv[0].scrollHeight);

        if (_defined(opts.paginator)) {
            self.paginator = new ez.paginator(self, opts.paginator);
        }
        if (_defined(opts.initial)) {
            self.activateSet(opts.sets[opts.initial]);
        } else {
            for (var key in self.columnIndicies) {
               self.visibility[self.columnIndicies[key]] = true;
            }
        }


        self.update();
        return self;
    };
})(window.ez);