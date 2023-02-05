Vue.component('add-edit-item', {
	props: {
		items: Array
	},
	data() {
		return {
			itemTitle: ''
		}
	},
	methods: {
		focusOnItemTitle: function () {
			$('#item_name').focus();
		},
		submitForm: function (event) {
			event.preventDefault();
			
			var value = this.itemTitle;

			// Add the list item to the list.
			// $('#item_list').append('<li class="list-group-item" data-val="' + value + '">' + value + '</li>');
			this.items.push({ name: value });

			// Hide the modal.
			this.$bvModal.hide('add_edit_modal');

			this.itemTitle = '';
		}
	},
	template: `
		<b-modal id="add_edit_modal" title="Add/Edit List Item" hide-footer @shown="focusOnItemTitle">
			<b-form id="add_edit_item_form" @submit="submitForm">
				<b-form-group>
					<b-form-input type="text" name="item_name" id="item_name" class="form-control" v-model="itemTitle" required></b-form-input>
				</b-form-group>
				<b-form-group class="mb-0 text-right">
					<b-button variant="secondary" @click="itemTitle = ''; $bvModal.hide('add_edit_modal');">Cancel</b-button>
					<b-button type="submit" variant="primary">Submit</b-button>
				</b-form-group>
			</b-form>
		</b-modal>
	`
});