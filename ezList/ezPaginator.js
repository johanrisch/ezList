if (typeof window.ez === "undefined" || typeof window.ez.list === "undefined") {
	console.error("You need to load list first");
}
(function(ez) {
	ez.paginator = (function(list, opts) {
		var ezPageItem = "<li><a id='{0}'' class='active page' href='javascript:ez.activePaginator.setPage({1})'>{2}</a></li>"
		var self = {};
		ez.activePaginator = self;
		list.paginator = self;

		var _getIOrMax = function(i, max) {
			if (i < max) return i;
			return max;
		}
		var _getIOrMin = function(i, min) {
			if (i > min) return i;
			return min;
		}

		self.update = function() {
			self.pages = [];
			var visibleItems = 0;
			for (var i = 0; i < list.items.length; i++) {
				if (list.items[i].matching) {
					visibleItems++;
				}
			}

			var pagesNeeded = Math.ceil(visibleItems / self.itemsPerPage);
			var startPage = _getIOrMin(self.currentPage - self.pageSpan, 0);
			var stopPage = _getIOrMax(self.currentPage + self.pageSpan, pagesNeeded);

			self.paginatorContainer.empty();
			for (var i = startPage; i < stopPage; i++) {
				if (i == startPage && startPage != 0) {
					self.paginatorContainer.append(ezPageItem.ezFormat("ezPage" + 0, 0, self.leftOverflow));
				} else if (i == stopPage - 1 && stopPage != pagesNeeded) {
					self.paginatorContainer.append(
						ezPageItem.ezFormat("ezPage" + (pagesNeeded - 1), pagesNeeded - 1, self.rightOverflow));
				} else {
					self.paginatorContainer.append(ezPageItem.ezFormat("ezPage" + i, i, i + 1));
				}
			}
			$(".page").parent().removeClass('active');
			$("#ezPage" + self.currentPage).parent().addClass('active');
		};


		self.setPage = function(index) {
			self.currentPage = index;
			list.update();
			self.update();
		};

		self.getPage = function() {
			var ret = [];
			for (var i = self.currentPage * self.itemsPerPage; ret.length < self.itemsPerPage; i++) {
				ret.push(list.matchingItems[i]);
			}
			return ret;
		}

		list.paginator = self;
		self.itemsPerPage = opts.pageSize;
		self.paginatorContainer = $("#" + opts.paginatorContainer);
		self.pager = $("#" + opts.pager);
		self.currentPage = 0;

		if (typeof opts.leftOverflow !== "undefined") {
			self.leftOverflow = opts.leftOverflow;
		} else {
			self.leftOverflow = "...";
		}

		if (typeof opts.rightOverflow !== "undefined") {
			self.rightOverflow = opts.rightOverflow;
		} else {
			self.rightOverflow = "...";
		}

		if (typeof opts.pageSpan !== "undefined") {
			self.pageSpan = opts.pageSpan;
		} else {
			self.pageSpan = 5;
		}

		self.update();
		return self;


		return self;
	});
})(window.ez);