/**
 * [Queue description]
 */
function Queue() {
	this.items = [];
}

/**
 * [enqueue description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
Queue.prototype.enqueue = function (item) {
	if (!item) throw new Error('item should be defined!');
	this.items.push(item);
	return this;
};

/**
 * [dequeue description]
 * @return {[type]} [description]
 */
Queue.prototype.dequeue = function () {
	return this.items.pop();
};

/**
 * [isEmpty description]
 * @return {Boolean} [description]
 */
Queue.prototype.isEmpty = function () {
	return !!this.item.length;
};

/**
 * [size description]
 * @return {[type]} [description]
 */
Queue.prototype.size = function () {
	return this.items.length;
};

/**
 * [getItems description]
 * @return {[type]} [description]
 */
Queue.prototype.getItems = function (item) {
	return this.items[item];
};

module.exports = Queue;
