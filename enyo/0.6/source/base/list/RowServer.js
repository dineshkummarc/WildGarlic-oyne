/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
//* @protected
enyo.kind({
	name: "enyo.RowServer",
	kind: enyo.Control,
	events: {
		onSetupRow: "",
		onRowIndexChanged: ""
	},
	chrome: [
		{name: "client", kind: "Flyweight", onNodeChange: "clientNodeChanged", onDecorateEvent: "clientDecorateEvent"},
		{name: "state", kind: "StateManager"}
	],
	lastIndex: -1,
	//* @protected
	create: function() {
		this.inherited(arguments);
		// some layouts make important changes at render time, so we render
		// and discard one client copy so we are capturing as much default state
		// as possible
		this.$.client.generateHtml();
		this.$.state.setControl(this.$.client);
	},
	//* @public
	prepareRow: function(inIndex) {
		//this.log(inIndex);
		this.transitionRow(inIndex);
		this.controlsToRow(inIndex);
	},
	//* @protected
	// we don't render anything directly ourselves
	generateHtml: function() {
		return '';
	},
	// ...instead we generate copies of our flyweight on demand
	// FIXME: whenver a row is generated, we restore and save its state. 
	// This is potentially costly because state is restored/saved for all row children controls.
	// In addition a default state is synthesized for any rows without state.
	// IF this proves too costly (specifically restoring and synthesizing), we could impose
	// stricter limits on what can be in a row.
	// e.g. Without restoring state and using default state, the held property of an Item
	// can be incorrectly rendered true (i.e. when a list is scrolled and the mouse is kept down)
	generateRow: function(inIndex) {
		var r;
		// FIXME: without resetting lastIndex here, after generating rows,
		// we'll save an incorrect state when we transitionRow.
		// ... should we optimize to set this less often than whenever a row is generated?
		//
		this.lastIndex = -1;
		//
		if (!this._nodesDisabled) {
			this.disableNodeAccess();
		}
		this.$.state.restore(inIndex);
		// let owner configure the item
		var fr = this.formatRow(inIndex);
		if (fr !== undefined) {
			if (fr === null) {
				r = " ";
			} else if (fr) {
				// render the index key to DOM
				this.$.client.domAttributes.rowIndex = inIndex;
				// generate html
				r = this.getChildContent();
				// capture formatted state (Note: make sure this is after getting content
				// since getChildContent may affect state, e.g. via flow)
				this.$.state.save(inIndex);
			}
		}
		//this.enableNodeAccess();
		return r;
	},
	clearState: function() {
		this.$.state.clear();
	},
	// hook for subclassing
	formatRow: function(inIndex) {
		return this.doSetupRow(inIndex);
	},
	// for convenience decorate all events that go through flyweight with the list rowIndex
	clientDecorateEvent: function(inSender, inEvent) {
		inEvent.rowIndex = this.fetchRowIndex(inSender);
	},
	// when our flyweight receives a new node via an event trigger, we must restore state for this row
	clientNodeChanged: function(inSender, inNode) {
		var i = this.fetchRowIndex();
		this.transitionRow(i);
		if (i !== undefined) {
			this.doRowIndexChanged(i);
		}
	},
	disableNodeAccess: function() {
		this.$.client.disableNodeAccess();
		this._nodesDisabled = true;
	},
	enableNodeAccess: function() {
		this.$.client.enableNodeAccess();
		this._nodesDisabled = false;
	},
	// save the state of the current row, restore state on new row
	transitionRow: function(inIndex) {
		//this.log(inIndex);
		if (this.lastIndex > -1) {
			this.$.state.save(this.lastIndex);
		}
		this.lastIndex = inIndex;
		this.$.state.restore(inIndex);
		this.enableNodeAccess();
	},
	/**
		Update list's controls to act as if they are rendered in the given rowIndex.
		@param inRowIndex {Number} A row index for list's controls.
	*/
	controlsToRow: function(inRowIndex) {
		var n = this.fetchRowNode(inRowIndex);
		if (n) {
			//console.log("controls to row: " + inRowIndex);
			this.$.client.setNode(n);
			return true;
		}
	},
	/**
		Fetch the dom node for the given row index.
		@param inRowIndex {Number} A row index.
	*/
	fetchRowNode: function(inRowIndex) {
		// FIXME: we could also possibly iterate childNodes
		var pn = this.getParentNode();
		if (pn) {
			return pn.querySelector('[rowindex="' + inRowIndex + '"]');
		}
	},
	/**
		Fetch the rowIndex which is currently receiving events.
		@returns {Number} a row index
	*/
	fetchRowIndex: function(inControl) {
		var c = inControl || this.$.client;
		return this.fetchRowIndexByNode(c.hasNode());
	},
	/**
		Fetch the rowIndex for a node in a list row.
		@param inNode {DomNode} A node in a list row.
		@returns {Number} The row index in which inNode exists.
	*/
	fetchRowIndexByNode: function(inNode) {
		var i, n = inNode, p = this.getParentNode();
		while (n && n.getAttribute && n != p) {
			i = n.getAttribute("rowIndex");
			if (i != null) {
				return Number(i);
			}
			n = n.parentNode;
		}
	}
});