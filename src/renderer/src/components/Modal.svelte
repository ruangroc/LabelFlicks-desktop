<!-- Reference: https://svelte.dev/examples/modal -->

<script>
	let dialog; // HTMLDialogElement

	// Dialog must be shown for it to appear on the Electron app
	// but the testing framework doesn't recognize showModal() as
	// a function so the try-catch block is here to handle that
	$: if (dialog) {
		try { dialog.showModal(); } 
		catch { console.log("unable to show modal"); }
	}
</script>

<dialog bind:this={dialog}>
	<div>
		<slot name="header" />
		<hr />
		<slot name="body" />
		<hr />
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
