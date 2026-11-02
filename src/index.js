import observer from "@cocreate/observer";

const selector = '[actions*="install"]';
const buttons = new WeakSet();
let deferredPrompt;

/**
 *
 * @public
 * @environment client
 */
function init(root = document) {
	const elements = [];
	if (root?.matches?.(selector)) elements.push(root);
	if (root?.querySelectorAll) elements.push(...root.querySelectorAll(selector));

	for (const button of elements) {
		if (buttons.has(button)) continue;
		buttons.add(button);
		button.addEventListener("click", () => install(button));
		if (deferredPrompt) button.removeAttribute("hidden");
	}
}

/**
 *
 * @public
 * @environment client
 */
async function install(button) {
	const promptEvent = deferredPrompt;
	if (!promptEvent) return;

	promptEvent.prompt();
	const result = await promptEvent.userChoice;
	deferredPrompt = null;
	window.deferredPrompt = null;
	button.setAttribute("hidden", "");
	return result;
}

window.addEventListener("beforeinstallprompt", (event) => {
	event.preventDefault();
	deferredPrompt = event;
	window.deferredPrompt = event;
	init();
});

window.addEventListener("appinstalled", () => {
	deferredPrompt = null;
	window.deferredPrompt = null;
});

observer.init({
	name: "pwaInstall",
	types: ["addedNodes"],
	selector,
	callback: (mutation) => init(mutation.target)
});

init();

export default { init, install };

/**
 *
 * @name hidden
 * @kind attribute
 * @environment client
 */

/**
 * A simple pwa component in vanilla javascript. Easily configured using HTML5 data-attributes and/or JavaScript API.
 *
 * @module pwa
 * @environment client
 */

/**
 * Declarative selectors recognized by this module.
 *
 * @name declarative-selectors
 * @kind member
 * @selectors
 * @environment client
 * @example
 * ```json
 * [
 *   "[actions*=\"install\"]"
 * ]
 * ```
 */
