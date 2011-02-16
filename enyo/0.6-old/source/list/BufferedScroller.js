/* Enyo JavaScript framework -- Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
//* @protected
enyo.kind({
	name: "enyo.BufferedScroller",
	kind: enyo.VirtualScroller,
	rowsPerPage: 3,
	events: {
		onGenerateRow: "generateRow",
		onAdjustTop: "",
		onAdjustBottom: ""
	},
	//* @protected
	constructor: function() {
		this.pages = [];
		this.inherited(arguments);
	},
	create: function() {
		this.inherited(arguments);
		this.createDomBuffer();
		this.createDisplayBuffer();
	},
	createDomBuffer: function() {
		this.domBuffer = this.createComponent({
			kind: enyo.DomBuffer,
			rowsPerPage: this.rowsPerPage,
			pages: this.pages,
			//overbuffer: 2,
			margin: 20,
			generateRow: enyo.hitch(this, "doGenerateRow")
		});
	},
	createDisplayBuffer: function() {
		this.displayBuffer = new enyo.DisplayBuffer({
			heights: this.heights,
			pages: this.pages
		});
	},
	rendered: function() {
		this.domBuffer.pagesNode = this.$.content.hasNode();
		this.inherited(arguments);
	},
	pageToTopRow: function(inPage) {
		return inPage * this.rowsPerPage;
	},
	pageToBottomRow: function(inPage) {
		return inPage * this.rowsPerPage + (this.rowsPerPage - 1);
	},
	//* @public
	adjustTop: function(inTop) {
		//this.log(inTop);
		this.doAdjustTop(this.pageToTopRow(inTop));
		if (this.domBuffer.adjustTop(inTop) === false) {
			return false;
		}
		this.displayBuffer.adjustTop(inTop);
		enyo.viz && enyo.viz.scrollerUpdate(this);
	},
	adjustBottom: function(inBottom) {
		//this.log(inBottom);
		this.doAdjustBottom(this.pageToBottomRow(inBottom));
		if (this.domBuffer.adjustBottom(inBottom) === false) {
			return false;
		}
		this.displayBuffer.adjustBottom(inBottom);
		enyo.viz && enyo.viz.scrollerUpdate(this);
	},
	findBottom: function() {
		while (this.pushPage() !== false);
		//this.log("new bottom:", this.bottom);
		this.contentHeight = this.displayBuffer.height;
		this.bottomBoundary = Math.min(-this.contentHeight + this.pageOffset + this.viewHeight, -1);
		//this.log(this.contentHeight, this.pageOffset, this.bottomBoundary);
		this.py = this.uy = this.y = this.y0 = this.bottomBoundary;
	},
	refreshPages: function() {
		// flush all DOM nodes
		this.domBuffer.flush();
		// domBuffer top/bottom are linked to scroller top/bottom because
		// scroller shiftPages/popPages rely on top/bottom referring to known
		// regions
		this.bottom = this.top - 1;
		this.displayBuffer.bottom = this.domBuffer.bottom = this.bottom;
		this.displayBuffer.top = this.domBuffer.top = this.top;
		// clear metrics
		this.contentHeight = 0;
		this.displayBuffer.height = 0;
		this.heights = this.displayBuffer.heights = [];
		// rebuild pages
		this.updatePages();
		//this.effectScroll();
	},
	punt: function() {
		this.$.scroll.stop();
		this.bottom = -1;
		this.top = 0;
		this.domBuffer.flush();
		this.displayBuffer.bottom = this.domBuffer.bottom = this.bottom;
		this.displayBuffer.top = this.domBuffer.top = this.top;
		this.contentHeight = 0;
		this.displayBuffer.height = 0;
		this.heights = this.displayBuffer.heights = [];
		this.pageOffset = 0;
		this.pageTop = 0;
		this.$.scroll.y = this.$.scroll.y0 = 0;
		//this.effectScroll();
		this.updatePages();
	}
});