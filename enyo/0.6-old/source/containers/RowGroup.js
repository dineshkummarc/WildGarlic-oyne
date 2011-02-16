/* Enyo JavaScript framework -- Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
/**
A <a href="#enyo.Group">Group</a> in which each control is automatically
displayed in an <a href="#enyo.Item">Item</a>, so they have small guide lines between them.

Here's an example:

	{kind: "Group", caption: "Audio/Video Options", components: [
		{layoutKind: "HFlexLayout", components: [
			{content: "Sound", flex: 1},
			{kind: "ToggleButton"}
		]},
		{layoutKind: "HFlexLayout", components: [
			{content: "Video", flex: 1},
			{kind: "ToggleButton"}
		]}
	]}
*/
enyo.kind({
	name: "enyo.RowGroup",
	kind: enyo.Group,
	chrome: [
		{name: "label", kind: "Control", className: "enyo-group-label"},
		// NOTE: row styling applied by the layoutKind here.
		{name: "client", kind: "Control", layoutKind: "OrderedLayout", className: "enyo-group-inner"}
	],
	roundedClass: "rounded",
	defaultKind: "enyo.Item",
	//* @protected
	addControl: function(inControl) {
		if (!inControl.isChrome) {
			inControl.addClass(this.roundedClass);
		}
		this.inherited(arguments);
	},
	// NOTE: to preserve row styling and add highlighting item behavior, 
	// wrap controls in an Item
	addChild: function(inChild) {
		if (!inChild.isChrome && !(inChild instanceof enyo.Item)) {
			var item = this.createComponent({kind: "Item", tapHighlight: inChild.tapHighlight});
			item.addChild(inChild);
		} else {
			this.inherited(arguments);
		}
	},
	controlAtIndex: function(inIndex) {
		return this.getControls()[inIndex];
	},
	//* @public
	showRow: function(inIndex) {
		var c = this.controlAtIndex(inIndex);
		c.setShowing(true);
		this.$.client.flow();
	},
	hideRow: function(inIndex) {
		var c = this.controlAtIndex(inIndex);
		c.setShowing(false);
		this.$.client.flow();
	}
});
