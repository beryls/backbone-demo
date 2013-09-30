/**
 * New comment creation button
 *
 * @class NewButtonView
 * @extends Backbone.View
 * @author Bodnar Istvan <istvan@gawker.com>
 */
/*global CommentModel, FormView */
var NewButtonView = Backbone.View.extend(
/** @lends NewButtonView.prototype */
	{
		/**
		 * The map of delegated event handlers
		 * @type Object
		 */
		events: {
			'click': 'createComment'
		},

		author: "",

		/**
		 * Initialize view, make sure button has a comment collection to work with
		 */
		initialize: function () {
			if (this.collection === undefined) {
				throw 'NoCollectionDefined';
			}
		},

		/**
		 * Click event handler that first creates a new empty comment model, and assigns the model to a FormView instance.
		 * FormView will handle internally new comment creation and existing comment editing.
		 * @returns {Boolean} Returns false to stop propagation
		 */
		createComment: function () {
			// create new comment model
			var comment = new CommentModel({});

			// if a FormView exists, trigger its cancel method
			if ($('.commentform').length > 0) {
				$('.commentform .cancel').trigger('click');
			}

			// checks if a FormView exists again, in case an existing instance was not removed
			if ($('.commentform').length === 0) {
				// render form view right after new button
				// pass in author - either most recently submitted, or blank if no submissions - as argument for FormView
				var formview = new FormView({model: comment, author: this.author});
				this.$el.after(formview.render().$el);

				// shows overlay when form is created
				$('#overlay').show();

				// triggers cancellation when overlay is clicked
				$('#overlay').click(function(){
					$('.commentform .cancel').trigger('click');
				});

				// add saved model to collection after form was submitted successfully
				formview.on('success', this.handleFormSuccess, this);
			}

			// finally, return false to stop event propagation
			return false;
		},

		/**
		 * Method to handle FormView success event
		 * @param {CommentModel} model Model data returned by FormViews save request
		 */
		handleFormSuccess: function (model, author) {
			this.collection.add(model);
			this.author = author;
		}

	}
);