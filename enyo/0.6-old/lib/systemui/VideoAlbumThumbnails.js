/* Enyo JavaScript framework -- Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
enyo.kind({
	name: "enyo.VideoAlbumThumbnails",
	kind: enyo.Control,
	published: {
		album: null
	},
	chrome: [
		{name: "client", kind: "Control", className: "enyo-video-album-thumbnails-client"},
		{name: "frame"},
		{name: "counterHolder", components: [
			{name: "counter", className: "enyo-image-album-thumbnails-counter"}
		]}
	],
	createThumbnailImage: function(inPath, imgIndex) {
		return this.createComponent({
			kind: "Image",
			src: inPath,
			className:"enyo-video-album-thumbnail-"+imgIndex
		});
	},
	albumChanged: function() {
		this.destroyControls();
	
		var albumLength = this.album.length;
		if (albumLength == 1) {
			this.$.counterHolder.setShowing(false);
		}
		else {
			this.$.counter.setContent(this.album.length);
			this.$.counterHolder.setClassName("enyo-image-album-thumbnails-counter-holder enyo-video-album-count-container-"+ albumLength);
		}
		this.$.client.setClassName("enyo-video-album-thumbnails-client enyo-video-album-thumbnail-overlay-show-thumb-" + this.album.length);
		//this.$.counterHolder.setClassName("enyo-image-album-thumbnails-counter-holder enyo-image-album-thumbnails-counter-holder-show-thumb-" + tn.length);
		for (i = 0; i < 3 && i< this.album.length; i++) {
			var videoArr = this.album[i];
			if(videoArr.thumbnails.length > 0 && videoArr.thumbnails[0].data)
				this.createThumbnailImage(enyo.path.rewrite("$enyo-lib/systemui/images/generic-thumb-video.png"), i);
				//this.createThumbnailImage(videoArr.thumbnails[0].data); //this.pickerAssistant.videoLibrary.Util.videoThumbUrlFormatter(videoArr[i].thumbnails[0].data);
			else
				this.createThumbnailImage(enyo.path.rewrite("$enyo-lib/systemui/images/generic-thumb-video.png"));
		}
	}
});