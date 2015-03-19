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
  var ezList = new ez.list({
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

The most important part is to remember to include the <thead> and <tbody>. ezList will parse the table and add the nessecary classes to each element in order to get the most basic functions working. 

For more advanced usage please see the samples.

## API
The api documentation container the following secitons:

1. Functions
  1. ezList.init(opts)
  2. ezList.update()
  3. ezList.sort(column, order, sortFunction, doNotUpdate)
  4. ezList.filter 
  5. ezList.on
2. opts


## Functions

#### init(opts)
Initialises ezList. There are several parameters to pass in opts. It must be called in order to use ezList.

#### update()
Should be called whenever custom changes to the internal state of ezList is altered. Update() goes through all items and shows the items on the current page of ezPager. 

#### sort(column, order, sortFunction, doNotUpdate)
sorts the item list in ascending "asc" or descending "desc" with the given sortFunction 

The sortfunction takes two argumenra (a,b) and returns a number (-infty,infty) with the following rules
````
ret < 0 if a < b
ret = 0 if a equals b
ret > 0 if a > b
````
The column argument is mereley there to be able to tell on callbacks what column is being sorted. E.g to add/remove classes depending on ascending/descending sorting

If doNotUpdate is undefined or false it indicates that you will take responsibility on updating the ezList when the internal state is ready.
#### filter(filter, doNotUpdate)
Will filter each item in ezList according to the function "filter" filter returns true iff the item should be included in the list and false otherwise.
#### on(event, func)

## Options

