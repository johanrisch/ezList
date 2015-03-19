  var ezList = new ez.list({
    toggleContainerDiv: "control",
    setContainerDiv: "setControl",
    filterContainerDiv: "filterContainer",
    initial: 0,
    sets: [{
      name: "col 1,2,3,4,5 and 6",
      show: "0,1,2,3,4,5",
      sortCols: "0,2",
      order: "asc",
      id: "set1"
    }, {
      name: "col 7,8,9,10,11 and 12",
      show: "6,7,8,9,10,11",
      sortCols: "7",
      order: "asc",
      id: "set2"
    }],
    filters: [{
      id: "filter1",
      type: "text",
      name: "Search all",
      extra: {
        column: "all"
      }
    }],
    paginator: {
      pageSize: 20,
      paginatorContainer: "ezPager"
    }
  });