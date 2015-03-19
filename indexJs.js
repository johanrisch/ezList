if (typeof window.app === "undefined") {
  window.app = {};
}
(function(app) {
  var list = new app.ez.list({
    toggleContainerDiv: "control",
    setContainerDiv: "setControl",
    filterContainerDiv: "filterContainer",
    initial: 0,
    sets: [{
      name: "Contact and Address",
      show: "name,phone,adr,city,country,email",
      sortCols: "city,name",
      order: "asc",
      id: "set1",
      actived: function(self) {},

    }, {
      name: "Salary and age",
      show: "name,adr,city,age,salary",
      id: "set2",
      sortCols: "data6",
      order: "desc",
      sort: function(a, b) {
        var mult = -1;
        if (a.data['salary'] === b.data['salary']) {
          if (a.data['age'] === b.data['age']) {
            return mult * (a.index - b.index);
          } else if (a.data['age'] < b.data['age']) {
            return mult * -1;
          }
          return mult * 1;
        } else if (a.data['salary'] < b.data['salary']) {
          return mult * -1;
        }
        return mult * 1;

      },
      actived: function(self) {},

    }, {
      name: "Bank",
      show: "name,card,bank,deposit",
      sortCols: "card",
      order: "asc",
      id: "set3",
      activated: function(self) {},

    }, {
      name: "Employer",
      show: "name,employer,iq,6",
      id: "set4",
      actived: function(self) {},

    }],
    filters: [{
        id: "filter1",
        type: "preset",
        name: "Salary above 500",
        filter: function(item) {
          var salary = item.data['salary'].substring(1);
          return parseInt(salary) > 500;
        }
      }, {
        id: "filter2",
        type: "text",
        name: "Search all",
        extra: {
          column: "all"
        }
      }, {
        id: "filter3",
        type: "text",
        name: "Search on name",
        extra: {
          column: "name"
        }
      }, {
        id: "filter4",
        type: "text",
        name: "Search on phone",
        extra: {
          column: "phone"
        }
      }, {
        id: "filter5",
        type: "text",
        name: "{minAge}-{maxAge}",
        filter: function(item, value) {
          var range = value.split("-");
          if (range.length == 2 && range[1].length > 0 && !isNaN(parseInt(range[0], 10)) && !isNaN(parseInt(range[1], 10)) && parseInt(range[0], 10) < parseInt(range[1], 10)) {
            var age = parseInt(item.data["age"]);
            var minAge = parseInt(range[0]);
            var maxAge = parseInt(range[1]);
            var ret = (minAge < age && age < maxAge) ? true : false;;
            return ret;
          } else {
            return true;
          }
        }
      }, {
        id: "filter6",
        type: "text",
        name: "{column}_{regexp}",
        filter: function(item, value) {
          var range = value.split("_");
          if (range.length == 2 && range[0].length > 0 && range[1].length > 0 && range[0] in item.data) {
            return item.data[range[0]].match(range[1]);
          } else {
            return true;
          }
        }
      }

    ],
    paginator: {
      pageSize: 20,
      paginatorContainer: "ezPager"
    }
  });
  app.list = list;
  list.on("updateHook", function(list) {
    console.log("on update" + list.length);
  });
  list.on("filterHook", function(list) {
    console.log("on filter");
  });
  list.on("sortHook", function(list) {
    console.log("on sort");
  });
  /* var options = {
   	page: 15,
   	plugins: [
   		ListPagination({})
   	]
   };*/
})(window.app);