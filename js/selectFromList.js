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
			listId: null,
			listName: null,
			canAddList: false,
			isListDirty: false,
			confirmDeleteId: 'delete_list_confirm_modal',
			confirmDeleteMessage: 'Are you sure that you want to delete the current list?',
			confirmUpdateId: 'update_list_confirm_modal',
			confirmUpdateMessage: 'Are you sure that you want to save changes to the current list?'
		}
	},
	methods: {
		clearItems: function () {
			// Clear the array of items and list ID.
			this.listItems = [];
			this.listId = null;
			this.canAddList = false;
			this.isListDirty = false;
			this.setListName(null);
		},
		setListId: function (listId) {
			this.listId = listId;
		},
		setListName: function (listName) {
			this.listName = listName;
		},
		findListName: function(listId) {
			for (i = 0; i < this.listData.length; i++) {
				if(listId === this.listData[i].value) {
					return this.listData[i].text;
				}
            }

			return null;
		},
		setCanAddList: function (canAdd) {
			this.canAddList = canAdd;
		},
		setIsListDirty: function (isDirty) {
			this.isListDirty = isDirty;
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
		},
		setListItems: function (listItems) {
			this.listItems = listItems;
		},
		loadListItems: function (listId) {
			this.clearItems();
			this.listId = listId;
			this.setListName(this.findListName(listId));

			const stopLoading = this.hideLoading;
			const setListItems = this.setListItems;
			const showInfoBox = this.displayResult;
			this.showLoading();

			var url = 'lists/' + this.listId;
			$.get(url, function(result) {
				if('success' in result && result.success && 'listItems' in result && typeof result.listItems === 'object') {
					setListItems(result.listItems);
				} else {
					showInfoBox('There was an issue loading the list.');
				}
				stopLoading();
			}, 'json');
		},
		updateList: function () {
			const setIsListDirty = this.setIsListDirty;
			const setCanAddList = this.setCanAddList;
			const showInfoBox = this.displayResult;

			$.post( 'lists/' + this.listId + '/items', { listItems: this.listItems }, function(response) {
				var responseJson = $.parseJSON(response);
				if(responseJson && 'success' in responseJson && responseJson.success) {
					showInfoBox('The list was successfully updated.');
					setIsListDirty(false);
					setCanAddList(false);
				} else {
					showInfoBox('There was an issue updating the list.');
				}
			});
		},
		deleteList: function () {
			const setListId = this.setListId;
			const clearItems = this.clearItems;
			const showInfoBox = this.displayResult;
			const updateListData = this.updateListData;

			$.ajax({
				url: 'lists/' + this.listId,
				type: 'DELETE',
				contentType: 'application/json',
				success: function(response) {
					var responseJson = $.parseJSON(response);
					if(responseJson && 'success' in responseJson && responseJson.success) {
						showInfoBox('The list was successfully deleted.');
						setListId('');
						clearItems();

						// Refresh the collection of available lists.
						updateListData(responseJson.listData);
					} else {
						showInfoBox('There was an issue deleting the list.');
					}
				}
			});
		}
	},
	template: `
		<div>
			<b-card bg-variant="primary" text-variant="white" class="square-bottom">
				<div class="row">
					<div class="col">
						<span style="font-size: 1.5rem;" v-if="listName">{{ listName }}</span>
						<span style="font-size: 1.5rem;" v-else>Selection List</span>
					</div>
				</div>
				<div class="row">
					<div class="col">
						<b-button v-b-modal.add_edit_list_modal v-show="listName" variant="link" v-b-tooltip.hover title="Edit list name" class="mx-n2 mb-n2">
							<b-icon icon="pencil" variant="light" font-scale="1.3"></b-icon>
						</b-button>
						<b-button v-b-modal.select_list_modal variant="link" v-b-tooltip.hover title="Load an existing list" class="mx-n2 mb-n2">
							<b-icon icon="folder2-open" variant="light" font-scale="1.5"></b-icon>
						</b-button>
						<b-button v-b-modal.add_edit_list_modal v-show="canAddList" variant="link" v-b-tooltip.hover title="Create a new list" class="mx-n2 mb-n2">
							<b-icon icon="folder-plus" variant="light" font-scale="1.5"></b-icon>
						</b-button>
						<b-button v-b-modal.update_list_confirm_modal v-show="listId" variant="link" v-b-tooltip.hover title="Save changes to the list" :disabled="isListDirty !== true" class="mx-n2 mb-n2">
							<b-icon icon="folder-check" variant="light" font-scale="1.5"></b-icon>
						</b-button>
						<b-button v-b-modal.delete_list_confirm_modal v-show="listId" variant="link" v-b-tooltip.hover title="Delete the list" class="mx-n2 mb-n2">
							<b-icon icon="folder-x" variant="light" font-scale="1.5"></b-icon>
						</b-button>
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
						<b-icon icon="trash-fill" @click="listItems.splice(row.index, 1); setIsListDirty(true); setCanAddList(true);"></b-icon>
					</b-link>
				</div>
			</template>
			</b-table>
			<b-button variant="primary" class="mt-3" @click="selectRandomItem" :disabled="listItems.length < 2">Submit</b-button>
			<b-button variant="secondary" class="mt-3" @click="clearItems">Clear</b-button>
			<add-edit-item :items="listItems" :list-id="listId" :set-can-add-list="setCanAddList" :set-is-list-dirty="setIsListDirty" />
			<add-edit-list :items="listItems" :list-id="listId" :list-name="listName" :set-list-id="setListId" :set-can-add-list="setCanAddList" :set-is-list-dirty="setIsListDirty" :update-list-data="updateListData" :set-list-name="setListName" />
			<select-specific-list :list-data="listData" :load-list-items="loadListItems" />
			<confirm-modal :id="confirmDeleteId" :message="confirmDeleteMessage" :on-yes-function="deleteList" />
			<confirm-modal :id="confirmUpdateId" :message="confirmUpdateMessage" :on-yes-function="updateList" />
		</div>
	`
});