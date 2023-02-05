Vue.component('number-range-select', {
	props: { displayResult: { type: Function } },
	data() {
		return {
			startNumber: null,
			endNumber: null,
			modalId: 'random_number_result'
		}
	},
	methods: {
		selectRandomNumberFromRange: function () {
			// Validate the form before trying to select a number.
			$form = $('#random_number_form');
			var isValid = $form[0].checkValidity();
			$form.addClass('was-validated');
			// If validation failed, don't submit the form.
			if(isValid === false) {
				return false;
			}

			var first = parseInt(this.startNumber);
			var second = parseInt(this.endNumber);
			// Make sure that the lower of the two numbers it first.
			if(second < first) {
				second = first;
				first = parseInt($('#end').val());
			}
			var diff = Math.abs(first - second)  + 1;
			var result = Math.floor(Math.random() * diff) + first;
			this.displayResult('Result: ' + result);
		},
		clearRangeNumbers: function () {
			this.startNumber = null;
			this.endNumber = null;
		}
	},
	template: `
		<div>
			<p>Randomly pick a number between:</p>
			<form id="random_number_form">
				<div class="form-row">
					<div class="form-group col-auto">
						<input type="number" class="form-control" name="start" id="start" v-model="startNumber" required>
					</div>
					<div class="form-group col-auto pt-2">
						and
					</div>
					<div class="form-group col-auto">
						<input type="number" class="form-control" name="end" id="end" v-model="endNumber" required>
					</div>
				</div>
				<div class="form-row">
					<div class="form-group col">
						<b-button variant="primary" @click="selectRandomNumberFromRange">Submit</b-button>
						<b-button variant="secondary" @click="clearRangeNumbers">Clear</b-button>
					</div>
				</div>
			</form>
		</div>
	`
});