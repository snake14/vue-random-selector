Vue.component('coin-flip', {
	data() {
		return {
			imageLink: 'images/coin_flip.png',
			defaultImageLink: 'images/coin_flip.png',
			coinImageUrls: [
				'images/Penny_Front.gif',
				'images/Penny_Back.gif'
			]
		}
	},
	methods: {
		flipCoin: function () {
			var index = Math.floor(Math.random() * 2);
			$('#coin_image').hide();
			$('#flip_spinner').show();
			this.imageLink = this.coinImageUrls[index];

			setTimeout(function() {
				$('#coin_image').show();
				$('#flip_spinner').hide();
			}, 500);
		},
		resetCoin: function () {
			this.imageLink = this.defaultImageLink;
		}
	},
	template: `
		<div>
			<form id="coin_flip_form">
				<div class="form-row">
					<div class="form-group col">
						<b-button variant="primary" @click="flipCoin">Flip</b-button>
						<b-button variant="secondary" @click="resetCoin">Reset</b-button>
					</div>
				</div>
			</form>
			<img :src="imageLink" id="coin_image" style="max-width: 200px;" class="mt-3" />
		</div>
	`
});