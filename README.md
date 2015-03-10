# ezList
ezList is JS module that gives you the most out of an HTML-table.


## Usage
The most basic usage of ezList is the follwowing:

HTML
````
<div id="controlContainer"></div>
<table>
  <thead>
    <tr>
      <th >Table header 1</th>
      <th >Table header 2</th>
      ...
      <th >Table header n</th>
    </tr>
  </thead>
  <tbody id="ezList">
    <tr>
      <td >Table cell 1</td>
      <td >Table cell 2</td>
      ...
      <td >Table cell n</td>
    </tr>
    ...
    <tr>
      <td >Table cell 1</td>
      <td >Table cell 2</td>
      ...
      <td >Table cell n</td>
    </tr>
  </tbody>
</table>
<ul id="ezPager"></ul>
````

Javascript
`````Javascript
  var ezList = ezList.init({
    controlDiv: "control",
    filters: {
        id: "filter1",
        type: "text",
        name: "Search all",
        column: "all"
    },
    paginator: {
      pageSize: 5,
      paginatorContainer: "ezPager"
    }
  });

`````

The most important part is to remember to include the <thead> and <tbody>. ezList will parse the table and add the nessecary classes to each element in order to get the most basic functions working. The init function does the following:

1. Finds the table by spplied id on opts.table or of opts.table is undefined finds the first table on the page.
2. Sets the table header row to opts.tableHeaderId or the first row inside the <thead> tag.

to be continued
