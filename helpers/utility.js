const constants = require("../constants");

exports.setSortSkipParams = function (filterData) {
	var res = {};
	var sortFilter = {};
	if (filterData.columnname && filterData.orderby) {
		sortFilter[filterData.columnname] = constants.ORDER_BY[filterData.orderby];
	}
	res["sortFilter"] = sortFilter;
	var skip =
    filterData.pagenumber && filterData.countperpage
    	? filterData.pagenumber * parseInt(filterData.countperpage)
    	: 0;
	res["skip"] = skip;
	var limit =
    filterData.pagenumber && filterData.countperpage
    	? parseInt(filterData.countperpage)
    	: 0;
	res["limit"] = limit;
	return res;
};
