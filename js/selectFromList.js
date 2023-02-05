Vue.component('list-item-select', {
	props: {
		updateListData: { type: Function },
		displayResult: { type: Function },
		showLoading: { type: Function },
		hideLoading: { type: Function },
		listData: Array
	},
	data() {
		return {
			cellNames: [ 'name', 'action_buttons' ],
			listItems: [],
			confirmClearItems: 'clear_list_confirm_modal',
			confirmClearMessage: 'Are you sure that you want to clear the current list?'
		}
	},
	methods: {
		clearItems: function () {
			// Clear the array of items.
			this.listItems = [];
		},
		selectRandomItem: function () {
			var count = this.listItems.length;
			var items = this.listItems;
			const showInfoBox = this.displayResult;
			const stopLoading = this.hideLoading;

			// There should be at least two items to choose between.
			if(count < 2) {
				// Display a warning.
				showInfoBox('Please have at least two items to select from.', true);
				return false;
			}

			this.showLoading();

			// Use an API (https://www.random.org/clients/http/) to get a more random number than Math.random can produce.
			var url = 'https://www.random.org/integers/?num=1&min=0&max=' + (count - 1) + '&col=1&base=10&format=plain&rnd=new';
			$.get(url, function(result) {
				// Get the selected item.
				var item = items[parseInt(result)];
				// Display the result.
				showInfoBox('Result: ' + item.name);
				stopLoading();
			});
		}
	},
	template: `
		<div>
			<b-card bg-variant="primary" text-variant="white" class="square-bottom">
				<div class="row">
					<div class="col">
						<span style="font-size: 1.5rem;">Selection List</span>
					</div>
				</div>
				<div class="row">
					<div class="col">
						<b-button v-b-modal.add_edit_modal variant="link" v-b-tooltip.hover title="Add item to the list" class="float-right mr-n2 mb-n2">
							<b-icon icon="plus-circle" variant="light" font-scale="1.5"></b-icon>
						</b-button>
					</div>
				</div>
			</b-card>
			<b-table striped hover :items="listItems" :fields="cellNames" outlined thead-class="hidden_header">
			<template #cell(action_buttons)="row">
				<div class="text-right">
					<b-link variant="primary" v-b-tooltip.hover title="Remove item from the list">
						<b-icon icon="trash-fill" @click="listItems.splice(row.index, 1);"></b-icon>
					</b-link>
				</div>
			</template>
			</b-table>
			<b-button variant="primary" class="mt-3" @click="selectRandomItem" :disabled="listItems.length < 2">Submit</b-button>
			<b-button variant="secondary" class="mt-3" v-b-modal.clear_list_confirm_modal>Clear</b-button>
			<add-edit-item :items="listItems" />
			<confirm-modal :id="confirmClearItems" :message="confirmClearMessage" :on-yes-function="clearItems" />
		</div>
	`
});