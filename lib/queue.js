'use strict';

/**
 * Simple queue
 */
function Queue() {
	this.items = [];
}

/**
 * Add item to queue
 * @param  {?} item
 * @return {Queue} this
 */
Queue.prototype.enqueue = function (item) {
	if (!item) throw new Error('item should be defined!');
	this.items.push(item);
	return this;
};

/**
 * Remove last element and return it
 * @return {Queue item}
 */
Queue.prototype.dequeue = function () {
	return this.items.pop();
};

/**
 * Check if Queue is empty
 * @return {Boolean}
 */
Queue.prototype.isEmpty = function () {
	return this.items.length < 1;
};

/**
 * Get size of queue
 * @return {Number} 
 */
Queue.prototype.size = function () {
	return this.items.length;
};

module.exports = Queue;
