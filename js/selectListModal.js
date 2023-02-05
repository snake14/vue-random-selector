Vue.component('select-specific-list', {
	props: {
		listData: Array,
		loadListItems: { type: Function }
	},
	data() {
		return {
			selected: null
		}
	},
	methods: {
		submitForm: function (event) {
			event.preventDefault();
			
			if(this.selected === null) {
				alert('Please select a list.');
				return false;
			}

			// Call the function that loads the list items for the selected list.
			this.loadListItems(this.selected);

			// Hide the modal.
			this.$bvModal.hide('select_list_modal');
			this.selected = null;
		}
	},
	template: `
		<b-modal id="select_list_modal" title="Select a List" hide-footer>
			<b-form id="select_specific_list_form" @submit="submitForm">
				<b-form-group>
					<b-form-select v-model="selected" :options="listData" :select-size="4"></b-form-select>
				</b-form-group>
				<b-form-group class="mb-0 text-right">
					<b-button variant="secondary" @click="selected = null; $bvModal.hide('select_list_modal');">Cancel</b-button>
					<b-button type="submit" variant="primary" :disabled="selected === null">Submit</b-button>
				</b-form-group>
			</b-form>
		</b-modal>
	`
});